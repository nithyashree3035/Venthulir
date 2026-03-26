import React, { useState } from 'react';
import { ChevronRight, ChevronDown, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
    const { login, register, requestRegisterOTP, verifyRegisterOTP, verifyResetOTP, forgotPassword, resetPassword } = useAuth();
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [formData, setFormData] = useState({ email: '', phone: '', password: '', name: '', otp: '' });
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isOtpMode, setIsOtpMode] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotStep, setForgotStep] = useState(1); // 1: email, 2: otp, 3: newpass
    const [isForgotVerified, setIsForgotVerified] = useState(false);

    React.useEffect(() => {
        let timer;
        if ((isOtpMode || (showForgotPassword && forgotStep === 2)) && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (timeLeft === 0 && (isOtpMode || (showForgotPassword && forgotStep === 2))) {
            setError("OTP has expired. Please use the resend button.");
        }
        return () => clearTimeout(timer);
    }, [isOtpMode, timeLeft, showForgotPassword, forgotStep]);

    if (!isOpen) return null;

    const handleSendRegisterOtp = async () => {
        if (!formData.email) {
            setError('Please enter your email to verify.');
            return;
        }
        setError('');
        setIsVerifying(true);
        const reqRes = await requestRegisterOTP(formData.email);
        setIsVerifying(false);
        if (reqRes.success) {
            setTimeLeft(30);
            setIsOtpMode(true);
            setError('');
        } else {
            setError(reqRes.msg);
        }
    };

    const handleVerifyRegisterOtp = async () => {
        if (!formData.otp) {
            setError('Please enter verification code.');
            return;
        }
        if (timeLeft <= 0) {
            setError('Verification code has expired. Please resend.');
            return;
        }
        setError('');
        setIsVerifying(true);
        const res = await verifyRegisterOTP(formData.email, formData.otp);
        setIsVerifying(false);
        if (res.success) {
            setIsEmailVerified(true);
            setIsOtpMode(false);
            setError('');
        } else {
            setError(res.msg);
        }
    };

    const handleVerifyResetOtp = async () => {
        if (!formData.otp) {
            setError('Please enter verification code.');
            return;
        }
        if (timeLeft <= 0) {
            setError('Verification code has expired. Please resend.');
            return;
        }
        setError('');
        setIsVerifying(true);
        const res = await verifyResetOTP(formData.email, formData.otp);
        setIsVerifying(false);
        if (res.success) {
            setIsForgotVerified(true);
            setForgotStep(3); // Move to password entry step
            setError('');
        } else {
            setError(res.msg);
        }
    };

    const handleForgotPassword = async (e) => {
        if (e) e.preventDefault();
        setError('');
        if (forgotStep === 1) {
            setIsVerifying(true);
            const res = await forgotPassword(formData.email);
            setIsVerifying(false);
            if (res.success) {
                setTimeLeft(30);
                setForgotStep(2);
                setIsForgotVerified(false);
                setError('');
            } else {
                setError(res.msg);
            }
        } else if (forgotStep === 2) {
            handleVerifyResetOtp();
        } else if (forgotStep === 3) {
            setIsVerifying(true);
            const res = await resetPassword(formData.email, formData.password);
            setIsVerifying(false);
            if (res.success) {
                setForgotStep(1);
                setIsForgotVerified(false);
                setShowForgotPassword(false);
                setIsLogin(true);
                alert(res.msg);
            } else {
                setError(res.msg);
            }
        }
    };

    const handleResendForgotPassword = async () => {
        setError('');
        setIsVerifying(true);
        const res = await forgotPassword(formData.email);
        setIsVerifying(false);
        if (res.success) {
            setTimeLeft(30);
            setError('');
        } else {
            setError(res.msg);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isLogin) {
                setIsVerifying(true);
                const res = await login(formData.email, formData.password, rememberMe);
                setIsVerifying(false);
                if (res.success) {
                    if (formData.email === 'thesmgroups@gmail.com') {
                        window.location.href = '/admin';
                        return;
                    }
                    onClose();
                } else {
                    setError(res.msg);
                }
            } else {
                if (!isEmailVerified) {
                    setError('Please verify your email first.');
                    return;
                }

                const phoneDigits = formData.phone.replace(/[\s\-\(\)\+]/g, '');
                if (!/^\d{10}$/.test(phoneDigits)) {
                    setError('Please enter a valid 10-digit mobile number.');
                    return;
                }

                setIsVerifying(true);
                const res = await register(formData.name, formData.email, formData.phone, formData.password, '', '', '', '', '');
                setIsVerifying(false);
                if (res.success) {
                    if (formData.email === 'thesmgroups@gmail.com') {
                        window.location.href = '/admin';
                        return;
                    }
                    onClose();
                } else {
                    setError(res.msg);
                }
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    const handleToggleMode = (loginMode) => {
        setIsLogin(loginMode);
        setIsOtpMode(false);
        setIsEmailVerified(false);
        setShowForgotPassword(false);
        setForgotStep(1);
        setError('');
        setFormData({ email: '', phone: '', password: '', name: '', otp: '' });
    };

    return (
        <div className="a-auth-overlay">
            <div className="a-auth-logo" onClick={onClose}>VENTHULIR</div>

            <div className="a-auth-card">
                <h1 className="a-auth-heading">
                    {showForgotPassword ? 'Reset Password' : (isLogin ? 'Sign in' : 'Create account')}
                </h1>

                {error && (
                    <div className="a-auth-error-alert">
                        <AlertCircle size={18} className="a-alert-icon" />
                        <div className="a-alert-content">
                            <h4>There was a problem</h4>
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={showForgotPassword ? handleForgotPassword : handleSubmit} className="a-auth-form">
                    {showForgotPassword ? (
                        <div className="a-forgot-password-stack">
                            {forgotStep === 1 ? (
                                <div className="a-input-row">
                                    <label htmlFor="forgot-email">Email Address</label>
                                    <input
                                        id="forgot-email"
                                        type="email"
                                        placeholder="Enter registered email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                            ) : forgotStep === 2 ? (
                                <div className="otp-box-standard">
                                    <label htmlFor="forgot-otp">Enter Verification Code</label>
                                    <div className="a-verify-group">
                                        <input
                                            id="forgot-otp"
                                            type="text"
                                            placeholder="000000"
                                            maxLength="6"
                                            value={formData.otp}
                                            onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                                            required
                                            style={{ letterSpacing: '4px', textAlign: 'center' }}
                                        />
                                        <button type="button" onClick={handleVerifyResetOtp} disabled={isVerifying || timeLeft <= 0} className="a-button-verify-inline">
                                            {isVerifying ? '...' : 'Validate'}
                                        </button>
                                    </div>

                                    <div className="timer-resend-row">
                                        <span className="timer" style={{ color: timeLeft <= 10 ? '#c40000' : '#0a2e1f' }}>
                                            {timeLeft > 0 ? `${timeLeft}s remaining` : 'Code expired'}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={handleResendForgotPassword}
                                            className="resend-btn"
                                        >
                                            Resend OTP?
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="a-input-row">
                                    <label htmlFor="forgot-password-new">New Password</label>
                                    <div className="a-password-input-wrapper">
                                        <input
                                            id="forgot-password-new"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="At least 6 characters"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="a-password-toggle-btn"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {forgotStep !== 2 && (
                                <button type="submit" disabled={isVerifying} className="a-button-primary">
                                    {isVerifying ? 'Processing...' : (forgotStep === 1 ? 'Send Reset Code' : 'Reset Password')}
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={() => { setShowForgotPassword(false); setForgotStep(1); setIsForgotVerified(false); setError(''); }}
                                style={{ width: '100%', background: 'none', border: 'none', color: '#0066c0', marginTop: '15px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                            >
                                Back to Sign In
                            </button>
                        </div>
                    ) : (
                        isLogin ? (
                            <>
                                <div className="a-input-row">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="a-input-row">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <label htmlFor="password">Password</label>
                                        <button
                                            type="button"
                                            onClick={() => setShowForgotPassword(true)}
                                            style={{ background: 'none', border: 'none', color: '#0066c0', fontSize: '12px', cursor: 'pointer', padding: 0 }}
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    <div className="a-password-input-wrapper">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="a-password-toggle-btn"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="a-remember-row">
                                    <input
                                        type="checkbox" id="remember"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <label htmlFor="remember">Keep me signed in</label>
                                </div>
                                <button type="submit" disabled={isVerifying} className="a-button-primary">
                                    {isVerifying ? 'Processing...' : 'Sign In'}
                                </button>
                            </>
                        ) : (
                            <div className="a-registration-form-stack">
                                <div className="a-input-row">
                                    <label htmlFor="name">Your name</label>
                                    <input id="name" type="text" placeholder="First and last name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                                </div>

                                <div className="a-input-row">
                                    <label htmlFor="email-reg">Email Address</label>
                                    <div className="a-verify-group">
                                        <input
                                            id="email-reg"
                                            type="email"
                                            placeholder="Enter email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            disabled={isEmailVerified}
                                            required
                                        />
                                        {!isEmailVerified && !isOtpMode && (
                                            <button
                                                type="button"
                                                onClick={handleSendRegisterOtp}
                                                disabled={isVerifying || !formData.email}
                                                className="a-button-verify-inline"
                                            >
                                                Verify
                                            </button>
                                        )}
                                        {isEmailVerified && (
                                            <span className="a-verified-badge">
                                                ✓ Verified
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {isOtpMode && !isEmailVerified && (
                                    <div className="otp-box-standard">
                                        <label>Enter Verification Code</label>
                                        <div className="a-verify-group">
                                            <input type="text" placeholder="000000" maxLength="6" value={formData.otp} onChange={e => setFormData({ ...formData, otp: e.target.value })} />
                                            <button type="button" onClick={handleVerifyRegisterOtp} disabled={isVerifying || timeLeft <= 0} className="a-button-verify-inline">Validate</button>
                                        </div>
                                        <div className="timer-resend-row">
                                            <span className="timer" style={{ color: timeLeft <= 10 ? '#c40000' : '#0a2e1f' }}>
                                                {timeLeft > 0 ? `${timeLeft}s` : 'Expired'}
                                            </span>
                                            <button type="button" onClick={handleSendRegisterOtp} className="resend-btn">Resend OTP?</button>
                                        </div>
                                    </div>
                                )}

                                <div className="a-input-row">
                                    <label htmlFor="phone">Mobile phone number</label>
                                    <input id="phone" type="tel" placeholder="10-digit number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                                </div>

                                <div className="a-input-row">
                                    <label htmlFor="password-reg">Password</label>
                                    <div className="a-password-input-wrapper">
                                        <input id="password-reg" type={showPassword ? "text" : "password"} placeholder="At least 6 characters" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                                        <button type="button" className="a-password-toggle-btn" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                                    </div>
                                </div>

                                <button type="submit" disabled={isVerifying || !isEmailVerified} className="a-button-primary" style={{ marginTop: '10px' }}>
                                    {isVerifying ? 'Processing...' : 'Create Account'}
                                </button>
                            </div>
                        )
                    )}
                </form>

                <div className="a-auth-card-footer">
                    <p className="a-auth-legal">By continuing, you agree to Venthulir's <span>Conditions of Use</span> and <span>Privacy Notice</span>.</p>

                    <div className="a-auth-help-section">
                        <div className="a-help-trigger" onClick={() => setIsHelpOpen(!isHelpOpen)}>
                            {isHelpOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            <span>Need help?</span>
                        </div>
                        {isHelpOpen && (
                            <div className="a-help-dropdown">
                                <span onClick={() => { setShowForgotPassword(true); setIsHelpOpen(false); }} style={{ cursor: 'pointer' }}>Forgot Password</span>
                                <a href="#issues">Other issues with Sign-In</a>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="a-auth-outer-footer">
                {isLogin && !showForgotPassword && (
                    <>
                        <div className="a-auth-divider"><h5>New to Venthulir?</h5></div>
                        <button type="button" className="a-button-secondary" onClick={() => handleToggleMode(false)}>Create your Venthulir account</button>
                    </>
                )}

                {!isLogin && !showForgotPassword && (
                    <div className="a-auth-switch-link">
                        Already have an account? <span onClick={() => handleToggleMode(true)}>Sign in <ChevronRight size={12} /></span>
                    </div>
                )}

                <button className="a-back-home-button" onClick={onClose}>CANCEL AND RETURN TO HOME</button>
            </div>
        </div>
    );
};

export default AuthModal;