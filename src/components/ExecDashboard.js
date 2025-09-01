import React from 'react';
import { useNavigate } from "react-router-dom";

export default function ExecDashboard() {
  const navigate = useNavigate();

  
  return (
    <main>
      <h1>Exec Member Dashboard</h1>

      <p>Welcome, executive member! Here you can oversee operations and review reports.</p>
      
      

     <button onClick={() => navigate("/exec-post")}>
        Click here to make a post
      </button>

      <p>
        Welcome, executive member! Here you can oversee operations and review
        reports.
      </p>

    </main>

    
  );
}
