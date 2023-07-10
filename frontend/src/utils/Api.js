import { config } from '../utils/apiConfig'

export class Api {
    constructor({ url, headers }) {
        this._url = 'http://localhost:3000/';
    }
    // ответ сервера
    _getResponseData(res) {
        if (res.ok) {
            return res.json();
        }
        return res.text().then((text) => {
            throw JSON.parse(text).message || JSON.parse(text).error;
        });
    }
    // данные пользователя
    getProfile() {
        return fetch(`${this._url}users/me`, {
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.getItem("jwt")}`,
                Accept: "*/*",
            },
        }).then((res) => this._getResponseData(res));
    }
    // отправка данных пользователя
    patchUserData(userName, userAbout) {
        return fetch(`${this._url}users/me `, {
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
            method: "PATCH",
            body: JSON.stringify({
                name: userName,
                about: userAbout,
            }),
        }).then((res) => this._getResponseData(res));
    }
    // отправка аватара
    patchUserPhoto(photoLink) {
        return fetch(`${this._url}users/me/avatar`, {
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
            method: "PATCH",
            body: JSON.stringify({ ...photoLink }),
        }).then((res) => this._getResponseData(res));
    }
    // получение пользователя, get по дефолту
    getCards() {
        return fetch(`${this._url}cards`, {
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.getItem("jwt")}`,
                Accept: "*/*",
            }
        })
            .then(res => {
                return this._getResponseData(res);
            })
    }
    // добавление карточки
    addNewCard(name, link) {
        return fetch(`${this._url}cards`, {
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
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
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
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
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
                method: "DELETE",
            }).then((res) => this._getResponseData(res));
        } else {
            return fetch(`${this._url}cards/${cardId}/likes`, {
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
                method: "PUT",
            }).then((res) => {
                console.log(res.data);
                this._getResponseData(res)
            });
        }
    }
}
// создание класса
export const api = new Api(config);