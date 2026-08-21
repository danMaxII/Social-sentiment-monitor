import React, { useState, useEffect } from "react";

function Connections() {
    const [connections, setConnections] = useState([]);

    return (
        <div className="connections">
            <main>
                <div><h2>Connect your social media accounts and platforms to start monitoring</h2></div>

                <div className="cardContainer">
                    <div className="socialCard">
                        <div>
                            <h2 className="socialName">Facebook</h2>
                        </div>
                        <span>3 connected</span>
                        <button>manage</button>
                    </div>
                    <div className="socialCard">
                        <div><h2 className="socialName">X (Twitter)</h2></div>
                        <span>3 connected</span>
                        <button>manage</button>
                    </div>
                    <div className="socialCard">
                        <div><h2 className="socialName">TikTok</h2></div>
                        <span>3 connected</span>
                        <button>manage</button>
                    </div>
                    <div className="socialCard">
                        <div><h2 className="socialName">Instagram</h2></div>
                        <span>3 connected</span>
                        <button>manage</button>
                    </div>
                    <div className="socialCard">
                        <div><h2 className="socialName">LinkedIn</h2></div>
                        <span>3 connected</span>
                        <button>manage</button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Connections;
