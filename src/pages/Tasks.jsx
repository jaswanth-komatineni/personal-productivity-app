import React, { useState, useEffect } from 'react';

function Tasks() {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem('tasks');
    return stored ? JSON.parse(stored) : [];
  });

  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.trim() === '') return;
    setTasks([
      ...tasks,
      {
        text: newTask,
        due: dueDate,
        completed: false,
      },
    ]);
    setNewTask('');
    setDueDate('');
  };

  const toggleComplete = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  const handleDelete = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  const today = new Date().toISOString().split('T')[0];

  const filteredTasks = tasks.filter((task) => {
    const matchSearch = task.text.toLowerCase().includes(searchText.toLowerCase());
    const isOverdue = task.due && !task.completed && task.due < today;

    if (!matchSearch) return false;
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed && !isOverdue;
    if (filter === 'overdue') return isOverdue;
    return true;
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #e0f7ff, #ffffff)',  // Light clean gradient
      padding: '2rem',
      fontFamily: 'Poppins, Arial, sans-serif',
      textAlign: 'center',
    }}>
      <h2 style={{ marginBottom: '1.5rem' }}>📝 Your Task List</h2>

      <div style={{ marginBottom: '2rem' }}>
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a task..."
          style={inputStyle}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{ ...inputStyle, marginLeft: '1rem' }}
        />
        <button onClick={handleAddTask} style={addButtonStyle}>
          ➕ Add
        </button>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="🔍 Search tasks..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ ...inputStyle, width: '250px' }}
        />
      </div>

      <div style={{ marginBottom: '2rem' }}>
        {['all', 'pending', 'completed', 'overdue'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            style={{
              ...filterButtonStyle,
              backgroundColor: filter === type ? '#4a90e2' : '#ccc',
              color: filter === type ? '#fff' : '#333',
            }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredTasks.length === 0 ? (
          <p style={{ color: '#666' }}>No tasks found...</p>
        ) : (
          filteredTasks.map((task, index) => {
            const isOverdue =
              task.due &&
              !task.completed &&
              new Date(task.due) < new Date(new Date().toDateString());

            return (
              <li key={index} style={{
                ...taskCardStyle,
                backgroundColor: task.completed ? '#d4edda' : isOverdue ? '#f8d7da' : '#ffffff',
                transition: '0.3s',
              }}>
                <span
                  onClick={() => toggleComplete(index)}
                  style={{
                    cursor: 'pointer',
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed
                      ? 'gray'
                      : isOverdue
                      ? 'red'
                      : 'black',
                    fontWeight: 'bold',
                  }}
                >
                  {task.text} {task.due && `📅 (${task.due})`}
                </span>
                <button
                  onClick={() => handleDelete(index)}
                  style={deleteButtonStyle}
                >
                  ❌
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

// Styling
const inputStyle = {
  padding: '0.6rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
};

const addButtonStyle = {
  marginLeft: '1rem',
  padding: '0.6rem 1.2rem',
  borderRadius: '6px',
  border: 'none',
  backgroundColor: '#4caf50',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const filterButtonStyle = {
  margin: '0.4rem',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  border: 'none',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const taskCardStyle = {
  marginBottom: '1rem',
  padding: '1rem',
  borderRadius: '8px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const deleteButtonStyle = {
  marginLeft: '1rem',
  border: 'none',
  backgroundColor: 'transparent',
  fontSize: '1.2rem',
  cursor: 'pointer',
};

export default Tasks;
