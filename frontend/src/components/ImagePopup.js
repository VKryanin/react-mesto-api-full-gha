import React from 'react';

export function ImagePopup(props) {
    return (
        <div className={`popup popup_image ${props.isOpen ? 'popup_opened' : ''}`} id={props.id}>
            <div className="popup__container popup__fullscreen">
                <figure className="popup__photo">
                    <button type="button" className="popup__close-form close-image" onClick={props.onClose} aria-label="Закрыть" />
                    <img src={props.card.link} className="popup__image" alt={props.card.name} />
                    <figcaption className="popup__subtitle">{props.card.name}</figcaption>
                </figure>
            </div>
        </div>
    )
}