import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from 'lucide-react';
import {
  BOUTIQUE_CONFIG,
  BUDGET_RANGES,
  ENQUIRY_API_ENDPOINT,
  SERVICES,
} from '../data/boutiqueData.js';
import { validateField, validateForm } from '../utils/validation.js';

function createSubmissionId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `sub-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getTodayDateString() {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offsetMs).toISOString().split('T')[0];
}

const INITIAL_VALUES = {
  customerName: '',
  mobileNumber: '',
  email: '',
  service: '',
  appointmentDate: '',
  budget: '',
  message: '',
};

export default function ContactSection({ preselectedService, focusToken }) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submissionIdRef = useRef(createSubmissionId());
  const lastSubmittedSignatureRef = useRef('');
  const nameInputRef = useRef(null);

  useEffect(() => {
    if (preselectedService) {
      setValues((prev) => ({ ...prev, service: preselectedService }));
      setErrors((prev) => {
        if (!prev.service) return prev;
        const next = { ...prev };
        delete next.service;
        return next;
      });
    }
  }, [preselectedService]);

  useEffect(() => {
    if (focusToken > 0 && nameInputRef.current) {
      nameInputRef.current.focus({ preventScroll: true });
    }
  }, [focusToken]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    if (status.type !== 'idle') {
      setStatus({ type: 'idle', message: '' });
    }

    if (touched[name]) {
      const fieldError = validateField(name, value);
      setErrors((prev) => {
        const next = { ...prev };
        if (fieldError) {
          next[name] = fieldError;
        } else {
          delete next[name];
        }
        return next;
      });
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value);
    setErrors((prev) => {
      const next = { ...prev };
      if (fieldError) {
        next[name] = fieldError;
      } else {
        delete next[name];
      }
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const validationErrors = validateForm(values);
    setTouched({
      customerName: true,
      mobileNumber: true,
      email: true,
      service: true,
      appointmentDate: true,
      message: true,
    });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setStatus({
        type: 'error',
        message: 'Please fix the highlighted fields before submitting your enquiry.',
      });
      return;
    }

    const signature = JSON.stringify({
      mobileNumber: values.mobileNumber.replace(/\D/g, ''),
      service: values.service,
      appointmentDate: values.appointmentDate,
      message: values.message.trim(),
    });

    if (lastSubmittedSignatureRef.current === signature) {
      setStatus({
        type: 'success',
        message:
          'Your enquiry was already submitted. Our boutique team will get in touch with you shortly!',
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: 'idle', message: '' });

    try {
      const response = await fetch(ENQUIRY_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          submissionId: submissionIdRef.current,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        if (data.errors && typeof data.errors === 'object') {
          setErrors(data.errors);
        }
        const fallbackMessage =
          response.status === 404 || response.status === 405
            ? 'Email server is not connected to this static preview yet. Please click "Chat on WhatsApp" or "Call Now" to send your enquiry directly.'
            : 'Unable to send your enquiry right now. Please try again or contact us on WhatsApp.';
        setStatus({
          type: 'error',
          message: data.message || fallbackMessage,
        });
        return;
      }

      lastSubmittedSignatureRef.current = signature;
      submissionIdRef.current = createSubmissionId();
      setValues(INITIAL_VALUES);
      setErrors({});
      setTouched({});
      setStatus({
        type: 'success',
        message:
          data.message ||
          'Thank you! Your enquiry has been sent to our boutique team. We will contact you shortly.',
      });
    } catch {
      setStatus({
        type: 'error',
        message:
          'Network error while sending your enquiry. Please check your connection or message us on WhatsApp.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappText = encodeURIComponent(
    `Hello ${BOUTIQUE_CONFIG.name}! I would like to enquire about ladies tailoring / boutique services.`
  );
  const whatsappUrl = `https://wa.me/${BOUTIQUE_CONFIG.whatsappNumber}?text=${whatsappText}`;

  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Contact &amp; Appointment</span>
          <h2 className="section-title">Book Your Fitting or Send an Enquiry</h2>
          <p className="section-subtitle">
            Share your outfit idea, preferred date, and service needed—we will reach out promptly
            to confirm your consultation.
          </p>
        </div>

        <div className="contact-layout">
          <aside className="contact-info-card">
            <h3>Visit or Reach Our Studio</h3>
            <p className="contact-lead">
              Walk in for fabric styling and custom measurements, or connect directly by phone,
              WhatsApp, or Instagram.
            </p>

            <div className="contact-list">
              <a href={`tel:${BOUTIQUE_CONFIG.phoneRaw}`} className="contact-item">
                <span className="contact-item-icon" aria-hidden="true">
                  <Phone size={18} />
                </span>
                <span>
                  <span className="contact-item-label">Click to Call</span>
                  <span className="contact-item-value">{BOUTIQUE_CONFIG.phoneDisplay}</span>
                </span>
              </a>

              <a
                href={BOUTIQUE_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-item"
              >
                <span className="contact-item-icon" aria-hidden="true">
                  <Instagram size={18} />
                </span>
                <span>
                  <span className="contact-item-label">Instagram</span>
                  <span className="contact-item-value">Follow our latest designs</span>
                </span>
              </a>

              <div className="contact-item">
                <span className="contact-item-icon" aria-hidden="true">
                  <MapPin size={18} />
                </span>
                <span>
                  <span className="contact-item-label">Boutique Address</span>
                  <span className="contact-item-value">{BOUTIQUE_CONFIG.address}</span>
                </span>
              </div>

              <div className="contact-item">
                <span className="contact-item-icon" aria-hidden="true">
                  <Clock size={18} />
                </span>
                <span>
                  <span className="contact-item-label">Studio Hours</span>
                  <span className="contact-item-value">{BOUTIQUE_CONFIG.hours}</span>
                </span>
              </div>
            </div>

            <div className="contact-quick-actions">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--whatsapp"
              >
                <MessageCircle size={17} />
                Chat on WhatsApp
              </a>
              <a href={`tel:${BOUTIQUE_CONFIG.phoneRaw}`} className="btn btn--secondary">
                <Phone size={16} />
                Call Now
              </a>
            </div>

            <div className="map-wrapper">
              <iframe
                title={`${BOUTIQUE_CONFIG.name} Boutique Location Map`}
                src={BOUTIQUE_CONFIG.mapsEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="map-footer">
                <span>Find us easily</span>
                <a href={BOUTIQUE_CONFIG.mapsLink} target="_blank" rel="noopener noreferrer">
                  Open in Google Maps
                </a>
              </div>
            </div>
          </aside>

          <div className="enquiry-form-card">
            <h3>Customer Enquiry Form</h3>
            <p className="contact-lead">
              Fill out the details below and our boutique team will confirm your appointment and
              share a personalized stitching estimate.
            </p>

            {status.type === 'success' && (
              <div className="form-alert form-alert--success" role="status" aria-live="polite">
                <CheckCircle2 size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{status.message}</span>
              </div>
            )}

            {status.type === 'error' && (
              <div className="form-alert form-alert--error" role="alert">
                <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{status.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="customerName">
                    Customer Name<span className="required-star">*</span>
                  </label>
                  <input
                    ref={nameInputRef}
                    id="customerName"
                    name="customerName"
                    type="text"
                    autoComplete="name"
                    placeholder="e.g., Ananya Sharma"
                    value={values.customerName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={Boolean(errors.customerName)}
                    aria-describedby={errors.customerName ? 'customerName-error' : undefined}
                    required
                  />
                  {errors.customerName && (
                    <span id="customerName-error" className="field-error" role="alert">
                      {errors.customerName}
                    </span>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="mobileNumber">
                    Mobile Number<span className="required-star">*</span>
                  </label>
                  <input
                    id="mobileNumber"
                    name="mobileNumber"
                    type="tel"
                    autoComplete="tel"
                    placeholder="e.g., +91 98765 43210"
                    value={values.mobileNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={Boolean(errors.mobileNumber)}
                    aria-describedby={errors.mobileNumber ? 'mobileNumber-error' : undefined}
                    required
                  />
                  {errors.mobileNumber && (
                    <span id="mobileNumber-error" className="field-error" role="alert">
                      {errors.mobileNumber}
                    </span>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="email">
                    Email Address<span className="optional-tag">(Optional)</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="e.g., ananya@email.com"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <span id="email-error" className="field-error" role="alert">
                      {errors.email}
                    </span>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="service">
                    Service Required<span className="required-star">*</span>
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={values.service}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={Boolean(errors.service)}
                    aria-describedby={errors.service ? 'service-error' : undefined}
                    required
                  >
                    <option value="">Select a service...</option>
                    {SERVICES.map((item) => (
                      <option key={item.id} value={item.title}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                  {errors.service && (
                    <span id="service-error" className="field-error" role="alert">
                      {errors.service}
                    </span>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="appointmentDate">
                    Preferred Appointment Date
                    <span className="optional-tag">(Optional)</span>
                  </label>
                  <input
                    id="appointmentDate"
                    name="appointmentDate"
                    type="date"
                    min={getTodayDateString()}
                    value={values.appointmentDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={Boolean(errors.appointmentDate)}
                    aria-describedby={errors.appointmentDate ? 'appointmentDate-error' : undefined}
                  />
                  {errors.appointmentDate && (
                    <span id="appointmentDate-error" className="field-error" role="alert">
                      {errors.appointmentDate}
                    </span>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="budget">
                    Budget Range<span className="optional-tag">(Optional)</span>
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={values.budget}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Select a budget range...</option>
                    {BUDGET_RANGES.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field field--full">
                  <label htmlFor="message">
                    Message / Requirements<span className="optional-tag">(Optional)</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Share fabric details, neckline preference, occasion date, or any special fitting notes..."
                    value={values.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  />
                  {errors.message && (
                    <span id="message-error" className="field-error" role="alert">
                      {errors.message}
                    </span>
                  )}
                </div>

                <div className="field field--full" style={{ marginTop: '0.25rem' }}>
                  <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={isSubmitting}
                    style={{ width: '100%' }}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner" aria-hidden="true" />
                        Sending Enquiry...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Submit Boutique Enquiry
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
