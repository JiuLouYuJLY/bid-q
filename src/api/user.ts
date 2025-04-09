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

export const getReservationList = (userId: number, page: number, pageSize: number) => {
  return instance({
    url: "/reservations",
    method: "get",
    params: {
      userId: userId,
      page: page,
      size: pageSize
    }
  })
}