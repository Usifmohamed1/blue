import { m, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './Logo.module.css';
export default function Logo({ variant = 'horizontal', animated = false, className = '' }) {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const animate = animated && !reduce;
  const triangle = (points, index) => (
    <m.polygon
      points={points}
      fill={index === 2 ? 'var(--cyan)' : 'var(--navy)'}
      initial={
        animate
          ? { opacity: 0, x: index === 2 ? 50 : -40, y: index === 0 ? -35 : index === 1 ? 35 : 0 }
          : false
      }
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: index * 0.18, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
    />
  );
  return (
    <span
      className={`${styles.logo} ${styles[variant]} ${className}`}
      role={variant === 'horizontal' ? undefined : 'img'}
      aria-label={variant === 'horizontal' ? undefined : t('common.logoLabel')}
    >
      <svg viewBox="0 0 381 704" aria-hidden="true">
        {triangle('0,0 304,176 0,353', 0)}
        {triangle('0,353 304,528 0,704', 1)}
        {triangle('381,176 381,528 78,353', 2)}
        {variant !== 'icon' && (
          <g fill="var(--ink)" fontFamily="Arial,sans-serif" textAnchor="middle">
            <text x="272" y="365" fontSize="48" fontWeight="700" letterSpacing="10">
              BLUE
            </text>
            <text x="270" y="392" fontSize="10.5" fontWeight="700" letterSpacing="2.1">
              YOUR CREATIVE PARTNER
            </text>
          </g>
        )}
      </svg>
      {variant === 'horizontal' && (
        <span className={styles.wordmark}>
          <strong>BLUE</strong> <span>YOUR CREATIVE PARTNER</span>
        </span>
      )}
    </span>
  );
}
