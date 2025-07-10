
import React, { useState } from 'react';
import styles from './Contact.module.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitMessage('Messaggio inviato con successo! Ti risponderemo entro 24 ore.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitMessage('Errore nell\'invio del messaggio. Riprova più tardi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.contact}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <h1 className={styles.title}>Contattaci</h1>
          <p className={styles.subtitle}>
            Siamo qui per aiutarti. Non esitare a contattarci per qualsiasi domanda 
            sui nostri prodotti o sui tuoi ordini.
          </p>
        </div>

        <div className={styles.contactGrid}>
          <div className={styles.contactInfo}>
            <div className={styles.infoSection}>
              <h2 className={styles.infoTitle}>Come raggiungerci</h2>
              
              <div className={styles.contactMethod}>
                <div className={styles.methodIcon}>📧</div>
                <div className={styles.methodContent}>
                  <h3 className={styles.methodTitle}>Email</h3>
                  <p className={styles.methodText}>info@boolshop.it</p>
                  <p className={styles.methodDescription}>
                    Risposta entro 24 ore
                  </p>
                </div>
              </div>

              <div className={styles.contactMethod}>
                <div className={styles.methodIcon}>📞</div>
                <div className={styles.methodContent}>
                  <h3 className={styles.methodTitle}>Telefono</h3>
                  <p className={styles.methodText}>+39 02 1234 5678</p>
                  <p className={styles.methodDescription}>
                    Lun-Ven 9:00-18:00
                  </p>
                </div>
              </div>

              <div className={styles.contactMethod}>
                <div className={styles.methodIcon}>💬</div>
                <div className={styles.methodContent}>
                  <h3 className={styles.methodTitle}>Chat Live</h3>
                  <p className={styles.methodText}>Assistenza in tempo reale</p>
                  <p className={styles.methodDescription}>
                    Lun-Ven 9:00-18:00
                  </p>
                </div>
              </div>

              <div className={styles.contactMethod}>
                <div className={styles.methodIcon}>📍</div>
                <div className={styles.methodContent}>
                  <h3 className={styles.methodTitle}>Sede</h3>
                  <p className={styles.methodText}>
                    Via dell'Arte, 123<br />
                    20121 Milano, Italia
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.faqSection}>
              <h3 className={styles.faqTitle}>Domande Frequenti</h3>
              <div className={styles.faqList}>
                <div className={styles.faqItem}>
                  <h4 className={styles.faqQuestion}>Quanto tempo richiede la spedizione?</h4>
                  <p className={styles.faqAnswer}>
                    Le spedizioni richiedono 2-3 giorni lavorativi in tutta Italia.
                  </p>
                </div>
                <div className={styles.faqItem}>
                  <h4 className={styles.faqQuestion}>Posso restituire un prodotto?</h4>
                  <p className={styles.faqAnswer}>
                    Sì, puoi restituire i prodotti entro 30 giorni dall'acquisto.
                  </p>
                </div>
                <div className={styles.faqItem}>
                  <h4 className={styles.faqQuestion}>Le stampe sono resistenti?</h4>
                  <p className={styles.faqAnswer}>
                    Utilizziamo inchiostri UV-resistenti su carta fotografica premium.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.contactForm}>
            <div className={styles.formCard}>
              <h2 className={styles.formTitle}>Invia un messaggio</h2>
              
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Il tuo nome *"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <input
                    type="email"
                    name="email"
                    placeholder="La tua email *"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className={styles.select}
                  >
                    <option value="">Seleziona un argomento *</option>
                    <option value="order">Domande sull'ordine</option>
                    <option value="product">Informazioni sui prodotti</option>
                    <option value="shipping">Spedizioni e consegne</option>
                    <option value="return">Resi e rimborsi</option>
                    <option value="technical">Supporto tecnico</option>
                    <option value="other">Altro</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <textarea
                    name="message"
                    placeholder="Il tuo messaggio *"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className={styles.textarea}
                  />
                </div>

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Invio in corso...' : 'Invia Messaggio'}
                </button>

                {submitMessage && (
                  <div className={`${styles.message} ${
                    submitMessage.includes('successo') ? styles.success : styles.error
                  }`}>
                    {submitMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        <div className={styles.mapSection}>
          <h2 className={styles.mapTitle}>Dove siamo</h2>
          <div className={styles.mapPlaceholder}>
            <div className={styles.mapContent}>
              <div className={styles.mapIcon}>🗺️</div>
              <p className={styles.mapText}>
                Via dell'Arte, 123 - 20121 Milano, Italia
              </p>
              <p className={styles.mapDescription}>
                La nostra sede è situata nel cuore del distretto artistico di Milano, 
                facilmente raggiungibile con i mezzi pubblici.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
