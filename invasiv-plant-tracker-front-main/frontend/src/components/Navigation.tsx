import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './map.module.css';

export const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className={styles.navigation}>
      <Link 
        to="/capture_photo" 
        className={`${styles.navLink} ${location.pathname === '/capture_photo' ? styles.active : ''}`}
      >
        <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
        <span>Capture</span>
      </Link>
      <Link 
        to="/cartographie" 
        className={`${styles.navLink} ${location.pathname === '/cartographie' ? styles.active : ''}`}
      >
        <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <span>Map</span>
      </Link>
      <Link 
        to="/upload" 
        className={`${styles.navLink} ${location.pathname === '/upload' ? styles.active : ''}`}
      >
        <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        <span>Upload</span>
      </Link>
    </nav>
  );
};
