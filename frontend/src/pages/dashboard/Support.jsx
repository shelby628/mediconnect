import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ChevronDown, ChevronUp, Send, Check, HelpCircle, MessageSquare } from 'lucide-react';

const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&family=Outfit:wght@700;800;900&display=swap');

    :root {
      --cream: #F7F3EC;
      --warm: #EDE5D8;
      --primary: #7B2D3E;
      --primary-light: #A84458;
      --primary-dark: #4E1A26;
      --text: #1A1008;
      --muted: #7A6A58;
      --white: #FFFFFF;
    }

    .support-page {
      font-family: 'DM Sans', sans-serif;
      color: var(--text);
      padding: 2.5rem;
      max-width: 1000px;
    }

    /* ── HEADER ── */
    .support-header { margin-bottom: 2.5rem; }
    .support-header h1 {
      font-family: 'Outfit', sans-serif;
      font-size: 2.4rem; font-weight: 800;
      color: var(--text); letter-spacing: -0.03em; margin-bottom: 0.3rem;
    }
    .support-header p { color: var(--muted); font-size: 0.95rem; }

    /* ── GRID ── */
    .support-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      align-items: start;
    }
    @media (max-width: 900px) {
      .support-grid { grid-template-columns: 1fr; }
    }

    /* ── SECTION HEADING ── */
    .section-head {
      display: flex; align-items: center; gap: 10px;
      margin-bottom: 1.2rem;
    }
    .section-icon {
      width: 40px; height: 40px; border-radius: 12px;
      background: rgba(123,45,62,0.08);
      display: flex; align-items: center; justify-content: center;
      color: var(--primary); flex-shrink: 0;
    }
    .section-head h2 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.2rem; font-weight: 800; color: var(--text);
    }
    .section-head p { font-size: 0.82rem; color: var(--muted); margin-top: 1px; }

    /* ── FAQ ── */
    .faq-list {
      display: flex; flex-direction: column; gap: 10px;
    }

    .faq-item {
      background: var(--white);
      border-radius: 16px;
      border: 1px solid rgba(123,45,62,0.07);
      box-shadow: 0 2px 12px rgba(26,16,8,0.04);
      overflow: hidden;
      transition: box-shadow 0.2s;
    }
    .faq-item:hover {
      box-shadow: 0 4px 20px rgba(123,45,62,0.08);
    }
    .faq-item.open {
      border-color: rgba(123,45,62,0.15);
    }

    .faq-question {
      display: flex; justify-content: space-between;
      align-items: center; gap: 12px;
      padding: 1rem 1.2rem;
      cursor: pointer;
      background: none; border: none; width: 100%;
      text-align: left;
      transition: background 0.15s;
    }
    .faq-question:hover { background: rgba(123,45,62,0.02); }
    .faq-question-text {
      font-size: 0.9rem; font-weight: 700;
      color: var(--text); line-height: 1.4;
    }
    .faq-item.open .faq-question-text { color: var(--primary); }
    .faq-chevron { color: var(--muted); flex-shrink: 0; transition: color 0.2s; }
    .faq-item.open .faq-chevron { color: var(--primary); }

    .faq-answer {
      padding: 0 1.2rem 1rem;
      font-size: 0.875rem; color: var(--muted);
      line-height: 1.7;
      border-top: 1px solid rgba(123,45,62,0.06);
      padding-top: 0.8rem;
    }

    /* ── CONTACT FORM ── */
    .contact-card {
      background: var(--white);
      border-radius: 22px;
      border: 1px solid rgba(123,45,62,0.07);
      border-top: 4px solid var(--primary);
      box-shadow: 0 4px 24px rgba(26,16,8,0.06);
      padding: 1.8rem;
    }

    .cfield { margin-bottom: 1.1rem; }
    .cfield label {
      display: block; font-size: 0.72rem; font-weight: 800;
      color: var(--muted); text-transform: uppercase;
      letter-spacing: 0.08em; margin-bottom: 5px;
    }
    .cfield input,
    .cfield select,
    .cfield textarea {
      width: 100%; padding: 0.8rem 0.95rem;
      background: var(--cream);
      border: 1.5px solid transparent; border-radius: 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.9rem; color: var(--text); outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .cfield input:focus,
    .cfield select:focus,
    .cfield textarea:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(123,45,62,0.08);
      background: var(--white);
    }
    .cfield input::placeholder,
    .cfield textarea::placeholder { color: #C4B8A8; }
    .cfield textarea { resize: none; height: 120px; }
    .cfield select { appearance: none; cursor: pointer; }

    .btn-send {
      width: 100%; padding: 0.9rem;
      background: var(--primary); color: #fff; border: none;
      border-radius: 50px; font-family: 'DM Sans', sans-serif;
      font-size: 0.95rem; font-weight: 700; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      box-shadow: 0 6px 20px rgba(123,45,62,0.28);
      transition: transform 0.2s, box-shadow 0.2s;
      margin-top: 0.5rem;
    }
    .btn-send:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 28px rgba(123,45,62,0.38);
    }
    .btn-send:disabled { opacity: 0.65; cursor: not-allowed; }
    .btn-send.success { background: #065F46; }

    .spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff; border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ── CONTACT INFO ── */
    .contact-info {
      display: flex; flex-direction: column; gap: 10px;
      margin-top: 1.5rem; padding-top: 1.5rem;
      border-top: 1px solid rgba(123,45,62,0.08);
    }
    .contact-info-item {
      display: flex; align-items: center; gap: 10px;
      font-size: 0.82rem; color: var(--muted);
    }
    .contact-info-item span {
      font-weight: 700; color: var(--text);
    }
  `}</style>
);

const faqs = [
  {
    q: 'How do I book an appointment?',
    a: 'Go to Doctor Availability from the sidebar. Find a doctor with an Available status and click Book Appointment. Choose your preferred date and time, add any notes, and confirm.'
  },
  {
    q: 'How do I cancel or reschedule an appointment?',
    a: 'Go to Appointments from the sidebar. Find the appointment you want to change and click Reschedule to pick a new time, or Cancel to cancel it entirely. Only upcoming appointments can be changed.'
  },
  {
    q: 'How do I update my personal information?',
    a: 'Go to Profile from the sidebar and click Edit Profile. You can update your name, phone number, email, gender, and date of birth. Your National ID cannot be changed as it is your unique identifier.'
  },
  {
    q: 'Where can I view my medical history?',
    a: 'Go to Consultation from the sidebar. Your past consultations including doctor notes, dates, and follow-up status are all listed there.'
  },
  {
    q: 'What does Pending status mean on my appointment?',
    a: 'Pending means your appointment request has been received and is waiting for confirmation from the hospital. You will be notified once it is approved.'
  },
  {
    q: 'How do I request a follow-up consultation?',
    a: 'Go to Consultation from the sidebar. Find the past consultation you want to follow up on and click the action button on the right to request a follow-up appointment.'
  },
  {
    q: 'Is my medical data safe?',
    a: 'Yes. All your data is encrypted and protected. We use industry-standard JWT authentication to ensure only you can access your personal health information.'
  },
];

export default function Support() {
  const { addTicket } = useData();
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({ subject: '', category: 'General', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      addTicket({ subject: formData.subject, type: formData.category, message: formData.message });
      setFormData({ subject: '', category: 'General', message: '' });
      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  return (
    <>
      <FontLoader />
      <div className="support-page">

        {/* HEADER */}
        <div className="support-header">
          <h1>Support</h1>
          <p>Find answers to common questions or send us a message</p>
        </div>

        <div className="support-grid">

          {/* LEFT — FAQ */}
          <div>
            <div className="section-head">
              <div className="section-icon"><HelpCircle size={18} /></div>
              <div>
                <h2>Common Questions</h2>
                <p>Click a question to see the answer</p>
              </div>
            </div>

            <div className="faq-list">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className={`faq-item ${openFaq === i ? 'open' : ''}`}
                >
                  <button
                    className="faq-question"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="faq-question-text">{faq.q}</span>
                    <span className="faq-chevron">
                      {openFaq === i
                        ? <ChevronUp size={16} />
                        : <ChevronDown size={16} />
                      }
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="faq-answer">{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Contact Form */}
          <div>
            <div className="section-head">
              <div className="section-icon"><MessageSquare size={18} /></div>
              <div>
                <h2>Still Need Help?</h2>
                <p>Send us a message and we'll get back to you</p>
              </div>
            </div>

            <div className="contact-card">
              <form onSubmit={handleSubmit}>
                <div className="cfield">
                  <label>Subject</label>
                  <input
                    type="text" required
                    placeholder="Brief summary of your issue"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
                <div className="cfield">
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option>General</option>
                    <option>Appointment</option>
                    <option>Medical Records</option>
                    <option>Technical Issue</option>
                    <option>Billing</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="cfield">
                  <label>Message</label>
                  <textarea
                    required
                    placeholder="Describe your issue in detail..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`btn-send ${success ? 'success' : ''}`}
                >
                  {submitting
                    ? <><div className="spinner" /> Sending...</>
                    : success
                      ? <><Check size={17} /> Message Sent!</>
                      : <><Send size={17} /> Send Message</>
                  }
                </button>
              </form>

              {/* Contact info */}
              <div className="contact-info">
                <div className="contact-info-item">
                  Emergency: <span>+254 711 000 999</span>
                </div>
                <div className="contact-info-item">
                  Email: <span>help@mediconnect.com</span>
                </div>
                <div className="contact-info-item">
                  Hours: <span>24/7 Emergency Services</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}