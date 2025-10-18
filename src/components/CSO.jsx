import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SGODashboard.css';

export default function SGODashboard() {
  const navigate = useNavigate();

  const addCSO = () => {
    navigate('/addCSO');
  };

  const back = () => {
    navigate('/SGO');
  };

  return (
    <main>
      <h1>Clubs, Societies, and Organizations</h1>
      <p>Modify, add, and delete CSOs.</p>
      <button onClick={addCSO}>Add CSO</button>
      <button onClick={back}>Back</button>
    </main>
  );
}
