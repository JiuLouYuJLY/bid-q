import {memo, useState} from "react";

import './RecommendList.less';
import {Image} from "tdesign-react";

interface RecommendListProps {
  type: string
}

const RecommendList = memo((props: RecommendListProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [recommendList, _setRecommendList] = useState([
    {
      img: "https://cbu01.alicdn.com/img/ibank/O1CN01C1QpSS1OAcEsJWlen_!!3933321665-0-cib.jpg?__r__=1667037502452",
      title: "ikun手办小黄鸡",
      link: "/",
      time: "2022-07-01 00:00:00",
      price: "100"
    },
    {
      img: "https://cbu01.alicdn.com/img/ibank/O1CN01ptO0V41qLQpSRGu1z_!!2212842345479-0-cib.jpg",
      title: "Q版77",
      link: "/",
      time: "2022-07-01 00:00:00",
      price: "200"
    },
    {
      img: "https://cbu01.alicdn.com/img/ibank/O1CN01DZiQkj1lv5bVVDM9w_!!4222024880-0-cib.jpg",
      title: "原神雷电将军",
      link: "/",
      time: "2022-07-01 00:00:00",
      price: "300"
    },
    {
      img: "https://cbu01.alicdn.com/img/ibank/O1CN01C1QpSS1OAcEsJWlen_!!3933321665-0-cib.jpg?__r__=1667037502452",
      title: "ikun手办小黄鸡",
      link: "/",
      time: "2022-07-01 00:00:00",
      price: "400"
    },
    {
      img: "https://cbu01.alicdn.com/img/ibank/O1CN01ptO0V41qLQpSRGu1z_!!2212842345479-0-cib.jpg",
      title: "Q版77",
      link: "/",
      time: "2022-07-01 00:00:00",
      price: "500"
    },
    {
      img: "https://cbu01.alicdn.com/img/ibank/O1CN01DZiQkj1lv5bVVDM9w_!!4222024880-0-cib.jpg",
      title: "原神雷电将军",
      link: "/",
      time: "2022-07-01 00:00:00",
      price: "600"
    },
  ])

  return (
    <div>
      <div className='bid-q-home-recommend-header'>
        <Image lazy src='/chasing.png' style={{height: 44, backgroundColor: '#fff'}}/>
        <span className='bid-q-home-recommend-title'>{props.type === 'recommend' ? '猜你想拍' : '与此相关'}</span>
      </div>
      <div>
        <div className='bid-q-home-recommend-list'>
          {
            recommendList.map((item, index) => {
              return (
                <a href={item.link} className='bid-q-home-recommend-list-item' key={index}>
                  <div style={{position: 'relative'}}>
                    <Image lazy src={item.img} className='bid-q-home-recommend-list-item-img'/>
                    <div className='bid-q-home-recommend-list-item-info'>
                      <div className='bid-q-home-recommend-list-item-info-title'>{item.title}</div>
                      <div className='bid-q-home-recommend-list-item-info-price'>起拍价: ￥
                        <span style={{fontSize: 32,color: '#ff0000'}}>{item.price}</span>
                      </div>
                      <div className='bid-q-home-recommend-list-item-info-time'>拍卖时间:{item.time}</div>
                    </div>
                  </div>
                </a>
              )
            })
          }
        </div>
      </div>
    </div>
  )
});

export default RecommendList;