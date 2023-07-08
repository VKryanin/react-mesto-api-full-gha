import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './Header';

export function Register({ onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister({
      email,
      password,
    });
  };

  function onHavigeteLogin() {
    navigate('/sing-in', { replace: true });
  }

  return (
    <>
      <Header title="Войти" onClick={onHavigeteLogin} />
      <form className="form" onSubmit={handleSubmit}>
        <h1 className="form__title">Регистрация</h1>
        <input
          name="email"
          className="form__input"
          type="email"
          required
          placeholder="Email"
          value={email || ''}
          minLength="5"
          maxLength="18"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          id="form-opened-account"
          name="password"
          className="form__input"
          type="password"
          required
          placeholder="Пароль"
          value={password || ''}
          minLength="5"
          maxLength="18"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="form__button">Зарегистрироваться</button>
      </form>
      <p className="form__subtitle">
        Уже зарегистрированы?
        <button
          className="form__button-login"
          type="submit"
          onClick={onHavigeteLogin}
        >
          Войти
        </button>
      </p>
    </>
  );
}

