import { useEffect, useState, useMemo } from "react";
import React from 'react';
import { supabase } from "../supabaseClient";
import { LuMail, LuMenu, LuX } from "react-icons/lu";
import { FaMessage } from "react-icons/fa6";
import { MdSentimentSatisfied, MdSentimentDissatisfied } from "react-icons/md";
import {LuCloud, LuLayoutDashboard, LuFolderKanban, LuChartPie,LuFileText, LuBell, LuSettings, LuClipboardList,LuLogOut} from "react-icons/lu";

// Pie chart component
function Donut({ summary }) {
    const total = summary.total || 1;
    const p = Math.round((summary.positive / total) * 100);
    const n = Math.round((summary.negative / total) * 100);
    const neu = Math.round((summary.neutral / total) * 100);

    return (
        <div className="donut-wrap">
            <div
                className="donut"
                style={{ background: `conic-gradient(#21b866 0 ${p}%, #ef3434 ${p}% ${p + n}%, #f5a20a ${p + n}% 100%)` }}
            >
                <div className="donut-hole">{p}%</div>
            </div>
            <div className="legend">
                <div><i className="dot positive" /><span>Positive</span><b>{summary.positive} ({p}%)</b></div>
                <div><i className="dot negative" /><span>Negative</span><b>{summary.negative} ({n}%)</b></div>
                <div><i className="dot neutral" /><span>Neutral</span><b>{summary.neutral} ({neu}%)</b></div>
            </div>
        </div>
    );
}

function Trend({ mentions = [] }) {
    const days = useMemo(() => {
        const now = new Date();
        return Array.from({ length: 7 }, (_, index) => {
            const date = new Date(now);
            date.setDate(now.getDate() - (6 - index));
            const key = date.toISOString().slice(0, 10);

            const list = (mentions || []).filter(
                m => String(m.created_at || m.createdAt || "").slice(0, 10) === key
            );

            return {
                label: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
                positive: list.filter(m => m.sentiment?.toLowerCase() === "positive").length,
                negative: list.filter(m => m.sentiment?.toLowerCase() === "negative").length,
                neutral: list.filter(m => m.sentiment?.toLowerCase() === "neutral").length
            };
        });
    }, [mentions]);

    const max = Math.max(5, ...days.flatMap(d => [d.positive, d.negative, d.neutral]));

    const width = 620, height = 210;
    const x = i => 25 + i * ((width - 50) / (days.length - 1));
    const y = v => 175 - (v / max) * 145;

    const path = k => days.map((d, i) => `${i ? "L" : "M"} ${x(i)} ${y(d[k])}`).join(" ");

    return (
        <div className="trend">
            <svg viewBox={`0 0 ${width} ${height}`}>
                {[0, .25, .5, .75, 1].map((v, i) => (
                    <line
                        key={i}
                        x1="25"
                        x2="600"
                        y1={175 - v * 145}
                        y2={175 - v * 145}
                        className="gridline"
                    />
                ))}

                <path d={path("positive")} className="line positive-line" />
                <path d={path("negative")} className="line negative-line" />
                <path d={path("neutral")} className="line neutral-line" />

                {days.map((d, i) => (
                    <g key={d.label}>
                        <circle cx={x(i)} cy={y(d.positive)} r="4" className="point positive-fill" />
                        <circle cx={x(i)} cy={y(d.negative)} r="4" className="point negative-fill" />
                        <circle cx={x(i)} cy={y(d.neutral)} r="3" className="point neutral-fill" />
                        <text x={x(i)} y="202" textAnchor="middle" className="axis">{d.label}</text>
                    </g>
                ))}
            </svg>
        </div>
    );
}

function Icon({ children }) { return <span className="icon">{children}</span>; }

