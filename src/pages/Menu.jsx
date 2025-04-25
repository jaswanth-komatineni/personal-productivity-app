import React, { useState } from 'react';

function Menu({ toggleTheme, theme }) {
  const storageUsed = calculateStorageUsed();

  const [backgroundStyle, setBackgroundStyle] = useState('gradient1');
  const [appTitle, setAppTitle] = useState('Personal Productivity App');
  const [showAdvanced, setShowAdvanced] = useState(false);

  function calculateStorageUsed() {
    let total = 0;
    for (let x in localStorage) {
      if (localStorage.hasOwnProperty(x)) {
        total += (localStorage[x].length * 2);
      }
    }
    return (total / 1024).toFixed(2); // KB
  }

  const exportTasks = () => {
    const tasks = localStorage.getItem('tasks');
    const blob = new Blob([tasks], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tasks_backup.json';
    link.click();
  };

  const importTasks = (e) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      try {
        const importedTasks = JSON.parse(event.target.result);
        localStorage.setItem('tasks', JSON.stringify(importedTasks));
        alert('Tasks imported successfully!');
        window.location.reload();
      } catch (error) {
        alert('Invalid file!');
      }
    };
    fileReader.readAsText(e.target.files[0]);
  };

  const clearTasks = () => {
    if (window.confirm('Are you sure you want to delete ALL tasks and settings?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const changeBackground = (style) => {
    setBackgroundStyle(style);
    localStorage.setItem('backgroundStyle', style);
  };

  const handleTitleChange = () => {
    const newTitle = prompt('Enter new app title:', appTitle);
    if (newTitle) {
      setAppTitle(newTitle);
      document.title = newTitle;
    }
  };

  return (
    <div style={{
      padding: '2rem',
      minHeight: '100vh',
      background: backgroundStyle === 'gradient1'
        ? 'linear-gradient(to bottom right, #e0eafc, #cfdef3)'
        : 'linear-gradient(to bottom right, #fbc2eb, #a6c1ee)',
      fontFamily: 'Poppins, Arial, sans-serif',
      color: theme === 'dark' ? '#f0f0f0' : '#333'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>⚙️ App Settings</h2>

      {/* Appearance */}
      <div style={card}>
        <h3>🎨 Appearance</h3>
        <button onClick={toggleTheme} style={button}>
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
        <div style={{ marginTop: '1rem' }}>
          <p>Background:</p>
          <button onClick={() => changeBackground('gradient1')} style={miniButton}>🌈 Soft Blue</button>
          <button onClick={() => changeBackground('gradient2')} style={miniButton}>🎨 Pink-Blue</button>
        </div>
      </div>

      {/* Backup and Restore */}
      <div style={card}>
        <h3>💾 Backup & Restore</h3>
        <button onClick={exportTasks} style={button}>⬇️ Export Tasks</button>
        <label style={{ ...button, backgroundColor: '#4caf50', cursor: 'pointer' }}>
          ⬆️ Import Tasks
          <input type="file" accept=".json" onChange={importTasks} style={{ display: 'none' }} />
        </label>
      </div>

      {/* Storage and App Info */}
      <div style={card}>
        <h3>📊 App Info</h3>
        <p><strong>Storage Used:</strong> {storageUsed} KB</p>
        <p><strong>Version:</strong> 1.0.0</p>
        <p><strong>Last Updated:</strong> April 2025</p>
      </div>

      {/* Quick Actions */}
      <div style={card}>
        <h3>⚡ Quick Actions</h3>
        <button onClick={clearTasks} style={{ ...button, backgroundColor: '#f44336' }}>🗑️ Factory Reset</button>
      </div>

      {/* Optional Advanced */}
      <div style={card}>
        <h3>🛠️ Advanced Settings</h3>
        <button onClick={() => setShowAdvanced(!showAdvanced)} style={button}>
          {showAdvanced ? '🔽 Hide' : '▶️ Show'} Advanced
        </button>
        {showAdvanced && (
          <div style={{ marginTop: '1rem' }}>
            <button onClick={handleTitleChange} style={{ ...button, backgroundColor: '#6a1b9a' }}>✍️ Change App Title</button>
            <p style={{ marginTop: '0.5rem' }}>Current Title: {appTitle}</p>
          </div>
        )}
      </div>

      {/* About and Credits */}
      <div style={card}>
        <h3>📜 About & Credits</h3>
        <p>This app is made for personal productivity without cloud sync.</p>
        <p>Icons by Flaticon. Developed by Jaswanth 🚀</p>
      </div>
    </div>
  );
}

const card = {
  background: '#ffffff',
  borderRadius: '10px',
  padding: '1.5rem',
  marginBottom: '2rem',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
};

const button = {
  marginTop: '0.5rem',
  marginRight: '0.5rem',
  padding: '0.6rem 1.2rem',
  borderRadius: '8px',
  border: 'none',
  fontWeight: 'bold',
  cursor: 'pointer',
  backgroundColor: '#4a90e2',
  color: 'white',
};

const miniButton = {
  marginTop: '0.3rem',
  marginRight: '0.5rem',
  padding: '0.4rem 1rem',
  borderRadius: '6px',
  border: 'none',
  fontSize: '0.8rem',
  backgroundColor: '#90caf9',
  color: '#333',
  cursor: 'pointer'
};

export default Menu;
