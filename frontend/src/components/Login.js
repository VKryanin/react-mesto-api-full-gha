import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './Header';

export function Login({ onLogin, handleShowInfoMessage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({
      password,
      email,
    });
  };

  function onHavigeteRegister() {
    navigate('/sing-up', { replace: true });
  }

  return (
    <>
      <Header title="Регистрация" onClick={onHavigeteRegister} isOpen={false} />
      <form className="form" onSubmit={handleSubmit}>
        <h1 className="form__title">Вход</h1>
        <input
          name="email"
          className="form__input"
          type="email"
          required
          placeholder="Email"
          value={email || ''}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          name="password"
          className="form__input"
          type="password"
          required
          placeholder="Пароль"
          value={password || ''}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="form__button">Войти</button>
      </form>
    </>
  );
}


