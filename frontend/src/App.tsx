
import { useState } from 'react';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import { getToken } from './auth';


function App() {
  const [page, setPage] = useState<'login' | 'register' | 'home'>(getToken() ? 'home' : 'login');

  if (page === 'login') {
    return <Login onLogin={() => setPage('home')} onGoRegister={() => setPage('register')} />;
  }
  if (page === 'register') {
    return <Register onRegister={() => setPage('login')} onGoLogin={() => setPage('login')} />;
  }
  if (page === 'home') {
    return <Home onLogout={() => setPage('login')} />;
  }
  return null;
}

export default App;
