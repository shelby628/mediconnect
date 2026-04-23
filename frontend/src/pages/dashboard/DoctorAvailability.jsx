import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Search, Filter, MapPin, X, Check, Calendar, Clock } from 'lucide-react';
import { departments } from '../../data/mockData';

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

    .da-page {
      font-family: 'Outfit', sans-serif;
      color: var(--text);
      padding: 2.5rem;
      max-width: 1200px;
    }

    .da-header { margin-bottom: 2rem; }
    .da-header h1 {
      font-family: 'Sans-serif', serif;
      font-size: 2.4rem; font-weight: 400;
      color: var(--text); letter-spacing: -0.03em; margin-bottom: 0.3rem;
    }
    .da-header p { color: var(--muted); font-size: 0.95rem; }

    .filters-bar {
      display: flex; gap: 1rem; flex-wrap: wrap;
      background: var(--white);
      border: 1px solid rgba(123,45,62,0.08);
      border-radius: 20px; padding: 1.2rem;
      margin-bottom: 2rem;
      box-shadow: 0 2px 16px rgba(26,16,8,0.05);
    }
    .search-wrap { flex: 1; min-width: 260px; position: relative; }
    .search-wrap svg {
      position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
      color: var(--muted); pointer-events: none;
    }
    .search-input {
      width: 100%; padding: 0.85rem 1rem 0.85rem 2.8rem;
      background: var(--cream);
      border: 1.5px solid transparent;
      border-radius: 14px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.92rem; color: var(--text); outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .search-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(123,45,62,0.08);
    }
    .search-input::placeholder { color: #C4B8A8; }

    .filter-select-wrap { width: 220px; position: relative; }
    .filter-select-wrap svg {
      position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
      color: var(--muted); pointer-events: none;
    }
    .filter-select {
      width: 100%; padding: 0.85rem 1rem 0.85rem 2.8rem;
      background: var(--cream);
      border: 1.5px solid transparent;
      border-radius: 14px; appearance: none;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.92rem; color: var(--text); outline: none;
      transition: border-color 0.2s; cursor: pointer;
    }
    .filter-select:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(123,45,62,0.08);
    }

    .results-label {
      font-size: 0.82rem; font-weight: 700;
      color: var(--muted); text-transform: uppercase;
      letter-spacing: 0.08em; margin-bottom: 1.2rem;
    }

    .doctors-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.4rem;
    }

    .doc-card {
      background: var(--white);
      border-radius: 22px;
      border: 1px solid rgba(123,45,62,0.07);
      box-shadow: 0 2px 16px rgba(26,16,8,0.05);
      overflow: hidden;
      transition: transform 0.25s, box-shadow 0.25s;
    }
    .doc-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 16px 48px rgba(123,45,62,0.12);
    }
    .doc-card-top { height: 5px; }
    .doc-card-top.available   { background: linear-gradient(to right, var(--primary), var(--primary-light)); }
    .doc-card-top.booked      { background: linear-gradient(to right, #F97316, #FB923C); }
    .doc-card-top.unavailable { background: linear-gradient(to right, #EF4444, #F87171); }

    .doc-card-body { padding: 1.6rem; }
    .doc-card-head {
      display: flex; justify-content: space-between;
      align-items: flex-start; margin-bottom: 1.2rem;
    }
    .doc-avatar {
      width: 58px; height: 58px; border-radius: 16px;
      background: rgba(123,45,62,0.08);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Playfair Display', serif;
      font-size: 1.3rem; font-weight: 900;
      color: var(--primary-dark); transition: background 0.2s;
    }
    .doc-card:hover .doc-avatar { background: rgba(123,45,62,0.15); }

    .status-pill {
      padding: 0.35rem 0.85rem; border-radius: 50px;
      font-size: 0.75rem; font-weight: 700;
    }
    .status-pill.available   { background: rgba(123,45,62,0.1); color: var(--primary-dark); }
    .status-pill.booked      { background: #FFF7ED; color: #C2410C; }
    .status-pill.unavailable { background: #FEF2F2; color: #B91C1C; }

    .doc-name {
      font-family: 'calibri', serif;
      font-size: 1.15rem; font-weight: 900;
      color: var(--text); margin-bottom: 3px; transition: color 0.2s;
    }
    .doc-card:hover .doc-name { color: var(--primary); }
    .doc-specialty { font-size: 0.85rem; color: var(--muted); font-weight: 500; }
    .doc-dept {
      display: inline-flex; align-items: center; gap: 5px;
      margin-top: 0.8rem;
      font-size: 0.75rem; font-weight: 700;
      color: var(--muted); text-transform: uppercase; letter-spacing: 0.07em;
    }
    .doc-dept svg { color: var(--primary); }

    .doc-card-footer {
      border-top: 1px solid rgba(123,45,62,0.06);
      padding-top: 1.2rem; margin-top: 1.2rem;
    }
    .btn-book {
      width: 100%; padding: 0.8rem;
      border-radius: 50px; border: none;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.92rem; font-weight: 700; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
    }
    .btn-book.active {
      background: var(--primary); color: #fff;
      box-shadow: 0 6px 20px rgba(123,45,62,0.28);
    }
    .btn-book.active:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 28px rgba(123,45,62,0.38);
    }
    .btn-book.disabled {
      background: var(--warm); color: var(--muted);
      cursor: not-allowed; opacity: 0.7;
    }

    .modal-overlay {
      position: fixed; inset: 0; z-index: 200;
      background: rgba(26,16,8,0.45);
      backdrop-filter: blur(6px);
      display: flex; align-items: center; justify-content: center;
      padding: 2rem; animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .modal {
      background: var(--white); border-radius: 28px;
      box-shadow: 0 30px 80px rgba(26,16,8,0.2);
      width: 100%; max-width: 500px; overflow: hidden;
      animation: slideUp 0.25s ease;
    }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: none; } }

    .modal-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      padding: 2rem 2rem 0;
    }
    .modal-header h2 {
      font-family: 'Playfair Display', serif;
      font-size: 1.6rem; font-weight: 900; color: var(--text); margin-bottom: 3px;
    }
    .modal-header p { color: var(--muted); font-size: 0.88rem; }
    .modal-close {
      background: var(--cream); border: none; border-radius: 50%;
      width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: var(--muted); flex-shrink: 0;
      transition: background 0.2s, color 0.2s;
    }
    .modal-close:hover { background: rgba(123,45,62,0.1); color: var(--primary); }

    .modal-doctor-row {
      display: flex; align-items: center; gap: 12px;
      margin: 1.4rem 2rem;
      background: var(--cream); border-radius: 14px; padding: 1rem;
    }
    .modal-doc-avatar {
      width: 46px; height: 46px; border-radius: 12px;
      background: rgba(123,45,62,0.1);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Playfair Display', serif;
      font-size: 1rem; font-weight: 900; color: var(--primary-dark);
    }
    .modal-doc-name { font-weight: 700; font-size: 0.95rem; color: var(--text); }
    .modal-doc-spec { font-size: 0.8rem; color: var(--muted); }

    .modal-body { padding: 0 2rem 2rem; }
    .mfield { margin-bottom: 1.2rem; }
    .mfield label {
      display: block; font-size: 0.75rem; font-weight: 700;
      color: var(--muted); text-transform: uppercase;
      letter-spacing: 0.08em; margin-bottom: 6px;
    }
    .mfield input, .mfield textarea {
      width: 100%; padding: 0.85rem 1rem;
      background: var(--cream);
      border: 1.5px solid transparent; border-radius: 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.92rem; color: var(--text); outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .mfield input:focus, .mfield textarea:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(123,45,62,0.08);
      background: var(--white);
    }
    .mfield textarea { resize: none; height: 100px; }
    .mfields-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

    .btn-confirm {
      width: 100%; padding: 1rem;
      background: var(--primary); color: #fff; border: none;
      border-radius: 50px; font-family: 'DM Sans', sans-serif;
      font-size: 1rem; font-weight: 700; cursor: pointer;
      box-shadow: 0 8px 28px rgba(123,45,62,0.3);
      transition: transform 0.2s, box-shadow 0.2s;
      display: flex; align-items: center; justify-content: center; gap: 10px;
      margin-top: 0.5rem;
    }
    .btn-confirm:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(123,45,62,0.4); }

    .success-body { padding: 3rem 2rem; text-align: center; }
    .success-icon {
      width: 80px; height: 80px; border-radius: 50%;
      background: rgba(123,45,62,0.1); color: var(--primary);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 1.5rem;
      animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1);
    }
    @keyframes popIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    .success-body h2 {
      font-family: 'calibri', serif;
      font-size: 1.8rem; font-weight: 900; color: var(--text); margin-bottom: 0.7rem;
    }
    .success-body p { color: var(--muted); font-size: 0.92rem; line-height: 1.7; }
  `}</style>
);

export default function DoctorAvailability() {
  const { doctors, bookAppointment } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingData, setBookingData] = useState({ date: '', time: '', notes: '' });
  const [bookingStep, setBookingStep] = useState(1);

  // ✅ FIX: was doc.name — field is now full_name from the updated DoctorSerializer
  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch =
      (doc.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.specialty || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || doc.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleBook = (e) => {
    e.preventDefault();
    bookAppointment(selectedDoctor, `${bookingData.date}T${bookingData.time}`, bookingData.notes);
    setBookingStep(2);
    setTimeout(() => {
      setSelectedDoctor(null);
      setBookingStep(1);
      setBookingData({ date: '', time: '', notes: '' });
    }, 2500);
  };

  const statusClass = (status) => {
    if (status === 'Available') return 'available';
    if (status === 'Fully Booked') return 'booked';
    return 'unavailable';
  };

  // ✅ Safe initials helper — won't crash if full_name is undefined
  const getInitials = (name) =>
    (name || '??').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <>
      <FontLoader />
      <div className="da-page">

        <div className="da-header">
          <h1>Doctor Availability</h1>
          <p>Find and book appointments with our specialists</p>
        </div>

        <div className="filters-bar">
          <div className="search-wrap">
            <input
              className="search-input"
              type="text"
              placeholder="Search by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-select-wrap">
            <Filter size={17} />
            <select
              className="filter-select"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="All">All Departments</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div className="results-label">
          {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found
        </div>

        <div className="doctors-grid">
          {filteredDoctors.map((doc) => (
            <div className="doc-card" key={doc.id}>
              <div className={`doc-card-top ${statusClass(doc.status)}`} />
              <div className="doc-card-body">
                <div className="doc-card-head">
                  {/* ✅ FIX: was doc.name */}
                  <div className="doc-avatar">{getInitials(doc.full_name)}</div>
                  <span className={`status-pill ${statusClass(doc.status)}`}>
                    ● {doc.status}
                  </span>
                </div>
                {/* ✅ FIX: was doc.name */}
                <div className="doc-name">{doc.full_name}</div>
                <div className="doc-specialty">{doc.specialty}</div>
                <div className="doc-dept"><MapPin size={13} /> {doc.department}</div>

                <div className="doc-card-footer">
                  <button
                    className={`btn-book ${doc.status === 'Available' ? 'active' : 'disabled'}`}
                    disabled={doc.status !== 'Available'}
                    onClick={() => doc.status === 'Available' && setSelectedDoctor(doc)}
                  >
                    <Calendar size={15} />
                    {doc.status === 'Available' ? 'Book Appointment' : doc.status}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedDoctor && (
          <div className="modal-overlay" onClick={() => setSelectedDoctor(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>

              {bookingStep === 1 ? (
                <>
                  <div className="modal-header">
                    <div>
                      <h2>Book Appointment</h2>
                      <p>Fill in the details below to confirm</p>
                    </div>
                    <button className="modal-close" onClick={() => setSelectedDoctor(null)}>
                      <X size={18} />
                    </button>
                  </div>

                  <div className="modal-doctor-row">
                    {/* ✅ FIX: was selectedDoctor.name */}
                    <div className="modal-doc-avatar">{getInitials(selectedDoctor.full_name)}</div>
                    <div>
                      <div className="modal-doc-name">{selectedDoctor.full_name}</div>
                      <div className="modal-doc-spec">
                        {selectedDoctor.specialty} · {selectedDoctor.department}
                      </div>
                    </div>
                  </div>

                  <div className="modal-body">
                    <form onSubmit={handleBook}>
                      <div className="mfields-row">
                        <div className="mfield">
                          <label><Calendar size={12} style={{ display: 'inline', marginRight: 4 }} />Date</label>
                          <input
                            type="date" required
                            min={new Date().toISOString().split('T')[0]}
                            value={bookingData.date}
                            onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                          />
                        </div>
                        <div className="mfield">
                          <label><Clock size={12} style={{ display: 'inline', marginRight: 4 }} />Time</label>
                          <input
                            type="time" required
                            min={bookingData.date === new Date().toISOString().split('T')[0]
                              ? new Date().toTimeString().slice(0, 5)
                              : undefined}
                            value={bookingData.time}
                            onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="mfield">
                        <label>Notes (Optional)</label>
                        <textarea
                          placeholder="E.g. symptoms, previous history..."
                          value={bookingData.notes}
                          onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                        />
                      </div>
                      <button type="submit" className="btn-confirm">
                        <Check size={18} /> Confirm Booking
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="success-body">
                  <div className="success-icon"><Check size={36} /></div>
                  <h2>Booking Successful!</h2>
                  <p>Your appointment request has been sent to the hospital for approval. You'll be notified shortly.</p>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </>
  );
}