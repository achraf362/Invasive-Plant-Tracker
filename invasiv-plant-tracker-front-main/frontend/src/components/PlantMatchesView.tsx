import React from "react";
import styles from "./plantMatches.module.css";

type PlantMatch = {
  score: number;
  species: {
    scientificName: string;
    family: {
      scientificName: string;
    };
  };
  images: Array<{
    url: {
      m: string;
    };
  }>;
};

type PlantMatchesViewProps = {
  matches: PlantMatch[];
  onValidateMatch: (match: PlantMatch) => void;
  onBack: () => void;  // New prop for handling back action
};

export const PlantMatchesView: React.FC<PlantMatchesViewProps> = ({
  matches,
  onValidateMatch,
  onBack,
}) => {
  return (
    <div className={styles.matchesContainer}>
      <button 
        className={styles.backButton}
        onClick={onBack}
      >
        ← Back to Camera
      </button>

      <h2 className={styles.matchesTitle}>Possible Plant Matches</h2>
      <p className={styles.matchesSubtitle}>Select the best match for your plant:</p>
      
      <div className={styles.matchesList}>
        {matches.map((match, index) => (
          <div key={index} className={styles.matchItem}>
            <div className={styles.matchInfo}>
              <h3 className={styles.scientificName}>{match.species.scientificName}</h3>
              <p className={styles.familyName}>Family: {match.species.family.scientificName}</p>
              <p className={styles.score}>Match Score: {(match.score * 100).toFixed(1)}%</p>
            </div>

            <div className={styles.imageGrid}>
              {match.images.slice(0, 4).map((image, imgIndex) => (
                <img
                  key={imgIndex}
                  src={image.url.m}
                  alt={`${match.species.scientificName} - Image ${imgIndex + 1}`}
                  className={styles.matchImage}
                />
              ))}
            </div>

            <button
              className={styles.validateButton}
              onClick={() => onValidateMatch(match)}
            >
              Validate This Match
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
