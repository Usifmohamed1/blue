import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { m } from 'framer-motion';
import { services } from '../data/services';
import { projects } from '../data/projects';
import { processSteps, counters, siteConfig } from '../data/config';
import { testimonials } from '../data/testimonials';
import { faq } from '../data/faq';
import { Container, Section, SectionHeading, Reveal, Button } from '../components/UI';
import HeroVisual from '../sections/HeroVisual';
import useAnimatedCounter from '../hooks/useAnimatedCounter';
import Icon from '../components/Icon';
import Poster from '../components/Poster';
import SEO from '../components/SEO';
import styles from './Home.module.css';
function Count({ counter }) {
  const { t } = useTranslation();
  const { ref, value, visible, reduce } = useAnimatedCounter(counter.value, counter.id !== 'since');
  return (
    <div ref={ref} className={styles.counter}>
      <m.strong
        initial={false}
        animate={{ opacity: visible ? 1 : 0.4, y: visible ? 0 : reduce ? 0 : 10 }}
        transition={{ duration: 0.65 }}
      >
        {String(value).padStart(2, '0')}
      </m.strong>
      <span>{t(`home.counters.${counter.id}`)}</span>
    </div>
  );
}
export default function Home() {
  const { t } = useTranslation();
  const [quote, setQuote] = useState(0);
  const current = testimonials[quote];
  return (
    <>
      <SEO title={t('home.metaTitle')} description={t('home.metaDescription')} />
      <section className={styles.hero} aria-labelledby="hero-title">
        <Container>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>
                <span />
                {t('home.hero.eyebrow')}
              </p>
              <h1 id="hero-title">
                <span>{t('home.hero.line1')}</span>
                <strong>{t('home.hero.line2')}</strong>
              </h1>
              <p className={styles.heroDescription}>{t('home.hero.description')}</p>
              <div className={styles.heroActions}>
                <Button to="/contact">
                  {t('home.hero.cta')}
                  <Icon name="arrow" size={18} />
                </Button>
                <Button to="/work" variant="secondary">
                  {t('home.hero.secondary')}
                  <Icon name="arrow" size={18} />
                </Button>
              </div>
              <p className={styles.heroLabel}>
                <Icon name="spark" size={15} />
                {t('home.hero.label')}
              </p>
            </div>
            <HeroVisual />
          </div>
          <div className={styles.heroBottom}>
            <a href="#home-services">
              <Icon name="down" size={17} />
              {t('home.hero.scroll')}
            </a>
            <span>{t('home.hero.since')}</span>
            <span dir="ltr">@{siteConfig.instagram}</span>
          </div>
        </Container>
      </section>
      <div className={styles.marquee} role="img" aria-label={t('home.marquee')}>
        <div aria-hidden="true">
          {[0, 1, 2, 3].map((n) => (
            <span key={n}>
              {t('home.marquee')}
              <Icon name="spark" size={36} />
            </span>
          ))}
        </div>
      </div>
      <Section id="home-services">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow={t('home.services.eyebrow')}
              title={t('home.services.title')}
              description={t('home.services.description')}
            />
          </Reveal>
          <div className={styles.servicesGrid}>
            {services.map((service, index) => (
              <Reveal key={service.id} delay={index * 0.035}>
                <Link to={`/services#${service.id}`} className={styles.serviceCard}>
                  <div className={styles.serviceTop}>
                    <span className={styles.serviceIcon}>
                      <Icon name={service.icon} size={27} />
                    </span>
                    <span className={styles.serviceNumber}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3>{t(`serviceItems.${service.id}.title`)}</h3>
                  <p>{t(`serviceItems.${service.id}.short`)}</p>
                  <span className={styles.serviceArrow}>
                    <Icon name="arrow" size={19} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className={styles.sectionLink}>
            <Button to="/services" variant="ghost">
              {t('home.services.cta')}
              <Icon name="arrow" size={17} />
            </Button>
          </div>
        </Container>
      </Section>
      <section className={styles.statement}>
        <Container className={styles.statementGrid}>
          <Reveal>
            <p className={styles.eyebrow}>{t('home.statement.eyebrow')}</p>
            <h2>
              <span>{t('home.statement.line1')}</span>
              <strong>{t('home.statement.line2')}</strong>
            </h2>
          </Reveal>
          <Reveal className={styles.statementAside}>
            <svg viewBox="0 0 300 260" fill="none" aria-hidden="true">
              <g stroke="currentColor" strokeWidth="1.5">
                <circle cx="150" cy="130" r="106" strokeDasharray="2 8" />
                <path d="m20 130 55-65 40 35-50 68-45-38Zm260 0-55-65-40 35 50 68 45-38ZM108 110l27-18c10-6 17-5 27 1l50 37-39 54c-8 9-14 10-25 3l-63-42M144 101l-24 21c-8 8-1 17 9 12l26-14 46 36m-68 8 25 21m-39-5 22 20m11-35 25 20" />
                <path d="m76 73 22-19m126 19-22-19M150 16v25m-37-15 8 22m66-22-8 22M39 207l24-17m198 17-24-17" />
              </g>
            </svg>
            <p>{t('home.statement.description')}</p>
            <span>{t('common.since', { year: siteConfig.since })}</span>
          </Reveal>
        </Container>
      </section>
      <Section>
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow={t('home.work.eyebrow')}
              title={t('home.work.title')}
              description={t('home.work.description')}
            />
          </Reveal>
          <div className={styles.featuredGrid}>
            {projects.slice(0, 3).map((project, index) => (
              <Reveal key={project.slug} delay={index * 0.07}>
                <Link to={`/work/${project.slug}`} className={styles.projectLink}>
                  <Poster project={project} ariaHidden />
                  <div className={styles.projectCaption}>
                    <div>
                      <span>{t(`projectItems.${project.slug}.category`)}</span>
                      <h3>{t(`projectItems.${project.slug}.title`)}</h3>
                    </div>
                    <Icon name="arrow" size={21} />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className={styles.sectionLink}>
            <Button to="/work" variant="ghost">
              {t('home.work.cta')}
              <Icon name="arrow" size={17} />
            </Button>
          </div>
        </Container>
      </Section>
      <Section className={styles.process}>
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow={t('home.process.eyebrow')}
              title={t('home.process.title')}
              description={t('home.process.description')}
            />
          </Reveal>
          <div className={styles.processGrid}>
            {processSteps.map(({ id }, index) => (
              <Reveal className={styles.processStep} key={id} delay={index * 0.07}>
                <span className={styles.stepNumber}>{String(index + 1).padStart(2, '0')}</span>
                <h3>{t(`home.process.items.${id}.title`)}</h3>
                <p>{t(`home.process.items.${id}.description`)}</p>
              </Reveal>
            ))}
          </div>
          <div className={styles.counters}>
            {counters.map((counter) => (
              <Count key={counter.id} counter={counter} />
            ))}
          </div>
        </Container>
      </Section>
      <Section>
        <Container className={styles.testimonialGrid}>
          <Reveal>
            <p className={styles.eyebrow}>{t('home.testimonials.eyebrow')}</p>
            <h2>{t('home.testimonials.title')}</h2>
            <p className={styles.demoNote}>{t('home.testimonials.note')}</p>
          </Reveal>
          <Reveal className={styles.quoteCard}>
            <Icon name="quote" className={styles.quoteIcon} size={38} />
            <div aria-live="polite" aria-atomic="true">
              <blockquote>{t(`testimonialItems.${current.id}.quote`)}</blockquote>
              <div className={styles.author}>
                <span>{String(quote + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{t(`testimonialItems.${current.id}.name`)}</strong>
                  <small>{t(`testimonialItems.${current.id}.role`)}</small>
                </div>
              </div>
              <span className="visuallyHidden">
                {t('home.testimonials.slide', { current: quote + 1, total: testimonials.length })}
              </span>
            </div>
            <div className={styles.quoteControls}>
              <button
                aria-label={t('home.testimonials.previous')}
                onClick={() => setQuote((quote - 1 + testimonials.length) % testimonials.length)}
              >
                <span className={styles.reverse}>
                  <Icon name="arrow" size={19} />
                </span>
              </button>
              <span dir="ltr">
                {quote + 1} / {testimonials.length}
              </span>
              <button
                aria-label={t('home.testimonials.next')}
                onClick={() => setQuote((quote + 1) % testimonials.length)}
              >
                <Icon name="arrow" size={19} />
              </button>
            </div>
          </Reveal>
        </Container>
      </Section>
      <Section className={styles.faqSection}>
        <Container className={styles.faqGrid}>
          <Reveal>
            <p className={styles.eyebrow}>{t('home.faq.eyebrow')}</p>
            <h2>{t('home.faq.title')}</h2>
            <p className={styles.faqDescription}>{t('home.faq.description')}</p>
          </Reveal>
          <div>
            {faq.map(({ id }) => (
              <details className={styles.faq} key={id}>
                <summary>
                  {t(`faqItems.${id}.q`)}
                  <span>
                    <Icon name="plus" size={18} />
                  </span>
                </summary>
                <p>{t(`faqItems.${id}.a`)}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>
      <section className={styles.cta}>
        <Container>
          <Reveal>
            <p className={styles.eyebrow}>{t('home.cta.eyebrow')}</p>
            <h2>
              <span>{t('home.cta.line1')}</span>
              <strong>{t('home.cta.line2')}</strong>
            </h2>
            <div className={styles.ctaBottom}>
              <p>{t('home.cta.description')}</p>
              <Button to="/contact">
                {t('home.cta.button')}
                <Icon name="arrow" />
              </Button>
            </div>
          </Reveal>
          <div className={styles.ctaSignature}>
            <span>{siteConfig.name}</span>
            <span>{siteConfig.tagline.toUpperCase()}</span>
          </div>
        </Container>
      </section>
    </>
  );
}
