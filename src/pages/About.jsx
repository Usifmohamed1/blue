import { useTranslation } from 'react-i18next';
import { Container, Section, Reveal, Button, SectionHeading } from '../components/UI';
import SEO from '../components/SEO';
import Icon from '../components/Icon';
import { siteConfig, timeline } from '../data/config';
import { team } from '../data/team';
import styles from './Secondary.module.css';

export default function About() {
  const { t } = useTranslation();
  const values = t('about.values', { returnObjects: true });
  return (
    <>
      <SEO title={t('about.metaTitle')} description={t('about.metaDescription')} />
      <Section className={styles.pageHero}>
        <Container>
          <Reveal>
            <SectionHeading
              headingAs="h1"
              eyebrow={t('about.eyebrow')}
              title={t('about.title')}
              description={t('about.description')}
            />
          </Reveal>
          <div className={styles.storyGrid}>
            <Reveal className={styles.sincePoster}>
              <span className={styles.posterOrbit} aria-hidden="true" />
              <span className={styles.posterLabel}>
                {t('common.since', { year: siteConfig.since })}
              </span>
              <strong className={styles.posterYear}>{siteConfig.since}</strong>
              <div className={styles.posterSignature}>
                <span>{siteConfig.name}</span>
                <span>{siteConfig.tagline}</span>
              </div>
            </Reveal>
            <Reveal className={styles.storyCopy}>
              <span className={styles.sectionNumber} aria-hidden="true">
                01 /
              </span>
              <h2>{t('about.storyTitle')}</h2>
              <p>{t('about.story')}</p>
              <p>{t('about.story2')}</p>
              <Button to="/contact">
                {t('about.cta')}
                <Icon name="arrow" />
              </Button>
            </Reveal>
          </div>
        </Container>
      </Section>
      <Section className={styles.panelSection}>
        <Container>
          <Reveal>
            <h2 className={styles.sectionTitle}>{t('about.valuesTitle')}</h2>
          </Reveal>
          <div className={styles.valuesGrid}>
            {Array.isArray(values) &&
              values.map((value, index) => (
                <Reveal key={value.title} className={styles.valueCard}>
                  <span className={styles.sectionNumber}>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{value.title}</h3>
                  <p>{value.text}</p>
                </Reveal>
              ))}
          </div>
        </Container>
      </Section>
      <Section>
        <Container>
          <Reveal>
            <h2 className={styles.sectionTitle}>{t('about.teamTitle')}</h2>
            <p className={styles.note}>{t('about.teamNote')}</p>
          </Reveal>
          <div className={styles.teamGrid}>
            {team.map((member, index) => (
              <Reveal key={member.id} className={styles.teamCard}>
                <div
                  className={`${styles.teamAvatar} ${styles[`avatar${index % 3}`] || ''}`}
                  aria-hidden="true"
                >
                  <span>{member.initials}</span>
                  <span className={styles.avatarRing} />
                  <Icon name="spark" />
                </div>
                <div className={styles.teamCopy}>
                  <p className={styles.overline}>{t(`teamItems.${member.id}.role`)}</p>
                  <h3>{t(`teamItems.${member.id}.name`)}</h3>
                  <p>{t(`teamItems.${member.id}.bio`)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
      <Section className={styles.panelSection}>
        <Container>
          <Reveal>
            <h2 className={styles.sectionTitle}>{t('about.timelineTitle')}</h2>
          </Reveal>
          <div className={styles.timeline}>
            {timeline.map((event) => (
              <Reveal className={styles.timelineItem} key={event.id}>
                <span className={styles.timelineYear}>{event.year}</span>
                <div>
                  <h3>{t(`about.timeline.${event.id}.title`)}</h3>
                  <p>{t(`about.timeline.${event.id}.text`)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
