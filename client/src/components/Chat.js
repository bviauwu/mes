import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const SERVER = 'http://10.40.31.124:5000';

export default function Chat({ username, token, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [text, setText] = useState('');
  const socketRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    fetch(`${SERVER}/messages`).then(r => r.json()).then(setMessages).catch(()=>{});
    const socket = io(SERVER, { auth: { token } });
    socketRef.current = socket;
    socket.on('connect', () => {
      console.log('socket connected', socket.id);
    });
    socket.on('message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    socket.on('users', (u) => setUsers(u));
    socket.on('connect_error', (err) => {
      console.warn('connect_error', err.message);
    });
    return () => socket.disconnect();
  }, [token]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  function send() {
    const t = text.trim();
    if (!t) return;
    socketRef.current.emit('message', { text: t });
    setText('');
  }

  return (
    <div style={{display:'flex',height:'100vh'}}>
      <div style={{flex:1,display:'flex',flexDirection:'column',borderRight:'1px solid #ddd'}}>
        <div style={{padding:10, borderBottom:'1px solid #eee', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>Zalogowany jako: <b>{username}</b></div>
          <div>
            {onLogout && <button onClick={onLogout}>Wyloguj</button>}
          </div>
        </div>
        <div ref={listRef} style={{flex:1, overflowY:'auto', padding:10}}>
          {messages.map(m => (
            <div key={m.id} style={{marginBottom:8}}>
              <div style={{fontSize:12,color:'#555'}}>{m.username} · <span style={{fontSize:11,color:'#999'}}>{new Date(m.time).toLocaleTimeString()}</span></div>
              <div>{m.text}</div>
            </div>
          ))}
        </div>
        <div style={{padding:10, borderTop:'1px solid #eee', display:'flex', gap:8}}>
          <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter' && send()} style={{flex:1}} placeholder="Napisz wiadomość..." />
          <button onClick={send}>Wyślij</button>
        </div>
      </div>

      <div style={{width:220,padding:10}}>
        <h4>Online</h4>
        <ul>
          {users.map((u, i) => <li key={i}>{u}</li>)}
        </ul>
      </div>
    </div>
  );
}
