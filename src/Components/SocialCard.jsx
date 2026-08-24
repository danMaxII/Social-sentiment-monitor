function SocialCard({ name, Icon, connectedCount }) {
    return (
        <div className="socialCard">
            <div className="socialCardHeader">
                <Icon size={32} />
                <h2 className="socialName">{name}</h2>
            </div>
            <span>{connectedCount} connected</span>
            <button className="primary" style={{ backgroundColor: "#0b1930" }}>manage</button>
        </div>
    )
}

export default SocialCard