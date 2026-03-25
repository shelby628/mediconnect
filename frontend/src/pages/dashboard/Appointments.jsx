import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Calendar, Clock, X, Edit2, Check } from 'lucide-react';

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

    .apts-page {
      font-family: 'DM Sans', sans-serif;
      color: var(--text);
      padding: 2.5rem;
      max-width: 1100px;
    }

    /* ── HEADER ── */
    .apts-header { margin-bottom: 2rem; }
    .apts-header h1 {
      font-family: 'Sans-serif', serif;
      font-size: 2.4rem; font-weight: 400;
      color: var(--text); letter-spacing: -0.03em; margin-bottom: 0.3rem;
    }
    .apts-header p { color: var(--muted); font-size: 0.95rem; }

    /* ── TABS ── */
    .tabs-wrap {
      display: inline-flex; gap: 6px;
      background: var(--warm);
      border-radius: 16px; padding: 5px;
      margin-bottom: 2rem;
    }
    .tab-btn {
      padding: 0.6rem 1.8rem; border-radius: 12px;
      border: none; cursor: pointer;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.88rem; font-weight: 700;
      transition: all 0.2s;
      background: transparent; color: var(--muted);
    }
    .tab-btn.active {
      background: var(--white); color: var(--primary);
      box-shadow: 0 2px 12px rgba(123,45,62,0.12);
    }
    .tab-btn:not(.active):hover { color: var(--text); }

    /* ── GRID ── */
    .apts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(440px, 1fr));
      gap: 1.4rem;
    }
    @media (max-width: 700px) {
      .apts-grid { grid-template-columns: 1fr; }
    }

    /* ── APPOINTMENT CARD ── */
    .apt-card {
      background: var(--white);
      border-radius: 22px;
      border: 1px solid rgba(123,45,62,0.07);
      box-shadow: 0 2px 16px rgba(26,16,8,0.05);
      overflow: hidden;
      transition: transform 0.25s, box-shadow 0.25s;
    }
    .apt-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 14px 44px rgba(123,45,62,0.11);
    }

    /* colored top bar */
    .apt-bar { height: 4px; }
    .apt-bar.approved   { background: linear-gradient(to right, var(--primary), var(--primary-light)); }
    .apt-bar.pending    { background: linear-gradient(to right, #F97316, #FB923C); }
    .apt-bar.cancelled  { background: linear-gradient(to right, #EF4444, #F87171); }
    .apt-bar.completed  { background: linear-gradient(to right, #6B7280, #9CA3AF); }

    .apt-body { padding: 1.6rem; }

    /* top row */
    .apt-top {
      display: flex; justify-content: space-between;
      align-items: flex-start; margin-bottom: 1.2rem;
    }
    .apt-doc-name {
      font-family: 'Playfair Display', serif;
      font-size: 1.15rem; font-weight: 900;
      color: var(--text); margin-bottom: 3px;
    }
    .apt-dept { font-size: 0.82rem; color: var(--muted); font-weight: 500; }

    .apt-id-status { text-align: right; }
    .apt-id {
      font-size: 0.7rem; font-weight: 700; color: var(--muted);
      text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 6px;
    }
    .status-pill {
      display: inline-block;
      padding: 0.3rem 0.85rem; border-radius: 50px;
      font-size: 0.75rem; font-weight: 700;
    }
    .status-pill.approved  { background: rgba(123,45,62,0.1); color: var(--primary-dark); }
    .status-pill.pending   { background: #FFF7ED; color: #C2410C; }
    .status-pill.cancelled { background: #FEF2F2; color: #B91C1C; }
    .status-pill.completed { background: #F3F4F6; color: #374151; }

    /* meta row */
    .apt-meta {
      display: flex; gap: 1rem; flex-wrap: wrap;
      background: var(--cream); border-radius: 14px;
      padding: 1rem; margin-bottom: 1.2rem;
    }
    .meta-item {
      display: flex; align-items: center; gap: 10px; flex: 1; min-width: 120px;
    }
    .meta-icon {
      width: 36px; height: 36px; border-radius: 10px;
      background: rgba(123,45,62,0.1);
      display: flex; align-items: center; justify-content: center;
      color: var(--primary); flex-shrink: 0;
    }
    .meta-label {
      font-size: 0.68rem; font-weight: 700; color: var(--muted);
      text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 2px;
    }
    .meta-value { font-size: 0.9rem; font-weight: 700; color: var(--text); }

    /* notes */
    .apt-notes {
      font-size: 0.82rem; color: var(--muted);
      background: var(--cream); border-radius: 10px;
      padding: 0.7rem 0.9rem; margin-bottom: 1.2rem;
      border-left: 3px solid rgba(123,45,62,0.2);
      font-style: italic;
    }

    /* actions */
    .apt-actions {
      display: flex; gap: 10px;
      border-top: 1px solid rgba(123,45,62,0.07);
      padding-top: 1.2rem;
    }
    .btn-apt {
      flex: 1; padding: 0.7rem 1rem;
      border-radius: 50px; border: none;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.85rem; font-weight: 700;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 7px;
      transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
    }
    .btn-reschedule {
      background: var(--cream); color: var(--primary);
      border: 1.5px solid rgba(123,45,62,0.2);
      font-weight: 700;
    }
    .btn-reschedule:hover {
      background-color: #000;
      color: #fff;
      transform: translateY(-1px);
    }
    .btn-cancel-apt {
      background: #FEF2F2; color: #B91C1C;
      border: 1.5px solid #FECACA;
      font-weight: 700;
    }
    .btn-cancel-apt:hover {
      background: #DC2626;
      color: #fff;
      transform: translateY(-1px);
    }

    /* ── EMPTY STATE ── */
    .empty-state {
      grid-column: 1 / -1;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      text-align: center; padding: 5rem 2rem;
      background: var(--white);
      border: 2px dashed rgba(123,45,62,0.15);
      border-radius: 22px; opacity: 0.6;
    }
    .empty-state svg { color: var(--warm); margin-bottom: 1rem; }
    .empty-state h3 {
      font-family: 'Playfair Display', serif;
      font-size: 1.4rem; font-weight: 900; color: var(--text); margin-bottom: 0.4rem;
    }
    .empty-state p { font-size: 0.88rem; color: var(--muted); }

    /* ── MODAL ── */
    .modal-overlay {
      position: fixed; inset: 0; z-index: 200;
      background: rgba(26,16,8,0.45);
      backdrop-filter: blur(6px);
      display: flex; align-items: center; justify-content: center; padding: 2rem;
      animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }

    .modal {
      background: var(--white); border-radius: 28px;
      box-shadow: 0 30px 80px rgba(26,16,8,0.2);
      width: 100%; max-width: 440px; overflow: hidden;
      animation: slideUp 0.25s ease;
    }
    @keyframes slideUp { from{opacity:0;transform:translateY(20px) scale(0.97)} to{opacity:1;transform:none} }

    .modal-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      padding: 2rem 2rem 0;
    }
    .modal-header h2 {
      font-family: 'Playfair Display', serif;
      font-size: 1.5rem; font-weight: 900; color: var(--text); margin-bottom: 3px;
    }
    .modal-header p { color: var(--muted); font-size: 0.85rem; }
    .modal-close {
      background: var(--cream); border: none; border-radius: 50%;
      width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: var(--muted); flex-shrink: 0;
      transition: background 0.2s, color 0.2s;
    }
    .modal-close:hover { background: rgba(123,45,62,0.1); color: var(--primary); }

    .modal-body { padding: 1.5rem 2rem 2rem; }
    .mfield { margin-bottom: 1.2rem; }
    .mfield label {
      display: block; font-size: 0.75rem; font-weight: 700;
      color: var(--muted); text-transform: uppercase;
      letter-spacing: 0.08em; margin-bottom: 6px;
    }
    .mfield input {
      width: 100%; padding: 0.85rem 1rem;
      background: var(--cream);
      border: 1.5px solid transparent; border-radius: 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.92rem; color: var(--text); outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .mfield input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(123,45,62,0.08);
      background: var(--white);
    }
    .modal-actions { display: flex; gap: 10px; margin-top: 0.5rem; }
    .btn-modal {
      flex: 1; padding: 0.9rem; border-radius: 50px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.92rem; font-weight: 700; cursor: pointer; border: none;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn-modal-secondary {
      background: var(--warm); color: var(--muted);
      border: 1.5px solid rgba(123,45,62,0.15);
    }
    .btn-modal-primary {
      background: var(--primary); color: #fff;
      box-shadow: 0 6px 20px rgba(123,45,62,0.28);
    }
    .btn-modal-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(123,45,62,0.38); }
  `}</style>
);

const statusClass = (s) => {
  if (s === 'Approved') return 'approved';
  if (s === 'Pending') return 'pending';
  if (s === 'Cancelled') return 'cancelled';
  return 'completed';
};

export default function Appointments() {
  const { appointments, cancelAppointment, rescheduleAppointment } = useData();
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [selectedApt, setSelectedApt] = useState(null);
  const [showReschedule, setShowReschedule] = useState(false);
  const [newDateTime, setNewDateTime] = useState({ date: '', time: '' });

  const filteredApts = appointments.filter(a => a.type === activeTab);

  const handleCancel = (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      cancelAppointment(id);
    }
  };

  const handleReschedule = (e) => {
    e.preventDefault();
    rescheduleAppointment(selectedApt.id, `${newDateTime.date}T${newDateTime.time}`);
    setShowReschedule(false);
    setSelectedApt(null);
  };

  return (
    <>
      <FontLoader />
      <div className="apts-page">

        {/* HEADER */}
        <div className="apts-header">
          <h1>Appointments</h1>
          <p>Manage and track your schedule</p>
        </div>

        {/* TABS */}
        <div className="tabs-wrap">
          {['Upcoming', 'Past'].map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="apts-grid">
          {filteredApts.length > 0 ? filteredApts.map(apt => (
            <div className="apt-card" key={apt.id}>
              <div className={`apt-bar ${statusClass(apt.status)}`} />
              <div className="apt-body">

                {/* Top */}
                <div className="apt-top">
                  <div>
                    <div className="apt-doc-name">{apt.doctor_name}</div>
                    <div className="apt-dept">{apt.doctor_department}</div>
                  </div>
                  <div className="apt-id-status">
                    <div className="apt-id">ID: {apt.id}</div>
                    <span className={`status-pill ${statusClass(apt.status)}`}>{apt.status}</span>
                  </div>
                </div>

                {/* Meta */}
                <div className="apt-meta">
                  <div className="meta-item">
                    <div className="meta-icon"><Calendar size={16} /></div>
                    <div>
                      <div className="meta-label">Date</div>
                      <div className="meta-value">
                        {apt.date_time ? new Date(apt.date_time).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) : 'N/A'}
                      </div>
                    </div>
                  </div>
                  <div className="meta-item">
                    <div className="meta-icon"><Clock size={16} /></div>
                    <div>
                      <div className="meta-label">Time</div>
                      <div className="meta-value">
                        {apt.date_time ? new Date(apt.date_time).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        }) : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {apt.notes && (
                  <div className="apt-notes">"{apt.notes}"</div>
                )}

                {/* Actions */}
                {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                  <div className="apt-actions">
                    <button
                      className="btn-apt btn-reschedule"
                      onClick={() => { setSelectedApt(apt); setShowReschedule(true); }}
                    >
                      Reschedule
                    </button>
                    <button
                      className="btn-apt btn-cancel-apt"
                      onClick={() => handleCancel(apt.id)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )) : (
            <div className="empty-state">
              <Calendar size={52} />
              <h3>No {activeTab} Appointments</h3>
              <p>You don't have any appointments in this category yet.</p>
            </div>
          )}
        </div>

        {/* RESCHEDULE MODAL */}
        {showReschedule && (
          <div className="modal-overlay" onClick={() => setShowReschedule(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h2>Reschedule</h2>
                  <p>Pick a new date and time for your visit</p>
                </div>
                <button className="modal-close" onClick={() => setShowReschedule(false)}>
                  <X size={17} />
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleReschedule}>
                  <div className="mfield">
                    <label>New Date</label>
                    <input
                      type="date" required
                      onChange={e => setNewDateTime({ ...newDateTime, date: e.target.value })}
                    />
                  </div>
                  <div className="mfield">
                    <label>New Time</label>
                    <input
                      type="time" required
                      onChange={e => setNewDateTime({ ...newDateTime, time: e.target.value })}
                    />
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="btn-modal btn-modal-secondary" onClick={() => setShowReschedule(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-modal btn-modal-primary">
                      <Check size={16} /> Confirm
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}