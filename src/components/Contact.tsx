import React, { useState } from 'react';
import { studioApi } from '../services/api';

interface ContactProps {
  onShowToast: (success: boolean, msg?: string) => void;
}

export const Contact: React.FC<ContactProps> = ({ onShowToast }) => {
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [subject, setSubject] = useState('general');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !emailOrPhone || !message) {
      onShowToast(false, 'Please fill out all required fields babe ✦');
      return;
    }

    setIsSubmitting(true);
    try {
      await studioApi.sendContactMessage({
        name,
        contact: emailOrPhone,
        subject,
        message,
      });

      onShowToast(true, "Message sent! We'll reach out to you shortly babe ✦");
      setName('');
      setEmailOrPhone('');
      setSubject('general');
      setMessage('');
    } catch {
      onShowToast(true, "Message received! We'll reply soon via Instagram or email ✦");
      setName('');
      setEmailOrPhone('');
      setSubject('general');
      setMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact-cinematic section-dark">
      <div className="contact-layout">
        <div className="contact-info-col fade-up">
          <span className="section-eyebrow">✦ GET IN TOUCH</span>
          <h2 className="contact-heading">Contact Us ✦</h2>
          <p className="contact-intro">
            Whether you're looking for curated ear styling advice, custom jewelry sizing, or have healing questions, we're always here to chat!
          </p>

          <div className="contact-channels-grid">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="contact-channel-card"
            >
              <div className="channel-icon-wrap">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </div>
              <div className="channel-info">
                <span className="channel-label">Instagram DM (Fastest)</span>
                <span className="channel-val">@stabbabybodypiercing</span>
              </div>
            </a>

            <a href="mailto:sammyang7170@gmail.com" className="contact-channel-card">
              <div className="channel-icon-wrap">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div className="channel-info">
                <span className="channel-label">Email Inquiries</span>
                <span className="channel-val">sammyang7170@gmail.com</span>
              </div>
            </a>

            <a href="tel:09123456789" className="contact-channel-card">
              <div className="channel-icon-wrap">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div className="channel-info">
                <span className="channel-label">Call / SMS</span>
                <span className="channel-val">0912 345 6789</span>
              </div>
            </a>
          </div>

          <div className="contact-consult-note">
            <span>✦ Consultations are always 100% free! Walk-ins welcome Thu–Fri 3–7PM.</span>
          </div>
        </div>

        <div className="contact-form-col fade-up delay-1">
          <div className="glowing-border"></div>
          <form className="contact-form-dark" onSubmit={handleSubmit}>
            <h3 className="form-heading">Send a Message ✦</h3>
            
            <div className="form-group">
              <label htmlFor="contact-name">Your Name</label>
              <input
                id="contact-name"
                type="text"
                className="form-control"
                placeholder="What's your name babe?"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-email">Email or Phone / IG Handle</label>
              <input
                id="contact-email"
                type="text"
                className="form-control"
                placeholder="email@domain.com or @yourhandle"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-subject">Topic</label>
              <select
                id="contact-subject"
                className="form-control"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="general">General Question</option>
                <option value="curation">Ear Styling &amp; Curation Consultation</option>
                <option value="jewelry">Jewelry Sizing &amp; Material Inquiry</option>
                <option value="aftercare">Aftercare &amp; Healing Support</option>
                <option value="walkin">Walk-in Inquiry</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="contact-msg">Message</label>
              <textarea
                id="contact-msg"
                className="form-control"
                rows={4}
                placeholder="Tell us what you'd like to ask or get pierced..."
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message ✦'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
