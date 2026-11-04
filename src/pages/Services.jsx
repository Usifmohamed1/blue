import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { services } from '../data/services.js';
import { Container, Section, Reveal, Button } from '../components/UI.jsx';
import Icon from '../components/Icon.jsx';
import SEO from '../components/SEO.jsx';
import styles from './Services.module.css';

export default function Services() {
  const { t } = useTranslation();
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const frame = requestAnimationFrame(() => {
      document
        .getElementById(hash.slice(1))
        ?.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, [hash]);

  return (
    <>
      <SEO title={t('services.metaTitle')} description={t('services.metaDescription')} />
      <section className={styles.header} aria-labelledby="services-title">
        <Container>
          <Reveal>
            <p className={styles.eyebrow}>{t('services.eyebrow')}</p>
            <h1 id="services-title" className={styles.title}>
              {t('services.title')}
            </h1>
            <p className={styles.description}>{t('services.description')}</p>
          </Reveal>
        </Container>
      </section>

      <nav className={styles.serviceNav} aria-label={t('services.title')}>
        <Container>
          <div className={styles.serviceNavInner}>
            {services.map((service, index) => (
              <a key={service.id} href={`#${service.id}`}>
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                {t(`serviceItems.${service.id}.title`)}
              </a>
            ))}
          </div>
        </Container>
      </nav>

      <Section className={styles.serviceSection}>
        <Container>
          <div className={styles.serviceList}>
            {services.map((service, index) => {
              const title = t(`serviceItems.${service.id}.title`);
              const deliverables = t(`serviceItems.${service.id}.deliverables`, {
                returnObjects: true,
              });
              return (
                <article
                  key={service.id}
                  id={service.id}
                  className={styles.service}
                  aria-labelledby={`${service.id}-title`}
                >
                  <Reveal className={styles.serviceGrid}>
                    <div className={styles.serviceIntro}>
                      <div className={styles.serviceTop}>
                        <span className={styles.number} aria-hidden="true">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className={styles.serviceIcon}>
                          <Icon name={service.icon} />
                        </span>
                      </div>
                      <h2 id={`${service.id}-title`}>{title}</h2>
                      <p>{t(`serviceItems.${service.id}.description`)}</p>
                    </div>
                    <div className={styles.serviceDetails}>
                      <div>
                        <h3>{t('services.deliverables')}</h3>
                        <ul>
                          {(Array.isArray(deliverables) ? deliverables : []).map((item) => (
                            <li key={item}>
                              <Icon name="check" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className={styles.audience}>
                        <h3>{t('services.audience')}</h3>
                        <p>{t(`serviceItems.${service.id}.audience`)}</p>
                      </div>
                      <Button to={`/contact?service=${encodeURIComponent(service.id)}`}>
                        {t('services.cta', { service: title })}
                        <Icon name="arrow" className={styles.arrow} />
                      </Button>
                    </div>
                  </Reveal>
                </article>
              );
            })}
          </div>
        </Container>
      </Section>
    </>
  );
}
