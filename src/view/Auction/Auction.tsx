import {memo, useCallback, useEffect, useState} from "react";
import Header from "../../component/header/Header.tsx";
import Footer from "../../component/footer/Footer.tsx";
import "./Auction.less";
import {useTitle} from "../../hook";
import {Button, Image, Input, Popup, Tag, MessagePlugin} from "tdesign-react";
import RecommendList from "../Home/RecommendList.tsx";
import {getAuctionDetail} from "../../api/auction.ts";
import {useParams} from "react-router-dom";
import {createReservation, deleteReservation, getLotNameById, isReserved} from "../../api/user.ts";

interface AuctionInfoProps {
  img: string;
  title: string;
  desc: string;
  time: string;
  tags: string[];
  currentPrice: string;
  lotId: number;
}

const quickPrice = [1, 10, 100, 1000, 10000];

const Auction = memo(() => {
  const {id} = useParams();
  const uid = localStorage.getItem('uid') || '';
  const [auctionInfo, setAuctionInfo] = useState<AuctionInfoProps>({
    img: '',
    title: '',
    desc: '',
    time: '',
    tags: [],
    currentPrice: '',
    lotId: 0,
  })
  const [isReservation, setIsReservation] = useState(false);
  const [nowTime, setNowTime] = useState(new Date().getTime());
  const [endTime, setEndTime] = useState('');
  const [nowPrice, setNowPrice] = useState(auctionInfo.currentPrice);
  const [price, setPrice] = useState(auctionInfo.currentPrice);
  const [autoPrice, setAutoPrice] = useState(false);
  const [nowLotName, setNowLotName] = useState('');
  const [myLotName, setMyLotName] = useState('');
  useTitle(`拍卖 - ${auctionInfo.title}`);

  const getEndTime = useCallback((nowTime: number) => {
    const endTime = new Date(auctionInfo.time).getTime() - nowTime;
    if (endTime < 0) {
      return '已结束';
    }
    const day = Math.floor(endTime / (24 * 3600 * 1000));
    const hour = Math.floor((endTime % (24 * 3600 * 1000)) / (3600 * 1000));
    const minute = Math.floor((endTime % (3600 * 1000)) / (60 * 1000));
    const second = Math.floor((endTime % (60 * 1000)) / 1000);
    return `${day}天${hour}小时${minute}分钟${second}秒`;
  }, [auctionInfo.time]);

  useEffect(() => {
    getAuctionDetail(Number(id)).then((res) => {
      if (res.data.code === 200) {
        const data = {
          title: res.data.data.auction.title,
          desc: res.data.data.auction.desc,
          img: res.data.data.auction.img,
          time: res.data.data.auction.time.replace('T', ' '),
          tags: res.data.data.tags,
          lotId: res.data.data.auction.lotId,
          currentPrice: res.data.data.auction.currentPrice,
        }
        setAuctionInfo(data);
        setPrice(data.currentPrice);
        setNowPrice(data.currentPrice);
        getLotName(data.lotId);
        getLotNameById(Number(uid)).then((res) => {
          if (res.data.code === 200) {
            setMyLotName(res.data.data);
          }
        })
      }
    });
    isReserved(Number(uid),Number(id)).then((res) => {
      if (res.data.code === 200) {
        setIsReservation(res.data.data);
      }
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setNowTime(new Date().getTime());
      setEndTime(getEndTime(nowTime));
    }, 1000);
    return () => {
      clearInterval(timer);
    }
  }, [getEndTime, nowTime]);

  const handleNowPrice = (bid: number) => {
    const newPrice = parseInt(price, 10) + bid;
    if (autoPrice) {
      setNowPrice(newPrice.toString());
      setNowLotName('Tom' + newPrice);
    }
    setPrice(newPrice.toString());
  }

  const addReservation = () => {
    if (uid) {
      createReservation(Number(uid),Number(id)).then((res) => {
        if (res.data.code === 200) {
          MessagePlugin.success('预约成功');
          setIsReservation(true);
        }
      });
    } else {
      MessagePlugin.warning('请先登录');
    }
  }

  const cancelReservation = () => {
    deleteReservation(Number(uid),Number(id)).then((res) => {
      if (res.data.code === 200) {
        MessagePlugin.success('取消预约成功');
        setIsReservation(false);
      }
    })
  }

  const getLotName = (id: number) => {
    if (id) {
      getLotNameById(id).then((res) => {
        if (res.data.code === 200) {
          setNowLotName(res.data.data);
        }
      })
    } else {
      setNowLotName('暂无人出价');
    }
  }

  return (
    <div>
      <Header/>
      <div className='bid-q-auction-container'>
        <div className='bid-q-auction-wrapper'>
          <div className='bid-q-auction-item'>
            <Image lazy src={auctionInfo.img} className='bid-q-auction-img'/>
            <div className='bid-q-auction-info'>
              <div className='bid-q-auction-info-title'>{auctionInfo.title}</div>
              <div className='bid-q-auction-info-tags'>
                {auctionInfo.tags.map((tag) => (
                  <Tag
                    key={tag}
                    className='bid-q-auction-info-tag'
                    shape="round"
                    size="large"
                    theme="default"
                    variant="light"
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
              <div className='bid-q-auction-info-desc'>
                <Popup content={auctionInfo.desc} overlayInnerStyle={{width: '330px'}}>
                  {auctionInfo.desc}
                </Popup>
              </div>
              {
                isReservation ? (
                  <div>
                    <Button theme="danger" block onClick={cancelReservation}>
                      取消预约
                    </Button>
                  </div>
                ) : (
                  <Button theme="primary" block onClick={addReservation}>
                    预约拍卖
                  </Button>
                )
              }
            </div>
          </div>
          <div className='bid-q-auction'>
            <div className='bid-q-auction-time'>
              <span>距离拍卖结束还有：</span>
              <span>{endTime}</span>
            </div>
            <div className='bid-q-auction-price'>
              <span>当前价格：</span>
              <span style={{fontSize: '2rem', color: '#ff0000'}}>￥{nowPrice}</span>
            </div>
            <div className='bid-q-auction-lot'>
              <span>出价人：</span>
              <span>{nowLotName}</span>
            </div>
            {
              isReservation && (
                <div className='bid-q-auction-bid'>
                  {
                    quickPrice.map((item) => (
                      <Button
                        key={item}
                        theme="primary"
                        block
                        onClick={() => handleNowPrice(item)}
                        className='bid-q-auction-bid-button'
                      >
                        +{item}
                      </Button>
                    ))
                  }
                  <div style={{display: 'flex', gap: '10px'}}>
                    <Input
                      className='bid-q-auction-bid-input'
                      value={price.toString()}
                      onChange={(value) => {
                        if (!value) {
                          setPrice('');
                          return;
                        }
                        setPrice(value);
                      }}
                      onKeydown={(value, context) => {
                        if (!value) {
                          setPrice('');
                          return;
                        }
                        if (context.e.key === 'Enter') {
                          if (!myLotName) {
                            MessagePlugin.warning('请先去个人中心设置拍卖名');
                            return;
                          }
                          setNowPrice(value);
                          setNowLotName('Tom' + value);
                          context.e.preventDefault();
                        }
                      }}
                      clearable={true}
                      placeholder="请输入价格"
                    />
                    <Button
                      theme="primary"
                      block
                      onClick={() => {
                        if (!price) {
                          MessagePlugin.warning('请输入价格');
                          return;
                        }
                        if (!myLotName) {
                          MessagePlugin.warning('请先去个人中心设置拍卖名');
                          return;
                        }
                        setNowPrice(price);
                        setNowLotName('Tom' + price);
                      }}
                    >
                      出价
                    </Button>
                    {
                      autoPrice ? (
                        <Button
                          theme="danger"
                          block
                          onClick={() => {
                            setAutoPrice(false);
                          }}
                        >
                          取消自动出价
                        </Button>
                      ) : (
                        <Button
                          theme="success"
                          block
                          onClick={() => {
                            setAutoPrice(true);
                          }}
                        >
                          开启自动出价
                        </Button>
                      )
                    }
                  </div>
                </div>
              )
            }
          </div>
        </div>
        { auctionInfo.tags.length > 0 && <RecommendList type='auction' tags={auctionInfo.tags} aid={Number(id)}/>}
      </div>
      <Footer/>
    </div>
  )
});

export default Auction;