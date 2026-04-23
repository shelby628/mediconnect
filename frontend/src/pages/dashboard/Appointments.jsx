import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Calendar, Clock, X, Check, CheckCircle } from 'lucide-react';

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

    .apts-header { margin-bottom: 2rem; }
    .apts-header h1 {
      font-family: 'Sans-serif', serif;
      font-size: 2.4rem; font-weight: 400;
      color: var(--text); letter-spacing: -0.03em; margin-bottom: 0.3rem;
    }
    .apts-header p { color: var(--muted); font-size: 0.95rem; }

    .approved-banner {
      display: flex; align-items: center; gap: 16px;
      background: linear-gradient(135deg, #052e16 0%, #14532d 100%);
      border-radius: 18px; padding: 1.1rem 1.6rem;
      margin-bottom: 1.8rem;
      box-shadow: 0 4px 24px rgba(5,46,22,0.18);
      cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
      border: 1px solid rgba(255,255,255,0.08);
    }
    .approved-banner:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(5,46,22,0.28); }
    .approved-banner-icon {
      width: 44px; height: 44px; background: rgba(255,255,255,0.12);
      border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .approved-banner-text { flex: 1; }
    .approved-banner-count { font-size: 1.35rem; font-weight: 900; color: #fff; line-height: 1.1; margin-bottom: 2px; }
    .approved-banner-sub { font-size: 0.82rem; color: rgba(255,255,255,0.65); font-weight: 500; }
    .approved-banner-action {
      font-size: 0.78rem; font-weight: 700; color: rgba(255,255,255,0.55);
      background: rgba(255,255,255,0.1); border-radius: 50px; padding: 5px 14px; white-space: nowrap;
    }

    .tabs-wrap {
      display: inline-flex; gap: 6px; background: var(--warm);
      border-radius: 16px; padding: 5px; margin-bottom: 2rem;
    }
    .tab-btn {
      padding: 0.6rem 1.8rem; border-radius: 12px; border: none; cursor: pointer;
      font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 700;
      transition: all 0.2s; background: transparent; color: var(--muted);
    }
    .tab-btn.active { background: var(--white); color: var(--primary); box-shadow: 0 2px 12px rgba(123,45,62,0.12); }
    .tab-btn:not(.active):hover { color: var(--text); }

    .apts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(440px, 1fr));
      gap: 1.4rem;
    }
    @media (max-width: 700px) { .apts-grid { grid-template-columns: 1fr; } }

    .apt-card {
      background: var(--white); border-radius: 22px;
      border: 1px solid rgba(123,45,62,0.07);
      box-shadow: 0 2px 16px rgba(26,16,8,0.05);
      overflow: hidden; transition: transform 0.25s, box-shadow 0.25s;
    }
    .apt-card:hover { transform: translateY(-4px); box-shadow: 0 14px 44px rgba(123,45,62,0.11); }
    .apt-card.apt-card--approved {
      border: 1.5px solid #bbf7d0;
      box-shadow: 0 2px 16px rgba(5,46,22,0.08);
    }
    .apt-card.apt-card--approved:hover { transform: translateY(-4px); box-shadow: 0 14px 44px rgba(5,46,22,0.15); }

    .apt-bar { height: 4px; }
    .apt-bar.approved  { background: linear-gradient(to right, #16a34a, #4ade80); }
    .apt-bar.pending   { background: linear-gradient(to right, #F97316, #FB923C); }
    .apt-bar.cancelled { background: linear-gradient(to right, #EF4444, #F87171); }
    .apt-bar.completed { background: linear-gradient(to right, #6B7280, #9CA3AF); }

    .apt-body { padding: 1.6rem; }
    .apt-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.2rem; }
    .apt-doc-name { font-family: 'Playfair Display', serif; font-size: 1.15rem; font-weight: 900; color: var(--text); margin-bottom: 3px; }
    .apt-dept { font-size: 0.82rem; color: var(--muted); font-weight: 500; }
    .apt-id-status { text-align: right; }
    .apt-id { font-size: 0.7rem; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 6px; }

    .status-pill { display: inline-flex; align-items: center; gap: 6px; padding: 0.3rem 0.85rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700; }
    .status-pill.approved  { background: #dcfce7; color: #14532d; }
    .status-pill.pending   { background: #FFF7ED; color: #C2410C; }
    .status-pill.cancelled { background: #FEF2F2; color: #B91C1C; }
    .status-pill.completed { background: #F3F4F6; color: #374151; }

    .pulse-dot {
      width: 8px; height: 8px; border-radius: 50%; background: #16a34a;
      box-shadow: 0 0 0 0 rgba(22,163,74,0.5);
      animation: pulse-ring 1.8s ease-out infinite; flex-shrink: 0;
    }
    @keyframes pulse-ring {
      0%   { box-shadow: 0 0 0 0 rgba(22,163,74,0.55); }
      60%  { box-shadow: 0 0 0 7px rgba(22,163,74,0); }
      100% { box-shadow: 0 0 0 0 rgba(22,163,74,0); }
    }

    .apt-meta { display: flex; gap: 1rem; flex-wrap: wrap; background: var(--cream); border-radius: 14px; padding: 1rem; margin-bottom: 1.2rem; }
    .apt-meta.apt-meta--approved { background: #f0fdf4; }
    .meta-item { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 120px; }
    .meta-icon { width: 36px; height: 36px; border-radius: 10px; background: rgba(123,45,62,0.1); display: flex; align-items: center; justify-content: center; color: var(--primary); flex-shrink: 0; }
    .meta-icon.meta-icon--approved { background: #dcfce7; color: #16a34a; }
    .meta-label { font-size: 0.68rem; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 2px; }
    .meta-value { font-size: 0.9rem; font-weight: 700; color: var(--text); }

    .apt-notes { font-size: 0.82rem; color: var(--muted); background: var(--cream); border-radius: 10px; padding: 0.7rem 0.9rem; margin-bottom: 1.2rem; border-left: 3px solid rgba(123,45,62,0.2); font-style: italic; }

    .apt-confirmed-strip {
      display: flex; align-items: center; gap: 8px;
      background: #f0fdf4; border: 1px solid #bbf7d0;
      border-radius: 10px; padding: 0.6rem 0.9rem; margin-bottom: 1.2rem;
      font-size: 0.82rem; font-weight: 700; color: #14532d;
    }

    .apt-actions { display: flex; gap: 10px; border-top: 1px solid rgba(123,45,62,0.07); padding-top: 1.2rem; }
    .btn-apt {
      flex: 1; padding: 0.7rem 1rem; border-radius: 50px; border: none;
      font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 700; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 7px;
      transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
    }
    .btn-reschedule { background: var(--cream); color: var(--primary); border: 1.5px solid rgba(123,45,62,0.2); }
    .btn-reschedule:hover { background-color: #000; color: #fff; transform: translateY(-1px); }
    .btn-cancel-apt { background: #FEF2F2; color: #B91C1C; border: 1.5px solid #FECACA; }
    .btn-cancel-apt:hover { background: #DC2626; color: #fff; transform: translateY(-1px); }

    .empty-state {
      grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center;
      text-align: center; padding: 5rem 2rem; background: var(--white);
      border: 2px dashed rgba(123,45,62,0.15); border-radius: 22px; opacity: 0.6;
    }
    .empty-state svg { color: var(--warm); margin-bottom: 1rem; }
    .empty-state h3 { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 900; color: var(--text); margin-bottom: 0.4rem; }
    .empty-state p { font-size: 0.88rem; color: var(--muted); }

    .modal-overlay {
      position: fixed; inset: 0; z-index: 200; background: rgba(26,16,8,0.45);
      backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center;
      padding: 2rem; animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }

    .modal {
      background: var(--white); border-radius: 28px; box-shadow: 0 30px 80px rgba(26,16,8,0.2);
      width: 100%; max-width: 440px; overflow: hidden; animation: slideUp 0.25s ease;
    }
    @keyframes slideUp { from{opacity:0;transform:translateY(20px) scale(0.97)} to{opacity:1;transform:none} }

    .modal-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 2rem 2rem 0; }
    .modal-header h2 { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 900; color: var(--text); margin-bottom: 3px; }
    .modal-header p { color: var(--muted); font-size: 0.85rem; }
    .modal-close {
      background: var(--cream); border: none; border-radius: 50%;
      width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: var(--muted); flex-shrink: 0; transition: background 0.2s, color 0.2s;
    }
    .modal-close:hover { background: rgba(123,45,62,0.1); color: var(--primary); }

    .modal-body { padding: 1.5rem 2rem 2rem; }
    .mfield { margin-bottom: 1.2rem; }
    .mfield label { display: block; font-size: 0.75rem; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
    .mfield input {
      width: 100%; padding: 0.85rem 1rem; background: var(--cream);
      border: 1.5px solid transparent; border-radius: 12px;
      font-family: 'DM Sans', sans-serif; font-size: 0.92rem; color: var(--text); outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .mfield input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(123,45,62,0.08); background: var(--white); }

    .modal-actions { display: flex; gap: 10px; margin-top: 0.5rem; }
    .btn-modal {
      flex: 1; padding: 0.9rem; border-radius: 50px; font-family: 'DM Sans', sans-serif;
      font-size: 0.92rem; font-weight: 700; cursor: pointer; border: none;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn-modal-secondary { background: var(--warm); color: var(--muted); border: 1.5px solid rgba(123,45,62,0.15); }
    .btn-modal-primary { background: var(--primary); color: #fff; box-shadow: 0 6px 20px rgba(123,45,62,0.28); }
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
  const [filterApproved, setFilterApproved] = useState(false);

  // ✅ Computed fresh each render so they're always accurate
  const today = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toTimeString().slice(0, 5);

  const filteredApts = appointments
    .filter(a => {
      const isUpcoming = a.status === 'Pending' || a.status === 'Approved';
      return activeTab === 'Upcoming' ? isUpcoming : !isUpcoming;
    })
    .filter(a => filterApproved ? a.status === 'Approved' : true)
    .sort((a, b) => {
      if (a.status === 'Approved' && b.status !== 'Approved') return -1;
      if (b.status === 'Approved' && a.status !== 'Approved') return 1;
      return 0;
    });

  const approvedCount = appointments.filter(a => a.status === 'Approved').length;

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

        <div className="apts-header">
          <h1>Appointments</h1>
          <p>Manage and track your schedule</p>
        </div>

        {approvedCount > 0 && activeTab === 'Upcoming' && (
          <div
            className="approved-banner"
            onClick={() => setFilterApproved(f => !f)}
            title={filterApproved ? 'Show all appointments' : 'Show only approved'}
          >
            <div className="approved-banner-icon">
              <CheckCircle size={22} color="#4ade80" />
            </div>
            <div className="approved-banner-text">
              <div className="approved-banner-count">
                {approvedCount} Appointment{approvedCount > 1 ? 's' : ''} Approved
              </div>
              <div className="approved-banner-sub">
                Your doctor has confirmed {approvedCount > 1 ? 'these visits' : 'this visit'} — please arrive on time
              </div>
            </div>
            <div className="approved-banner-action">
              {filterApproved ? 'Show all' : 'View only'}
            </div>
          </div>
        )}

        <div className="tabs-wrap">
          {['Upcoming', 'Past'].map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab); setFilterApproved(false); }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="apts-grid">
          {filteredApts.length > 0 ? filteredApts.map(apt => {
            const isApproved = apt.status === 'Approved';
            return (
              <div className={`apt-card${isApproved ? ' apt-card--approved' : ''}`} key={apt.id}>
                <div className={`apt-bar ${statusClass(apt.status)}`} />
                <div className="apt-body">
                  <div className="apt-top">
                    <div>
                      <div className="apt-doc-name">{apt.doctor_name}</div>
                      <div className="apt-dept">{apt.doctor_department}</div>
                    </div>
                    <div className="apt-id-status">
                      <div className="apt-id">ID: {apt.id}</div>
                      <span className={`status-pill ${statusClass(apt.status)}`}>
                        {isApproved && <span className="pulse-dot" />}
                        {apt.status}
                      </span>
                    </div>
                  </div>

                  {isApproved && (
                    <div className="apt-confirmed-strip">
                      <CheckCircle size={15} color="#16a34a" />
                      Your appointment has been confirmed by the doctor
                    </div>
                  )}

                  <div className={`apt-meta${isApproved ? ' apt-meta--approved' : ''}`}>
                    <div className="meta-item">
                      <div className={`meta-icon${isApproved ? ' meta-icon--approved' : ''}`}>
                        <Calendar size={16} />
                      </div>
                      <div>
                        <div className="meta-label">Date</div>
                        <div className="meta-value">
                          {apt.date_time ? new Date(apt.date_time).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          }) : 'N/A'}
                        </div>
                      </div>
                    </div>
                    <div className="meta-item">
                      <div className={`meta-icon${isApproved ? ' meta-icon--approved' : ''}`}>
                        <Clock size={16} />
                      </div>
                      <div>
                        <div className="meta-label">Time</div>
                        <div className="meta-value">
                          {apt.date_time ? new Date(apt.date_time).toLocaleTimeString('en-US', {
                            hour: '2-digit', minute: '2-digit', hour12: true
                          }) : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {apt.notes && <div className="apt-notes">"{apt.notes}"</div>}

                  {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                    <div className="apt-actions">
                      <button
                        className="btn-apt btn-reschedule"
                        onClick={() => { setSelectedApt(apt); setShowReschedule(true); }}
                      >
                        Reschedule
                      </button>
                      <button className="btn-apt btn-cancel-apt" onClick={() => handleCancel(apt.id)}>
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          }) : (
            <div className="empty-state">
              <Calendar size={52} />
              <h3>No {activeTab} Appointments</h3>
              <p>{filterApproved ? 'No approved appointments found.' : `You don't have any appointments in this category yet.`}</p>
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
                      type="date"
                      required
                      min={today}
                      onChange={e => setNewDateTime({ ...newDateTime, date: e.target.value })}
                    />
                  </div>
                  <div className="mfield">
                    <label>New Time</label>
                    <input
                      type="time"
                      required
                      min={newDateTime.date === today ? currentTime : undefined}
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
