import React, { useState } from 'react';

const SERVER = 'http:// 10.40.31.124:5000';

export default function Login({ onLogin }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    const username = name.trim();
    if (!username || !password) {
      setError('Wypełnij pola');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${SERVER}/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json().catch(()=>({}));
      if (!res.ok) {
        setError(data && data.error ? data.error : `Błąd: ${res.status}`);
      } else {
        if (onLogin) onLogin({ username: data.username, token: data.token });
      }
    } catch (err) {
      setError('Brak połączenia z serwerem');
      console.error('login error', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{padding:20}}>
      <h2>{mode === 'login' ? 'Zaloguj się' : 'Zarejestruj się'}</h2>
      <form onSubmit={submit}>
        <input
          autoComplete="username"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Twoja nazwa"
          disabled={loading}
        />
        <input
          type="password"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Hasło"
          disabled={loading}
        />
        <div style={{marginTop:8}}>
          <button type="submit" disabled={loading}>{loading ? 'Proszę czekać...' : (mode === 'login' ? 'Wejdź' : 'Zarejestruj')}</button>
          <button
            type="button"
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }}
            style={{marginLeft:8}}
            disabled={loading}
          >
            {mode === 'login' ? 'Utwórz konto' : 'Mam konto'}
          </button>
        </div>
      </form>
      {error && <div style={{color:'red', marginTop:8}}>{error}</div>}
    </div>
  );
}
