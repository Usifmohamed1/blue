import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Container, Section, Button, Reveal, SectionHeading } from '../components/UI';
import SEO from '../components/SEO';
import Icon from '../components/Icon';
import { siteConfig } from '../data/config';
import { services } from '../data/services';
import styles from './Secondary.module.css';

const budgets = ['not-sure', 'under-10k', '10k-25k', '25k-50k', '50k-plus'];
const normalizePhone = (value) =>
  value
    .replace(/[٠-٩]/g, (char) => char.charCodeAt(0) - 1632)
    .replace(/[۰-۹]/g, (char) => char.charCodeAt(0) - 1776);

export default function Contact() {
  const { t, i18n } = useTranslation();
  const [params] = useSearchParams();
  const selectedService = services.some(({ id }) => id === params.get('service'))
    ? params.get('service')
    : '';
  const [status, setStatus] = useState(null);
  const languageRef = useRef(i18n.language);
  const abortRef = useRef(null);
  const schema = useMemo(
    () =>
      z.object({
        name: z
          .string()
          .trim()
          .min(2, t('contact.form.nameError'))
          .max(100, t('contact.form.nameError')),
        phone: z
          .string()
          .trim()
          .refine((value) => {
            const normalized = normalizePhone(value);
            return (
              /^[+\d\s().-]+$/.test(normalized) && /^\d{8,15}$/.test(normalized.replace(/\D/g, ''))
            );
          }, t('contact.form.phoneError')),
        email: z
          .string()
          .trim()
          .email(t('contact.form.emailError'))
          .max(254, t('contact.form.emailError')),
        service: z
          .string()
          .refine(
            (value) => services.some(({ id }) => id === value),
            t('contact.form.serviceError'),
          ),
        budget: z
          .string()
          .refine((value) => budgets.includes(value), t('contact.form.budgetError')),
        message: z
          .string()
          .trim()
          .min(10, t('contact.form.messageError'))
          .max(4000, t('contact.form.messageError')),
        website: z.string().max(200).optional(),
      }),
    [t],
  );
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    trigger,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      service: selectedService,
      budget: 'not-sure',
      message: '',
      website: '',
    },
    shouldFocusError: true,
  });
  useEffect(() => {
    if (selectedService) setValue('service', selectedService);
  }, [selectedService, setValue]);
  useEffect(() => {
    if (languageRef.current !== i18n.language) {
      languageRef.current = i18n.language;
      if (Object.keys(errors).length) void trigger();
    }
  }, [i18n.language, errors, trigger]);
  useEffect(() => () => abortRef.current?.abort(), []);
  const instagramUrl = `https://www.instagram.com/${encodeURIComponent(siteConfig.instagram)}/`;
  const whatsappUrl = siteConfig.whatsapp
    ? `https://wa.me/${String(siteConfig.whatsapp).replace(/\D/g, '')}`
    : null;
  const submit = async (values) => {
    setStatus(null);
    const controller = new AbortController();
    abortRef.current = controller;
    let timedOut = false;
    const timeout = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 15000);
    try {
      const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
      const response = await fetch(`${apiBase}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, phone: normalizePhone(values.phone) }),
        signal: controller.signal,
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) {
        const key =
          response.status === 429
            ? 'rateLimited'
            : response.status === 503
              ? 'unavailable'
              : 'error';
        setStatus({ type: 'error', key });
        return;
      }
      setStatus({
        type: 'success',
        key: result.delivery === 'development' ? 'development' : 'success',
      });
      reset({
        name: '',
        phone: '',
        email: '',
        service: selectedService,
        budget: 'not-sure',
        message: '',
        website: '',
      });
    } catch {
      if (!controller.signal.aborted || timedOut) setStatus({ type: 'error', key: 'error' });
    } finally {
      clearTimeout(timeout);
      abortRef.current = null;
    }
  };
  const prepareAlternative = (event) => {
    if (!whatsappUrl) return;
    const values = getValues();
    const details = [t('contact.formTitle')];
    for (const key of ['name', 'phone', 'email', 'service', 'budget', 'message']) {
      if (!values[key]) continue;
      const value =
        key === 'service'
          ? t(`serviceItems.${values[key]}.title`)
          : key === 'budget'
            ? t(`contact.form.budgets.${values[key]}`)
            : values[key];
      details.push(`${t(`contact.form.${key}`)}: ${value}`);
    }
    event.currentTarget.href = `${whatsappUrl}?text=${encodeURIComponent(details.join('\n'))}`;
  };
  const errorText = (name) =>
    errors[name] && (
      <span className={styles.fieldError} id={`${name}-error`}>
        {errors[name].message}
      </span>
    );
  const fieldProps = (name) => ({
    required: true,
    'aria-invalid': !!errors[name],
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
    ...register(name),
  });
  return (
    <>
      <SEO title={t('contact.metaTitle')} description={t('contact.metaDescription')} />
      <Section className={styles.pageHero}>
        <Container>
          <Reveal>
            <SectionHeading
              headingAs="h1"
              eyebrow={t('contact.eyebrow')}
              title={t('contact.title')}
              description={t('contact.description')}
            />
          </Reveal>
          <div className={styles.contactGrid}>
            <Reveal className={styles.contactDetails}>
              <h2>{t('contact.detailsTitle')}</h2>
              <a
                className={styles.contactLink}
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="instagram" />
                <span>
                  <small>{t('contact.instagram')}</small>
                  <strong dir="ltr">@{siteConfig.instagram}</strong>
                </span>
                <Icon name="arrow" />
              </a>
              {whatsappUrl ? (
                <a
                  className={styles.contactLink}
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="whatsapp" />
                  <span>
                    <small>{t('contact.whatsapp')}</small>
                    <strong dir="ltr">+{siteConfig.whatsapp}</strong>
                  </span>
                  <Icon name="arrow" />
                </a>
              ) : (
                <div className={styles.contactLink}>
                  <Icon name="whatsapp" />
                  <span>
                    <small>{t('contact.whatsapp')}</small>
                    <strong>{t('contact.missing')}</strong>
                  </span>
                </div>
              )}
              {siteConfig.email ? (
                <a className={styles.contactLink} href={`mailto:${siteConfig.email}`}>
                  <Icon name="mail" />
                  <span>
                    <small>{t('contact.email')}</small>
                    <strong dir="ltr">{siteConfig.email}</strong>
                  </span>
                  <Icon name="arrow" />
                </a>
              ) : (
                <div className={styles.contactLink}>
                  <Icon name="mail" />
                  <span>
                    <small>{t('contact.email')}</small>
                    <strong>{t('contact.missing')}</strong>
                  </span>
                </div>
              )}
              <div className={styles.contactLink}>
                <Icon name="location" />
                <span>
                  <small>{t('contact.location')}</small>
                  <strong>
                    {siteConfig.city
                      ? `${siteConfig.city}, ${siteConfig.country}`
                      : t('contact.locationMissing')}
                  </strong>
                </span>
              </div>
              <div className={styles.mapPlaceholder}>
                <div className={styles.mapGrid} aria-hidden="true" />
                <Icon name="location" />
                <h3>{t('contact.mapTitle')}</h3>
                <p>{t('contact.mapNote')}</p>
              </div>
            </Reveal>
            <Reveal>
              <form
                className={styles.contactForm}
                onSubmit={handleSubmit(submit)}
                aria-busy={isSubmitting}
                noValidate
              >
                <h2>{t('contact.formTitle')}</h2>
                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label htmlFor="contact-name">{t('contact.form.name')}</label>
                    <input
                      id="contact-name"
                      autoComplete="name"
                      placeholder={t('contact.form.namePlaceholder')}
                      maxLength={100}
                      {...fieldProps('name')}
                    />
                    {errorText('name')}
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="contact-phone">{t('contact.form.phone')}</label>
                    <input
                      id="contact-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder={t('contact.form.phonePlaceholder')}
                      maxLength={30}
                      {...fieldProps('phone')}
                    />
                    {errorText('phone')}
                  </div>
                  <div className={`${styles.field} ${styles.fieldFull}`}>
                    <label htmlFor="contact-email">{t('contact.form.email')}</label>
                    <input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      placeholder={t('contact.form.emailPlaceholder')}
                      maxLength={254}
                      {...fieldProps('email')}
                    />
                    {errorText('email')}
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="contact-service">{t('contact.form.service')}</label>
                    <select id="contact-service" {...fieldProps('service')}>
                      <option value="">{t('contact.form.servicePlaceholder')}</option>
                      {services.map(({ id }) => (
                        <option value={id} key={id}>
                          {t(`serviceItems.${id}.title`)}
                        </option>
                      ))}
                    </select>
                    {errorText('service')}
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="contact-budget">{t('contact.form.budget')}</label>
                    <select id="contact-budget" {...fieldProps('budget')}>
                      {budgets.map((value) => (
                        <option value={value} key={value}>
                          {t(`contact.form.budgets.${value}`)}
                        </option>
                      ))}
                    </select>
                    {errorText('budget')}
                  </div>
                  <div className={`${styles.field} ${styles.fieldFull}`}>
                    <label htmlFor="contact-message">{t('contact.form.message')}</label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      placeholder={t('contact.form.messagePlaceholder')}
                      maxLength={4000}
                      {...fieldProps('message')}
                    />
                    {errorText('message')}
                  </div>
                  <div className={styles.honeypot} aria-hidden="true">
                    <label htmlFor="contact-website">{t('contact.form.website')}</label>
                    <input
                      id="contact-website"
                      autoComplete="off"
                      tabIndex={-1}
                      {...register('website')}
                    />
                  </div>
                </div>
                <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                  {isSubmitting ? t('contact.form.sending') : t('contact.form.submit')}
                  <Icon name={isSubmitting ? 'spark' : 'arrow'} />
                </button>
                <p className={styles.privacy}>{t('contact.form.privacy')}</p>
                <div aria-live="polite" aria-atomic="true">
                  {status && (
                    <p
                      className={`${styles.formStatus} ${status.type === 'error' ? styles.statusError : ''}`}
                      role={status.type === 'error' ? 'alert' : 'status'}
                    >
                      {t(`contact.form.${status.key}`)}
                    </p>
                  )}
                </div>
                <div className={styles.formAlternative}>
                  <Button
                    href={whatsappUrl || instagramUrl}
                    onClick={prepareAlternative}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="secondary"
                  >
                    {t('contact.alternative')}
                    <Icon name={whatsappUrl ? 'whatsapp' : 'instagram'} />
                  </Button>
                </div>
              </form>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
