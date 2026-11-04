import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Section, Reveal, Button } from '../components/UI';
import SEO from '../components/SEO';
import Icon from '../components/Icon';
import { posts } from '../data/posts';
import NotFound from './NotFound';
import styles from './Secondary.module.css';

export default function BlogPost() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const post = posts.find((item) => item.slug === slug);
  if (!post) return <NotFound />;
  const body = t(`postItems.${post.slug}.body`, { returnObjects: true });
  const related = posts.filter((item) => item.slug !== slug);
  const date = new Intl.DateTimeFormat(i18n.language.startsWith('ar') ? 'ar-EG' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${post.date}T12:00:00Z`));
  return (
    <>
      <SEO
        title={t(`postItems.${post.slug}.title`)}
        description={t(`postItems.${post.slug}.excerpt`)}
      />
      <Section className={styles.pageHero}>
        <Container>
          <div className={styles.articleWrap}>
            <Link className={styles.backLink} to="/blog">
              <Icon name="arrow" />
              {t('blog.back')}
            </Link>
            <Reveal>
              <div className={styles.articleMeta}>
                <span>{t(`postItems.${post.slug}.category`)}</span>
                <time dateTime={post.date}>{date}</time>
                <span>{t('blog.minutes', { count: post.minutes })}</span>
              </div>
              <h1 className={styles.articleTitle}>{t(`postItems.${post.slug}.title`)}</h1>
              <p className={styles.articleLead}>{t(`postItems.${post.slug}.excerpt`)}</p>
              <p className={styles.demoNote}>
                <Icon name="info" />
                {t('blog.placeholder')}
              </p>
            </Reveal>
            <article className={styles.articleBody}>
              {Array.isArray(body) &&
                body.map((section) => (
                  <Reveal as="section" key={section.heading}>
                    <h2>{section.heading}</h2>
                    <p>{section.text}</p>
                  </Reveal>
                ))}
            </article>
            <div className={styles.relatedArticles}>
              <h2>{t('blog.related')}</h2>
              {related.map((item) => (
                <Link key={item.slug} to={`/blog/${item.slug}`}>
                  <span>{t(`postItems.${item.slug}.title`)}</span>
                  <Icon name="arrow" />
                </Link>
              ))}
            </div>
            <Button to="/contact">
              {t('about.cta')}
              <Icon name="arrow" />
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
