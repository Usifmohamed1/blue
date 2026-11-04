import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { siteConfig } from '../data/config';
export default function SEO({ title, description, image = '/social-card.png', noIndex = false }) {
  const { i18n } = useTranslation();
  const { pathname } = useLocation();
  const base = import.meta.env.VITE_SITE_URL || siteConfig.siteUrl || window.location.origin;
  const url = new URL(pathname, base).href;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    foundingDate: String(siteConfig.since),
    url: base,
    sameAs: [`https://www.instagram.com/${siteConfig.instagram}/`],
    logo: new URL('/favicon.svg', base).href,
  };
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noIndex ? 'noindex,follow' : 'index,follow'} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={i18n.language === 'ar' ? 'ar_EG' : 'en_GB'} />
      <meta property="og:image" content={new URL(image, base).href} />
      <meta name="twitter:card" content="summary_large_image" />
      <script type="application/ld+json">{JSON.stringify(schema).replace(/</g, '\\u003c')}</script>
    </Helmet>
  );
}
