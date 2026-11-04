import styles from './Icon.module.css';
const paths = {
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7h.01" />
    </>
  ),
  expand: <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" />,
  arrow: <path d="M4 12h16m-7-7 7 7-7 7" />,
  chevron: <path d="m8 4 8 8-8 8" />,
  down: <path d="M12 3v18m-6-6 6 6 6-6" />,
  spark: <path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z" />
    </>
  ),
  menu: <path d="M3 7h18M7 12h14M3 17h18" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  search: (
    <>
      <circle cx="10" cy="10" r="6" />
      <path d="m15 15 6 6" />
    </>
  ),
  check: <path d="m4 12 5 5L20 6" />,
  plus: <path d="M12 4v16M4 12h16" />,
  play: <path d="m8 4 12 8-12 8V4Z" />,
  branding: <path d="m12 2 10 10-10 10L2 12 12 2ZM12 2v20M2 12h20" />,
  social: (
    <>
      <rect x="3" y="3" width="18" height="15" rx="4" />
      <path d="m8 18-3 4M8 8h8M8 12h5" />
    </>
  ),
  management: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M7 2v6M17 2v6M3 10h18m-13 5 3 3 5-5" />
    </>
  ),
  motion: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="m10 8 6 4-6 4V8Z" />
    </>
  ),
  ads: <path d="m3 10 17-6v14L3 14v-4ZM7 15l2 6h4l-2-5M20 9l2-1" />,
  web: (
    <>
      <rect x="2" y="3" width="20" height="18" rx="3" />
      <path d="M2 8h20m-12 4-3 3 3 3m4-6 3 3-3 3" />
    </>
  ),
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="m3 6 9 7 9-7" />
    </>
  ),
  phone: <path d="m8 3 2 5-3 2c2 4 3 5 7 7l2-3 5 2c1 4-1 6-4 5C9 20 4 15 3 7c-1-3 1-5 5-4Z" />,
  whatsapp: (
    <>
      <path d="M21 11.5a9 9 0 0 1-13.3 8L3 21l1.5-4.7A9 9 0 1 1 21 11.5Z" />
      <path d="m8 7 1 3-1 1c1 2 2 3 4 4l1-1 3 1c0 2-1 3-3 2-5-1-8-5-7-8 0-1 1-2 2-2Z" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </>
  ),
  location: (
    <>
      <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" />
      <circle cx="12" cy="10" r="2" />
    </>
  ),
  quote: (
    <path d="M4 14h5v6H2v-8c0-4 2-7 7-8v4c-3 1-5 3-5 6Zm13 0h5v6h-7v-8c0-4 2-7 7-8v4c-3 1-5 3-5 6Z" />
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6l4 2" />
    </>
  ),
  external: (
    <>
      <path d="M14 3h7v7m0-7L10 14" />
      <path d="M10 3H3v18h18v-7" />
    </>
  ),
};
export default function Icon({ name = 'spark', size = 22, className = '', ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`${styles.icon} ${['arrow', 'chevron'].includes(name) ? styles.directional : ''} ${className}`}
      {...props}
    >
      {paths[name] || paths.spark}
    </svg>
  );
}
