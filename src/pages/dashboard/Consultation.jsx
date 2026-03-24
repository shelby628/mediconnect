import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { MessageSquare, History, ExternalLink, Check, Send, X, Calendar, Clock } from 'lucide-react';

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

    .consult-page {
      font-family: 'DM Sans', sans-serif;
      color: var(--text);
      padding: 2.5rem;
      max-width: 1200px;
    }

    /* ── HEADER ── */
    .consult-header { margin-bottom: 2.5rem; }
    .consult-header h1 {
      font-family: 'Sans-serif', serif;
      font-size: 2.4rem; font-weight: 400;
      color: var(--text); letter-spacing: -0.03em; margin-bottom: 0.3rem;
    }
    .consult-header p { color: var(--muted); font-size: 0.95rem; }

    /* ── LAYOUT ── */
    .consult-grid {
      display: grid;
      grid-template-columns: 1fr 360px;
      gap: 1.5rem;
      align-items: start;
    }
    @media (max-width: 1000px) {
      .consult-grid { grid-template-columns: 1fr; }
    }

    /* ── SECTION HEADING ── */
    .section-head {
      display: flex; align-items: center; gap: 12px;
      margin-bottom: 1.4rem;
    }
    .section-icon {
      width: 44px; height: 44px; border-radius: 14px;
      background: rgba(123,45,62,0.1);
      display: flex; align-items: center; justify-content: center;
      color: var(--primary); flex-shrink: 0;
    }
    .section-head h2 {
      font-family: 'Playfair Display', serif;
      font-size: 1.4rem; font-weight: 900; color: var(--text);
    }

    /* ── TABLE CARD ── */
    .table-card {
      background: var(--white);
      border-radius: 22px;
      border: 1px solid rgba(123,45,62,0.07);
      box-shadow: 0 4px 24px rgba(26,16,8,0.06);
      overflow: hidden;
    }

    .ctable { width: 100%; border-collapse: collapse; }
    .ctable thead tr {
      background: var(--cream);
      border-bottom: 1px solid rgba(123,45,62,0.08);
    }
    .ctable thead th {
      padding: 1rem 1.2rem;
      font-size: 0.72rem; font-weight: 800;
      color: var(--muted); text-transform: uppercase;
      letter-spacing: 0.09em; text-align: left;
    }
    .ctable tbody tr {
      border-bottom: 1px solid rgba(123,45,62,0.05);
      transition: background 0.15s;
    }
    .ctable tbody tr:last-child { border-bottom: none; }
    .ctable tbody tr:hover { background: rgba(123,45,62,0.02); }
    .ctable td { padding: 1.1rem 1.2rem; vertical-align: middle; }

    .td-date {
      font-family: 'Playfair Display', serif;
      font-size: 0.9rem; font-weight: 700; color: var(--text);
      white-space: nowrap;
    }
    .td-doc { font-weight: 700; font-size: 0.92rem; color: var(--text); }
    .td-dept { font-size: 0.75rem; color: var(--muted); margin-top: 2px; }

    .td-notes {
      font-size: 0.85rem; color: var(--muted);
      max-width: 260px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.5;
    }

    .followup-pill {
      display: inline-block;
      padding: 0.3rem 0.8rem; border-radius: 50px;
      font-size: 0.72rem; font-weight: 800;
      text-transform: uppercase; letter-spacing: 0.06em;
    }
    .followup-pill.required { background: #FFF7ED; color: #C2410C; }
    .followup-pill.none     { background: rgba(123,45,62,0.08); color: var(--muted); }

    .btn-view {
      width: 36px; height: 36px; border-radius: 10px;
      background: var(--cream); border: 1px solid rgba(123,45,62,0.12);
      display: flex; align-items: center; justify-content: center;
      color: var(--primary); cursor: pointer;
      transition: background 0.2s, transform 0.2s;
    }
    .btn-view:hover {
      background: rgba(123,45,62,0.1);
      transform: scale(1.08);
    }

    /* ── ASK A QUESTION CARD ── */
    .ask-card {
      background: var(--white);
      border-radius: 22px;
      border: 1px solid rgba(123,45,62,0.07);
      border-top: 4px solid var(--primary);
      box-shadow: 0 4px 24px rgba(26,16,8,0.06);
      padding: 1.8rem;
    }
    .ask-card .section-head { margin-bottom: 0.6rem; }
    .ask-intro {
      font-size: 0.85rem; color: var(--muted);
      line-height: 1.65; margin-bottom: 1.4rem;
    }

    /* ── FORM FIELDS ── */
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
    .cfield textarea { resize: none; height: 110px; }
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

    /* ── MODAL ── */
    .modal-overlay {
      position: fixed; inset: 0; z-index: 200;
      background: rgba(26,16,8,0.45); backdrop-filter: blur(6px);
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
      cursor: pointer; color: var(--muted);
      transition: background 0.2s, color 0.2s; flex-shrink: 0;
    }
    .modal-close:hover { background: rgba(123,45,62,0.1); color: var(--primary); }
    .modal-body { padding: 1.5rem 2rem 2rem; }
    .modal-actions { display: flex; gap: 10px; margin-top: 1rem; }
    .btn-modal {
      flex: 1; padding: 0.9rem; border-radius: 50px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.92rem; font-weight: 700;
      cursor: pointer; border: none;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn-modal-secondary { background: var(--warm); color: var(--muted); border: 1.5px solid rgba(123,45,62,0.15); }
    .btn-modal-primary {
      background: var(--primary); color: #fff;
      box-shadow: 0 6px 20px rgba(123,45,62,0.28);
    }
    .btn-modal-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(123,45,62,0.38); }
  `}</style>
);

export default function Consultation() {
  const { consultations, requestFollowUp, addTicket } = useData();
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [followUpData, setFollowUpData] = useState({ date: '', time: '' });
  const [questionData, setQuestionData] = useState({ subject: '', dept: 'General Medicine', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFollowUp = (e) => {
    e.preventDefault();
    requestFollowUp(selectedConsultation.doctor, followUpData.date, followUpData.time);
    setShowFollowUp(false);
    setSelectedConsultation(null);
  };

  const handleAskQuestion = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      addTicket({ subject: questionData.subject, type: 'Technical', message: questionData.message });
      setQuestionData({ subject: '', dept: 'General Medicine', message: '' });
      setSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  return (
    <>
      <FontLoader />
      <div className="consult-page">

        {/* HEADER */}
        <div className="consult-header">
          <h1>Consultation</h1>
          <p>Your medical history and follow-up requests</p>
        </div>

        <div className="consult-grid">

          {/* LEFT — Past Consultations Table */}
          <div>
            <div className="section-head">
              <div className="section-icon"><History size={20} /></div>
              <h2>Past Consultations</h2>
            </div>

            <div className="table-card">
              <table className="ctable">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Doctor / Department</th>
                    <th>Notes</th>
                    <th>Follow-up</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {consultations.map(c => (
                    <tr key={c.id}>
                      <td><div className="td-date">{c.date}</div></td>
                      <td>
                        <div className="td-doc">{c.doctor}</div>
                        <div className="td-dept">{c.department}</div>
                      </td>
                      <td><div className="td-notes">{c.notes}</div></td>
                      <td>
                        <span className={`followup-pill ${c.followUp === 'Yes' ? 'required' : 'none'}`}>
                          {c.followUp === 'Yes' ? 'Required' : 'None'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-view"
                          onClick={() => { setSelectedConsultation(c); setShowFollowUp(true); }}
                          title="Request follow-up"
                        >
                          <ExternalLink size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT — Ask a Question */}


        </div>

        {/* FOLLOW-UP MODAL */}
        {showFollowUp && selectedConsultation && (
          <div className="modal-overlay" onClick={() => setShowFollowUp(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h2>Request Follow-up</h2>
                  <p>With <strong>{selectedConsultation.doctor}</strong> · {selectedConsultation.department}</p>
                </div>
                <button className="modal-close" onClick={() => setShowFollowUp(false)}>
                  <X size={17} />
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleFollowUp}>
                  <div className="cfield">
                    <label><Calendar size={11} style={{ display: 'inline', marginRight: 4 }} />Preferred Date</label>
                    <input
                      type="date" required
                      onChange={e => setFollowUpData({ ...followUpData, date: e.target.value })}
                    />
                  </div>
                  <div className="cfield">
                    <label><Clock size={11} style={{ display: 'inline', marginRight: 4 }} />Preferred Time</label>
                    <input
                      type="time" required
                      onChange={e => setFollowUpData({ ...followUpData, time: e.target.value })}
                    />
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="btn-modal btn-modal-secondary" onClick={() => setShowFollowUp(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-modal btn-modal-primary">
                      <Check size={16} /> Submit Request
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