import React, { useState } from 'react';
import Login from './components/Login';
import Chat from './components/Chat';

export default function App() {
  const [auth, setAuthState] = useState(() => {
    try {
      const raw = localStorage.getItem('auth');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  function setAuth(payload) {
    let next = null;
    if (!payload) next = null;
    else if (typeof payload === 'string') next = { username: payload, token: null };
    else next = payload;
    setAuthState(next);
    if (next) localStorage.setItem('auth', JSON.stringify(next));
    else localStorage.removeItem('auth');
  }

  function handleLogout() {
    setAuth(null);
  }

  return auth
    ? <Chat username={auth.username} token={auth.token} onLogout={handleLogout} />
    : <Login onLogin={setAuth} />;
}
