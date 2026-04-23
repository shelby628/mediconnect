import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, ShieldCheck, ArrowRight, CheckCircle2,
  Star, UserCheck, CalendarCheck, ClipboardList, Menu, X
} from 'lucide-react';
import woman from '../assets/woman.jpg';
import man1 from '../assets/man1.jpg';
import doctor from '../assets/doctor.jpg';

/* ─── Google Fonts injection ─── */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --cream:         #F7F3EC;
      --warm:          #EDE5D8;
      --sand:          #D9C9B0;
      --primary:       #7B2D3E;
      --primary-light: #A84458;
      --primary-dark:  #4E1A26;
      --text:          #1A1008;
      --muted:         #7A6A58;
      --white:         #FFFFFF;
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: 'DM Sans', sans-serif;
      background: var(--cream);
      color: var(--text);
      overflow-x: hidden;
    }

    /* ── NAV ── */
    .nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      display: flex; align-items: center; justify-content: space-between;
      padding: 1.4rem 6%;
      background: rgba(247,243,236,0.85);
      backdrop-filter: blur(14px);
      border-bottom: 1px solid rgba(123,45,62,0.08);
      transition: box-shadow 0.3s;
    }
    .nav.scrolled { box-shadow: 0 4px 30px rgba(123,45,62,0.12); }
    .logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }
    .logo-icon {
      width: 44px; height: 44px; background: var(--primary);
      border-radius: 12px; display: flex; align-items: center;
      justify-content: center; color: #fff; font-family: 'Playfair Display', serif;
      font-size: 1.5rem; font-weight: 900; box-shadow: 0 4px 14px rgba(123,45,62,0.35);
    }
    .logo-text {
      font-family: 'Playfair Display', serif;
      font-size: 1.45rem; font-weight: 900;
      color: var(--primary-dark); letter-spacing: -0.02em;
    }
    .nav-links { display: flex; align-items: center; gap: 2.5rem; }
    .nav-links a {
      text-decoration: none; font-size: 0.9rem; font-weight: 500;
      color: var(--muted); transition: color 0.2s;
    }
    .nav-links a:hover { color: var(--primary); }
    .nav-cta {
      background: var(--primary); color: #fff !important;
      padding: 0.6rem 1.4rem; border-radius: 50px;
      font-weight: 600 !important; font-size: 0.88rem !important;
      box-shadow: 0 4px 14px rgba(123,45,62,0.3);
      transition: transform 0.2s, box-shadow 0.2s !important;
    }
    .nav-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(123,45,62,0.4) !important; }

    /* ── HAMBURGER ── */
    .hamburger {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--primary);
      padding: 4px;
      z-index: 101;
    }

    /* ── MOBILE MENU ── */
    .mobile-menu {
      position: absolute;
      top: 100%; left: 0; right: 0;
      background: rgba(247,243,236,0.98);
      backdrop-filter: blur(14px);
      border-top: 1px solid rgba(123,45,62,0.1);
      display: flex; flex-direction: column;
      padding: 1.5rem 6%;
      gap: 1.2rem;
      box-shadow: 0 20px 40px rgba(123,45,62,0.12);
      animation: slideDown 0.25s ease;
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .mobile-menu a {
      font-size: 1rem; font-weight: 500;
      color: var(--muted); text-decoration: none;
      padding: 0.3rem 0;
      border-bottom: 1px solid rgba(123,45,62,0.06);
      transition: color 0.2s;
    }
    .mobile-menu a:hover { color: var(--primary); }
    .mobile-menu .nav-cta {
      text-align: center;
      margin-top: 0.5rem;
      border-bottom: none !important;
    }

    /* ── HERO ── */
    .hero {
      min-height: 100vh;
      display: flex; align-items: center;
      padding: 8rem 6% 5rem;
      position: relative; overflow: hidden;
    }
    .hero-bg {
      position: absolute; inset: 0; z-index: 0;
      background: radial-gradient(ellipse 80% 60% at 70% 40%, rgba(168,68,88,0.1) 0%, transparent 70%),
                  radial-gradient(ellipse 50% 50% at 20% 80%, rgba(123,45,62,0.06) 0%, transparent 60%);
    }
    .hero-content { position: relative; z-index: 1; max-width: 600px; }
    .hero-badge {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(123,45,62,0.1); border: 1px solid rgba(123,45,62,0.2);
      color: var(--primary); padding: 0.4rem 1rem; border-radius: 50px;
      font-size: 0.8rem; font-weight: 600; letter-spacing: 0.05em;
      text-transform: uppercase; margin-bottom: 1.5rem;
    }
    .hero-badge span {
      width: 6px; height: 6px; background: var(--primary);
      border-radius: 50%; display: inline-block; animation: pulse 2s infinite;
    }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
    .hero h1 {
      font-family: 'Inter', sans-serif;
      font-size: clamp(2.8rem, 5.5vw, 4.4rem);
      font-weight: 700; line-height: 1.1; letter-spacing: -0.03em;
      color: var(--text); margin-bottom: 1.5rem;
    }
    .hero h1 em { color: var(--primary); }
    .hero p {
      font-size: 1.1rem; color: var(--muted); line-height: 1.75;
      max-width: 480px; margin-bottom: 2.5rem; font-weight: 400;
    }
    .hero-actions { display: flex; align-items: center; gap: 1.2rem; flex-wrap: wrap; }
    .btn-primary {
      display: inline-flex; align-items: center; gap: 10px;
      background: var(--primary); color: #fff;
      padding: 0.95rem 2rem; border-radius: 50px;
      font-weight: 600; font-size: 1rem; text-decoration: none;
      box-shadow: 0 8px 30px rgba(123,45,62,0.35);
      transition: transform 0.25s, box-shadow 0.25s;
    }
    .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 14px 40px rgba(123,45,62,0.45); }
    .btn-secondary {
      display: inline-flex; align-items: center; gap: 8px;
      color: var(--primary); font-weight: 600; font-size: 1rem; text-decoration: none;
      padding: 0.95rem 1.5rem; border-radius: 50px;
      border: 1.5px solid rgba(123,45,62,0.3);
      transition: background 0.2s, border-color 0.2s;
    }
    .btn-secondary:hover { background: rgba(123,45,62,0.06); border-color: var(--primary); }
    .hero-stats { margin-top: 3.5rem; display: flex; gap: 2.5rem; flex-wrap: wrap; }
    .stat h3 {
      font-family: 'Inter', sans-serif;
      font-size: 2rem; font-weight: 700; color: var(--primary-dark);
    }
    .stat p { font-size: 0.85rem; color: var(--muted); font-weight: 500; margin-top: 2px; }

    /* ── HERO VISUAL CARDS ── */
    .hero-visual {
      position: absolute; right: 6%; top: 50%; transform: translateY(-50%);
      z-index: 1; display: flex; flex-direction: column; gap: 16px;
    }
    .visual-card {
      background: var(--white); border-radius: 20px;
      padding: 1.2rem 1.5rem; box-shadow: 0 8px 40px rgba(26,16,8,0.12);
      display: flex; align-items: center; gap: 14px;
      min-width: 240px; animation: float 4s ease-in-out infinite;
    }
    .visual-card:nth-child(2) { animation-delay: 1.5s; margin-left: 2rem; }
    .visual-card:nth-child(3) { animation-delay: 0.8s; }
    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    .card-icon {
      width: 44px; height: 44px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .card-icon.green { background: #D1FAE5; color: #065F46; }
    .card-icon.rose  { background: #FFE4E6; color: var(--primary); }
    .card-icon.blue  { background: #DBEAFE; color: #1D4ED8; }
    .card-label { font-size: 0.72rem; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; }
    .card-value { font-size: 1rem; font-weight: 700; color: var(--text); margin-top: 1px; }

    /* ── FEATURES ── */
    .features { padding: 7rem 6%; background: var(--warm); }
    .section-label {
      text-align: center; font-size: 0.8rem; font-weight: 700;
      color: var(--primary); letter-spacing: 0.12em; text-transform: uppercase;
      margin-bottom: 1rem;
    }
    .section-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(2rem, 4vw, 3rem); font-weight: 900;
      text-align: center; color: var(--text);
      letter-spacing: -0.02em; line-height: 1.15; margin-bottom: 1rem;
    }
    .section-sub {
      text-align: center; color: var(--muted); font-size: 1rem;
      max-width: 520px; margin: 0 auto 4rem; line-height: 1.7;
    }
    .features-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem; max-width: 1100px; margin: 0 auto;
    }
    .feature-card {
      background: var(--white); border-radius: 24px; padding: 2rem;
      box-shadow: 0 2px 20px rgba(26,16,8,0.06);
      transition: transform 0.3s, box-shadow 0.3s;
      border: 1px solid rgba(123,45,62,0.06);
    }
    .feature-card:hover { transform: translateY(-6px); box-shadow: 0 16px 50px rgba(123,45,62,0.12); }
    .feature-icon-wrap {
      width: 56px; height: 56px; background: rgba(123,45,62,0.1);
      border-radius: 16px; display: flex; align-items: center;
      justify-content: center; color: var(--primary); margin-bottom: 1.4rem;
    }
    .feature-card h3 {
      font-family: 'Playfair Display', serif;
      font-size: 1.2rem; font-weight: 700; margin-bottom: 0.7rem; color: var(--text);
    }
    .feature-card p { color: var(--muted); font-size: 0.9rem; line-height: 1.7; }

    /* ── HOW IT WORKS ── */
    .how { padding: 7rem 6%; }
    .steps {
      display: flex; gap: 0; max-width: 900px; margin: 0 auto;
      position: relative;
    }
    .steps::before {
      content: ''; position: absolute; top: 28px; left: 14%; right: 14%;
      height: 2px;
      background: linear-gradient(to right, var(--primary), var(--sand));
      z-index: 0;
    }
    .step { flex: 1; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 1rem; position: relative; z-index: 1; }
    .step-num {
      width: 56px; height: 56px; border-radius: 50%;
      background: var(--primary); color: #fff;
      font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 900;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 6px 20px rgba(123,45,62,0.3); margin-bottom: 1.2rem;
    }
    .step h4 { font-weight: 700; font-size: 1rem; margin-bottom: 0.5rem; color: var(--text); }
    .step p { font-size: 0.85rem; color: var(--muted); line-height: 1.6; }

    /* ── TESTIMONIALS ── */
    .testimonials { padding: 7rem 6%; background: var(--primary-dark); }
    .testimonials .section-title { color: var(--cream); }
    .testimonials .section-sub { color: rgba(247,243,236,0.6); }
    .testi-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem; max-width: 960px; margin: 0 auto;
    }
    .testi-card {
      background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
      border-radius: 20px; padding: 2rem;
    }
    .stars { display: flex; gap: 4px; margin-bottom: 1rem; }
    .stars svg { color: #F59E0B; }
    .testi-card blockquote {
      font-size: 0.95rem; color: rgba(247,243,236,0.85);
      line-height: 1.75; margin-bottom: 1.5rem; font-style: italic;
    }
    .testi-author { display: flex; align-items: center; gap: 12px; }
    .avatar {
      width: 44px; height: 44px; border-radius: 50%;
      object-fit: cover;
      background: var(--primary-light);
      display: flex; align-items: center;
      justify-content: center; font-weight: 700;
      color: #fff; font-size: 0.9rem;
      flex-shrink: 0;
    }
    .author-name { font-weight: 600; color: var(--cream); font-size: 0.9rem; }
    .author-role { font-size: 0.78rem; color: rgba(247,243,236,0.5); margin-top: 1px; }

    /* ── CTA BANNER ── */
    .cta-banner {
      margin: 5rem 6%; border-radius: 32px;
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      padding: 4rem 5%; display: flex; align-items: center; justify-content: space-between;
      gap: 2rem; flex-wrap: wrap;
      box-shadow: 0 20px 60px rgba(123,45,62,0.3);
      position: relative; overflow: hidden;
    }
    .cta-banner::before {
      content: ''; position: absolute; right: -80px; top: -80px;
      width: 300px; height: 300px; border-radius: 50%;
      background: rgba(255,255,255,0.05);
    }
    .cta-banner h2 {
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 900;
      color: #fff; margin-bottom: 0.5rem;
    }
    .cta-banner p { color: rgba(255,255,255,0.7); font-size: 1rem; }
    .btn-light {
      display: inline-flex; align-items: center; gap: 10px;
      background: #fff; color: var(--primary);
      padding: 1rem 2.2rem; border-radius: 50px;
      font-weight: 700; font-size: 1rem; text-decoration: none;
      box-shadow: 0 6px 24px rgba(0,0,0,0.15);
      transition: transform 0.25s, box-shadow 0.25s; white-space: nowrap;
    }
    .btn-light:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(0,0,0,0.2); }

    /* ── FOOTER ── */
    .footer {
      padding: 3rem 6%; border-top: 1px solid rgba(123,45,62,0.1);
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: 1rem;
    }
    .footer p { font-size: 0.85rem; color: var(--muted); }
    .footer-links { display: flex; gap: 1.5rem; }
    .footer-links a {
      font-size: 0.85rem; color: var(--muted);
      text-decoration: none; transition: color 0.2s;
    }
    .footer-links a:hover { color: var(--primary); }

    /* ── RESPONSIVE ── */
    @media (max-width: 900px) {
      .hero-visual { display: none; }
      .hero-content { max-width: 100%; }
      .steps::before { display: none; }
      .steps { flex-direction: column; gap: 2rem; }
    }
    @media (max-width: 600px) {
      .nav-links { display: none; }
      .hamburger { display: flex; }
    }
  `}</style>
);

/* ─── Data ─── */
// TODO: Replace with real API data when backend is ready
const STATS = [
  { value: '2k+', label: 'Active Patients' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '7+',  label: 'Departments' },
];

const FEATURES = [
  { icon: <UserCheck size={26} />,    title: 'Doctor Availability',   desc: 'Real-time status of doctors across all hospital departments — no more guessing or waiting in queues.' },
  { icon: <CalendarCheck size={26} />, title: 'Smart Booking',         desc: 'Secure your appointment instantly with our zero-friction booking system.' },
  { icon: <ClipboardList size={26} />, title: 'Consultation History',  desc: 'Keep a private, digital record of every visit, prescription, and medical note.' },
  { icon: <ShieldCheck size={26} />,   title: 'Secure Medical Records', desc: 'Your data is encrypted and protected with industry-leading, HIPAA-aligned security standards.' },
];

const STEPS = [
  { n: '1', title: 'Create Account',    desc: 'Sign up with your phone number or email in under a minute.' },
  { n: '2', title: 'Find a Doctor',     desc: 'Browse available doctors and check real-time availability.' },
  { n: '3', title: 'Book Appointment',  desc: 'Choose a time slot and confirm your booking instantly.' },
  { n: '4', title: 'Get Care',          desc: 'Attend your appointment and access records digitally.' },
];

const TESTIMONIALS = [
  { q: 'Booking an appointment used to take hours on the phone. MediConnect cut it down to 30 seconds. Genuinely life-changing.', name: 'Amina K.',   role: 'Patient · Nairobi',   photo: woman  },
  { q: 'Having all my consultation history in one secure place is incredible. I no longer carry folders of paper records to every visit.', name: 'Brian O.',   role: 'Patient · Mombasa',   photo: man1   },
  { q: 'The real-time doctor availability feature is exactly what hospitals have been missing. Clean, fast, and incredibly intuitive.',  name: 'Dr. Sara M.', role: 'Physician · Kisumu',  photo: doctor },
];

/* ─── Sub-components ─── */
const HeroVisual = () => (
  <div className="hero-visual">
    <div className="visual-card">
      <div className="card-icon green"><CheckCircle2 size={22} /></div>
      <div><div className="card-label">Appointment</div><div className="card-value">Confirmed ✓</div></div>
    </div>
    <div className="visual-card">
      <div className="card-icon rose"><Calendar size={22} /></div>
      <div><div className="card-label">Next visit</div><div className="card-value">Today, 2:30 PM</div></div>
    </div>
    <div className="visual-card">
      <div className="card-icon blue"><ShieldCheck size={22} /></div>
      <div><div className="card-label">Records</div><div className="card-value">Encrypted & Safe</div></div>
    </div>
  </div>
);

const TestimonialAvatar = ({ photo, name }) => {
  const [imgFailed, setImgFailed] = useState(false);

  if (imgFailed) {
    return <div className="avatar">{name.charAt(0)}</div>;
  }

  return (
    <img
      src={photo}
      alt={name}
      className="avatar"
      onError={() => setImgFailed(true)}
    />
  );
};

/* ─── Main Page ─── */
export default function LandingPage() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <FontLoader />

      {/* ── NAV ── */}
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <a href="#" className="logo">
          <div className="logo-icon">M</div>
          <span className="logo-text">MediConnect</span>
        </a>

        {/* Desktop links */}
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#reviews">Reviews</a>
          <Link to="/login">Log in</Link>
          <Link to="/signup" className="nav-cta">Get Started</Link>
        </div>

        {/* Hamburger — mobile only */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="mobile-menu">
            <a href="#features" onClick={closeMenu}>Features</a>
            <a href="#how"      onClick={closeMenu}>How it works</a>
            <a href="#reviews"  onClick={closeMenu}>Reviews</a>
            <Link to="/login"   onClick={closeMenu}>Log in</Link>
            <Link to="/signup"  onClick={closeMenu} className="nav-cta">Get Started</Link>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="hero-badge"><span />Smart Hospital Management</div>
          <h1>Modern Care for<br />Modern Patients</h1>
          <p>MediConnect streamlines your entire healthcare journey — from booking appointments to accessing medical records — in one secure platform.</p>
          <div className="hero-actions">
            <Link to="/signup" className="btn-primary">Get Started Free <ArrowRight size={18} /></Link>
            <a href="#how" className="btn-secondary">See how it works</a>
          </div>
          <div className="hero-stats">
            {STATS.map((s, i) => (
              <div className="stat" key={i}>
                <h3>{s.value}</h3>
                <p>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <HeroVisual />
      </section>

      {/* ── FEATURES ── */}
      <section className="features" id="features">
        <div className="section-label">Why MediConnect</div>
        <h2 className="section-title">Everything you need,<br />in one place</h2>
        <p className="section-sub">From real-time doctor availability to encrypted medical records, we've built every feature with patients in mind.</p>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon-wrap">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how" id="how">
        <div className="section-label">Simple Process</div>
        <h2 className="section-title">Up and running in minutes</h2>
        <p className="section-sub">Getting started with MediConnect takes less than 3 minutes.</p>
        <div className="steps">
          {STEPS.map((s, i) => (
            <div className="step" key={i}>
              <div className="step-num">{s.n}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials" id="reviews">
        <div className="section-label" style={{ color: 'rgba(247,243,236,0.5)' }}>Patient Stories</div>
        <h2 className="section-title">Loved by hundreds</h2>
        <p className="section-sub">Real experiences from real users across our network.</p>
        <div className="testi-grid">
          {TESTIMONIALS.map((t, i) => (
            <div className="testi-card" key={i}>
              <div className="stars">
                {[...Array(5)].map((_, j) => <Star key={j} size={15} fill="currentColor" />)}
              </div>
              <blockquote>"{t.q}"</blockquote>
              <div className="testi-author">
                <TestimonialAvatar photo={t.photo} name={t.name} />
                <div>
                  <div className="author-name">{t.name}</div>
                  <div className="author-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <div className="cta-banner">
        <div>
          <h2>Ready to transform your healthcare?</h2>
          <p>Join 500+ patients already using MediConnect.</p>
        </div>
        <Link to="/signup" className="btn-light">Start for Free <ArrowRight size={18} /></Link>
      </div>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <p>© 2026 MediConnect · Elegant Healthcare Solutions</p>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Support</a>
        </div>
      </footer>
    </>
  );
}
