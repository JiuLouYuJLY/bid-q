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

export const deleteReservation = (userId: number,auctionId: number) => {
  return instance({
    url: `/reservations/${userId}/${auctionId}`,
    method: "delete",
  })
}

export const getUserUploadList = (uid: number) => {
  return instance({
    url: `/auctions/uploaded/${uid}`,
    method: "get",
  })
}

export const updateUserInfo = (data: any) => {
  return instance({
    url: `/users/update/${data.uid}`,
    method: "put",
    data: {
      name: data.nickname,
      avatar: data.avatar,
      lotName: data.lotName,
    }
  })
}

export const getHistoryList = (uid: number) => {
  return instance({
    url: `/users/${uid}/history`,
    method: "get",
  })
}

export const deleteHistory = (uid: number, aid: number) => {
  return instance({
    url: "/users/history/delete",
    method: "delete",
    params: {
      userId: uid,
      auctionId: aid
    }
  })
}

export const isReserved = (uid: number, aid: number) => {
  return instance({
    url: "/reservations/check",
    method: "get",
    params: {
      uid,
      aid
    }
  })
}

export const createReservation = (uid: number, aid: number) => {
  return instance({
    url: "/reservations/create",
    method: "post",
    data: {
      uid,
      aid
    }
  })
}

export const getLotNameById = (uid: number) => {
  return instance({
    url: `/users/${uid}/lot-name`,
    method: "get",
  })
}

export const bidToAuction = (aid: number, uid: number, price: number) => {
  return instance({
    url: `/auctions/${aid}/bid`,
    method: "post",
    data: {
      uid,
      price
    }
  })
}

export const addHistory = (aid: number, uid: number) => {
  return instance({
    url: "/histories/add",
    method: "post",
    data: {
      aid,
      uid
    }
  })
}

export const checkUserIsUploader = (aid: number, uid: number) => {
  return instance({
    url: `/auctions/${aid}/check-owner/${uid}`,
    method: "get",
  })
}