import React, { useContext } from 'react';
import { Card } from "./Card";
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { Header } from './Header';
import { Footer } from './Footer'


export function Main(props) {
    const {
        email,
        onSingOut,
    } = props;
    const userData = useContext(CurrentUserContext);
    return (
        <main>
            <Header title="Выход" email={email} isOpen={true} onSingOut={onSingOut} />
            <section className="profile">
                <div className="profile__container">
                    <img
                        className="profile__avatar"
                        src={userData.avatar}
                        alt="Аватар пользователя" />
                    <button
                        type="button"
                        className="profile__avatar-edit"
                        aria-label="Редактировать аватар профиля"
                        onClick={props.onEditAvatar} />
                    <div className="profile__info">
                        <h1 className="profile__title">
                            {userData.name}
                        </h1>
                        <button
                            type="button"
                            className="profile__button-edit profile__button"
                            title="Редактировать профиль"
                            onClick={props.onEditProfile}
                        />
                        <p className="profile__subtitle">
                            {userData.about}
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    className="profile__button-add profile__button"
                    title="Добавить фотографию"
                    onClick={props.onEditAddPhoto} />
            </section>
            <section className="elements">
                <ul className="elements__list">
                    {props.cards.map((card) => {
                        return < Card
                            link={card.link}
                            name={card.name}
                            likeCount={card.likes.length}
                            onCardClick={props.onCardClick}
                            onCardLike={props.onCardLike}
                            onCardDelete={props.onCardDelete}
                            card={card}
                            key={card._id}
                        />
                    }
                    )}
                </ul>
            </section>
            <Footer />
        </main>
    )
}