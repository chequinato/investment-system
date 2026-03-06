import { useState } from 'react';

const API_URL = 'http://localhost:3000';

export default function Register({ onRegister, onGoLogin }: { onRegister: () => void, onGoLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao cadastrar');
      setMsg('Cadastro realizado! Faça login.');
      setTimeout(onRegister, 1000);
    } catch (err: any) {
      setMsg(err.message);
    }
  };

  return (
    <div className="container">
      <h2>Cadastro</h2>
      {msg && <div className="msg">{msg}</div>}
      <form onSubmit={handleRegister} className="form">
        <input placeholder="Nome" value={name} onChange={e => setName(e.target.value)} required />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input placeholder="Senha" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Cadastrar</button>
      </form>
      <button onClick={onGoLogin} style={{ marginTop: 16 }}>Já tenho conta</button>
    </div>
  );
}
