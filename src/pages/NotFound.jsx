
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.errorCode}>404</div>
          <h1 className={styles.title}>Pagina non trovata</h1>
          <p className={styles.description}>
            Oops! La pagina che stai cercando non esiste o è stata spostata.
          </p>
          <div className={styles.actions}>
            <Link to="/" className={styles.homeButton}>
              Torna alla Homepage
            </Link>
            <Link to="/gallery" className={styles.galleryButton}>
              Esplora la Galleria
            </Link>
          </div>
          <div className={styles.suggestions}>
            <h3 className={styles.suggestionsTitle}>Forse stavi cercando:</h3>
            <ul className={styles.suggestionsList}>
              <li><Link to="/gallery">Le nostre stampe d'arte</Link></li>
              <li><Link to="/about">Chi siamo</Link></li>
              <li><Link to="/contact">Contattaci</Link></li>
              <li><Link to="/cart">Il tuo carrello</Link></li>
            </ul>
          </div>
        </div>
        <div className={styles.illustration}>
          <div className={styles.frame}>
            <div className={styles.frameContent}>
              <span className={styles.frameIcon}>🎨</span>
              <p className={styles.frameText}>Arte non trovata</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
