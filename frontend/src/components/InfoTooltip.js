import { closePopup } from '../utils/constants';
import closeIcon from '../images/closeIcon.svg'

export function InfoTooltip({ onClose, isOpen, message, image }) {
  return (
    <div
      className={isOpen ? 'popup popup_opened' : 'popup'}
      onClick={(e) => closePopup(e, onClose)}
    >
      <div className="popup__container popup__message">
        <img src={message.imgPath} alt={image} className="popup__image" />
        <img
          className="popup__close"
          src={closeIcon}
          onClick={onClose}
          alt='x'
        />
        <h2 className="popup__title-aut">{message.text}</h2>
      </div>
    </div>
  );
}


