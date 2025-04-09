import instance from "../http";

export const getSwiperList = () => {
  return instance({
    url: "/auctions/carousel",
    method: "get",
  });
};

export const getIndexList = () => {
  return instance({
    url: "/auction-tags/groups",
    method: "get",
  });
};

export const getRecommendList = (num: number = 10) => {
  return instance({
    url: "/recommend",
    method: "get",
    params: {
      num: num,
    },
  });
};