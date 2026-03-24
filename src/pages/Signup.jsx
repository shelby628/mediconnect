import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ArrowLeft, UserPlus } from 'lucide-react';
import PremiumModal from '../components/common/PremiumModal';
import { useData } from '../context/DataContext';
const FontLoader = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

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

    body {
      font-family: 'DM Sans', sans-serif;
      background: var(--cream);
      color: var(--text);
    }

    .signup-page {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    /* ── LEFT PANEL ── */
    .signup-left {
      background: linear-gradient(145deg, var(--primary-dark) 0%, var(--primary) 60%, var(--primary-light) 100%);
      display: flex; flex-direction: column;
      justify-content: space-between;
      padding: 3rem; position: relative; overflow: hidden;
    }
    .signup-left::before {
      content: ''; position: absolute;
      width: 400px; height: 400px; border-radius: 50%;
      background: rgba(255,255,255,0.04);
      top: -100px; left: -100px;
    }
    .signup-left::after {
      content: ''; position: absolute;
      width: 300px; height: 300px; border-radius: 50%;
      background: rgba(255,255,255,0.06);
      bottom: -80px; right: -80px;
    }
    .s-logo { display: flex; align-items: center; gap: 12px; z-index: 1; }
    .s-logo-icon {
      width: 46px; height: 46px;
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.25);
      border-radius: 12px; display: flex; align-items: center;
      justify-content: center; color: #fff;
      font-family: 'Playfair Display', serif;
      font-size: 1.5rem; font-weight: 900;
    }
    .s-logo-text {
      font-family: 'Playfair Display', serif;
      font-size: 1.4rem; font-weight: 900;
      color: #fff; letter-spacing: -0.02em;
    }
    .s-left-body { z-index: 1; }
    .s-left-body h2 {
      font-family: 'Playfair Display', serif;
      font-size: clamp(2rem, 3vw, 2.8rem);
      font-weight: 900; color: #fff;
      line-height: 1.15; margin-bottom: 1.2rem;
    }
    .s-left-body h2 em { font-style: italic; color: rgba(255,255,255,0.7); }
    .s-left-body p {
      color: rgba(255,255,255,0.65);
      font-size: 1rem; line-height: 1.75; max-width: 360px;
    }
    .s-steps { margin-top: 2rem; display: flex; flex-direction: column; gap: 14px; }
    .s-step {
      display: flex; align-items: center; gap: 12px;
      color: rgba(255,255,255,0.8); font-size: 0.88rem; font-weight: 600;
    }
    .s-step-num {
      width: 28px; height: 28px; border-radius: 50%;
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.25);
      display: flex; align-items: center; justify-content: center;
      font-size: 0.78rem; font-weight: 800; color: #fff; flex-shrink: 0;
    }
    .s-left-footer { color: rgba(255,255,255,0.35); font-size: 0.8rem; z-index: 1; }

    /* ── RIGHT PANEL ── */
    .signup-right {
      display: flex; flex-direction: column;
      justify-content: center; align-items: center;
      padding: 3rem 4rem;
      background: var(--cream);
      position: relative; overflow-y: auto;
    }
    .s-back-link {
      position: absolute; top: 2rem; left: 2rem;
      display: flex; align-items: center; gap: 6px;
      color: var(--primary); font-size: 0.88rem; font-weight: 600;
      text-decoration: none; transition: gap 0.2s;
    }
    .s-back-link:hover { gap: 10px; }

    .signup-form-wrap { width: 100%; max-width: 480px; }

    .s-form-header { margin-bottom: 2rem; }
    .s-form-header .eyebrow {
      font-size: 0.78rem; font-weight: 700; color: var(--primary);
      letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.6rem;
    }
    .s-form-header h1 {
      font-family: 'Playfair Display', serif;
      font-size: 2.2rem; font-weight: 900;
      color: var(--text); letter-spacing: -0.03em;
      line-height: 1.1; margin-bottom: 0.5rem;
    }
    .s-form-header p { color: var(--muted); font-size: 0.95rem; }

    /* ERROR */
    .s-error-box {
      background: #FFF1F2; border: 1px solid #FECDD3;
      color: #BE123C; border-radius: 12px;
      padding: 0.85rem 1.1rem; font-size: 0.88rem;
      font-weight: 600; margin-bottom: 1.5rem;
      display: flex; align-items: center; gap: 8px;
    }

    /* FORM GRID */
    .s-form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.2rem;
    }
    .s-full { grid-column: 1 / -1; }

    /* FIELDS */
    .s-field { display: flex; flex-direction: column; gap: 5px; }
    .s-field label {
      font-size: 0.75rem; font-weight: 800;
      color: var(--muted); text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .s-field input,
    .s-field select {
      padding: 0.85rem 1rem;
      background: var(--white);
      border: 1.5px solid rgba(123,45,62,0.15);
      border-radius: 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.92rem; color: var(--text); outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .s-field input:focus,
    .s-field select:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(123,45,62,0.08);
    }
    .s-field input::placeholder { color: #C4B8A8; }
    .s-field select { appearance: none; cursor: pointer; }

    /* PASSWORD WRAP */
    .s-pw-wrap { position: relative; }
    .s-pw-wrap input { width: 100%; padding-right: 3rem; }
    .s-toggle-pw {
      position: absolute; right: 1rem; top: 50%;
      transform: translateY(-50%);
      background: none; border: none; cursor: pointer;
      color: var(--muted); display: flex; align-items: center;
      transition: color 0.2s;
    }
    .s-toggle-pw:hover { color: var(--primary); }

    /* SUBMIT */
    .s-btn-submit {
      width: 100%; padding: 1rem;
      background: var(--primary); color: #fff;
      border: none; border-radius: 50px;
      font-family: 'DM Sans', sans-serif;
      font-size: 1rem; font-weight: 700;
      cursor: pointer; margin-top: 0.5rem;
      display: flex; align-items: center;
      justify-content: center; gap: 10px;
      box-shadow: 0 8px 28px rgba(123,45,62,0.3);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .s-btn-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 14px 36px rgba(123,45,62,0.4);
    }
    .s-btn-submit:disabled { opacity: 0.65; cursor: not-allowed; }

    .s-spinner {
      width: 18px; height: 18px;
      border: 2.5px solid rgba(255,255,255,0.35);
      border-top-color: #fff; border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .s-form-footer {
      text-align: center; margin-top: 1.5rem;
      font-size: 0.88rem; color: var(--muted); font-weight: 500;
    }
    .s-form-footer a {
      color: var(--primary); font-weight: 700; text-decoration: none;
    }
    .s-form-footer a:hover { text-decoration: underline; }

    @media (max-width: 900px) {
      .signup-page { grid-template-columns: 1fr; }
      .signup-left { display: none; }
      .signup-right { padding: 3rem 2rem; }
      .s-form-grid { grid-template-columns: 1fr; }
    }
  `}</style>
);

export default function Signup() {
    const [formData, setFormData] = useState({
        fullName: '',
        dob: '',
        nationalId: '',
        gender: 'Male',
        phone: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const { refreshAllData } = useData();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const result = await signup(formData);
        if (result.success) {
            const token = localStorage.getItem('access_token');
            if (token) {
                refreshAllData(token);
            }
            navigate('/dashboard');
        } else {
            const msg = result.message || '';
            if (msg.toLowerCase().includes('already')) {
                setShowModal(true);
            } else {
                setError(msg);
            }
        }
        setLoading(false);
    };

    return (
        <>
            <FontLoader />
            <div className="signup-page">

                {/* LEFT PANEL */}
                <div className="signup-left">
                    <div className="s-logo">
                        <div className="s-logo-icon">M</div>
                        <span className="s-logo-text">MediConnect</span>
                    </div>
                    <div className="s-left-body">
                        <h2>Join us &<br /><em>take control.</em></h2>
                        <p>Create your account in minutes and get instant access to all MediConnect services.</p>
                        <div className="s-steps">
                            <div className="s-step"><div className="s-step-num">1</div> Fill in your personal details</div>
                            <div className="s-step"><div className="s-step-num">2</div> Create a secure password</div>
                            <div className="s-step"><div className="s-step-num">3</div> Access your dashboard instantly</div>
                        </div>
                    </div>
                    <div className="s-left-footer">© 2026 MediConnect · Elegant Healthcare Solutions</div>
                </div>

                {/* RIGHT PANEL */}
                <div className="signup-right">
                    <Link to="/" className="s-back-link"><ArrowLeft size={16} /> Back to Home</Link>

                    <div className="signup-form-wrap">
                        <div className="s-form-header">
                            <div className="eyebrow">Get started</div>
                            <h1>Create Account</h1>
                            <p>Enter your details to register as a patient</p>
                        </div>

                        {error && (
                            <div className="s-error-box"><span>⚠</span> {error}</div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="s-form-grid">

                                <div className="s-field s-full">
                                    <label>Full Name</label>
                                    <input
                                        name="fullName" type="text" required
                                        placeholder="e.g. Beryl Atieno"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="s-field">
                                    <label>Date of Birth</label>
                                    <input
                                        name="dob" type="date" required
                                        value={formData.dob}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="s-field">
                                    <label>National ID</label>
                                    <input
                                        name="nationalId" type="text" required
                                        placeholder="e.g. 12345678"
                                        value={formData.nationalId}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="s-field">
                                    <label>Gender</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange}>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="s-field">
                                    <label>Phone Number</label>
                                    <input
                                        name="phone" type="tel" required
                                        placeholder="e.g. +254 712 345 678"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="s-field s-full">
                                    <label>Password</label>
                                    <div className="s-pw-wrap">
                                        <input
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            placeholder="Create a strong password"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                        <button
                                            type="button"
                                            className="s-toggle-pw"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="s-full" style={{ marginTop: '0.5rem' }}>
                                    <button type="submit" disabled={loading} className="s-btn-submit">
                                        {loading
                                            ? <><div className="s-spinner" /> Creating Account...</>
                                            : <><UserPlus size={18} /> Create Account</>
                                        }
                                    </button>
                                </div>

                            </div>
                        </form>

                        <p className="s-form-footer">
                            Already have an account? <Link to="/login">Sign In</Link>
                        </p>
                    </div>
                </div>

            </div>

            <PremiumModal
                isOpen={showModal}
                title="Account Already Exists"
                message="An account with this National ID already exists. Please sign in instead."
                onAction={() => navigate('/login')}
                onClose={() => setShowModal(false)}
            />
        </>
    );
}