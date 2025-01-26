import React, { useState } from "react";
import { PlantInfoCard } from "./PlantInfo";
import { PlantMatchesView } from "./PlantMatchesView";
import { ProcessedImage, PlantMatch } from "../types/fetchedInfosType";
import styles from "./map.module.css";
import exifr from "exifr";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface ApiResponse {
  status: "identified" | "unidentified" | "error";
  message?: string;
  results?: PlantMatch[];
  latitude?: number;
  longitude?: number;
}

export const UploadImage: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [plantInfo, setPlantInfo] = useState<ProcessedImage>();
  const [plantMatches, setPlantMatches] = useState<PlantMatch[]>([]);
  const [showMatches, setShowMatches] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [coords, setCoords] = useState<{
    longitude: number | null;
    latitude: number | null;
  }>({
    longitude: null,
    latitude: null,
  });

  const handleBack = () => {
    setShowMatches(false);
    setPlantMatches([]);
    setImageUrl(null);
    setError(null);
  };

  const plantInfoFetch = async (imageBlob: Blob, latitude: number, longitude: number) => {
    try {
      setIsProcessing(true);
      setError(null);

      console.log("Preparing form data with coordinates:", { latitude, longitude });
      const formData = new FormData();
      formData.append("image", imageBlob, "plant.jpg");
      formData.append("latitude", latitude.toString());
      formData.append("longitude", longitude.toString());

      console.log("Sending request to:", `${API_URL}/process-image`);
      const response = await fetch(`${API_URL}/process-image`, {
        method: "POST",
        body: formData,
      });

      const data: ApiResponse = await response.json();
      console.log("Received response:", data);

      if (data.status === "error" || data.status === "unidentified") {
        setError(data.message || "Une erreur s'est produite");
        setPlantMatches([]);
        return;
      }

      if (data.status === "identified" && data.results && data.results.length > 0) {
        setPlantMatches(data.results);
        setShowMatches(true);
      }
    } catch (error) {
      console.error("Error processing image:", error);
      setError("Une erreur s'est produite lors du traitement de l'image");
      setPlantMatches([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleValidateMatch = async (match: PlantMatch) => {
    if (!coords.latitude || !coords.longitude || !imageUrl) {
      setError("Position GPS ou image non disponible.");
      return;
    }

    try {
      setIsProcessing(true);
      const response = await fetch(`${API_URL}/validate-match`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scientificName: match.species.scientificName,
          latitude: coords.latitude,
          longitude: coords.longitude,
          imageUrl: match.images[0]?.url.m,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setPlantInfo({
          name: data.name,
          probability: 1,
          isInvasiv: data.isInvasiv,
          imgUrl: imageUrl,
          latitude: coords.latitude,
          longitude: coords.longitude,
          family: data.family
        });
        setShowMatches(false);
      } else {
        setError(data.message || "Une erreur s'est produite lors de la validation");
      }
    } catch (error) {
      console.error("Error validating match:", error);
      setError("Une erreur s'est produite lors de la validation");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    const blobFile = event.target.files[0];

    // First set up image preview for immediate feedback
    const reader = new FileReader();
    reader.onload = () => {
      const imgUrl = reader.result as string;
      setImageUrl(imgUrl);
    };
    reader.readAsDataURL(blobFile);

    try {
      setError(null);
      console.log("Reading EXIF data from file:", blobFile.name);
      const exifData = await exifr.parse(blobFile);
      console.log("EXIF data:", exifData);

      if (!exifData) {
        setError("Cette image ne contient pas de métadonnées EXIF.");
        return;
      }

      if (!exifData.latitude || !exifData.longitude) {
        setError("Cette image ne contient pas de coordonnées GPS. Assurez-vous que la localisation était activée lors de la prise de photo.");
        return;
      }

      console.log(`Found coordinates - Latitude: ${exifData.latitude}, Longitude: ${exifData.longitude}`);
      setCoords({
        latitude: exifData.latitude,
        longitude: exifData.longitude,
      });
      
      // Process image with coordinates directly
      await plantInfoFetch(blobFile, exifData.latitude, exifData.longitude);
    } catch (error) {
      console.error("Error reading EXIF data:", error);
      setError("Erreur lors de la lecture des métadonnées de l'image.");
      return;
    }
  };

  return (
    <div className={styles.uploadContainer}>
      {!showMatches ? (
        <>
          <h1 className={styles.title}>Upload Plant Photo</h1>

          <div className={styles.uploadSection}>
            <label htmlFor="imageUpload" className={styles.uploadButton}>
              Choose Image
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>
            
            {isProcessing && (
              <div className={styles.processing}>
                Analyse de l'image en cours...
              </div>
            )}

            {error && <div className={styles.error}>{error}</div>}

            {imageUrl && !error && (
              <div className={styles.uploadedImageContainer}>
                <h2 className={styles.uploadedTitle}>Photo téléchargée</h2>
                <img
                  src={imageUrl}
                  alt="Plante téléchargée"
                  className={styles.uploadedImage}
                />
              </div>
            )}

            {plantInfo && (
              <PlantInfoCard
                isInvasiv={plantInfo.isInvasiv}
                name={plantInfo.name}
                probability={plantInfo.probability}
                img={plantInfo.imgUrl}
                familyName={plantInfo.family}
              />
            )}
          </div>
        </>
      ) : (
        <PlantMatchesView
          matches={plantMatches}
          onValidateMatch={handleValidateMatch}
          onBack={handleBack}
        />
      )}
    </div>
  );
};
