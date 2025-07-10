
import React from 'react';
import { useAppContext } from '../context/AppContext';
import styles from './ProductFilters.module.css';

const ProductFilters = () => {
  const { viewMode, sortBy, dispatch } = useAppContext();

  const handleViewModeChange = (mode) => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode });
  };

  const handleSortChange = (e) => {
    dispatch({ type: 'SET_SORT_BY', payload: e.target.value });
  };

  return (
    <div className={styles.filters}>
      <div className={styles.viewModeToggle}>
        <button
          className={`${styles.viewButton} ${
            viewMode === 'grid' ? styles.active : ''
          }`}
          onClick={() => handleViewModeChange('grid')}
          title="Vista griglia"
        >
          ⊞
        </button>
        <button
          className={`${styles.viewButton} ${
            viewMode === 'list' ? styles.active : ''
          }`}
          onClick={() => handleViewModeChange('list')}
          title="Vista lista"
        >
          ☰
        </button>
      </div>

      <div className={styles.sortContainer}>
        <label htmlFor="sort" className={styles.sortLabel}>
          Ordina per:
        </label>
        <select
          id="sort"
          value={sortBy}
          onChange={handleSortChange}
          className={styles.sortSelect}
        >
          <option value="newest">Più recenti</option>
          <option value="name">Nome A-Z</option>
          <option value="price-asc">Prezzo crescente</option>
          <option value="price-desc">Prezzo decrescente</option>
        </select>
      </div>
    </div>
  );
};

export default ProductFilters;
