import { useEffect, useState } from 'react';
import Dashboard from './Dashboard.jsx';
import LoginScreen from './components/LoginScreen.jsx';
import { TOKEN_KEY, verifyToken } from './api.js';

export default function App() {
  const [authenticated, setAuthenticated] = useState(null); // null = checking, true = in, false = out

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setAuthenticated(false);
      return;
    }
    verifyToken(token)
      .then((d) => setAuthenticated(d.valid === true))
      .catch(() => setAuthenticated(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setAuthenticated(false);
  };

  if (authenticated === null) {
    return <div className="min-h-screen bg-[#F5F6FB]" />;
  }

  if (!authenticated) {
    return <LoginScreen onLogin={() => setAuthenticated(true)} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}
