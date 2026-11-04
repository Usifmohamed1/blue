import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { projects } from '../data/projects.js';
import { Container, Reveal, Button } from '../components/UI.jsx';
import Icon from '../components/Icon.jsx';
import Poster from '../components/Poster.jsx';
import SEO from '../components/SEO.jsx';
import styles from './Portfolio.module.css';

export default function CaseStudy() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const projectIndex = projects.findIndex((item) => item.slug === slug);
  const project = projects[projectIndex];
  const [activeImage, setActiveImage] = useState(null);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const isRtl = i18n.dir() === 'rtl';

  useEffect(() => {
    setActiveImage(null);
  }, [slug]);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (activeImage === null || !dialog) return undefined;
    if (!dialog.open) dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeImage]);

  if (!project)
    return (
      <section className={styles.missing}>
        <SEO title={t('notFound.title')} description={t('notFound.description')} noIndex />
        <Container>
          <h1>{t('notFound.title')}</h1>
          <p>{t('notFound.description')}</p>
          <Button to="/work">{t('caseStudy.back')}</Button>
        </Container>
      </section>
    );

  const prefix = `projectItems.${project.slug}`;
  const gallery = project.gallery || [];
  const previousProject = projects[(projectIndex - 1 + projects.length) % projects.length];
  const nextProject = projects[(projectIndex + 1) % projects.length];
  const moveImage = (direction) =>
    setActiveImage((index) => (index + direction + gallery.length) % gallery.length);
  const closeDialog = () => dialogRef.current?.close();
  const renderGalleryVisual = (image, index, full = false) =>
    image.image ? (
      <img
        src={image.image}
        alt={t(`${prefix}.gallery.${index}`)}
        loading={full ? 'eager' : 'lazy'}
        decoding="async"
        width="1200"
        height="1000"
      />
    ) : (
      <div
        className={`${styles.generatedGallery} ${styles[`galleryVariant${index}`]}`}
        role={full ? 'img' : undefined}
        aria-label={full ? t(`${prefix}.gallery.${index}`) : undefined}
      >
        <Poster project={project} variant={full ? 'detail' : 'gallery'} ariaHidden={full} />
        <span className={styles.gallerySerial} aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
    );

  return (
    <>
      <SEO
        title={t(`${prefix}.title`)}
        description={t(`${prefix}.brief`)}
        image={project.image || undefined}
      />
      <section className={styles.caseHeader} aria-labelledby="case-title">
        <Container>
          <Link to="/work" className={styles.backLink}>
            <Icon name="arrow" />
            {t('caseStudy.back')}
          </Link>
          <Reveal>
            <div className={styles.caseMeta}>
              <span>{t(`${prefix}.category`)}</span>
              <span>{t('caseStudy.conceptLabel')}</span>
            </div>
            <h1 id="case-title" className={styles.caseTitle}>
              {t(`${prefix}.title`)}
            </h1>
            <p className={styles.caseSubtitle}>{t(`${prefix}.caption`)}</p>
          </Reveal>
          <div className={styles.caseHero}>
            <Poster project={project} variant="detail" />
          </div>
        </Container>
      </section>
      <section className={styles.caseBody} aria-label={t('caseStudy.eyebrow')}>
        <Container>
          <div className={styles.briefGrid}>
            <Reveal>
              <p className={styles.eyebrow}>{t('caseStudy.brief')}</p>
              <h2>{t(`${prefix}.client`)}</h2>
            </Reveal>
            <Reveal>
              <p className={styles.briefText}>{t(`${prefix}.brief`)}</p>
            </Reveal>
          </div>
          <div className={styles.storyGrid}>
            {['challenge', 'approach', 'results'].map((part, index) => (
              <Reveal key={part} className={styles.storyCard}>
                <span className={styles.storyNumber} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h2>{t(`caseStudy.${part}`)}</h2>
                <p>{t(`${prefix}.${part}`)}</p>
              </Reveal>
            ))}
          </div>
          <div className={styles.metrics}>
            {(project.metrics || []).map((metric) => (
              <div key={metric.key}>
                <strong>{metric.value}</strong>
                <span>{t(`${prefix}.metrics.${metric.key}`)}</span>
              </div>
            ))}
            <p>
              <Icon name="info" />
              {t('caseStudy.resultsNote')}
            </p>
          </div>
          <div className={styles.galleryHeading}>
            <p className={styles.eyebrow}>{t('caseStudy.gallery')}</p>
            <span>{String(gallery.length).padStart(2, '0')}</span>
          </div>
          <div className={styles.gallery}>
            {gallery.map((image, index) => (
              <button
                key={image.id}
                type="button"
                className={styles.galleryButton}
                onClick={(event) => {
                  triggerRef.current = event.currentTarget;
                  setActiveImage(index);
                }}
              >
                {renderGalleryVisual(image, index)}
                <span className={styles.srOnly}>
                  {t('caseStudy.openImage', { number: index + 1 })}
                </span>
                <span className={styles.expandIcon} aria-hidden="true">
                  <Icon name="expand" />
                </span>
              </button>
            ))}
          </div>
          <nav className={styles.projectPagination} aria-label={t('caseStudy.eyebrow')}>
            <Link to={`/work/${previousProject.slug}`}>
              <span className={styles.paginationArrow}>
                <Icon name="arrow" />
              </span>
              <div>
                <small>{t('caseStudy.previous')}</small>
                <strong>{t(`projectItems.${previousProject.slug}.title`)}</strong>
              </div>
            </Link>
            <Link to={`/work/${nextProject.slug}`}>
              <div>
                <small>{t('caseStudy.next')}</small>
                <strong>{t(`projectItems.${nextProject.slug}.title`)}</strong>
              </div>
              <span className={styles.paginationArrow}>
                <Icon name="arrow" />
              </span>
            </Link>
          </nav>
        </Container>
      </section>
      <dialog
        ref={dialogRef}
        className={styles.lightbox}
        aria-label={t('caseStudy.gallery')}
        onClose={() => {
          setActiveImage(null);
          triggerRef.current?.focus({ preventScroll: true });
        }}
        onClick={(event) => {
          if (event.target !== dialogRef.current) return;
          const rect = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            closeDialog();
        }}
        onKeyDown={(event) => {
          if (activeImage === null) return;
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();
            moveImage((event.key === 'ArrowRight' ? 1 : -1) * (isRtl ? -1 : 1));
          }
        }}
      >
        <button
          type="button"
          onClick={closeDialog}
          className={styles.lightboxClose}
          aria-label={t('caseStudy.close')}
        >
          <Icon name="close" />
        </button>
        {activeImage !== null && (
          <>
            <div className={styles.lightboxVisual}>
              {renderGalleryVisual(gallery[activeImage], activeImage, true)}
            </div>
            <div className={styles.lightboxControls}>
              <button
                type="button"
                className={styles.lightboxPrevious}
                onClick={() => moveImage(-1)}
                aria-label={t('caseStudy.previousImage')}
              >
                <Icon name="arrow" />
              </button>
              <p aria-live="polite" aria-atomic="true">
                {t('caseStudy.imageCount', { current: activeImage + 1, total: gallery.length })}
              </p>
              <button
                type="button"
                className={styles.lightboxNext}
                onClick={() => moveImage(1)}
                aria-label={t('caseStudy.nextImage')}
              >
                <Icon name="arrow" />
              </button>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
