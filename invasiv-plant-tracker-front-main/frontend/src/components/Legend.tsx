import { CSSProperties } from "react";
import styles from "./map.module.css";

interface LegendProps {
  familyColors: { [key: string]: string };
}

export const Legend = ({ familyColors }: LegendProps) => {
  if (Object.keys(familyColors).length === 0) return null;

  return (
    <div className={styles.legend}>
      <h4>Plant Families</h4>
      <div className={styles.legendItems}>
        {Object.entries(familyColors).map(([family, color]) => (
          <div key={family} className={styles.legendItem}>
            <span 
              className={styles.colorBox} 
              style={{ backgroundColor: color } as CSSProperties} 
            />
            <span className={styles.familyName}>{family}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
