import {memo} from "react";
import {Image, Swiper} from "tdesign-react";

import './SwiperList.less';

interface SwiperItem {
  img: string;
  title: string;
  desc: string;
  link: string;
}

interface SwiperItemProps {
  items: SwiperItem[];
}

const SwiperListItem = memo((props: SwiperItem) => {

  return (
    <a href={props.link} className='bid-q-home-swiper-item'>
      <Image lazy className='bid-q-home-swiper-item-img' shape='round' src={props.img}/>
      <div className='bid-q-home-swiper-item-bottom-container'>
        <div className='bid-q-home-swiper-item-bottom-title'>
                    <span
                      style={{
                        maxWidth: '80%',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: '1',
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {props.title}
                    </span>
        </div>
        <div className='bid-q-home-swiper-item-bottom-desc'>{props.desc}</div>
      </div>
    </a>
  )
});

const SwiperList = memo((props: SwiperItemProps) => {
  const {SwiperItem} = Swiper;
  return (
    <Swiper
      className='bid-q-home-swiper'
    >
      {props.items.map((item: SwiperItem, index: number) => (
        <SwiperItem key={index}>
          <SwiperListItem {...item}/>
        </SwiperItem>
      ))}
    </Swiper>
  )
});

export default SwiperList;