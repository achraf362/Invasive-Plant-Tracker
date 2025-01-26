import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { getInvaisvImg } from "../logic/process_img";
import { useEffect, useState, useMemo } from "react";
import { PlantIdResponse } from "../types/fetchedInfosType";
import { PlantInfoCard } from "./PlantInfo";
import { Legend } from "./Legend";
import { Icon } from "leaflet";
import styles from "./map.module.css";

// Type for grouped plants
interface GroupedPlants {
  [key: string]: PlantIdResponse[];
}

// Function to generate a unique color for a family
const generateColor = (str: string | undefined): string => {
  if (!str || str === "Famille inconnue") {
    return "#808080"; // Gray color for unknown or missing family
  }
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
};


// Function to create a colored marker icon
const createColoredIcon = (color: string): Icon => {
  return new Icon({
    iconUrl: `data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${encodeURIComponent(color)}" width="32" height="32"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

export const Map = () => {
  const [fetchedInfos, setFetchedInfos] = useState<PlantIdResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate family colors
  const familyColors = useMemo(() => {
    const families = [...new Set(fetchedInfos.map(plant => plant.family))];
    return {
      ...families.reduce((acc, family) => ({
        ...acc,
        [family]: generateColor(family)
      }), {}),
      'Familles multiples': '#9C27B0' // Add mixed families to legend
    } as { [key: string]: string };
  }, [fetchedInfos]);
  
  // Default center of France
  const defaultCenter: [number, number] = [46.227638, 2.213749];

  // Function to group plants by location
  const groupPlantsByLocation = (plants: PlantIdResponse[]): GroupedPlants => {
    return plants.reduce((acc: GroupedPlants, plant) => {
      const key = `${plant.latitude},${plant.longitude}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(plant);
      return acc;
    }, {});
  };

  // Fetch invasive plants data
  useEffect(() => {
    const getFetchedData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const imageInfo = await getInvaisvImg();
        console.log('Fetched plants:', imageInfo);
        setFetchedInfos(imageInfo);
      } catch (error) {
        console.error("Error fetching invasive plants:", error);
        setError("Erreur lors de la récupération des plantes invasives.");
      } finally {
        setIsLoading(false);
      }
    };

    getFetchedData();
  }, []);

  // Group plants by location
  const groupedPlants = groupPlantsByLocation(fetchedInfos);

  // Debug logs
  useEffect(() => {

  }, [fetchedInfos, groupedPlants, familyColors]);

  return (
    <div className={styles.mapWrapper}>
      {error && <div className={styles.error}>{error}</div>}
      {isLoading ? (
        <div className={styles.loading}>Loading Map...</div>
      ) : (
        <MapContainer
          center={defaultCenter}
          zoom={6}
          scrollWheelZoom={true}
          className={styles.map}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Markers for grouped plants */}
          {Object.entries(groupedPlants).map(([coords, plants]) => {
            const [lat, lng] = coords.split(',').map(Number);
            // Check if all plants at this location are from the same family
            const uniqueFamilies = [...new Set(plants.map(plant => plant.family))];
            const markerColor = uniqueFamilies.length === 1 
              ? familyColors[plants[0].family] 
              : '#9C27B0'; // Purple color for mixed families
            return (
              <Marker
                position={[lat, lng]}
                key={coords}
                icon={createColoredIcon(markerColor)}
              >
                <Popup>
                  <div className={styles.multiplePopup}>
                    <h3>Plantes invasives à cet endroit :</h3>
                    <div className={styles.plantsList}>
                      {plants.map((plant, index) => (
                        <div key={index} className={styles.plantItem}>
                          <PlantInfoCard
                            isInvasiv={true}
                            name={plant.name}
                            probability={plant.probability}
                            img={plant.img_url}
                            familyName={plant.family}
                          />
                          {index < plants.length - 1 && (
                            <hr className={styles.plantDivider} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      )}
      {!isLoading && Object.keys(familyColors).length > 0 && (
        <Legend familyColors={familyColors} />
      )}
    </div>
  );
};
