import logo from '../images/header__logo.svg'
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router';

export function Header({ email, onSingOut }) {
    const pathname = useLocation();
    const navigate = useNavigate();

    function exit() {
        navigate('/sing-in', { replace: true });
        onSingOut();
    }

    return (
        <>
            <header className="header">
                <img className="header__logo" src={logo} alt='Mesto Russia' />
                {pathname.pathname === '/sing-up' && (
                    <Link className="header__button" to={'/sing-in'}>
                        Войти
                    </Link>
                )}
                {pathname.pathname === '/sing-in' && (
                    <Link className="header__button" to={'/sing-up'}>
                        Регистрация
                    </Link>
                )}
                {pathname.pathname === '/' && (
                    <>
                        {/* <div className="header__burger" onClick={handleShow}>
                            <div className={burgerClassName} />
                        </div> */}
                        <div className="header__info">
                            <p className="header__email">{email}</p>
                            <button onClick={exit} className="header__button">
                                Выйти
                            </button>
                        </div>
                    </>
                )}
            </header>
        </>
    );
}
