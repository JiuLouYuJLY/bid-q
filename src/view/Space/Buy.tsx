import {memo, useState, useEffect} from "react";
import {List, Space, Button, Dialog, Input, MessagePlugin} from 'tdesign-react';
import './Buy.less';
import {BasicImageViewer} from "../../component/BasicImageViewer.tsx";
import {getLotNameById, getUserDeal, noticePayment, noticeSellGood} from "../../api/user.ts";
import {
  getDealDetail, sendRejectNotice, updateAuctionTime,
  updateDealContact,
  updateDealGood,
  updateDealPayment,
  updateDealReject
} from "../../api/auction.ts";

interface buyListProps {
  id: number;
  sid: number;
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

const Buy = memo(() => {
  const uid = localStorage.getItem('uid') || '';
  const [sid, setSid] = useState(0);
  const [buyList, setBuyList] = useState<buyListProps[]>([]);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    isPay: false,
    isReject: false,
  })
  const [data, setData] = useState({
    id: 0,
    name: '',
    phone: '',
    address: '',
    isPay: false,
    isReject: false,
  });
  const [nowTime, setNowTime] = useState(new Date().getTime());
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFirst, setIsFirst] = useState(true);
  const [isChange, setIsChange] = useState(false);

  const handleClose = () => {
    setLoading(false);
    setVisible(false);
    if (isChange) {
      getDeal(Number(uid));
      setIsChange(false);
    }
    setForm({
      ...form,
      phone: '',
      address: '',
      isPay: false,
      isReject: false,
    });
  }

  const updateContact = () => {
    updateDealContact(data.id, form.phone, form.address).then((res) => {
      if (res.data.code === 200) {
        MessagePlugin.success('修改成功');
        noticePayment(data.id, sid).then((res) => {
          if (res.data.code === 200) {
            MessagePlugin.success('已通知卖家确认信息并发货');
          }
        })
        getDeal(Number(uid));
      } else {
        MessagePlugin.error('修改失败');
      }
    })
  }

  const handleCloseAsync = () => {
    if (!form.phone || !form.address) {
      MessagePlugin.warning('请填写收货信息');
      return;
    }
    if (!form.phone.match("^1[3-9]\\d{9}$")) {
      MessagePlugin.warning('请输入正确手机号');
      return;
    }
    setLoading(true);
    updateContact();
    setLoading(false);
    handleClose();
  }

  const getEndTime = (nowTime: number, time: string) => {
    const endTime = new Date(time).getTime() + 24 * 60 * 60 * 1000;
    const diffTime = endTime - nowTime;
    if (diffTime < 0) {
      return '已结束';
    } else {
      const diffDay = Math.floor(diffTime / (24 * 60 * 60 * 1000));
      const diffHour = Math.floor((diffTime % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const diffMinute = Math.floor((diffTime % (60 * 60 * 1000)) / (60 * 1000));
      const diffSecond = Math.floor((diffTime % (60 * 1000)) / 1000);
      return `${diffDay}天${diffHour}小时${diffMinute}分钟${diffSecond}秒`;
    }
  }

  const reset = (id: number, sid: number) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    updateAuctionTime(id, tomorrow.toISOString()).then((res) => {
      if (res.data.code === 200) {
        sendRejectNotice(id, sid).then((res) => {
          if (res.data.code === 200) {
            handleClose();
            getDeal(Number(uid));
          }
        })
      }
    })
  }

  const getDeal = (id: number) => {
    getUserDeal(id).then((res) => {
      if (res.data.code === 200) {
        const data = res.data.data;
        const deal = data.map((item: any) => {
          if (new Date(item.dealInfo.time.replace('T', ' ')).getTime() + 24 * 60 * 60 * 1000 - nowTime < 0) {
            if (item.dealInfo.payment === 0 && item.dealInfo.reject === 0) {
              MessagePlugin.error(`${item.auctionDetails.title}您已超时未付款违约`);
              updateDealReject(item.dealInfo.aid, 1);
              reset(item.auctionDetails.aid, item.dealInfo.sid);
              item.dealInfo.reject = 1;
            } else if (item.dealInfo.payment !== 0 && item.dealInfo.reject === 0 && item.dealInfo.good === 0) {
              MessagePlugin.error(`${item.auctionDetails.title}卖家超时未发货已违约`);
              updateDealReject(item.dealInfo.aid, 2);
              item.dealInfo.reject = 2;
            }
          }
          return {
            id: item.auctionDetails.aid,
            sid: item.dealInfo.sid,
            title: item.auctionDetails.title,
            desc: item.auctionDetails.desc,
            price: item.auctionDetails.currentPrice,
            time: item.dealInfo.time.replace('T', ' '),
            img: item.auctionDetails.img,
            payment: item.dealInfo.payment,
            good: item.dealInfo.good,
            reject: item.dealInfo.reject,
          }
        });
        setBuyList(deal);
      }
    })
  }

  const getDetailDeal = (id: number) => {
    getDealDetail(id).then((res) => {
      if (res.data.code === 200) {
        setData({
          ...data,
          id: res.data.data.aid,
          phone: res.data.data.phone,
          address: res.data.data.address,
          isPay: res.data.data.payment !== 0,
          isReject: res.data.data.reject === 1,
        });
        setSid(res.data.data.sid);
      }
    })
  }

  const updatePayment = (payment: number) => {
    updateDealPayment(data.id, payment).then((res) => {
      if (res.data.code === 200) {
        MessagePlugin.success('付款成功');
        setForm({
          ...form,
          isPay: true,
        });
        setIsChange(true);
      }
    })
  }

  const updateReject = (reject: number) => {
    updateDealReject(data.id, reject).then((res) => {
      if (res.data.code === 200) {
        MessagePlugin.error('已支付违约金');
        setForm({
          ...form,
          isReject: true,
        });
        setIsChange(true);
      }
    })
    reset(data.id, sid);
  }

  const updateGood = (id: number, sid: number, good: number, title: string) => {
    updateDealGood(id, good).then((res) => {
      if (res.data.code === 200) {
        noticeSellGood(sid, title).then((res) => {
          if (res.data.code === 200) {
            MessagePlugin.success('已通知卖家已收货');
            getDeal(Number(uid));
          }
        })
      }
    })
  }

  useEffect(() => {
    getDeal(Number(uid));
    getLotNameById(Number(uid)).then((res) => {
      if (res.data.code === 200) {
        setForm({...form, name: res.data.data});
        setData({...data, name: res.data.data});
      }
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setNowTime(new Date().getTime());
    }, 1000);
    return () => {
      clearInterval(timer);
    }
  }, [nowTime]);

  useEffect(() => {
    setForm({
      ...form,
      phone: data.phone,
      address: data.address,
      isPay: data.isPay,
      isReject: data.isReject,
    });
    if (!isFirst) setVisible(true);
  }, [data]);

  if (!buyList || buyList.length === 0) {
    return <div className='bid-q-space-buy-empty'>暂无成功拍得商品</div>
  }

  return (
    <List
      split={true}
      size='large'
    >
      {
        buyList.map((item) => {
          const action = (
            <Space>
              {
                item.reject === 0 && item.good === 0 &&
                  <Button
                      theme="primary"
                      onClick={() => {
                        setIsFirst(false);
                        getDetailDeal(item.id);
                      }}
                  >填写收货信息</Button>
              }
              {
                item.payment !== 0 && item.reject === 0 && item.good !== 2 &&
                  <Button theme="primary" onClick={() => {
                    updateGood(item.id, item.sid, 2, item.title);
                  }}>确认收货</Button>
              }
              {
                item.reject === 1 && <span className='bid-q-space-buy-reject'>已违约</span>
              }
              {
                item.reject === 2 && <span className='bid-q-space-buy-reject'>卖家违约</span>
              }
              {
                item.payment !== 0 && item.reject === 0 && item.good === 2 &&
                  <span className='bid-q-space-buy-good'>已收货</span>
              }
            </Space>
          );
          return (
            <div key={item.id}>
              <ListItem
                key={item.id}
                className='bid-q-space-buy-item'
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
              <Dialog
                header="填写收货信息"
                visible={visible}
                confirmLoading={loading}
                onClose={handleClose}
                onConfirm={handleCloseAsync}
              >
                <div className='bid-q-space-buy-form-item'>
                  <div style={{width: '80px'}}>收货名字:</div>
                  <Input
                    value={form?.name}
                    disabled={true}
                  />
                </div>
                <div className='bid-q-space-buy-form-item'>
                  <div style={{width: '80px'}}>联系方式:</div>
                  <Input
                    value={form?.phone}
                    onChange={(item) => setForm({...form, phone: item})}
                    clearable={true}
                    placeholder="请输入联系方式"
                  />
                </div>
                <div className='bid-q-space-buy-form-item'>
                  <div style={{width: '80px'}}>收货地址:</div>
                  <Input
                    value={form?.address}
                    onChange={(item) => setForm({...form, address: item})}
                    clearable={true}
                    placeholder="请输入收货地址"
                  />
                </div>
                <div style={{display: 'flex', gap: '10px'}}>
                  <Button
                    theme="primary"
                    disabled={form.isPay || form.isReject}
                    onClick={() => {
                      updatePayment(1);
                    }}
                  >
                    付款
                  </Button>
                  <Button
                    theme="danger"
                    disabled={form.isPay || form.isReject}
                    onClick={() => {
                      updateReject(1);
                    }}
                  >
                    支付违约金
                  </Button>
                </div>
              </Dialog>
            </div>
          )
        })
      }
    </List>
  )
})

export default Buy;