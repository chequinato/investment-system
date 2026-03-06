import { useState } from 'react';
import { saveToken } from '../auth';

const API_URL = 'http://localhost:3000';

export default function Login({ onLogin, onGoRegister }: { onLogin: () => void, onGoRegister: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao logar');
      saveToken(data.token);
      onLogin();
    } catch (err: any) {
      setMsg(err.message);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      {msg && <div className="msg">{msg}</div>}
      <form onSubmit={handleLogin} className="form">
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input placeholder="Senha" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Entrar</button>
      </form>
      <button onClick={onGoRegister} style={{ marginTop: 16 }}>Cadastrar</button>
    </div>
  );
}
