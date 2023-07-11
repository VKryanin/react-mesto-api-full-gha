export const baseUrl = 'http://api.vitaly.nomoredomains.work';

const handleRes = (res) => {
  if (res.ok) {
    return res.json();
  }
  return res.text().then((text) => {
    throw JSON.parse(text).message || JSON.parse(text).error;
  });
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
