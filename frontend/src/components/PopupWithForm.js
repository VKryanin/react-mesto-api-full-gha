import React from 'react';

export function PopupWithForm(props) {
  return (
    <div className={`popup ${props.isOpen ? 'popup_opened' : ''}`} id={props.id}>
      <div className="popup__container">
        <button
          type="button"
          className="popup__close-form"
          onClick={props.onClose}
          aria-label="Закрыть форму" />
        <h2 className="popup__title">{props.title}</h2>
        <form name={props.type} onSubmit={props.onSubmit} className="popup__form">
          {props.children}
          <button
            type="submit"
            className="popup__submit-button"
            aria-label="Сохранить">{props.buttonText || 'Сохранить'}</button>
        </form>
      </div>
    </div>
  )
}



