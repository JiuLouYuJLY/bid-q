import {memo, useState, useEffect} from "react";
import {useTitle} from "../../hook";
import Header from "../../component/header/Header.tsx";
import Footer from "../../component/footer/Footer.tsx";
import "./Home.less";
import SwiperList from "./SwiperList.tsx";
import IndexList from "./IndexList.tsx";
import ReservationList from "./ReservationList.tsx";
import RecommendList from "./RecommendList.tsx";
import {getIndexList, getSwiperList} from "../../api/auction.ts";
import {getReservationList, getUserInfo, isUserLogin} from "../../api/user.ts";

export interface AuctionItem {
  aid: number;
  img: string;
  title: string;
  desc: string;
  time: string;
  price: number;
  currentPrice: number;
  lotId: number;
  uploadId: number;
}

interface TagItem {
  title: string;
  tags: []
}

const Home = () => {
  useTitle("首页");
  const [swiperList, setSwiperList] = useState([]);
  const [indexList, setIndexList] = useState([]);
  const [reservationList, setReservationList] = useState([]);

  const getSwiper = () => {
    getSwiperList().then(res => {
      if (res.data) {
        const swiper = res.data.map((item: AuctionItem) => {
          return {
            img: item.img,
            link: `auction/${item.aid}`,
            title: item.title,
            desc: item.desc
          }
        })
        setSwiperList(swiper);
      }
    });
  };

  const getIndex = () => {
    getIndexList().then(res => {
      if (res.data) {
        const index = res.data.map((item: TagItem) => {
          return {
            title: item.title,
            items: item.tags.map((tag: string) => {
              return {
                url: `search/${tag}/1`,
                tag: tag
              }
            })
          }
        });
        setIndexList(index);
      }
    })
  }

  const getReservationListByUid = (uid: number) => {
    getReservationList(uid, 0, 10).then(res => {
      if (res.data.code === 200) {
        const content = res.data.data.content;
        const reservation = content.map((item: AuctionItem) => {
          return {
            img: item.img,
            title: item.title,
            link: `auction/${item.aid}`,
            time: item.time.replace('T', ' ')
          }
        });
        setReservationList(reservation);
      }
    })
  }

  const getReservation = () => {
    let uid = localStorage.getItem("uid") || '';
    if (!uid) {
      getUserInfo().then(res => {
        if (res.data.code === 200) {
          uid = res.data.data.uid;
          localStorage.setItem('uid', uid.toString());
          getReservationListByUid(Number(uid));
        }
      });
    } else {
      getReservationListByUid(Number(uid));
    }

  }

  useEffect(() => {
    getSwiper();
    getIndex();
    if (isUserLogin()) {
      getReservation();
    }
  }, []);

  return (
    <div>
      <Header/>
      <div className='bid-q-home-wrapper'>
        <div className='bid-q-home-index-container'>
          <SwiperList items={swiperList}/>

          <IndexList data={indexList}/>
        </div>

        <ReservationList items={reservationList}/>

        <RecommendList type="recommend"/>
      </div>
      <Footer/>
    </div>
  );
};

export default memo(Home);