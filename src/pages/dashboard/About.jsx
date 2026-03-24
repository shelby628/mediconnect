import React from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck, HeartPulse, Building2 } from 'lucide-react';

const FontLoader = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

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

    .about-page {
      font-family: 'DM Sans', sans-serif;
      color: var(--text);
      padding: 2.5rem;
      max-width: 1100px;
    }

    /* ── HERO ── */
    .about-hero {
      text-align: center;
      max-width: 680px;
      margin: 0 auto 3.5rem;
    }
    .about-hero-icon {
      width: 72px; height: 72px;
      background: rgba(123,45,62,0.1);
      border-radius: 22px;
      display: flex; align-items: center; justify-content: center;
      color: var(--primary); margin: 0 auto 1.5rem;
      border: 1px solid rgba(123,45,62,0.15);
    }
    .about-hero h1 {
      font-family: 'calibri', serif;
      font-size: clamp(2.2rem, 4vw, 3.2rem);
      font-weight: 900; letter-spacing: -0.03em;
      color: var(--text); margin-bottom: 1rem; line-height: 1.1;
    }
    .about-hero h1 span { color: calibri; font-style: italic; }
    .about-hero p {
      font-size: 1rem; color: var(--muted);
      line-height: 1.8; max-width: 560px; margin: 0 auto;
    }

    /* ── TWO COL ── */
    .about-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }
    @media (max-width: 900px) { .about-grid { grid-template-columns: 1fr; } }

    /* ── SECTION HEADING ── */
    .section-head {
      display: flex; align-items: center; gap: 10px;
      margin-bottom: 1.2rem;
    }
    .section-head svg { color: calibri; flex-shrink: 0; }
    .section-head h2 {
      font-family: 'calibri', serif;
      font-size: 1.4rem; font-weight: 900; color: var(--text);
    }

    /* ── CONTACT CARD ── */
    .contact-card {
      background: var(--white);
      border-radius: 22px;
      border: 1px solid rgba(123,45,62,0.07);
      box-shadow: 0 4px 24px rgba(26,16,8,0.06);
      padding: 1.8rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    @media (max-width: 600px) { .contact-card { grid-template-columns: 1fr; } }

    .contact-item { display: flex; gap: 12px; align-items: flex-start; }
    .contact-icon {
      width: 42px; height: 42px; border-radius: 12px;
      background: rgba(123,45,62,0.08);
      display: flex; align-items: center; justify-content: center;
      color: calibri; flex-shrink: 0;
    }
    .contact-label {
      font-size: 0.68rem; font-weight: 800; color: var(--muted);
      text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px;
    }
    .contact-value {
      font-size: 0.88rem; font-weight: 600; color: var(--text); line-height: 1.5;
    }

    /* ── DEPARTMENTS ── */
    .depts-wrap {
      background: var(--white);
      border-radius: 22px;
      border: 1px solid rgba(123,45,62,0.07);
      box-shadow: 0 4px 24px rgba(26,16,8,0.06);
      padding: 1.8rem;
    }
    .depts-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .dept-pill {
      display: flex; align-items: center; gap: 10px;
      padding: 0.75rem 1rem;
      background: var(--cream);
      border: 1.5px solid transparent;
      border-radius: 14px;
      transition: border-color 0.2s, background 0.2s, transform 0.2s;
      cursor: default;
    }
    .dept-pill:hover {
      border-color: rgba(123,45,62,0.2);
      background: rgba(123,45,62,0.05);
      transform: translateX(3px);
    }
    .dept-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--primary); flex-shrink: 0;
      transition: transform 0.2s;
    }
    .dept-pill:hover .dept-dot { transform: scale(1.5); }
    .dept-name { font-size: 0.85rem; font-weight: 700; color: var(--text); }

    /* ── STATS BANNER ── */
    .stats-banner {
      background: var(--primary-dark);
      border-radius: 22px;
      padding: 3rem 2rem;
      position: relative; overflow: hidden;
    }
    .stats-banner::before {
      content: ''; position: absolute;
      top: -80px; right: -80px;
      width: 280px; height: 280px; border-radius: 50%;
      background: rgba(255,255,255,0.04);
    }
    .stats-banner::after {
      content: ''; position: absolute;
      bottom: -60px; left: -60px;
      width: 200px; height: 200px; border-radius: 50%;
      background: rgba(168,68,88,0.15);
    }

    .stats-inner {
      position: relative; z-index: 1;
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 2rem; text-align: center;
      margin-bottom: 2.5rem;
    }
    @media (max-width: 600px) { .stats-inner { grid-template-columns: 1fr; gap: 1.5rem; } }

    .stat-num {
      font-family: 'Playfair Display', serif;
      font-size: 2.8rem; font-weight: 900;
      line-height: 1; margin-bottom: 0.5rem;
    }
    .stat-num.s1 { color: var(--primary-light); }
    .stat-num.s2 { color: #F9A8D4; }
    .stat-num.s3 { color: #FCD34D; }

    .stat-divider {
      width: 1px; background: rgba(255,255,255,0.08);
    }
    @media (max-width: 600px) { .stat-divider { display: none; } }

    .stat-lbl {
      font-size: 0.72rem; font-weight: 800;
      color: rgba(247,243,236,0.45);
      text-transform: uppercase; letter-spacing: 0.1em;
    }

    .cert-row {
      position: relative; z-index: 1;
      display: flex; align-items: center; justify-content: center;
      gap: 10px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 50px;
      padding: 0.75rem 1.5rem;
      width: fit-content; margin: 0 auto;
      color: rgba(247,243,236,0.8);
      font-size: 0.85rem; font-weight: 700;
    }
    .cert-row svg { color: var(--primary-light); }
  `}</style>
);

const ContactItem = ({ icon, label, value }) => (
    <div className="contact-item">
        <div className="contact-icon">{React.cloneElement(icon, { size: 18 })}</div>
        <div>
            <div className="contact-label">{label}</div>
            <div className="contact-value">{value}</div>
        </div>
    </div>
);

const departments = [
    'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics',
    'General Medicine', 'Dermatology', 'Oncology', 'Radiology'
];

export default function About() {
    return (
        <>
            <FontLoader />
            <div className="about-page">

                {/* HERO */}
                <div className="about-hero">
                    <div className="about-hero-icon">
                        <HeartPulse size={32} />
                    </div>
                    <h1>About <span>MediConnect</span></h1>
                    <p>
                        MediConnect is a hospital management system designed to bridge
                        the gap between patients and quality healthcare. Our mission is to eliminate
                        wait times and empower patients with 24/7 access to medical services.
                    </p>
                </div>

                {/* TWO COL */}
                <div className="about-grid">

                    {/* Hospital Info */}
                    <div>
                        <div className="section-head">

                            <h2>Contact Us</h2>
                        </div>
                        <div className="contact-card">
                            <ContactItem icon={<MapPin />} label="Address" value="123 Health Avenue, Medical District, Nairobi, Kenya" />
                            <ContactItem icon={<Phone />} label="Emergency Phone" value="+254 711 000 999" />
                            <ContactItem icon={<Mail />} label="Email Support" value="help@mediconnect.com" />
                            <ContactItem icon={<Clock />} label="Operating Hours" value="24/7 Emergency Services" />
                        </div>
                    </div>

                    {/* Departments */}
                    <div>
                        <div className="section-head">
                            <HeartPulse size={20} />
                            <h2>Our Departments</h2>
                        </div>
                        <div className="depts-wrap">
                            <div className="depts-grid">
                                {departments.map(dept => (
                                    <div className="dept-pill" key={dept}>
                                        <div className="dept-dot" />
                                        <span className="dept-name">{dept}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

                {/* STATS BANNER */}
                <div className="stats-banner">
                    <div className="stats-inner">
                        <div>
                            <div className="stat-num s1">10+</div>
                            <div className="stat-lbl">Specialized Doctors</div>
                        </div>
                        <div>
                            <div className="stat-num s2">50k+</div>
                            <div className="stat-lbl">Happy Patients</div>
                        </div>
                        <div>
                            <div className="stat-num s3">4+</div>
                            <div className="stat-lbl">Medical Centers</div>
                        </div>
                    </div>

                </div>

            </div>
        </>
    );
}