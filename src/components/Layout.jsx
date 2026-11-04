import { useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { siteConfig } from '../data/config';
import Logo from './Logo';
import Icon from './Icon';
import { Container, Button } from './UI';
import styles from './Layout.module.css';
const navItems = ['services', 'work', 'about', 'blog', 'contact'];
export default function Layout() {
  const { t, i18n } = useTranslation();
  const drawer = useRef();
  const menuButton = useRef();
  const location = useLocation();
  const main = useRef();
  const first = useRef(true);
  const close = () => drawer.current?.close();
  useEffect(() => {
    close();
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    main.current?.focus({ preventScroll: true });
  }, [location.pathname]);
  useEffect(() => {
    const dialog = drawer.current;
    const onClose = () => {
      document.body.style.overflow = '';
      menuButton.current?.setAttribute('aria-expanded', 'false');
    };
    dialog.addEventListener('close', onClose);
    return () => {
      dialog.removeEventListener('close', onClose);
      document.body.style.overflow = '';
    };
  }, []);
  const toggleLanguage = () => i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
  const links = (mobile = false) =>
    navItems.map((id) => (
      <NavLink
        key={id}
        to={`/${id}`}
        onClick={mobile ? close : undefined}
        className={({ isActive }) => (isActive ? styles.active : '')}
      >
        {t(`nav.${id}`)}
      </NavLink>
    ));
  const social = `https://www.instagram.com/${siteConfig.instagram}/`;
  const floating = siteConfig.whatsapp ? `https://wa.me/${siteConfig.whatsapp}` : social;
  return (
    <>
      <a className={styles.skip} href="#main">
        {t('common.skip')}
      </a>
      <header className={styles.header}>
        <Container className={styles.headerInner}>
          <Link to="/" className={styles.brandLink}>
            <Logo />
          </Link>
          <nav className={styles.nav} aria-label={t('nav.menu')}>
            {links()}
          </nav>
          <div className={styles.actions}>
            <button
              className={styles.language}
              type="button"
              onClick={toggleLanguage}
              lang={i18n.language === 'ar' ? 'en' : 'ar'}
              aria-label={`${t('common.languageToggle')}: ${t('nav.language')}`}
            >
              <Icon name="globe" size={15} />
              {t('nav.language')}
            </button>
            <Button to="/contact" className={styles.navCta}>
              {t('nav.cta')}
              <Icon name="arrow" size={16} />
            </Button>
            <button
              className={styles.menuButton}
              ref={menuButton}
              aria-label={t('common.openMenu')}
              aria-expanded="false"
              aria-controls="mobile-navigation"
              onClick={() => {
                drawer.current.showModal();
                menuButton.current.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';
              }}
            >
              <Icon name="menu" />
            </button>
          </div>
        </Container>
      </header>
      <dialog
        ref={drawer}
        id="mobile-navigation"
        className={styles.drawer}
        aria-label={t('nav.menu')}
        onClick={(e) => {
          if (e.target === drawer.current) close();
        }}
      >
        <div className={styles.drawerContent}>
          <div className={styles.drawerTop}>
            <Logo />
            <button className={styles.close} onClick={close} aria-label={t('common.closeMenu')}>
              <Icon name="close" />
            </button>
          </div>
          <nav className={styles.mobileLinks} aria-label={t('nav.menu')}>
            <NavLink to="/" onClick={close}>
              {t('nav.home')}
            </NavLink>
            {links(true)}
          </nav>
          <Button to="/contact" onClick={close}>
            {t('nav.cta')}
            <Icon name="arrow" />
          </Button>
          <p className={styles.drawerNote}>{t('footer.since')}</p>
        </div>
      </dialog>
      <main id="main" ref={main} tabIndex="-1" className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <Container>
          <div className={styles.footerTop}>
            <div>
              <Link to="/">
                <Logo />
              </Link>
              <p className={styles.footerDescription}>{t('footer.description')}</p>
            </div>
            <div className={styles.footerNav}>
              <p>{t('footer.links')}</p>
              <nav aria-label={t('footer.links')}>
                {navItems.map((id) => (
                  <Link key={id} to={`/${id}`}>
                    {t(`nav.${id}`)}
                  </Link>
                ))}
              </nav>
            </div>
            <div className={styles.footerSocial}>
              <p>{t('footer.social')}</p>
              <a href={social} target="_blank" rel="noopener noreferrer">
                <Icon name="instagram" size={18} />
                <span dir="ltr">@{siteConfig.instagram}</span>
                <Icon name="external" size={16} />
              </a>
              <span>
                {siteConfig.city
                  ? `${siteConfig.city}, ${siteConfig.country}`
                  : t('footer.location')}
              </span>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <span>{t('footer.copyright', { year: new Date().getFullYear() })}</span>
            <span>{t('footer.note')}</span>
            <a href="#main" aria-label={t('common.backToTop')}>
              <Icon name="down" className={styles.up} size={18} />
            </a>
          </div>
        </Container>
      </footer>
      <a
        href={floating}
        className={styles.floating}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={siteConfig.whatsapp ? t('common.whatsapp') : t('common.instagram')}
      >
        <Icon name={siteConfig.whatsapp ? 'whatsapp' : 'instagram'} size={23} />
      </a>
    </>
  );
}
