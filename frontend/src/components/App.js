import React, { useState, useEffect } from "react";
// import { Footer } from "./Footer";
// import { Header } from "./Header";
import { Main } from "./Main";
import { ImagePopup } from "./ImagePopup";
import { PopupEditAvatar } from "./PopupEditAvatar";
import { PopupEditProfile } from "./PopupEditProfile";
import { PopupAddCard } from "./PopupAddCard";
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { api } from "../utils/Api";
import * as auth from '../utils/Auth';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import True from '../images/True.svg';
import False from '../images/False.svg'
import { Login } from "./Login";
import { Register } from "./Register";
import { ProtectedRoute } from "./ProtectedRoute";
import { InfoTooltip } from "./InfoTooltip";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({
    imgPath: '',
    text: '',
  });
  const [infoTooltip, setInfoTooltip] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  // попап изм. аватара
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true)
  }
  // попап изм профиля
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true)
  }
  // попап доб. карточки
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true)
  }
  // удаление карточки
  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => { setCards((cardsArray) => cardsArray.filter((cardItem) => cardItem._id !== card._id)) })
      .catch((err) => { console.log(`Возникла ошибка при удалении карточки, ${err}`) })
  }
  // попап карточки
  function handleCardClick(cardData) {
    setIsImageOpen(true);
    setSelectedCard({
      ...selectedCard,
      name: cardData.name,
      link: cardData.link
    })
  }
  // лайк карточки
  function handleCardLike(card) {
    const isLiked = card.likes.some(cardItem => cardItem._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((cardsItem) => {
        setCards((state) => state.map((cardItem) => cardItem._id === card._id ? cardsItem : cardItem))
      })
      .catch((err) => { console.log(`Возникла ошибка при обработке лайков, ${err}`) })
  }
  // доб. карточки
  function handleAddCard(cardItem) {
    console.log(cardItem);
    api.addNewCard(cardItem.name, cardItem.link)
      .then((card) => { setCards([card, ...cards]); closeAllPopups() })
      .catch((err) => { console.log(`Возникла ошибка при добавлении новой карточки, ${err}`) })
  }
  // обн. пользователя
  function handleUpdateUser(userData) {
    api.patchUserData(userData.name, userData.about)
      .then((res) => { setCurrentUser(res); closeAllPopups() })
      .catch((err) => { console.log(`Возникла ошибка при редактировании профиля, ${err}`) })
  }
  // ред. аватара
  function handleUpdateAvatar(link) {
    api.patchUserPhoto(link)
      .then((res) => { setCurrentUser(res); closeAllPopups() })
      .catch((err) => { console.log(`Возникла ошибка при зименении аватара, ${err}`) })
  }
  //сообщение
  const handleInfoTooltip = () => {
    setInfoTooltip(!infoTooltip);
  };

  // закрытие попапов
  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImageOpen(false);
  }
  // контект при авторизации
  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getProfile(), api.getCards()])
        .then(([userData, cardData]) => {
          setCurrentUser(userData);
          setCards(cardData);
        })
        .catch((err) => {
          console.log(`Возникла глобальная ошибка, ${err}`);
        });
    }
  }, [loggedIn]);

  //регистрация
  function onRegister({ password, email }) {
    auth
      .register({ password, email })
      .then((res) => {
        navigate('/sing-in');
        setInfoTooltip(true);
        setEmail(res.data.email);
        setMessage({
          imgPath: True,
          text: 'Вы успешно зарегистрировались!',
        });
        if (res.jwt) {
          setLoggedIn(true);
          sessionStorage.getItem('jwt', res.jwt);
        }
      })
      .catch((err) => {
        setInfoTooltip(true);
        console.log(err);
        setMessage({
          imgPath: False,
          text: 'Что-то пошло не так! Попробуйте ещё раз.',
        });
      });
  }
  //авторизация
  function onLogin({ password, email }) {
    auth
      .authorize({ password, email })
      .then(() => {
        setLoggedIn(true);
        setEmail(email);
        navigate('/', { replace: true });
      })
      .catch(() => {
        setInfoTooltip(true);
        setMessage({
          imgPath: False,
          text: 'Что-то пошло не так! Попробуйте ещё раз.',
        });
      });
  }
  //сохранение токена
  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      auth
        .getContent(jwt)
        .then((res) => {
          setEmail(res.data.email);
          setLoggedIn(true);
          navigate('/', { replace: true });
        })
        .catch((err) => console.log(err));
    }
  }, [navigate]);
  //выход из акк
  const onSingOut = () => {
    localStorage.removeItem('jwt');
    setLoggedIn(true);
    navigate('/sing-in');
  };

  return (
    <>
      <CurrentUserContext.Provider value={currentUser}>
        <Routes>
          <Route path="/sing-in" element={<Login onLogin={onLogin} />} />
          <Route
            path="/sing-up"
            element={<Register onRegister={onRegister} />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={Main}
                onEditAvatar={handleEditAvatarClick}
                onEditProfile={handleEditProfileClick}
                onEditAddPhoto={handleAddPlaceClick}
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
                onCardClick={(card) => handleCardClick(card)}
                loggedIn={loggedIn}
                email={email}
                onSingOut={onSingOut}
              />
            }
          />
          <Route path="/" element={loggedIn ? <Navigate to='/content' /> : <Navigate to='/sign-in' replace />} />
        </Routes>

        < PopupEditAvatar
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        < PopupEditProfile
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        < PopupAddCard
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddCard}
        />

        < ImagePopup
          isOpen={isImageOpen}
          onClose={closeAllPopups}
          card={selectedCard}
        />

        <InfoTooltip
          isOpen={infoTooltip}
          onClose={handleInfoTooltip}
          message={message}
        />
      </CurrentUserContext.Provider>

    </>
  );
}

export default App;
