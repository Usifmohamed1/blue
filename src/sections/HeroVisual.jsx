import { useTranslation } from 'react-i18next';
import { siteConfig } from '../data/config';
import Logo from '../components/Logo';
import Icon from '../components/Icon';
import styles from '../pages/Home.module.css';
export default function HeroVisual() {
  const { t } = useTranslation();
  return (
    <div className={styles.heroVisual} role="img" aria-label={t('home.hero.visualLabel')}>
      <div className={styles.artHalo} />
      <div className={styles.mesh}>
        <svg viewBox="0 0 600 600" fill="none" aria-hidden="true">
          <g stroke="currentColor" strokeWidth=".7">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <ellipse
                key={i}
                cx="300"
                cy="300"
                rx={35 + i * 33}
                ry="225"
                transform={`rotate(-22 300 300)`}
              />
            ))}
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <ellipse
                key={i}
                cx="300"
                cy="300"
                rx="235"
                ry={30 + i * 30}
                transform="rotate(-22 300 300)"
              />
            ))}
            <circle cx="300" cy="300" r="260" strokeDasharray="2 12" />
          </g>
        </svg>
      </div>
      <div className={styles.heroLogo}>
        <Logo variant="full" animated />
      </div>
      <span className={styles.coordinate}>{t('home.hero.since')}</span>
      <div className={styles.artBadge}>
        <Icon name="spark" size={22} />
        <span>{t('home.hero.gameOn')}</span>
      </div>
      <div className={styles.artStamp}>
        <span>{siteConfig.name}</span>
        <span>{siteConfig.tagline.toUpperCase()}</span>
      </div>
    </div>
  );
}
