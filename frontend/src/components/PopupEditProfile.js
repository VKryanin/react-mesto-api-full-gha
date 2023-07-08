import React, { useContext, useEffect, useState } from 'react';
import { PopupWithForm } from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

export function PopupEditProfile(props) {
    const userData = useContext(CurrentUserContext);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        setName(userData.name);
        setDescription(userData.about)
    }, [props.isOpen]);
    function handleSubmit(event) {
        event.preventDefault();
        props.onUpdateUser({ name: name, about: description });
    }
    function handleName(event) { setName(event.target.value) }
    function handleDescription(event) { setDescription(event.target.value) }
    return (
        < PopupWithForm
            isOpen={props.isOpen}
            onClose={props.onClose}
            onSubmit={handleSubmit}
            id='profile-popup'
            title='Редактировать профиль'
            type='profile' >
            <label htmlFor="username-input"
                className="popup__label">
                <input id="username-input"
                    type="text"
                    className="popup__input"
                    name="username"
                    required
                    placeholder="Ваше имя"
                    minLength="2"
                    maxLength="40"
                    value={name || ''}
                    onChange={handleName} />
                <span className="username-input-error popup__input-error" />
            </label>
            <label htmlFor="description-input"
                className="popup__label">
                <input id="description-input"
                    type="text"
                    className="popup__input"
                    name="description"
                    required
                    placeholder="Ваш род занятий"
                    minLength="2"
                    maxLength="200"
                    value={description || ''}
                    onChange={handleDescription} />
                <span className="description-input-error popup__input-error" />
            </label>
        </PopupWithForm>
    )
}