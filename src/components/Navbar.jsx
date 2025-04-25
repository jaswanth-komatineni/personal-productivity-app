import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={styles.navbar}>
      <ul style={styles.navList}>
        <li><Link to="/" style={styles.link}>🏠 Home</Link></li>
        <li><Link to="/tasks" style={styles.link}>📝 Tasks</Link></li>
        <li><Link to="/calendar" style={styles.link}>📅 Calendar</Link></li>
        <li><Link to="/dashboard" style={styles.link}>📊 Dashboard</Link></li>
        <li><Link to="/menu" style={styles.link}>⚙️ Menu</Link></li>
      </ul>
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: '#282c34',
    padding: '1rem',
  },
  navList: {
    display: 'flex',
    justifyContent: 'space-around',
    listStyleType: 'none',
    margin: 0,
    padding: 0,
  },
  link: {
    color: '#61dafb',
    textDecoration: 'none',
    fontSize: '1.1rem',
  },
};

export default Navbar;
