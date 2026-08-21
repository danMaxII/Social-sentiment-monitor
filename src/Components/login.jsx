import { useState } from "react";
import { supabase } from "../supabaseClient";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { LuCloud } from "react-icons/lu";
import "./login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otpToken, setOtpToken] = useState("");
    const [isSignup, setIsSignup] = useState(false);
    const [awaitingOTP, setAwaitingOTP] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        if (isSignup) {
            // Attempt Sign Up
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                setMessage({ type: "error", text: error.message });
            } else if (data?.user && data?.session) {
                // Email was auto-confirmed by Supabase
                setMessage({ type: "success", text: "Signed up and logged in successfully!" });
            } else {
                // Email confirmation required -> Show OTP Input
                setMessage({ type: "success", text: "OTP code sent to your email!" });
                setAwaitingOTP(true);
            }
        } else {
            // Password Sign In
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setMessage({ type: "error", text: error.message });
            }
        }
        setLoading(false);
    };

    // Verify OTP Code
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        const { error } = await supabase.auth.verifyOtp({
            email,
            token: otpToken.trim(),
            type: "signup",
        });

        if (error) {
            setMessage({ type: "error", text: error.message });
        } else {
            setMessage({ type: "success", text: "Email verified successfully!" });
        }
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        setMessage({ type: "", text: "" });
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: window.location.origin },
        });
        if (error) setMessage({ type: "error", text: error.message });
    };

    const handleGithubLogin = async () => {
        setMessage({ type: "", text: "" });
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "github",
            options: { redirectTo: window.location.origin },
        });
        if (error) setMessage({ type: "error", text: error.message });
    };

    const toggleAuthMode = () => {
        setIsSignup(!isSignup);
        setAwaitingOTP(false);
        setMessage({ type: "", text: "" });
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="logo">
                    <div className="brand-mark"><LuCloud size={24} color="white" /></div>
                </div>

                <h1>Social Sentiment Monitor</h1>

                <p className="login-description">
                    Monitor what people are saying about your organization across social media.
                </p>

                {message.text && (
                    <div style={{
                        color: message.type === "error" ? "#ef4444" : "#16a34a",
                        fontSize: "14px",
                        marginBottom: "15px",
                        textAlign: "center"
                    }}>
                        {message.text}
                    </div>
                )}

                <button
                    className="social-button google"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                >
                    <FcGoogle style={{ marginRight: "8px" }} />
                    Continue with Google
                </button>

                <button
                    className="social-button github"
                    onClick={handleGithubLogin}
                    disabled={loading}
                >
                    <FaGithub style={{ marginRight: "8px" }} />
                    Continue with GitHub
                </button>

                <div className="divider">
                    <span>OR</span>
                </div>

                {!awaitingOTP ? (
                    <form onSubmit={handleEmailLogin}>
                        <label>Email address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <button type="submit" className="login-button" disabled={loading}>
                            {loading ? "Processing..." : isSignup ? "Send OTP Code" : "Sign In"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOTP}>
                        <label>Enter OTP Code</label>
                        <input
                            type="text"
                            placeholder="Enter code"
                            value={otpToken}
                            onChange={(e) => setOtpToken(e.target.value)}
                            required
                        />

                        <button type="submit" className="login-button" disabled={loading}>
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </form>
                )}

                <p style={{ textAlign: "center", fontSize: "13px", marginTop: "18px", color: "#6b7280" }}>
                    {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                    <span
                        onClick={toggleAuthMode}
                        style={{ color: "#2563eb", cursor: "pointer", fontWeight: "600" }}
                    >
                        {isSignup ? "Sign In" : "Sign Up"}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Login;
