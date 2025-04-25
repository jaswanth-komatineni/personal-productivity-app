import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function CalendarView() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [taskInput, setTaskInput] = useState('');
  const [taskTime, setTaskTime] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('tasks');
    if (stored) {
      const parsed = JSON.parse(stored);
      const dueTasks = parsed
        .filter((task) => task.due)
        .map((task) => ({
          title: task.text,
          date: task.due,
          color: task.completed ? 'green' : 'red',
        }));
      setEvents(dueTasks);
    }
  }, []);

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setIsModalOpen(true);
  };

  const handleAddTask = () => {
    if (taskInput.trim() !== '') {
      const newDue = selectedDate + (taskTime ? `/T/${taskTime}` : '');
      const newTask = {
        text: taskInput,
        due: newDue,
        completed: false,
      };
      const updatedTasks = [...(JSON.parse(localStorage.getItem('tasks')) || []), newTask];
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setEvents([...events, { title: taskInput, date: selectedDate, color: 'red' }]);
      setIsModalOpen(false);
      setTaskInput('');
      setTaskTime('');
    }
  };

  return (
    <div
      style={{
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: '#e0f7ff',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
        position: 'relative',
      }}
    >
      {/* Blur overlay */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.2)',
          backdropFilter: 'blur(4px)',
          zIndex: 99,
        }} />
      )}

      <h2>📅 Calendar View</h2>

      <div
        style={{
          maxWidth: '900px',
          margin: '2rem auto',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '1rem',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          zIndex: 1,
          position: 'relative'
        }}
      >
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={handleDateClick}
          height="auto"
        />
      </div>

      {/* Bottom Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.3)',   // background becomes dark and slightly blurred
            backdropFilter: 'blur(5px)',          // << ✅ blur only the background
            zIndex: 99,
          },
          content: {
            position: 'fixed',
            bottom: '0',
            left: '0',
            right: '0',
            height: 'auto',
            minHeight: '250px',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            background: '#ffffff',                // popup background is clear white
            padding: '2rem',
            boxShadow: '0 -4px 12px rgba(0,0,0,0.2)',
            zIndex: 100,
            overflow: 'auto',
          }
        }}
      >

        <h2 style={{ marginBottom: '1rem' }}>➕ Add New Task</h2>

        <input
          type="text"
          placeholder="Task Name"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          style={{
            width: '100%',
            padding: '0.7rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
          }}
        />

        <input
          type="time"
          value={taskTime}
          onChange={(e) => setTaskTime(e.target.value)}
          style={{
            width: '100%',
            padding: '0.7rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={() => setIsModalOpen(false)}
            style={{
              flex: 1,
              marginRight: '0.5rem',
              padding: '0.7rem',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: '#ccc',
              color: '#222',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleAddTask}
            style={{
              flex: 1,
              marginLeft: '0.5rem',
              padding: '0.7rem',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: '#4caf50',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Add Task
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default CalendarView;
