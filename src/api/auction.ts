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