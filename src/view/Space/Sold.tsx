import {memo, useState, useEffect} from 'react';
import {List, Space, Button, MessagePlugin} from "tdesign-react";
import './Sold.less';
import {BasicImageViewer} from "../../component/BasicImageViewer.tsx";
import {getUserSoldList, noticeUserGood} from "../../api/user.ts";
import {
  sendRejectNotice,
  updateAuctionTime,
  updateDealGood,
  updateDealPayment,
  updateDealReject
} from "../../api/auction.ts";

interface soldListProps {
  id: number;
  uid: number;
  title: string;
  desc: string;
  price: string;
  time: string;
  img: string;
  payment: number;
  good: number;
  reject: number;
}

const {ListItem, ListItemMeta} = List;

const Sold = memo(() => {
  const uid = localStorage.getItem('uid') || '';
  const [soldList, setSoldList] = useState<soldListProps[]>([]);
  const [nowTime, setNowTime] = useState(new Date().getTime());

  const getEndTime = (nowTime: number, time: string) => {
    const endTime = new Date(time).getTime() + 24 * 60 * 60 * 1000;
    const diffTime = endTime - nowTime;
    if (diffTime < 0) {
      return '已结束';
    } else {
      const Day = Math.floor(diffTime / (24 * 60 * 60 * 1000));
      const Hour = Math.floor((diffTime % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const Minute = Math.floor((diffTime % (60 * 60 * 1000)) / (60 * 1000));
      const Second = Math.floor((diffTime % (60 * 1000)) / 1000);
      return `${Day}天${Hour}小时${Minute}分钟${Second}秒`;
    }
  }

  const updatePayment = (id: number, payment: number) => {
    updateDealPayment(id, payment).then((res) => {
      if (res.data.code === 200) {
        MessagePlugin.success('确认收款');
        getSoldList();
      }
    })
  }

  const updateGood = (id: number, uid: number, good: number, title: string) => {
    updateDealGood(id, good).then((res) => {
      if (res.data.code === 200) {
        noticeUserGood(uid, title).then((res) => {
          if (res.data.code === 200) {
            MessagePlugin.success('已通知买家已发货');
            getSoldList();
          }
        })
      }
    }).catch(() => {
      MessagePlugin.error('操作失败');
    })
  }

  const reset = (id: number, sid: number) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    updateAuctionTime(id, tomorrow.toISOString()).then((res) => {
      if (res.data.code === 200) {
        sendRejectNotice(id, sid).then((res) => {
          if (res.data.code === 200) {
            getSoldList();
          }
        })
      }
    })
  }

  const getSoldList = () => {
    getUserSoldList(Number(uid)).then((res) => {
      if (res.data.code === 200) {
        const sold = res.data.data.map((item: any) => {
          if (new Date(item.dealInfo.time.replace('T', ' ')).getTime() + 24 * 60 * 60 * 1000 - nowTime < 0) {
            if (item.dealInfo.payment === 0 && item.dealInfo.reject === 0) {
              MessagePlugin.error(`${item.auctionDetails.title}买家超时未付款违约`);
              reset(item.auctionDetails.aid, item.dealInfo.sid);
              updateDealReject(item.dealInfo.aid, 1);
              item.dealInfo.reject = 1;
            } else if (item.dealInfo.payment !== 0 && item.dealInfo.reject === 0 && item.dealInfo.good === 0) {
              MessagePlugin.error(`${item.auctionDetails.title}您超时未发货已违约`);
              updateDealReject(item.dealInfo.aid, 2);
              item.dealInfo.reject = 2;
            }
          }
          return {
            id: item.auctionDetails.aid,
            uid: item.dealInfo.uid,
            title: item.auctionDetails.title,
            desc: item.auctionDetails.desc,
            price: item.auctionDetails.currentPrice,
            time: item.dealInfo.time,
            img: item.auctionDetails.img,
            payment: item.dealInfo.payment,
            good: item.dealInfo.good,
            reject: item.dealInfo.reject
          }
        });
        setSoldList(sold);
      }
    })
  }

  useEffect(() => {
    getSoldList();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setNowTime(new Date().getTime());
    }, 1000);
    return () => {
      clearInterval(timer);
    }
  }, [nowTime]);

  if (!soldList || soldList.length === 0) {
    return <div className='bid-q-space-sold-empty'>暂无成功拍出商品</div>
  }

  return (
    <List
      split={true}
      size='large'
    >
      {
        soldList.map((item) => {
          const action = (
            <Space>
              {
                item.payment === 0 && item.reject === 0 && item.good === 0 &&
                  <span className='bid-q-space-sold-no-pay'>买家还未付款</span>
              }
              {
                item.payment === 1 && item.reject === 0 && item.good === 0 &&
                  <Button theme="primary" onClick={() => {
                    updatePayment(item.id, 2);
                  }}>确认收款</Button>
              }
              {
                item.reject === 1 && <span className='bid-q-space-sold-reject'>买家违约</span>
              }
              {
                item.reject === 2 && <span className='bid-q-space-sold-reject'>已违约</span>
              }
              {
                item.payment === 2 && item.reject === 0 && item.good === 0 &&
                  <Button theme="primary" onClick={() => {
                    updateGood(item.id, item.uid, 1, item.title);
                  }}>发货</Button>
              }
              {
                item.payment === 2 && item.reject === 0 && item.good === 1 &&
                  <span className='bid-q-space-sold-good'>货物运输中</span>
              }
              {
                item.payment === 2 && item.reject === 0 && item.good === 2 &&
                  <span className='bid-q-space-sold-good'>买家已收货</span>
              }
            </Space>
          );
          return (
            <div key={item.id}>
              <ListItem
                key={item.id}
                className='bid-q-space-sold-item'
                action={action}
              >
                <ListItemMeta
                  image={
                    BasicImageViewer(item.img, item.title)
                  }
                  title={item.title}
                  description={item.desc}
                />
                <div>
                  <div style={{marginBottom: '10px'}}>
                    <span style={{fontSize: 24}}>成交价: ￥ </span>
                    <span style={{fontSize: 32, color: '#ff0000'}}>{item.price}</span>
                  </div>
                  <div>
                    离交易结束还有: {getEndTime(nowTime, item.time)}
                  </div>
                </div>
              </ListItem>
            </div>
          )
        })
      }
    </List>
  )
});

export default Sold;