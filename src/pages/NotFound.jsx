import { useTranslation } from 'react-i18next';
import { Container, Section, Button } from '../components/UI';
import SEO from '../components/SEO';
import Icon from '../components/Icon';
import styles from './Secondary.module.css';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <>
      <SEO title={t('notFound.metaTitle')} description={t('notFound.metaDescription')} noIndex />
      <Section className={styles.notFound}>
        <Container>
          <div className={styles.errorArtwork} aria-hidden="true">
            404
            <span />
          </div>
          <p className={styles.overline}>{t('notFound.eyebrow')}</p>
          <h1>{t('notFound.title')}</h1>
          <p>{t('notFound.description')}</p>
          <div className={styles.errorActions}>
            <Button to="/">
              {t('notFound.home')}
              <Icon name="arrow" />
            </Button>
            <Button variant="secondary" to="/work">
              {t('notFound.work')}
              <Icon name="spark" />
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
