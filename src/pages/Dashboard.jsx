import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('tasks');
    if (stored) {
      setTasks(JSON.parse(stored));
    }
  }, []);

  const completed = tasks.filter((t) => t.completed).length;
  const pending = tasks.filter((t) => !t.completed).length;
  const overdue = tasks.filter((t) => {
    if (!t.due || t.completed) return false;
    return new Date(t.due) < new Date(new Date().toDateString());
  }).length;

  const pieData = {
    labels: ['Completed', 'Pending', 'Overdue'],
    datasets: [
      {
        label: 'Tasks',
        data: [completed, pending, overdue],
        backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ['Completed', 'Pending', 'Overdue'],
    datasets: [
      {
        label: 'Number of Tasks',
        data: [completed, pending, overdue],
        backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
        borderRadius: 8,
      },
    ],
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '2rem',
        fontFamily: 'Poppins, Arial, sans-serif',
        background: 'linear-gradient(to bottom right, #e0f7ff, #ffffff)',
        textAlign: 'center',
        animation: 'fadeIn 1s ease-in',
      }}
    >
      <h2>📊 Productivity Dashboard</h2>

      <div
        style={{
          marginTop: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '2rem',
        }}
      >
        {/* Pie Chart Card */}
        <div
          style={{
            background: '#ffffff',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            width: '320px',
            height: '350px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <h4 style={{ marginBottom: '1rem' }}>Tasks Breakdown</h4>
          <div style={{ width: '250px', height: '250px' }}>
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Bar Chart Card */}
        <div
          style={{
            background: '#ffffff',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            width: '400px',
            height: '400px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <h4 style={{ marginBottom: '1rem' }}>Tasks Overview</h4>
          <div style={{ width: '300px', height: '250px' }}>
            <Bar data={barData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem', color: '#666' }}>
        <p>Total Tasks: {tasks.length}</p>
        <p>Completed: {completed} ✅</p>
        <p>Pending: {pending} 🕑</p>
        <p>Overdue: {overdue} ⚠️</p>
      </div>
    </div>
  );
}

export default Dashboard;
