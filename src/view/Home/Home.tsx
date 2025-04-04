import {memo, useState} from "react";
import {useTitle} from "../../hook";
import Header from "../../component/header/Header.tsx";
import Footer from "../../component/footer/Footer.tsx";
import "./Home.less";
import SwiperList from "./SwiperList.tsx";
import IndexList from "./IndexList.tsx";
import ReservationList from "./ReservationList.tsx";
import RecommendList from "./RecommendList.tsx";

const Home = () => {
  useTitle("首页");
  // const {SwiperItem} = Swiper;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [swiperList, _setSwiperList] = useState([
    {
      img: "https://cbu01.alicdn.com/img/ibank/O1CN01C1QpSS1OAcEsJWlen_!!3933321665-0-cib.jpg?__r__=1667037502452",
      title: "ikun手办小黄鸡",
      desc: "ikun手办小黄鸡坤坤鸡你太美手办蔡徐坤周边卡通公仔车载小摆件-阿里巴巴",
      link: "/",
    },
    {
      img: "https://cbu01.alicdn.com/img/ibank/O1CN01ptO0V41qLQpSRGu1z_!!2212842345479-0-cib.jpg",
      title: "Q版77",
      desc: "动漫 原神手办 Q版七七 冻冻回魂夜小僵尸 PVC公仔模型摆件-阿里巴巴",
      link: "/",
    },
    {
      img: "https://cbu01.alicdn.com/img/ibank/O1CN01DZiQkj1lv5bVVDM9w_!!4222024880-0-cib.jpg",
      title: "原神雷电将军",
      desc: "原神雷电将军拔刀手办",
      link: "/",
    },
  ]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [indexList, _setIndexList] = useState([
    {
      title: "类别",
      items: [
        {
          url: "search/家具/1",
          tag: "家具"
        },
        {
          url: "search/手办/1",
          tag: "手办"
        },
        {
          url: "search/周边/1",
          tag: "周边"
        },
        {
          url: "search/模型/1",
          tag: "模型"
        },
        {
          url: "search/其他/1",
          tag: "其他"
        }
      ]
    },
    {
      title: "标签",
      items: [
        {
          url: "search/原神/1",
          tag: "原神",
        },
        {
          url: "search/奢侈品/1",
          tag: "奢侈品"
        },
        {
          url: "search/电竞椅/1",
          tag: "电竞椅"
        },
        {
          url: "search/限量/1",
          tag: "限量"
        }
      ]
    },
    {
      title: "热门",
      items: [
        {
          url: "search/手办/1",
          tag: "手办"
        },
        {
          url: "search/周边/1",
          tag: "周边"
        },
        {
          url: "search/模型/1",
          tag: "模型"
        },
        {
          url: "search/其他/1",
          tag: "其他"
        }
      ]
    },
  ]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [reservationList, _setReservationList] = useState([
    {
      img: "https://cbu01.alicdn.com/img/ibank/O1CN01C1QpSS1OAcEsJWlen_!!3933321665-0-cib.jpg?__r__=1667037502452",
      title: "ikun手办小黄鸡",
      link: "/",
      time: "2022-07-01 00:00:00"
    },
    {
      img: "https://cbu01.alicdn.com/img/ibank/O1CN01ptO0V41qLQpSRGu1z_!!2212842345479-0-cib.jpg",
      title: "Q版77",
      link: "/",
      time: "2022-07-01 00:00:00"
    },
    {
      img: "https://cbu01.alicdn.com/img/ibank/O1CN01DZiQkj1lv5bVVDM9w_!!4222024880-0-cib.jpg",
      title: "原神雷电将军",
      link: "/",
      time: "2022-07-01 00:00:00"
    },
    {
      img: "https://cbu01.alicdn.com/img/ibank/O1CN01C1QpSS1OAcEsJWlen_!!3933321665-0-cib.jpg?__r__=1667037502452",
      title: "ikun手办小黄鸡",
      link: "/",
      time: "2022-07-01 00:00:00"
    },
    {
      img: "https://cbu01.alicdn.com/img/ibank/O1CN01ptO0V41qLQpSRGu1z_!!2212842345479-0-cib.jpg",
      title: "Q版77",
      link: "/",
      time: "2022-07-01 00:00:00"
    },
    {
      img: "https://cbu01.alicdn.com/img/ibank/O1CN01DZiQkj1lv5bVVDM9w_!!4222024880-0-cib.jpg",
      title: "原神雷电将军",
      link: "/",
      time: "2022-07-01 00:00:00"
    },
  ]);

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