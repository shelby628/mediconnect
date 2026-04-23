import React from 'react';
import { ShieldCheck, Users, Activity, Layers } from 'lucide-react';

const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

    :root {
      --primary: #7B2D3E;
      --bg: #F7F3EC;
      --card: #FFFFFF;
      --text: #1A1008;
      --muted: #7A6A58;
    }

    .about-page {
      font-family: 'DM Sans', sans-serif;
      padding: 2.5rem;
      max-width: 1000px;
      color: var(--text);
    }

    .hero {
      text-align: center;
      max-width: 650px;
      margin: 0 auto 3rem;
    }

    .hero h1 {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 1rem;
    }

    .hero p {
      color: var(--muted);
      line-height: 1.7;
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    @media (max-width: 768px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }

    .card {
      background: var(--card);
      padding: 1.5rem;
      border-radius: 16px;
      border: 1px solid rgba(0,0,0,0.05);
    }

    .card h2 {
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }

    .list {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      font-size: 0.9rem;
      color: var(--muted);
    }

    .pill {
      background: var(--bg);
      padding: 0.6rem 0.9rem;
      border-radius: 10px;
      font-weight: 600;
      color: var(--text);
    }

    .stats {
      display: flex;
      justify-content: space-between;
      background: var(--primary);
      color: white;
      padding: 2rem;
      border-radius: 16px;
      text-align: center;
    }

    .stat h3 {
      font-size: 1.8rem;
      margin-bottom: 0.3rem;
    }

    .stat p {
      font-size: 0.8rem;
      opacity: 0.8;
    }

  `}</style>
);

export default function About() {
  return (
    <>
      <FontLoader />
      <div className="about-page">

        {/* HERO */}
        <div className="hero">
          <h1>About Mediconnect</h1>
          <p>
            Mediconnect is a healthcare management system built to streamline
            interactions between patients, doctors, and administrators.
            It simplifies appointment scheduling, patient management, and
            communication within medical environments.
          </p>
        </div>

        {/* GRID */}
        <div className="grid">

          {/* SYSTEM OVERVIEW */}
          <div className="card">
            <h2>System Overview</h2>
            <div className="list">
              <div>Built for: Hospitals & Clinics</div>
              <div>Users: Patients, Doctors, Admins</div>
              <div>Access: Web-based platform</div>
              <div>Availability: 24/7 system access</div>
            </div>
          </div>

          {/* CORE FEATURES */}
          <div className="card">
            <h2>Core Features</h2>
            <div className="list">
              <div className="pill">Appointment Scheduling</div>
              <div className="pill">Doctor Dashboard</div>
              <div className="pill">Patient Management</div>
              <div className="pill">Notifications System</div>
              <div className="pill">Admin Control Panel</div>
              <div className="pill">Secure Records</div>
            </div>
          </div>

        </div>

        {/* STATS (REAL, NOT FAKE) */}
        <div className="stats">
          <div className="stat">
            <h3>3</h3>
            <p>User Roles</p>
          </div>
          <div className="stat">
            <h3>6+</h3>
            <p>Core Features</p>
          </div>
          <div className="stat">
            <h3>1</h3>
            <p>Full System</p>
          </div>
        </div>

      </div>
    </>
  );
}