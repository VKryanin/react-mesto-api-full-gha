import React from 'react';
import { useEffect, useRef } from 'react';
import { PopupWithForm } from './PopupWithForm';

export function PopupEditAvatar(props) {
    const avatarRef = useRef();

    useEffect(() => { avatarRef.current.value = '' }, [props.isOpen]);
    function handleSubmit(e) {
        e.preventDefault();
        props.onUpdateAvatar({ avatar: avatarRef.current.value });
    }
    return (
        < PopupWithForm
            isOpen={props.isOpen}
            onClose={props.onClose}
            onSubmit = { handleSubmit }
            id='avatar-popup'
            title='Обновить аватар'
            type='user-avatar' >
            <label htmlFor="avatar-input" className="popup__label">
                <input name="avatar"
                    className="popup__input popup__input-avatar"
                    id="avatar"
                    placeholder="Введите ссылку на аватар"
                    ref={ avatarRef }
                    type="url"
                    minLength="2"
                    maxLength="200"
                    required />
                <span className="popup__span popup__text-error avatar-error"></span>
            </label>
        </PopupWithForm>
    )
}