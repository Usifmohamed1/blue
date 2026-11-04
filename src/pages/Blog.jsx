import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Section, Reveal, SectionHeading } from '../components/UI';
import SEO from '../components/SEO';
import Icon from '../components/Icon';
import { posts } from '../data/posts';
import { siteConfig } from '../data/config';
import styles from './Secondary.module.css';

export default function Blog() {
  const { t, i18n } = useTranslation();
  const date = (value) =>
    new Intl.DateTimeFormat(i18n.language.startsWith('ar') ? 'ar-EG' : 'en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(`${value}T12:00:00Z`));
  return (
    <>
      <SEO title={t('blog.metaTitle')} description={t('blog.metaDescription')} />
      <Section className={styles.pageHero}>
        <Container>
          <Reveal>
            <SectionHeading
              headingAs="h1"
              eyebrow={t('blog.eyebrow')}
              title={t('blog.title')}
              description={t('blog.description')}
            />
            <p className={styles.demoNote}>
              <Icon name="info" />
              {t('blog.placeholder')}
            </p>
          </Reveal>
          <div className={styles.blogGrid}>
            {posts.map((post, index) => (
              <Reveal key={post.slug} className={styles.blogCard}>
                <Link to={`/blog/${post.slug}`} className={styles.articleLink}>
                  <div
                    className={`${styles.blogVisual} ${styles[`blogVisual${index % 3}`]}`}
                    aria-hidden="true"
                  >
                    <span className={styles.blogVisualNumber}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className={styles.blogVisualShape} />
                    <span className={styles.blogVisualCategory}>
                      {t(`postItems.${post.slug}.category`)}
                    </span>
                    <span className={styles.blogVisualBrand}>
                      {siteConfig.name} / {siteConfig.tagline}
                    </span>
                  </div>
                  <div className={styles.blogCardBody}>
                    <div className={styles.articleMeta}>
                      <span>{t(`postItems.${post.slug}.category`)}</span>
                      <span>{t('blog.minutes', { count: post.minutes })}</span>
                    </div>
                    <h2>{t(`postItems.${post.slug}.title`)}</h2>
                    <p>{t(`postItems.${post.slug}.excerpt`)}</p>
                    <span className={styles.readLink}>
                      {t('blog.read')}
                      <Icon name="arrow" />
                    </span>
                    <time dateTime={post.date}>{date(post.date)}</time>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
