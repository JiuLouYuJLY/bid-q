import instance from "../http";
import {AuctionInfoProps} from "../component/SpaceList.tsx";

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

export const search = (keyword: string, page: number = 0, pageSize: number = 10) => {
  return instance({
    url: "/search",
    method: "get",
    params: {
      keyword: keyword,
      page: page,
      size: pageSize,
    },
  });
};

export const getAuctionDetail = (auctionId: number) => {
  return instance({
    url: `/auctions/${auctionId}/tags`,
    method: "get",
  });
};

interface uploadItem {
  uid: number;
  title: string;
  desc: string;
  price: number;
  img: string;
  tags: string[];
  time: string;
}
export const createAuction = (data: uploadItem) => {
  return instance({
    url: "/auctions/create",
    method: "post",
    data,
  });
};

export const updateAuction = (data: AuctionInfoProps) => {
  return instance({
    url: `/auctions/update/${data.aid}`,
    method: "put",
    data: {
      title: data.title,
      desc: data.desc,
      price: Number(data.price),
      img: data.img,
      tags: data.tags,
      time: data.time.replace(' ', 'T')
    }
  });
};

export const deleteAuction = (id: number) => {
  return instance({
    url: `/auctions/delete/${id}`,
    method: "delete",
  });
};

export const getRecommendByTags = (tags: string[], aid: number) => {
  return instance({
    url: `/auctions/recommend`,
    method: "get",
    params: {
      tags,
      aid
    },
    paramsSerializer: params => {
      // 将数组参数转换为tags=value1&tags=value2格式
      return Object.entries(params)
        .flatMap(([key, values]) =>
          Array.isArray(values)
            ? values.map(v => `${key}=${encodeURIComponent(v)}`)
            : `${key}=${encodeURIComponent(values)}`
        )
        .join('&');
    }
  });
};

export const getNowAuctionPriceAndLot = (aid: number) => {
  return instance({
    url: `/auctions/${aid}/price`,
    method: "get",
  });
};

export const extendTime = (aid: number) => {
  return instance({
    url: `/auctions/extend/${aid}`,
    method: "put",
  });
};

export const notifyAllUser = (aid: number) => {
  return instance({
    url: `/auctions/${aid}/notify`,
    method: "post",
  });
};

export const addDeal = (aid: number, uid: number, sid: number) => {
  return instance({
    url: `/deal/add`,
    method: "post",
    data: {
      aid,
      uid,
      sid
    }
  });
};

export const sendEmail = (uid: number) => {
  return instance({
    url: `/users/sendAuctionEmail`,
    method: "post",
    data: {
      uid
    }
  });
};

export const getDealDetail  = (aid: number) => {
  return instance({
    url: `/deal/${aid}/auction-result`,
    method: "get",
  });
};

export const updateDealPayment = (aid: number, payment: number) => {
  return instance({
    url: `/deal/${aid}/payment`,
    method: "put",
    params: {
      payment
    }
  });
};

export const updateDealReject = (aid: number, reject: number) => {
  return instance({
    url: `/deal/${aid}/reject`,
    method: "put",
    params: {
      reject
    }
  });
};

export const updateDealContact  = (aid: number, phone: string, address: string) => {
  return instance({
    url: `/deal/${aid}/contact`,
    method: "put",
    params: {
      phone,
      address
    }
  });
};

export const updateDealGood  = (aid: number, good: number) => {
  return instance({
    url: `/deal/${aid}/good`,
    method: "put",
    params: {
      good
    }
  });
};

export const updateAuctionTime = (aid: number, time: string) => {
  return instance({
    url: `/auctions/update-time/${aid}`,
    method: "put",
    data: {
      time
    }
  });
};

export const sendRejectNotice = (aid: number, uid: number) => {
  return instance({
    url: `/deal/sendRejectNotification`,
    method: "post",
    params: {
      aid,
      uid
    }
  });
};

export const noticeSellerNoSold = (uid: number, title: string) => {
  return instance({
    url: `/deal/notify-failed-auction`,
    method: "post",
    params: {
      uid,
      title
    }
  });
};