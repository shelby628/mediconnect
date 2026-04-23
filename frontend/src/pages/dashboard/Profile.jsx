import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { User, Phone, Mail, Calendar, IdCard, Save, X, Edit2, ShieldCheck } from 'lucide-react';

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

    .profile-page {
      font-family: 'DM Sans', sans-serif;
      color: var(--text);
      padding: 2.5rem;
      max-width: 1100px;
    }

    .profile-header {
      display: flex; justify-content: space-between; align-items: flex-end;
      margin-bottom: 2.5rem; flex-wrap: wrap; gap: 1.2rem;
    }
    .profile-header h1 {
      font-family: 'Outfit', sans-serif;
      font-size: 2.4rem; font-weight: 800;
      color: var(--text); letter-spacing: -0.03em; margin-bottom: 0.3rem;
    }
    .profile-header p { color: var(--muted); font-size: 0.95rem; }
    .header-actions { display: flex; gap: 10px; }

    .btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 0.7rem 1.4rem; border-radius: 50px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.9rem; font-weight: 700;
      cursor: pointer; border: none;
      transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
    }
    .btn:hover { transform: translateY(-2px); }
    .btn-edit { background: var(--primary); color: #fff; box-shadow: 0 6px 20px rgba(123,45,62,0.3); }
    .btn-edit:hover { box-shadow: 0 10px 28px rgba(123,45,62,0.4); }
    .btn-save { background: var(--primary); color: #fff; box-shadow: 0 6px 20px rgba(123,45,62,0.25); }
    .btn-cancel { background: var(--warm); color: var(--text); border: 1.5px solid rgba(123,45,62,0.15); }
    .btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

    .profile-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 1.5rem; }
    @media (max-width: 900px) { .profile-grid { grid-template-columns: 1fr; } }

    .pcard {
      background: var(--white); border-radius: 24px;
      border: 1px solid rgba(123,45,62,0.07);
      box-shadow: 0 4px 24px rgba(26,16,8,0.06);
      padding: 2rem;
    }

    .summary-card { display: flex; flex-direction: column; align-items: center; text-align: center; }
    .avatar-wrap {
      width: 100px; height: 100px;
      background: rgba(123,45,62,0.1); border-radius: 28px;
      display: flex; align-items: center; justify-content: center;
      color: var(--primary); font-family: 'Outfit', sans-serif;
      font-size: 2.6rem; font-weight: 900;
      margin-bottom: 1.2rem; position: relative; overflow: hidden;
      border: 2px solid rgba(123,45,62,0.12);
    }
    .avatar-edit-overlay {
      position: absolute; inset: 0; background: rgba(123,45,62,0.5);
      backdrop-filter: blur(2px); display: flex; align-items: center; justify-content: center;
      color: white; cursor: pointer; opacity: 0; transition: opacity 0.2s;
    }
    .avatar-wrap:hover .avatar-edit-overlay { opacity: 1; }

    .summary-name {
      font-family: 'Outfit', sans-serif;
      font-size: 1.4rem; font-weight: 800; color: var(--text); margin-bottom: 0.3rem;
    }
    .summary-since { font-size: 0.82rem; color: var(--muted); font-weight: 500; margin-bottom: 1.4rem; }
    .divider-line { width: 100%; height: 1px; background: rgba(123,45,62,0.08); margin: 0.5rem 0 1.2rem; }

    .verified-badge {
      width: 100%; display: flex; align-items: center; gap: 12px;
      background: rgba(123,45,62,0.05); border: 1px solid rgba(123,45,62,0.1);
      border-radius: 14px; padding: 0.9rem 1rem; margin-bottom: 1.2rem;
    }
    .verified-badge .badge-icon { color: var(--primary); flex-shrink: 0; }
    .badge-label { font-size: 0.7rem; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 2px; }
    .badge-value { font-size: 0.82rem; font-weight: 700; color: var(--primary-dark); }

    .stats-row { display: flex; gap: 0; width: 100%; border-radius: 14px; overflow: hidden; border: 1px solid rgba(123,45,62,0.1); margin-top: 0.5rem; }
    .stat-item { flex: 1; padding: 0.9rem 0.5rem; text-align: center; background: var(--cream); }
    .stat-item + .stat-item { border-left: 1px solid rgba(123,45,62,0.1); }
    .stat-num { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 900; color: var(--primary); }
    .stat-lbl { font-size: 0.7rem; color: var(--muted); font-weight: 600; margin-top: 2px; }

    .fields-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.8rem; }
    .fields-header h2 { font-family: 'Outfit', sans-serif; font-size: 1.3rem; font-weight: 800; color: var(--text); }
    .fields-header p { font-size: 0.82rem; color: var(--muted); margin-top: 2px; }
    .editing-badge {
      background: rgba(123,45,62,0.08); color: var(--primary);
      border: 1px solid rgba(123,45,62,0.2);
      padding: 0.3rem 0.8rem; border-radius: 50px;
      font-size: 0.75rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.06em;
    }

    .fields-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.4rem; }
    @media (max-width: 600px) { .fields-grid { grid-template-columns: 1fr; } }

    .field-wrap { display: flex; flex-direction: column; gap: 6px; }
    .field-label { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; }
    .field-label svg { color: var(--primary); flex-shrink: 0; }

    .field-value {
      padding: 0.85rem 1rem; background: var(--cream); border-radius: 12px;
      font-size: 0.95rem; font-weight: 600; color: var(--text);
      border: 1.5px solid transparent; min-height: 48px;
    }
    .field-value.readonly {
      opacity: 0.7; border: 1.5px dashed rgba(123,45,62,0.2);
      display: flex; align-items: center; justify-content: space-between;
    }
    .readonly-tag {
      font-size: 0.68rem; font-weight: 700; color: var(--muted);
      text-transform: uppercase; letter-spacing: 0.05em;
      background: var(--warm); padding: 2px 8px; border-radius: 50px;
    }
    .field-input, .field-select {
      padding: 0.85rem 1rem; background: var(--white);
      border: 1.5px solid rgba(123,45,62,0.2); border-radius: 12px;
      font-size: 0.95rem; font-weight: 500;
      font-family: 'DM Sans', sans-serif; color: var(--text); outline: none;
      transition: border-color 0.2s, box-shadow 0.2s; width: 100%;
    }
    .field-input:focus, .field-select:focus {
      border-color: var(--primary); box-shadow: 0 0 0 4px rgba(123,45,62,0.08);
    }

    .spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff; border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `}</style>
);

const ProfileField = ({ label, value, isEditing, readOnly, type = 'text', onChange, icon, options }) => (
  <div className="field-wrap">
    <div className="field-label">{icon}{label}</div>
    {isEditing && !readOnly ? (
      type === 'select' ? (
        <select className="field-select" value={value || ''} onChange={onChange}>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input
          type={type}
          className="field-input"
          value={value || ''}
          onChange={onChange}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      )
    ) : (
      <div className={`field-value ${readOnly ? 'readonly' : ''}`}>
        <span>{value || <span style={{ color: '#C4B8A8' }}>Not set</span>}</span>
        {readOnly && <span className="readonly-tag">Locked</span>}
      </div>
    )}
  </div>
);

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { appointments } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // ✅ Use full_name (backend key) with fallback to fullName (legacy)
  const displayName = user?.full_name || user?.fullName || '';

  const [formData, setFormData] = useState({
    full_name: user?.full_name || user?.fullName || '',
    dob: user?.dob || '',
    gender: user?.gender || '',
    phone: user?.phone || '',
    email: user?.email || '',
    national_id: user?.national_id || user?.nationalId || '',
  });

  const totalAppointments = appointments.length;
  const upcomingAppointments = appointments.filter(
    a => a.status === 'Pending' || a.status === 'Approved'
  ).length;

  const getRoleLabel = () => {
    if (user?.role === 'admin') return 'Administrator Account';
    if (user?.role === 'doctor') return 'Verified Doctor Account';
    return 'Verified Patient Account';
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      // ✅ Save with full_name key so it persists correctly in localStorage
      updateProfile(formData);
      setSaving(false);
      setIsEditing(false);
    }, 1000);
  };

  const handleCancel = () => {
    setFormData({
      full_name: user?.full_name || user?.fullName || '',
      dob: user?.dob || '',
      gender: user?.gender || '',
      phone: user?.phone || '',
      email: user?.email || '',
      national_id: user?.national_id || user?.nationalId || '',
    });
    setIsEditing(false);
  };

  return (
    <>
      <FontLoader />
      <div className="profile-page">

        <div className="profile-header">
          <div>
            <h1>My Profile</h1>
            <p>Manage your personal information</p>
          </div>
          <div className="header-actions">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="btn btn-edit">
                <Edit2 size={16} /> Edit Profile
              </button>
            ) : (
              <>
                <button onClick={handleCancel} className="btn btn-cancel">
                  <X size={16} /> Cancel
                </button>
                <button onClick={handleSave} disabled={saving} className="btn btn-save">
                  {saving ? <><div className="spinner" /> Saving...</> : <><Save size={16} /> Save Changes</>}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="profile-grid">

          {/* LEFT — Summary Card */}
          <div className="pcard summary-card">
            <div className="avatar-wrap">
              {/* ✅ Use displayName which handles both full_name and fullName */}
              {displayName.charAt(0).toUpperCase() || '?'}
              {isEditing && (
                <div className="avatar-edit-overlay"><Edit2 size={20} /></div>
              )}
            </div>

            <div className="summary-name">{displayName || 'Patient'}</div>
            <div className="summary-since">Member Since {new Date().getFullYear()}</div>

            <div className="divider-line" />

            <div className="verified-badge">
              <ShieldCheck className="badge-icon" size={20} />
              <div>
                <div className="badge-label">Account Security</div>
                <div className="badge-value">{getRoleLabel()}</div>
              </div>
            </div>

            <div className="stats-row">
              <div className="stat-item">
                <div className="stat-num">{totalAppointments}</div>
                <div className="stat-lbl">Appointments</div>
              </div>
              <div className="stat-item">
                <div className="stat-num">{upcomingAppointments}</div>
                <div className="stat-lbl">Upcoming</div>
              </div>
            </div>
          </div>

          {/* RIGHT — Personal Information Card */}
          <div className="pcard">
            <div className="fields-header">
              <div>
                <h2>Personal Information</h2>
                <p>Your details as registered in the system</p>
              </div>
              {isEditing && <span className="editing-badge">✏ Editing</span>}
            </div>

            <div className="fields-grid">
              {/* ✅ All fields now use full_name, national_id (backend keys) */}
              <ProfileField
                label="Full Name" value={formData.full_name}
                isEditing={isEditing} icon={<User size={14} />}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              />
              <ProfileField
                label="Date of Birth" value={formData.dob}
                isEditing={isEditing} type="date" icon={<Calendar size={14} />}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              />
              <ProfileField
                label="National ID" value={formData.national_id}
                readOnly icon={<IdCard size={14} />}
              />
              <ProfileField
                label="Gender" value={formData.gender}
                isEditing={isEditing} type="select"
                options={['Male', 'Female', 'Other']} icon={<User size={14} />}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              />
              <ProfileField
                label="Phone Number" value={formData.phone}
                isEditing={isEditing} icon={<Phone size={14} />}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <ProfileField
                label="Email Address" value={formData.email}
                isEditing={isEditing} icon={<Mail size={14} />}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
