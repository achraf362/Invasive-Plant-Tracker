import React, { useRef, useState, useEffect } from "react";
import { PlantInfoCard } from "./PlantInfo";
import { PlantMatchesView } from "./PlantMatchesView";
import { ProcessedImage, PlantMatch } from "../types/fetchedInfosType";
import styles from "./map.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface ApiResponse {
  status: "identified" | "unidentified" | "error";
  message?: string;
  results?: PlantMatch[];
  latitude?: number;
  longitude?: number;
}

export const CameraCapture: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [plantInfo, setPlantInfo] = useState<ProcessedImage>();
  const [plantMatches, setPlantMatches] = useState<PlantMatch[]>([]);
  const [showMatches, setShowMatches] = useState(false);

  const [coords, setCoords] = useState<{
    longitude: number | null;
    latitude: number | null;
  }>({
    longitude: null,
    latitude: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(true);

  const initializeCamera = async () => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const constraint = isMobile
      ? { video: { facingMode: { exact: "environment" } } }
      : { video: true };
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraint);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setError("Impossible d'accéder à la caméra");
    }
  };

  const handleBack = async () => {
    setShowMatches(false);
    setPlantMatches([]);
    setImageUrl(null);
    setError(null);
    await initializeCamera();
  };

  // Get location when component mounts and update periodically
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        setIsGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCoords({
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
            });
            setIsGettingLocation(false);
          },
          (error) => {
            console.error("Error getting location:", error);
            setError(
              "Impossible d'obtenir votre position. Veuillez activer la géolocalisation."
            );
            setIsGettingLocation(false);
          }
        );
      } else {
        setError(
          "La géolocalisation n'est pas supportée par votre navigateur."
        );
        setIsGettingLocation(false);
      }
    };

    getLocation();
    // Update location every 30 seconds
    const intervalId = setInterval(getLocation, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const plantInfoFetch = async (imageBlob: Blob) => {
    if (!coords.latitude || !coords.longitude) {
      setError("Position GPS non disponible. Veuillez réessayer.");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      console.log("Preparing form data with coordinates:", coords);
      const formData = new FormData();
      formData.append("image", imageBlob, "plant.jpg");
      formData.append("latitude", coords.latitude.toString());
      formData.append("longitude", coords.longitude.toString());

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

      if (
        data.status === "identified" &&
        data.results &&
        data.results.length > 0
      ) {
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
          imageUrl: imageUrl, // Use the captured image URL instead of API image
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
        // Reinitialize camera after validation
        await initializeCamera();
      } else {
        setError(
          data.message || "Une erreur s'est produite lors de la validation"
        );
      }
    } catch (error) {
      console.error("Error validating match:", error);
      setError("Une erreur s'est produite lors de la validation");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    initializeCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const captureImage = () => {
    if (!coords.latitude || !coords.longitude) {
      setError("Position GPS non disponible. Veuillez réessayer.");
      return;
    }

    setError(null);
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const video = videoRef.current;

    if (canvas && context && video) {
      try {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        setImageUrl(dataUrl);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              plantInfoFetch(blob);
            } else {
              throw new Error("Impossible de convertir l'image");
            }
          },
          "image/jpeg",
          0.8
        );
      } catch (error) {
        console.error("Error capturing image:", error);
        setError("Impossible de capturer l'image");
      }
    }
  };

  return (
    <div className={styles.cameraContainer}>
      {!showMatches ? (
        <>
          <h1 className={styles.title}>Capture Plant Photo</h1>

          <div className={styles.videoContainer}>
            <video
              ref={videoRef}
              className={styles.video}
              autoPlay
              playsInline
            ></video>
          </div>

          <button
            className={styles.captureButton}
            onClick={captureImage}
            disabled={
              isProcessing ||
              isGettingLocation ||
              !coords.latitude ||
              !coords.longitude
            }
            aria-label="Take photo"
          />


          {isGettingLocation && (
            <div className={styles.processing}>
              Obtention de la position GPS...
            </div>
          )}

          {isProcessing && (
            <div className={styles.processing}>
              Analyse de l'image en cours...
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}

          {imageUrl && !error && (
            <div className={styles.capturedImageContainer}>
              <h2 className={styles.capturedTitle}>Photo capturée</h2>
              <img
                ref={imgRef}
                src={imageUrl}
                alt="Plante capturée"
                className={styles.capturedImage}
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
        </>
      ) : (
        <PlantMatchesView
          matches={plantMatches}
          onValidateMatch={handleValidateMatch}
          onBack={handleBack}
        />
      )}

      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        style={{ display: "none" }}
      ></canvas>
    </div>
  );
};
