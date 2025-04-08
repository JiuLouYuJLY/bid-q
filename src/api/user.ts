import instance from "../http";

export const isUserLogin = () => {
  return localStorage.getItem("token") !== null;
}

export const getUserInfo = () => {
  return instance({
    url: "/users/info",
    method: "get",
  })
}