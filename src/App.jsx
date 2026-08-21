import {useEffect, useState} from "react";
import { supabase } from "./supabaseClient";
import Login from "./Components/login.jsx";
import Dashboard from "./Frontend/Dashboard.jsx";

function App() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const { data: {subscription} } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return <div style={{display: "flex", justifyContent: "center", height: "100vh"}}>Loading...</div>;
    }


    return (
       <div>
       {!session ? <Login /> : <Dashboard session={session}/>}
       </div>
    )
}

export default App