import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, m as Motion, useReducedMotion } from 'framer-motion';
import { projects } from '../data/projects.js';
import { Container, Reveal } from '../components/UI.jsx';
import Icon from '../components/Icon.jsx';
import Poster from '../components/Poster.jsx';
import SEO from '../components/SEO.jsx';
import styles from './Portfolio.module.css';

const filters = ['all', 'social', 'branding', 'video', 'ads'];
const normalize = (value) =>
  value
    .normalize('NFKC')
    .replace(/[\u064B-\u065F\u0640]/g, '')
    .toLocaleLowerCase();

export default function Work() {
  const { t } = useTranslation();
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const reduceMotion = useReducedMotion();
  const visibleProjects = useMemo(
    () =>
      projects.filter((project) => {
        const inCategory = category === 'all' || category === project.category;
        const search = [
          t(`projectItems.${project.slug}.title`),
          t(`projectItems.${project.slug}.client`),
          t(`projectItems.${project.slug}.category`),
        ].join(' ');
        return inCategory && normalize(search).includes(normalize(query.trim()));
      }),
    [category, query, t],
  );

  return (
    <>
      <SEO title={t('work.metaTitle')} description={t('work.metaDescription')} />
      <section className={styles.pageHeader} aria-labelledby="work-title">
        <Container>
          <Reveal>
            <p className={styles.eyebrow}>{t('work.eyebrow')}</p>
            <h1 id="work-title" className={styles.pageTitle}>
              {t('work.title')}
            </h1>
            <p className={styles.pageDescription}>{t('work.description')}</p>
          </Reveal>
        </Container>
      </section>
      <section className={styles.workSection} aria-label={t('work.title')}>
        <Container>
          <div className={styles.workToolbar}>
            <div className={styles.filters} role="group" aria-label={t('work.title')}>
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setCategory(filter)}
                  aria-pressed={category === filter}
                >
                  {t(`work.filters.${filter}`)}
                </button>
              ))}
            </div>
            <div className={styles.searchField}>
              <label htmlFor="project-search" className={styles.srOnly}>
                {t('work.search')}
              </label>
              <Icon name="search" />
              <input
                id="project-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t('work.searchPlaceholder')}
                autoComplete="off"
              />
            </div>
          </div>
          <p className={styles.resultCount} role="status" aria-live="polite">
            {t('work.count', { count: visibleProjects.length })}
          </p>
          <Motion.div layout={!reduceMotion} className={styles.projectGrid}>
            <AnimatePresence initial={false} mode="popLayout">
              {visibleProjects.map((project, index) => (
                <Motion.article
                  key={project.slug}
                  layout={!reduceMotion}
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.3,
                    delay: reduceMotion ? 0 : index * 0.025,
                  }}
                  className={styles.projectCard}
                >
                  <Link to={`/work/${project.slug}`} className={styles.projectLink}>
                    <div className={styles.posterFrame}>
                      <Poster project={project} ariaHidden />
                    </div>
                    <div className={styles.projectCaption}>
                      <div>
                        <p>{t(`projectItems.${project.slug}.category`)}</p>
                        <h2>{t(`projectItems.${project.slug}.title`)}</h2>
                      </div>
                      <span className={styles.cardArrow} aria-hidden="true">
                        <Icon name="arrow" />
                      </span>
                    </div>
                    <span className={styles.srOnly}>{t('work.viewProject')}</span>
                  </Link>
                </Motion.article>
              ))}
            </AnimatePresence>
          </Motion.div>
          {!visibleProjects.length && (
            <div className={styles.emptyState}>
              <Icon name="search" />
              <p>{t('work.empty')}</p>
            </div>
          )}
          <p className={styles.conceptNote}>
            <Icon name="info" />
            {t('work.conceptNote')}
          </p>
        </Container>
      </section>
    </>
  );
}
