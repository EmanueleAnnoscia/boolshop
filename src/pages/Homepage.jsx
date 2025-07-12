
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ProductCarousel from '../components/ProductCarousel';
import mockData from '../data/mockProducts.json';
import styles from './Homepage.module.css';

const Homepage = () => {
  const { dispatch } = useAppContext();
  const [heroSlide, setHeroSlide] = useState(0);
  
  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&h=800&fit=crop&crop=center",
      title: "Arte che Trasforma",
      subtitle: "Scopri la nostra collezione esclusiva di stampe d'arte 45x75 cm"
    },
    {
      image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200&h=800&fit=crop&crop=center",
      title: "Qualità Premium",
      subtitle: "Stampe di alta qualità su carta professionale"
    },
    {
      image: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=1200&h=800&fit=crop&crop=center",
      title: "Design Unico",
      subtitle: "Ogni pezzo è selezionato per la sua unicità e bellezza"
    }
  ];

  useEffect(() => {
    dispatch({ type: 'SET_PRODUCTS', payload: mockData.products });
    
    const interval = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const newProducts = mockData.products.filter(p => p.isNew);
  const saleProducts = mockData.products.filter(p => p.onSale);
  const featuredProducts = mockData.products.filter(p => p.isFeatured);

  return (
    <div className={styles.homepage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroSlider}>
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`${styles.heroSlide} ${
                index === heroSlide ? styles.heroSlideActive : ''
              }`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>{slide.title}</h1>
                <p className={styles.heroSubtitle}>{slide.subtitle}</p>
                <Link to="/gallery" className={styles.heroCta}>
                  Esplora la Collezione
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.heroIndicators}>
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`${styles.heroIndicator} ${
                index === heroSlide ? styles.heroIndicatorActive : ''
              }`}
              onClick={() => setHeroSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Free Shipping Banner */}
      <section className={styles.banner}>
        <div className={styles.bannerContent}>
          <span className={styles.bannerIcon}>🚚</span>
          <span className={styles.bannerText}>
            Spedizione gratuita per ordini superiori a 75€
          </span>
        </div>
      </section>

      {/* Product Carousels */}
      <section className={styles.carousels}>
        <div className={styles.container}>
          {newProducts.length > 0 && (
            <ProductCarousel
              title="Nuovi Arrivi"
              products={newProducts}
              viewAllLink="/gallery?filter=new"
            />
          )}

          {saleProducts.length > 0 && (
            <ProductCarousel
              title="In Offerta"
              products={saleProducts}
              viewAllLink="/gallery?filter=sale"
            />
          )}

          {featuredProducts.length > 0 && (
            <ProductCarousel
              title="Scelti per Te"
              products={featuredProducts}
              viewAllLink="/gallery?filter=featured"
            />
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.container}>
          <div className={styles.featuresGrid}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🎨</div>
              <h3 className={styles.featureTitle}>Arte Selezionata</h3>
              <p className={styles.featureDescription}>
                Ogni stampa è curata e selezionata da esperti d'arte
              </p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📏</div>
              <h3 className={styles.featureTitle}>Formato Perfetto</h3>
              <p className={styles.featureDescription}>
                45x75 cm, la dimensione ideale per ogni ambiente
              </p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>⚡</div>
              <h3 className={styles.featureTitle}>Spedizione Rapida</h3>
              <p className={styles.featureDescription}>
                Consegna in 2-3 giorni lavorativi in tutta Italia
              </p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🏆</div>
              <h3 className={styles.featureTitle}>Qualità Premium</h3>
              <p className={styles.featureDescription}>
                Stampe su carta di alta qualità con colori duraturi
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
