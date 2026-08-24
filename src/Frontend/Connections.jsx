import React, { useState, useEffect } from "react";
import "../Components/SocialCard.jsx";
import { FaFacebook, FaTwitter, FaTiktok, FaInstagram, FaLinkedin, FaPinterest } from "react-icons/fa";

function Connections() {
    const [connections, setConnections] = useState([]);

    const socialPlatforms = [
        { id: 'tw', name: 'Twitter', icon: FaTwitter, count: 3 },
        { id: 'fb', name: 'Facebook', icon: FaFacebook, count: 1 },
        { id: 'ig', name: 'Instagram', icon: FaInstagram, count: 0 },
    ];

    return (
        <div className="connections">
            <main>
                <div><h4>Connect your social media accounts and platforms to start monitoring</h4></div>

                <div className="cardContainer">

                    {socialPlatforms.map((platform) => (
                        <SocialCard
                            key={platform.id}
                            name={platform.name}
                            Icon={platform.icon}
                            connectedCount={platform.count}
                        />
                    ))}

                    <div className="socialCard">
                        <div className="socialCardHeader">
                            <FaTwitter size={32} color="#1DA1F2" />
                            <h2 className="socialName">X (Twitter)</h2>
                        </div>
                        <span>3 connected</span>
                        <button className="primary" style={{ backgroundColor: "#0b1930" }}>manage</button>
                    </div>
                    <div className="socialCard">
                        <div className="socialCardHeader">
                            <FaTiktok size={32} color="#000000" />
                            <h2 className="socialName">TikTok</h2>
                        </div>
                        <span>3 connected</span>
                        <button className="primary" style={{ backgroundColor: "#0b1930" }}>manage</button>
                    </div>
                    <div className="socialCard">
                        <div className="socialCardHeader">
                            <FaInstagram size={32} color="#E1306C" />
                            <h2 className="socialName">Instagram</h2>
                        </div>
                        <span>3 connected</span>
                        <button className="primary" style={{ backgroundColor: "#0b1930" }}>manage</button>
                    </div>
                    <div className="socialCard">
                        <div className="socialCardHeader">
                            <FaLinkedin size={32} color="#0077B5" />
                            <h2 className="socialName">LinkedIn</h2>
                        </div>
                        <span>3 connected</span>
                        <button className="primary" style={{ backgroundColor: "#0b1930" }}>manage</button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Connections;