export default function Dashboard({ session }) {
    const [mentions, setMentions] = useState([]);
    const [active, setActive] = useState("Dashboard");
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);

    const [showSignOutModal, setShowSignOutModal] = useState(false);

    const fetchMentions = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("sentiment_logs")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error && data) {
            setMentions(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMentions();
    }, []);

    const summary = useMemo(() => {
        const pos = mentions.filter(m => m.sentiment?.toLowerCase() === "positive").length;
        const neg = mentions.filter(m => m.sentiment?.toLowerCase() === "negative").length;
        const neu = mentions.filter(m => m.sentiment?.toLowerCase() === "neutral").length;
        const total = mentions.length || 1;

        return {
            total: mentions.length,
            positive: pos,
            negative: neg,
            neutral: neu,
            percentages: {
                positive: Math.round((pos / total) * 100),
                negative: Math.round((neg / total) * 100),
                neutral: Math.round((neu / total) * 100),
            }
        };
    }, [mentions]);

    const filtered = mentions.filter(m => {
        const textToSearch = m.content || m.text || "";
        const matchesFilter = filter === "All" || m.sentiment?.toLowerCase() === filter.toLowerCase();
        const matchesSearch = textToSearch.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleSignOut = () => supabase.auth.signOut();
    const nav = [["Dashboard", <LuLayoutDashboard />], ["Mentions", <LuFolderKanban />], ["Sentiment", <LuChartPie />], ["Alerts", <LuBell />], ["Reports", <LuFileText />], ["Settings", <LuSettings />], ["Logs", <LuClipboardList />], ["SignOut", <LuLogOut />]];

    const handleNavClick = (name) => {
        setMenuOpen(false);
        if (name === "SignOut") {
            setShowSignOutModal(true);
        } else {
            setActive(name);
        }
    };

    return (
        <div className="app">
            {menuOpen && <div className="sidebar-overlay" onClick={() => setMenuOpen(false)} />}

            <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
                <div className="brand">
                    <div className="brand-mark"><LuCloud size={24} /></div>
                    <div>Social Sentiment<br />Monitor</div>
                </div>
                <nav>
                    {nav.map(([name, icon]) => (
                        <button
                            key={name}
                            onClick={() => handleNavClick(name)}
                            className={`nav-item ${active === name ? "active" : ""}`}
                        >
                            <Icon>{icon}</Icon>
                            <span>{name}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            <main className="main">
                <header className="topbar">
                    <div className="title-row">
                        <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)}>
                            {menuOpen ? <LuX size={24} /> : <LuMenu size={24} />}
                        </button>
                        <h1>{active}</h1>
                    </div>
                    <div className="top-actions">
                        <div className="gmail">
                            <LuMail style={{ marginRight: "8px" }} />
                            <div><span style={{ marginRight: "15px", color: "#64748b" }}>{session?.user?.email}</span></div>
                        </div>
                    </div>
                </header>

                <section className="content">
                    <div className="intro">
                        
                        <div>
                            <strong>{session?.user?.email}</strong>
                            <p>Monitor social media comments and automatically classify sentiment.</p>
                        </div>
                        <div className="actions">
                            <button className="secondary" onClick={fetchMentions}>↻ Scan now</button>
                            <button className="primary">✉ Send report</button>
                        </div>
                    </div>

                    <div className="cards">
                        <div className="stat-card">
                            <div className="stat-icon blue"><FaMessage size={20} /></div>
                            <div><span>Total Mentions</span><small>{summary.total} stored</small></div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon green"><MdSentimentSatisfied size={20} /></div>
                            <div><span>Positive</span><small>{summary.positive} mentions</small></div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon red"><MdSentimentDissatisfied size={20} /></div>
                            <div><span>Negative</span><small>{summary.negative} mentions</small></div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon orange">―</div>
                            <div><span>Neutral</span><small>{summary.neutral} mentions</small></div>
                        </div>
                    </div>

                    <div className="grid-two">
                        <section className="panel">
                            <div className="panel-header"><h3>Sentiment Overview</h3></div>
                            <Donut summary={summary} />
                        </section>
                        <section className="panel">
                            <div className="panel-header">
                                <h3>Sentiment Trend <small>(Last 7 Days)</small></h3>
                                <div className="chart-legend">
                                    <span><i className="dot positive" />Positive</span>
                                    <span><i className="dot negative" />Negative</span>
                                    <span><i className="dot neutral" />Neutral</span>
                                </div>
                            </div>
                            <Trend mentions={mentions} />
                        </section>
                    </div>

                    <div className="grid-bottom">
                        <section className="panel mentions-panel">
                            <div className="panel-header mention-head">
                                <h3>Recent Mentions</h3>
                                <div className="filters">
                                    {["All", "Positive", "Negative", "Neutral"].map(f => (
                                        <button
                                            key={f}
                                            className={`filter ${filter === f ? "active" : ""}`}
                                            onClick={() => setFilter(f)}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="search-row">
                                <input
                                    placeholder="Search mentions..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="mention-list">
                                {loading ? (
                                    <p style={{ padding: "20px", color: "#64748b" }}>Loading mentions...</p>
                                ) : filtered.length === 0 ? (
                                    <p style={{ padding: "20px", color: "#64748b" }}>No mentions found.</p>
                                ) : (
                                    filtered.map(m => (
                                        <div className="mention" key={m.id}>
                                            <div className={`platform ${m.platform?.toLowerCase()}`}>
                                                {m.platform === "Facebook" ? "f" : m.platform === "TikTok" ? "♪" : "𝕏"}
                                            </div>
                                            <p>{m.content || m.text}</p>
                                            <span className={`pill ${m.sentiment?.toLowerCase()}`}>{m.sentiment}</span>
                                            <time>
                                                {new Date(m.created_at || m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            </time>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>
                </section>
            </main>

            {showSignOutModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        background: "#ffffff",
                        padding: "24px",
                        borderRadius: "12px",
                        width: "320px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                        textAlign: "center",
                        fontFamily: "sans-serif"
                    }}>
                        <h3 style={{ margin: "0 0 10px 0", color: "#0f172a", fontSize: "18px" }}>Sign Out</h3>
                        <p style={{ margin: "0 0 20px 0", color: "#64748b", fontSize: "14px" }}>
                            Are you sure you want to sign out of your account?
                        </p>
                        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                            <button
                                onClick={() => setShowSignOutModal(false)}
                                style={{
                                    flex: 1,
                                    padding: "10px 16px",
                                    border: "1px solid #cbd5e1",
                                    borderRadius: "6px",
                                    background: "#ffffff",
                                    color: "#334155",
                                    fontWeight: "600",
                                    cursor: "pointer"
                                }}
                            >
                                No
                            </button>
                            <button
                                onClick={handleSignOut}
                                style={{
                                    flex: 1,
                                    padding: "10px 16px",
                                    border: "none",
                                    borderRadius: "6px",
                                    background: "#ef4444",
                                    color: "#ffffff",
                                    fontWeight: "600",
                                    cursor: "pointer"
                                }}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
