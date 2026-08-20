import { useState } from "react";
import "./login.css"

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    const handleEmailLogin = (e) => {
        e.preventDefault();

        console.log("Email Connected", {
            email,
            password,
        });
    };

    const handleGoogleLogin = () => {
        console.log("Google Login");
    }
    const handleGithubLogin = () => {
        console.log("Github Login");
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="logo">
                    <div className="logo-icon">S</div>
                </div>

                <h1>Social Sentiment Monitor</h1>

                <p className="login-description">
                    Monitor what people are saying about your organization
                    across social media.
                </p>

                <button
                    className="social-button google"
                    onClick={handleGoogleLogin}
                >
                    <span className="social-icon">G</span>
                    Continue with Google
                </button>

                <button
                    className="social-button github"
                    onClick={handleGithubLogin}
                >
                    <span className="social-icon">●</span>
                    Continue with GitHub
                </button>

                <div className="divider">
                    <span>OR</span>
                </div>

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

                    <button
                        type="submit"
                        className="login-button"
                    >
                        Sign in
                    </button>

                </form>

                <p className="login-footer">
                    Authorized users only
                </p>
            </div>
        </div>
    );
}

export default Login