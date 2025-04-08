import {memo} from "react";
import {Image} from "tdesign-react";
import './ReservationList.less';

interface ReservationItemProps {
  img: string;
  link: string;
  title: string;
  time: string;
}

interface ReservationListProps {
  items: ReservationItemProps[];
}

const ReservationList = memo((props: ReservationListProps) => {

  return (
    <>
      {
        props.items.length > 0 && (
          <div className='bid-q-home-reservation-container'>
            <div className='bid-q-home-reservation-header'>
              <Image lazy src='/clock.png' style={{height: 44, backgroundColor: '#fff'}}/>
              <span className='bid-q-home-reservation-title'>我的预约</span>
            </div>
            <div className='bid-q-home-reservation-list'>
              {
                props.items.map((item, index) => {
                  return (
                    <a href={item.link} key={index} className='bid-q-home-reservation-list-item'>
                      <div style={{position: 'relative'}}>
                        <Image lazy src={item.img} className='bid-q-home-reservation-list-item-img'/>
                        <div className='big-q-home-reservation-list-item-cover-background'></div>
                        <div className='bid-q-home-reservation-list-item-time'>
                          拍卖时间 {item.time}
                        </div>
                      </div>
                      <div className='bid-q-home-reservation-list-item-title'>{item.title}</div>
                    </a>
                  );
                })
              }
            </div>
          </div>
        )
      }
    </>
  );
});

export default ReservationList;