import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Layout from './components/Layout';
const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const Work = lazy(() => import('./pages/Work'));
const CaseStudy = lazy(() => import('./pages/CaseStudy'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const NotFound = lazy(() => import('./pages/NotFound'));
function PageRoutes() {
  const location = useLocation();
  const reduce = useReducedMotion();
  const { t } = useTranslation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={location.pathname}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reduce ? 0 : -8 }}
        transition={{ duration: 0.2 }}
      >
        <Suspense
          fallback={
            <div role="status" style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
              {t('common.loading')}
            </div>
          }
        >
          <Routes location={location}>
            <Route index element={<Home />} />
            <Route path="services" element={<Services />} />
            <Route path="work" element={<Work />} />
            <Route path="work/:slug" element={<CaseStudy />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </m.div>
    </AnimatePresence>
  );
}
export default function App() {
  return (
    <Routes>
      <Route path="/*" element={<Layout />}>
        <Route path="*" element={<PageRoutes />} />
      </Route>
    </Routes>
  );
}
