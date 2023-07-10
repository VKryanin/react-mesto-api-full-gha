export const baseUrl = 'http://localhost:3000';

const handleRes = (res) => {
  res.ok ? res.json() : Promise.reject(`Ошибка ${res.status}`);
}

export const register = ({ password, email }) => {
  return fetch(baseUrl + "/signup", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }).then((res) => handleRes(res));
};

export const authorize = ({ password, email }) => {
  return fetch(baseUrl + "/signin", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }).then((res) => handleRes(res));
};

export const getContent = (token) => {
  return fetch(baseUrl + "/users/me", {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  }).then((res) => handleRes(res));
};
