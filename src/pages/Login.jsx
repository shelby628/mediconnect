import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Eye, EyeOff, LogIn } from 'lucide-react';
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

    .login-page {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    /* LEFT PANEL */
    .login-left {
      background: linear-gradient(145deg, var(--primary-dark) 0%, var(--primary) 60%, var(--primary-light) 100%);
      display: flex; flex-direction: column;
      justify-content: space-between;
      padding: 3rem; position: relative; overflow: hidden;
    }
    .login-left::before {
      content: ''; position: absolute;
      width: 400px; height: 400px; border-radius: 50%;
      background: rgba(255,255,255,0.04);
      top: -100px; left: -100px;
    }
    .login-left::after {
      content: ''; position: absolute;
      width: 300px; height: 300px; border-radius: 50%;
      background: rgba(255,255,255,0.06);
      bottom: -80px; right: -80px;
    }
    .left-logo { display: flex; align-items: center; gap: 12px; z-index: 1; }
    .left-logo-icon {
      width: 46px; height: 46px;
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.25);
      border-radius: 12px; display: flex; align-items: center;
      justify-content: center; color: #fff;
      font-family: 'Playfair Display', serif;
      font-size: 1.5rem; font-weight: 900;
    }
    .left-logo-text {
      font-family: 'Playfair Display', serif;
      font-size: 1.4rem; font-weight: 900;
      color: #fff; letter-spacing: -0.02em;
    }
    .left-body { z-index: 1; }
    .left-body h2 {
      font-family: 'Playfair Display', serif;
      font-size: clamp(2rem, 3vw, 2.8rem);
      font-weight: 900; color: #fff;
      line-height: 1.15; letter-spacing: -0.02em;
      margin-bottom: 1.2rem;
    }
    .left-body h2 em { font-style: italic; color: rgba(255,255,255,0.7); }
    .left-body p {
      color: rgba(255,255,255,0.65);
      font-size: 1rem; line-height: 1.75; max-width: 360px;
    }
    .left-pills { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 2rem; z-index: 1; }
    .pill {
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.15);
      color: rgba(255,255,255,0.85);
      padding: 0.45rem 1rem; border-radius: 50px;
      font-size: 0.8rem; font-weight: 600;
    }
    .left-footer { color: rgba(255,255,255,0.35); font-size: 0.8rem; z-index: 1; }

    /* RIGHT PANEL */
    .login-right {
      display: flex; flex-direction: column;
      justify-content: center; align-items: center;
      padding: 3rem 4rem;
      background: var(--cream);
      position: relative;
    }
    .back-link {
      position: absolute; top: 2rem; left: 2rem;
      display: flex; align-items: center; gap: 6px;
      color: var(--primary); font-size: 0.88rem; font-weight: 600;
      text-decoration: none; transition: gap 0.2s;
    }
    .back-link:hover { gap: 10px; }

    .login-form-wrap { width: 100%; max-width: 400px; }

    .form-header { margin-bottom: 2.5rem; }
    .form-header .eyebrow {
      font-size: 0.78rem; font-weight: 700; color: var(--primary);
      letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.6rem;
    }
    .form-header h1 {
      font-family: 'Playfair Display', serif;
      font-size: 2.4rem; font-weight: 900;
      color: var(--text); letter-spacing: -0.03em;
      line-height: 1.1; margin-bottom: 0.5rem;
    }
    .form-header p { color: var(--muted); font-size: 0.95rem; }

    /* ERROR */
    .error-box {
      background: #FFF1F2; border: 1px solid #FECDD3;
      color: #BE123C; border-radius: 12px;
      padding: 0.85rem 1.1rem; font-size: 0.88rem;
      font-weight: 600; margin-bottom: 1.5rem;
      display: flex; align-items: center; gap: 8px;
    }

    /* FORM FIELDS */
    .field { margin-bottom: 1.4rem; }
    .field label {
      display: block; font-size: 0.82rem; font-weight: 700;
      color: var(--text); letter-spacing: 0.03em;
      text-transform: uppercase; margin-bottom: 0.5rem;
    }
    .field input {
      width: 100%; padding: 0.95rem 1.1rem;
      background: var(--white);
      border: 1.5px solid rgba(123,45,62,0.15);
      border-radius: 14px; font-size: 0.95rem;
      font-family: 'DM Sans', sans-serif;
      color: var(--text); outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .field input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(123,45,62,0.08);
    }
    .field input::placeholder { color: #C4B8A8; }
    .password-wrap { position: relative; }
    .password-wrap input { padding-right: 3rem; }
    .toggle-pw {
      position: absolute; right: 1rem; top: 50%; transform: translateY(-50%);
      background: none; border: none; cursor: pointer;
      color: var(--muted); display: flex; align-items: center;
      transition: color 0.2s;
    }
    .toggle-pw:hover { color: var(--primary); }

    /* SUBMIT BUTTON */
    .btn-submit {
      width: 100%; padding: 1rem;
      background: var(--primary); color: #fff;
      border: none; border-radius: 50px;
      font-family: 'DM Sans', sans-serif;
      font-size: 1rem; font-weight: 700;
      cursor: pointer; margin-top: 0.5rem;
      display: flex; align-items: center; justify-content: center; gap: 10px;
      box-shadow: 0 8px 28px rgba(123,45,62,0.3);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 14px 36px rgba(123,45,62,0.4);
    }
    .btn-submit:disabled { opacity: 0.65; cursor: not-allowed; }

    /* SPINNER */
    .spinner {
      width: 18px; height: 18px;
      border: 2.5px solid rgba(255,255,255,0.35);
      border-top-color: #fff; border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .form-footer {
      text-align: center; margin-top: 1.8rem;
      font-size: 0.88rem; color: var(--muted); font-weight: 500;
    }
    .form-footer a {
      color: var(--primary); font-weight: 700; text-decoration: none;
    }
    .form-footer a:hover { text-decoration: underline; }

    .divider {
      display: flex; align-items: center; gap: 12px;
      margin: 1.5rem 0; color: var(--muted); font-size: 0.8rem;
    }
    .divider::before, .divider::after {
      content: ''; flex: 1; height: 1px;
      background: rgba(123,45,62,0.12);
    }

    @media (max-width: 768px) {
      .login-page { grid-template-columns: 1fr; }
      .login-left { display: none; }
      .login-right { padding: 3rem 2rem; }
    }
  `}</style>
);

export default function Login() {
    // ✅ Changed from fullName to nationalId
    const [formData, setFormData] = useState({ nationalId: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { refreshAllData } = useData();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // ✅ Sends nationalId instead of fullName
        const result = await login(formData.nationalId, formData.password);

        if (result.success) {
            if (result.token) {
                refreshAllData(result.token);
            }
            navigate(result.role === 'admin' ? '/admin' : '/dashboard');
        } else {
            setError(result.message);
            setLoading(false);
        }
    };

    return (
        <>
            <FontLoader />
            <div className="login-page">

                {/* LEFT PANEL */}
                <div className="login-left">
                    <div className="left-logo">
                        <div className="left-logo-icon">M</div>
                        <span className="left-logo-text">MediConnect</span>
                    </div>
                    <div className="left-body">
                        <h2>Your health,<br /><em>beautifully managed.</em></h2>
                        <p>Sign in to access your appointments, medical records, and real-time doctor availability — all in one place.</p>
                        <div className="left-pills">
                            <span className="pill"> Smart Booking</span>
                            <span className="pill">Secure Records</span>
                            <span className="pill"> Visit History</span>
                            <span className="pill"> Real-time Updates</span>
                        </div>
                    </div>
                    <div className="left-footer">© 2026 MediConnect · Healthcare Solutions</div>
                </div>

                {/* RIGHT PANEL */}
                <div className="login-right">
                    <Link to="/" className="back-link">
                        <ArrowLeft size={16} /> Back to Home
                    </Link>

                    <div className="login-form-wrap">
                        <div className="form-header">
                            <div className="eyebrow">Welcome back</div>
                            <h1>Sign In</h1>
                            <p>Enter your credentials to access your account</p>
                        </div>

                        {error && (
                            <div className="error-box">
                                <span>⚠</span> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>

                            {/* ✅ National ID field */}
                            <div className="field">
                                <label>National ID</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 12345678"
                                    required
                                    value={formData.nationalId}
                                    onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                                />
                            </div>

                            {/* Password field */}
                            <div className="field">
                                <label>Password</label>
                                <div className="password-wrap">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        className="toggle-pw"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn-submit"
                                disabled={loading}
                            >
                                {loading
                                    ? <><div className="spinner" /> Signing In...</>
                                    : <><LogIn size={18} /> Sign In</>
                                }
                            </button>
                        </form>

                        <div className="divider">or</div>

                        <p className="form-footer">
                            Don't have an account? <Link to="/signup">Register Now</Link>
                        </p>
                    </div>
                </div>

            </div>
        </>
    );
}