function Sidebar() {
    // "*" is just a Placeholder for the Icons
    const nav =[["Dashboard","*"], ["Mentions","*"],["Sentiment","*"],["Alerts","*"],["Reports","*"],["Settings","*"],["Logs","*"]];
    
    return(
        <aside className="sidebar">
             <div className="brand">
                <div className="brand-mark">☁</div>
                <div>Social Sentiment<br/>Monitor</div>
            </div>
            {/* <nav>{nav.map(([name,icon])=><button key={name} className={`nav-item ${active===name?"active":""}`} onClick={()=>setActive(name)}><Icon>{icon}</Icon><span>{name}</span></button>)}</nav> */}
        </aside>
    )
}

export default Sidebar