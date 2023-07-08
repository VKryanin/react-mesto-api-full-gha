import { config } from '../utils/apiConfig'

export class Api {
    constructor({ url, headers }) {
        this._url = url;
        this._headers = headers;
    }
    // ответ сервера
    _getResponseData(res) {
        if (res.ok) {
            return res.json();
        }
        else {
            return Promise.reject(`et Ошибка: ${res.status}`);
        }
    }
    // данные пользователя
    getProfile() {
        return fetch(`${this._url}users/me/`, {
            headers: this._headers,
        })
            .then(res => {
                return this._getResponseData(res);
            })
    }
    // отправка данных пользователя
    patchUserData(userName, userAbout) {
        return fetch(`${this._url}users/me/`, {
            headers: this._headers,
            method: 'PATCH',
            body: JSON.stringify({ name: userName, about: userAbout })
        })
            .then(res => {
                return this._getResponseData(res);
            })
    }
    // отправка аватара
    patchUserPhoto(photoLink) {
        return fetch(`${this._url}users/me/avatar/`, {
            headers: this._headers,
            method: 'PATCH',
            body: JSON.stringify({ avatar: photoLink.avatar })
        })
            .then(res => {
                return this._getResponseData(res);
            })
    }
    // получение пользователя, get по дефолту
    getCards() {
        return fetch(`${this._url}cards/`, {
            headers: this._headers
        })
            .then(res => {
                return this._getResponseData(res);
            })
    }
    // добавление карточки
    addNewCard( name, link ) {
        return fetch(`${this._url}cards`, {
            headers: this._headers,
            method: 'POST',
            body: JSON.stringify({ name, link })
        })
            .then(res => {
                return this._getResponseData(res);
            })
    }
    // удаление карточки
    deleteCard(cardId) {
        return fetch(`${this._url}cards/${cardId}`, {
            headers: this._headers,
            method: 'DELETE',
        })
            .then(res => {
                return this._getResponseData(res);
            })
    }
    // изменение лайка
    changeLikeCardStatus(cardId, isLiked) {
        if (isLiked) {
            return fetch(`${this._url}cards/${cardId}/likes`, {
                headers: this._headers,
                method: 'PUT',
            })
                .then(res => { return this._getResponseData(res); })
        } else {
            return fetch(`${this._url}cards/${cardId}/likes`, {
                headers: this._headers,
                method: 'DELETE',
            })
                .then(res => { return this._getResponseData(res); })
        }
    }
}
// создание класса
export const api = new Api(config);