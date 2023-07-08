export const constants = {
    formEdit: document.querySelector('.edit-form'),
    avatarEdit: document.querySelector('.edit-avatar'),
    formAdd: document.querySelector('.add-form'),
    popupInputName: document.querySelector('.popup__input-name'),
    popupInputInfo: document.querySelector('.popup__input-info'),
    buttonEditProfile: document.querySelector('.profile__button-edit'),
    profileAvatarEdit: document.querySelector('.profile__avatar-edit'),
    buttonAddCard: document.querySelector('.profile__button-add')
}

export const closePopup = (e, onClose) => {
    if (e.target === e.currentTarget) onClose();
  }