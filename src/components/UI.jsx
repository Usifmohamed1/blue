import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './UI.module.css';
export function Container({ as: Tag = 'div', className = '', children, ...props }) {
  return (
    <Tag className={`${styles.container} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
export function Section({ as: Tag = 'section', className = '', children, ...props }) {
  return (
    <Tag className={`${styles.section} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
export function Button({ to, href, variant = 'primary', className = '', children, ...props }) {
  const cls = `${styles.button} ${styles[variant] || styles.primary} ${className}`;
  if (to)
    return (
      <Link to={to} className={cls} {...props}>
        {children}
      </Link>
    );
  if (href)
    return (
      <a href={href} className={cls} {...props}>
        {children}
      </a>
    );
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
const observer =
  typeof IntersectionObserver === 'undefined'
    ? null
    : new IntersectionObserver(
        (entries) => {
          for (const entry of entries)
            if (entry.isIntersecting) {
              entry.target.dataset.visible = 'true';
              observer.unobserve(entry.target);
            }
        },
        { threshold: 0.08 },
      );
export function Reveal({ as: Tag = 'div', className = '', children, delay = 0, ...props }) {
  const ref = useRef();
  useEffect(() => {
    const element = ref.current;
    if (!observer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.dataset.visible = 'true';
      return;
    }
    observer.observe(element);
    return () => observer.unobserve(element);
  }, []);
  return (
    <Tag
      ref={ref}
      data-visible="false"
      className={`${styles.reveal} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
      {...props}
    >
      {children}
    </Tag>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  description,
  className = '',
  headingAs: Heading = 'h2',
}) {
  return (
    <div className={`${styles.sectionHeading} ${className}`}>
      <div>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <Heading>{title}</Heading>
      </div>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
}
export function Card({ as: Tag = 'article', className = '', children, ...props }) {
  return (
    <Tag className={`${styles.card} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
