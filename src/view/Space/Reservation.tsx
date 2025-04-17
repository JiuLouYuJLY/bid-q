import {memo, useState, useEffect} from "react";
import './Reservation.less';
import {useTitle} from "../../hook";
import SpaceList from "../../component/SpaceList.tsx";
import {deleteReservation, getReservationList, isUserLogin} from "../../api/user.ts";
import {AuctionItem} from "../Home/Home.tsx";
import {MessagePlugin} from "tdesign-react";
import {useNavigate} from "react-router-dom";

const Reservation = memo(() => {
  useTitle('拍卖预约');
  const uid = localStorage.getItem('uid') || '';
  const navigate = useNavigate();
  const [reservationList, setReservationList] = useState([]);

  useEffect(() => {
    if (!isUserLogin()) {
      navigate('/login', {replace: true});
    }
  }, []);

  const deleteReservationItem = (aid: number) => {
    const confirm = window.confirm('确定取消预约吗？');
    if (!confirm) {
      return;
    }
    deleteReservation(Number(uid), aid).then(res => {
      if (res.data.code === 200) {
        MessagePlugin.success('取消预约成功');
        getReservation();
      }
    })
  }

  const getReservation = () => {
    getReservationList(Number(uid), 0, 100).then(res => {
      if (res.data.code === 200) {
        const content = res.data.data.content;
        const reservation = content.map((item: AuctionItem) => {
          return {
            aid: item.aid,
            img: item.img,
            title: item.title,
            desc: item.desc,
            price: item.price,
            link: `/auction/${item.aid}`,
            time: item.time.replace('T', ' ')
          }
        });
        setReservationList(reservation);
      }
    })
  }

  useEffect(() => {
    if (uid) {
      getReservation();
    }

  }, []);


  if (!reservationList || reservationList?.length === 0) {
    return (
      <div className='bid-q-space-reservation-empty'>
        暂无预约
      </div>
    )
  }

  return (
    <div className='bid-q-space-reservation-container'>
      <SpaceList list={reservationList} type='reservation' onDeleteClick={deleteReservationItem}/>
    </div>
  )
});

export default Reservation;