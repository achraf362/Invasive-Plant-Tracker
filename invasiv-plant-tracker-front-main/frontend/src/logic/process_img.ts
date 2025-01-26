import { PlantIdResponse, PlantMatchesResponse, ValidatedMatchResponse, PlantMatch } from "../types/fetchedInfosType";

const API_URL = import.meta.env.VITE_API_URL ||'http://localhost:3000';

export async function getInvaisvImg(): Promise<PlantIdResponse[]> {
  try {
    const response = await fetch(`${API_URL}/getInvasivPlants`);
    if (!response.ok) {
      throw new Error('Failed to fetch invasive plants');
    }
    const result = await response.json();
    
    // Update image URLs to include API_URL if they're relative paths
    // and ensure we only return invasive plants
    return result
      .filter((item: PlantIdResponse) => item.is_invasive)
      .map((item: PlantIdResponse) => ({
        ...item,
        img_url: item.img_url?.startsWith('/') ? `${API_URL}${item.img_url}` : item.img_url
      }));
  } catch (error) {
    console.error("Error fetching invasive plants:", error);
    throw error;
  }
}

export async function processPlantImage(imageBlob: Blob, latitude: number, longitude: number): Promise<PlantMatchesResponse> {
  try {
    const formData = new FormData();
    formData.append('image', imageBlob, 'plant.jpg');
    formData.append('latitude', latitude.toString());
    formData.append('longitude', longitude.toString());

    const response = await fetch(`${API_URL}/process-image`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to process image');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  }
}

export async function validatePlantMatch(
  match: PlantMatch,
  latitude: number,
  longitude: number
): Promise<ValidatedMatchResponse> {
  try {
    const response = await fetch(`${API_URL}/validate-match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scientificName: match.species.scientificName,
        latitude,
        longitude,
        imageUrl: match.images[0]?.url.m
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to validate match');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error validating match:", error);
    throw error;
  }
}
