import {memo, useState} from "react";
import './Reservation.less';
import {useTitle} from "../../hook";
import SpaceList from "../../component/SpaceList.tsx";

const Reservation = memo(() => {
  useTitle('拍卖预约');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [reservationList, _setReservationList] = useState([
    {
      img: "https://cbu01.alicdn.com/img/ibank/O1CN01C1QpSS1OAcEsJWlen_!!3933321665-0-cib.jpg?__r__=1667037502452",
      title: "ikun手办小黄鸡",
      desc: "ikun手办小黄鸡坤坤鸡你太美手办蔡徐坤周边卡通公仔车载小摆件-阿里巴巴",
      link: "/",
      time: "2022-07-01 00:00:00",
      price: "1000",
    },
    {
      img: "https://cbu01.alicdn.com/img/ibank/O1CN01ptO0V41qLQpSRGu1z_!!2212842345479-0-cib.jpg",
      title: "Q版77",
      desc: "动漫 原神手办 Q版七七 冻冻回魂夜小僵尸 PVC公仔模型摆件-阿里巴巴",
      link: "/",
      time: "2022-07-01 00:00:00",
      price: "1000",
    },
    {
      img: "https://cbu01.alicdn.com/img/ibank/O1CN01DZiQkj1lv5bVVDM9w_!!4222024880-0-cib.jpg",
      title: "原神雷电将军",
      desc: "原神雷电将军拔刀手办",
      link: "/",
      time: "2022-07-01 00:00:00",
      price: "1000",
    },
    {
      img: "https://cbu01.alicdn.com/img/ibank/O1CN01C1QpSS1OAcEsJWlen_!!3933321665-0-cib.jpg?__r__=1667037502452",
      title: "ikun手办小黄鸡",
      desc: "ikun手办小黄鸡坤坤鸡你太美手办蔡徐坤周边卡通公仔车载小摆件-阿里巴巴",
      link: "/",
      time: "2022-07-01 00:00:00",
      price: "1000",
    },
    {
      img: "https://cbu01.alicdn.com/img/ibank/O1CN01ptO0V41qLQpSRGu1z_!!2212842345479-0-cib.jpg",
      title: "Q版77",
      desc: "动漫 原神手办 Q版七七 冻冻回魂夜小僵尸 PVC公仔模型摆件-阿里巴巴",
      link: "/",
      time: "2022-07-01 00:00:00",
      price: "1000",
    },
    {
      img: "https://cbu01.alicdn.com/img/ibank/O1CN01DZiQkj1lv5bVVDM9w_!!4222024880-0-cib.jpg",
      title: "原神雷电将军",
      desc: "原神雷电将军拔刀手办",
      link: "/",
      time: "2022-07-01 00:00:00",
      price: "1000",
    },
    {
      img: "https://cbu01.alicdn.com/img/ibank/O1CN01C1QpSS1OAcEsJWlen_!!3933321665-0-cib.jpg?__r__=1667037502452",
      title: "ikun手办小黄鸡",
      desc: "ikun手办小黄鸡坤坤鸡你太美手办蔡徐坤周边卡通公仔车载小摆件-阿里巴巴",
      link: "/",
      time: "2022-07-01 00:00:00",
      price: "1000",
    },
    {
      img: "https://cbu01.alicdn.com/img/ibank/O1CN01ptO0V41qLQpSRGu1z_!!2212842345479-0-cib.jpg",
      title: "Q版77",
      desc: "动漫 原神手办 Q版七七 冻冻回魂夜小僵尸 PVC公仔模型摆件-阿里巴巴",
      link: "/",
      time: "2022-07-01 00:00:00",
      price: "1000",
    },
    {
      img: "https://cbu01.alicdn.com/img/ibank/O1CN01DZiQkj1lv5bVVDM9w_!!4222024880-0-cib.jpg",
      title: "原神雷电将军",
      desc: "原神雷电将军拔刀手办",
      link: "/",
      time: "2022-07-01 00:00:00",
      price: "1000",
    },
    {
      img: "https://cbu01.alicdn.com/img/ibank/O1CN01C1QpSS1OAcEsJWlen_!!3933321665-0-cib.jpg?__r__=1667037502452",
      title: "ikun手办小黄鸡",
      desc: "ikun手办小黄鸡坤坤鸡你太美手办蔡徐坤周边卡通公仔车载小摆件-阿里巴巴",
      link: "/",
      time: "2022-07-01 00:00:00",
      price: "1000",
    },
    {
      img: "https://cbu01.alicdn.com/img/ibank/O1CN01ptO0V41qLQpSRGu1z_!!2212842345479-0-cib.jpg",
      title: "Q版77",
      desc: "动漫 原神手办 Q版七七 冻冻回魂夜小僵尸 PVC公仔模型摆件-阿里巴巴",
      link: "/",
      time: "2022-07-01 00:00:00",
      price: "1000",
    },
    {
      img: "https://cbu01.alicdn.com/img/ibank/O1CN01DZiQkj1lv5bVVDM9w_!!4222024880-0-cib.jpg",
      title: "原神雷电将军",
      desc: "原神雷电将军拔刀手办",
      link: "/",
      time: "2022-07-01 00:00:00",
      price: "1000",
    },
  ]);


  if (!reservationList || reservationList?.length === 0) {
    return (
      <div className='bid-q-space-reservation-empty'>
        暂无预约
      </div>
    )
  }

  return (
    <div className='bid-q-space-reservation-container'>
      <SpaceList list={reservationList} type='reservation'/>
    </div>
  )
});

export default Reservation;