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
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

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

  const handleAddTask = () => {
    if (newTask.trim() === '') return;
    setTasks([...tasks, { text: newTask, due: dueDate, completed: false }]);
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

  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  const handleVoiceCommand = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase().trim();
      console.log('🎤 Voice Command Received:', command);

      const allTasks = JSON.parse(localStorage.getItem('tasks')) || [];

      if (command.startsWith('add task')) {
        const text = command.replace('add task', '').trim();
        if (text) {
          const updated = [...allTasks, { text, due: '', completed: false }];
          localStorage.setItem('tasks', JSON.stringify(updated));
          setTasks(updated);
          speak(`Task added: ${text}`);
        }
      } else if (command.includes('mark task')) {
        const number = parseInt(command.replace(/\D/g, ''));
        const targetTask = allTasks[number - 1];
        if (!isNaN(number) && targetTask) {
          targetTask.completed = true;
          localStorage.setItem('tasks', JSON.stringify(allTasks));
          setTasks(allTasks);
          speak(`Marked task ${number} as completed.`);
        } else {
          speak("Couldn't find the task to mark as completed.");
        }
      } else if (command.includes('delete task')) {
        const number = parseInt(command.replace(/\D/g, ''));
        if (!isNaN(number)) {
          const updated = allTasks.filter((_, i) => i !== number - 1);
          localStorage.setItem('tasks', JSON.stringify(updated));
          setTasks(updated);
          speak(`Task ${number} deleted.`);
        } else {
          speak("Couldn't find the task to delete.");
        }
      } else {
        speak("Sorry, I didn't understand the command.");
      }
    };

    recognition.start();
  };

  return (
    <div style={{
      padding: '2rem',
      textAlign: 'center',
      backgroundColor: '#e0f7ff',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h2>📝 Task Manager</h2>

      <div style={{ marginBottom: '1.5rem' }}>
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a task..."
          style={{ padding: '0.5rem', borderRadius: '5px', width: '200px' }}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{ marginLeft: '1rem', padding: '0.5rem', borderRadius: '5px' }}
        />
        <button
          onClick={handleAddTask}
          style={{
            marginLeft: '1rem',
            padding: '0.6rem 1.2rem',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: '#4a90e2',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          ➕ Add Task
        </button>
        <div style={{ marginTop: '1rem' }}>
          <button
            onClick={handleVoiceCommand}
            style={{
              margin: '1rem auto',
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: isListening ? '#f44336' : '#4caf50',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            {isListening ? '🎙️ Listening...' : '🎤 Voice Command'}
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="🔍 Search tasks..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ padding: '0.5rem', width: '250px', borderRadius: '5px' }}
      />

      <div style={{ marginTop: '1rem' }}>
        {['all', 'pending', 'completed', 'overdue'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            style={{
              margin: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: '6px',
              backgroundColor: filter === type ? '#4a90e2' : '#ccc',
              color: filter === type ? 'white' : 'black',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <ul style={{ marginTop: '1rem', listStyle: 'none', padding: 0 }}>
        {filteredTasks.map((task, index) => {
          const isOverdue = task.due && !task.completed && task.due < today;
          return (
            <li
              key={index}
              style={{
                backgroundColor: '#fff',
                padding: '1rem',
                marginBottom: '0.8rem',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                maxWidth: '500px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              {editingIndex === index ? (
                <input
                  type="text"
                  value={editedText}
                  autoFocus
                  onChange={(e) => setEditedText(e.target.value)}
                  onBlur={() => {
                    if (editedText.trim() !== '') {
                      const updated = [...tasks];
                      updated[index].text = editedText;
                      setTasks(updated);
                    }
                    setEditingIndex(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (editedText.trim() !== '') {
                        const updated = [...tasks];
                        updated[index].text = editedText;
                        setTasks(updated);
                      }
                      setEditingIndex(null);
                    }
                  }}
                  style={{
                    width: '80%',
                    padding: '0.3rem',
                    fontSize: '1rem',
                    borderRadius: '4px',
                  }}
                />
              ) : (
                <span
                  onClick={() => {
                    setEditingIndex(index);
                    setEditedText(task.text);
                  }}
                  onDoubleClick={() => toggleComplete(index)}
                  style={{
                    cursor: 'pointer',
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? 'gray' : isOverdue ? 'red' : 'black',
                  }}
                >
                  <strong style={{ fontSize: '1.1rem' }}>{index + 1}.</strong> {task.text} {task.due && `📅 (${task.due})`}
                </span>
              )}
              <button
                onClick={() => handleDelete(index)}
                style={{
                  marginLeft: '1rem',
                  border: 'none',
                  background: 'transparent',
                  fontSize: '1rem',
                  cursor: 'pointer',
                }}
              >
                ❌
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Tasks;
