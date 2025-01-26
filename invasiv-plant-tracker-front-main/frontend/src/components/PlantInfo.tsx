import React from "react";
import styles from "./map.module.css";

type PlantInfoCardProps = {
  name: string;
  probability: number;
  img: any;
  isInvasiv: boolean;
  familyName?: string;  // Added familyName as optional prop
};

export const PlantInfoCard: React.FC<PlantInfoCardProps> = ({
  name,
  probability,
  img,
  isInvasiv,
  familyName,
}) => {
  return (
    <div className={styles.plantCard}>
      <img src={img} className={styles.plantImage} alt={name} />
      <div className={styles.plantContent}>
        <h2 className={styles.plantName}>{name}</h2>
        {familyName && (
          <p className={styles.plantFamily}>Family: {familyName}</p>
        )}
        <p className={styles.plantProbability}>
          Probability: {(probability * 100).toFixed(1)}%
        </p>
        <div className={styles.probabilityBar}>
          <div
            className={styles.probabilityFill}
            style={{ width: `${probability * 100}%` }}
          />
        </div>
        <p>isInvasiv: {isInvasiv ? "yes" : "No"}</p>
      </div>
    </div>
  );
};
