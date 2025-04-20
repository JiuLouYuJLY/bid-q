import {memo, useState, useEffect} from "react";

import './RecommendList.less';
import {Image} from "tdesign-react";
import {getRecommendByTags, getRecommendList} from "../../api/auction.ts";
import {AuctionItem} from "./Home.tsx";

interface RecommendListProps {
  type: string;
  aid?: number;
  tags?: string[];
}

interface RecommendItem {
  img: string;
  title: string;
  link: string;
  time: string;
  price: number;
}

const RecommendList = memo((props: RecommendListProps) => {
  const [recommendList, setRecommendList] = useState<RecommendItem[]>([]);

  const getRecommend = () => {
    getRecommendList().then(res => {
      if (res.data.code === 200) {
        const recommend = res.data.data.map((item: AuctionItem) => {
          return {
            img: item.img,
            title: item.title,
            link: `/auction/${item.aid}`,
            time: item.time.replace('T', ' '),
            price: item.price
          }
        });
        setRecommendList(recommend);
      }
    })
  }

  const getRecommendByTag = () => {
    if (!props.tags || !props.aid) return;
    getRecommendByTags(props.tags, props.aid).then(res => {
      if (res.data.code === 200) {
        const recommend = res.data.data.map((item: AuctionItem) => {
          return {
            img: item.img,
            title: item.title,
            link: `/auction/${item.aid}`,
            time: item.time.replace('T', ' '),
            price: item.price
          }
        });
        setRecommendList(recommend);
      }
    })
  }

  useEffect(() => {
    if (props.type === 'recommend') {
      getRecommend();
    } else {
      if (!props.tags || !props.aid) return;
      getRecommendByTag();
    }
  }, []);

  return (
    <div>
      <div className='bid-q-home-recommend-header'>
        <Image lazy src='/chasing.png' style={{height: 44, backgroundColor: '#fff'}}/>
        <span className='bid-q-home-recommend-title'>{props.type === 'recommend' ? '猜你想拍' : '与此相关'}</span>
        {
          props.type === 'recommend' ?
            <span className='bid-q-home-recommend-fresh' onClick={getRecommend}>刷新</span>
            : <span className='bid-q-home-recommend-fresh' onClick={getRecommendByTag}>刷新</span>
        }
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