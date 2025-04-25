import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  // Get today's date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',    // e.g., Monday
    month: 'long',      // e.g., April
    day: 'numeric',     // e.g., 25
    year: 'numeric',    // e.g., 2025
  });

  return (
    <div style={{
      padding: '2rem',
      textAlign: 'center',
      minHeight: '100vh',
      fontFamily: 'Poppins, Arial, sans-serif',
      background: 'linear-gradient(to bottom right, #c9d6ff, #e2e2e2)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ fontSize: '2.8rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        🚀 Boost Your Productivity
      </h1>

      {/* Show today's real date */}
      <p style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#666' }}>
        {formattedDate}
      </p>

      <p style={{ fontSize: '1.4rem', color: '#555', marginBottom: '2rem' }}>
        Focus. Finish. Fly.
      </p>

      <img
        src="https://cdn-icons-png.flaticon.com/512/1055/1055644.png"
        alt="Productivity Icon"
        style={{ width: '180px', marginBottom: '2rem' }}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
        <Link to="/tasks">
          <button style={buttonStyle}>📝 Tasks</button>
        </Link>
        <Link to="/calendar">
          <button style={buttonStyle}>📅 Calendar</button>
        </Link>
        <Link to="/dashboard">
          <button style={buttonStyle}>📊 Dashboard</button>
        </Link>
        <Link to="/menu">
          <button style={buttonStyle}>⚙️ Menu</button>
        </Link>
      </div>

      <p style={{ marginTop: '3rem', fontSize: '0.9rem', color: '#777' }}>
        Your data stays safe — only on your device. ✨
      </p>
    </div>
  );
}

const buttonStyle = {
  padding: '0.8rem 1.5rem',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: '#4a90e2',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

export default Home;
