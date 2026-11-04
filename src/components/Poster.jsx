import { useTranslation } from 'react-i18next';
import { siteConfig } from '../data/config';
import Icon from './Icon';
import styles from './Poster.module.css';
export default function Poster({ project, variant = '', ariaHidden = false }) {
  const { t } = useTranslation();
  const image = typeof variant === 'number' ? project.gallery?.[variant]?.image : project.image;
  const label = t(`projectItems.${project.slug}.title`);
  return image ? (
    <img
      className={styles.image}
      src={image}
      width="900"
      height="1000"
      loading="lazy"
      decoding="async"
      alt={label}
    />
  ) : (
    <div
      className={`${styles.poster} ${styles[project.theme] || styles.pulse} ${variant === 'detail' ? styles.detail : ''}`}
      role={ariaHidden ? undefined : 'img'}
      aria-label={ariaHidden ? undefined : label}
      aria-hidden={ariaHidden || undefined}
    >
      <div className={styles.content} aria-hidden="true">
        <div className={styles.topline}>
          <span>{t('common.concept')}</span>
          <Icon name="spark" size={17} />
        </div>
        <div className={styles.orbit} />
        <div className={styles.orbit2} />
        <svg className={styles.geometry} viewBox="0 0 400 400" fill="none">
          <path
            d="m70 300 130-225 130 225H70ZM105 280l95-165 95 165H105ZM140 260l60-104 60 104H140Z"
            stroke="currentColor"
          />
          <path
            d="M45 200h310M200 45v310M90 90l220 220M90 310 310 90"
            stroke="currentColor"
            opacity=".4"
          />
        </svg>
        <div className={styles.headline}>{t(`projectItems.${project.slug}.poster`)}</div>
        <span className={styles.caption}>{t(`projectItems.${project.slug}.caption`)}</span>
        <div className={styles.stamp}>
          <strong>{siteConfig.name}</strong>
          <span>{siteConfig.tagline.toUpperCase()}</span>
          <span>↗</span>
        </div>
      </div>
    </div>
  );
}
