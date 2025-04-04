import {memo, useCallback, useEffect, useState} from "react";
import Header from "../../component/header/Header.tsx";
import Footer from "../../component/footer/Footer.tsx";
import "./Auction.less";
import {useTitle} from "../../hook";
import {Button, Image, Input, Popup, Tag} from "tdesign-react";
import RecommendList from "../Home/RecommendList.tsx";

const quickPrice = [1, 10, 100, 1000, 10000];

const Auction = memo(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [auctionInfo, _setAuctionInfo] = useState({
    title: 'ikun手办小黄鸡',
    desc: 'ikun手办小黄鸡坤坤鸡你太美手办蔡徐坤周边卡通公仔车载小摆件-阿里巴巴ikun手办小黄鸡坤坤鸡你太美手办蔡徐坤周边卡通公仔车载小摆件-阿里巴巴ikun手办小黄鸡坤坤鸡你太美手办蔡徐坤周边卡通公仔车载小摆件-阿里巴巴ikun手办小黄鸡坤坤鸡你太美手办蔡徐坤周边卡通公仔车载小摆件-阿里巴巴ikun手办小黄鸡坤坤鸡你太美手办蔡徐坤周边卡通公仔车载小摆件-阿里巴巴ikun手办小黄鸡坤坤鸡你太美手办蔡徐坤周边卡通公仔车载小摆件-阿里巴巴ikun手办小黄鸡坤坤鸡你太美手办蔡徐坤周边卡通公仔车载小摆件-阿里巴巴',
    img: "https://cbu01.alicdn.com/img/ibank/O1CN01C1QpSS1OAcEsJWlen_!!3933321665-0-cib.jpg?__r__=1667037502452",
    time: '2025-04-01 00:00:00',
    tags: ['ikun', '小黄鸡', '蔡徐坤', '小摆件', '车载', '手办', '周边', '卡通公仔', '坤坤', '鸡你太美'],
    price: '100',
  })
  const [isReservation, setIsReservation] = useState(false);
  const [nowTime, setNowTime] = useState(new Date().getTime());
  const [endTime, setEndTime] = useState('');
  const [nowPrice, setNowPrice] = useState(auctionInfo.price);
  const [price, setPrice] = useState(auctionInfo.price);
  const [autoPrice, setAutoPrice] = useState(false);
  const [nowLotName, setNowLotName] = useState('Tom');
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
                    <Button theme="danger" block onClick={() => setIsReservation(false)}>
                      取消预约
                    </Button>
                  </div>
                ) : (
                  <Button theme="primary" block onClick={() => setIsReservation(true)}>
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
                        if (context.e.key === 'Enter') {
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
        <RecommendList type='auction'/>
      </div>
      <Footer/>
    </div>
  )
});

export default Auction;