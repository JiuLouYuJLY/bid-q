import {memo, useState, useEffect} from "react";
import {useTitle} from "../../hook";
import './Lot.less';
import SpaceList, {AuctionInfoProps} from "../../component/SpaceList.tsx";
import {getUserUploadList} from "../../api/user.ts";
import {AuctionItem} from "../Home/Home.tsx";
import {deleteAuction, updateAuction} from "../../api/auction.ts";
import {MessagePlugin} from 'tdesign-react';

const Lot = memo(() => {
  useTitle('我的拍品');
  const uid = localStorage.getItem('uid') || '';
  const [lotList, setLotList] = useState([]);

  const getLotList = () => {
    getUserUploadList(Number(uid)).then(res => {
      if (res.data.code === 200) {
        const lot = res.data.data.map((item: AuctionItem) => {
          return {
            aid: item.aid,
            img: item.img,
            title: item.title,
            desc: item.desc,
            link: `/auction/${item.aid}`,
            time: item.time.replace('T', ' '),
            price: item.price
          }
        });
        setLotList(lot);
      }
    })
  }

  const updateLot = (data: AuctionInfoProps) => {
    updateAuction(data).then(res => {
      if (res.data.success) {
        MessagePlugin.success('修改成功');
        getLotList();
      }
    })
  }

  const deleteLot = (aid: number) => {
    const confirm = window.confirm('确定删除拍品吗？');
    if (!confirm) {
      return;
    }
    deleteAuction(aid).then(res => {
      if (res.data.code === 200) {
        MessagePlugin.success('删除成功');
        getLotList();
      }
    })
  }

  useEffect(() => {
    getLotList();
  }, []);

  if (!lotList || lotList?.length === 0) {
    return (
      <div className='bid-q-space-lot-empty'>
        暂无拍品
      </div>
    );
  }

  return (
    <div className='bid-q-space-lot-container'>
      <SpaceList list={lotList} type='lot' onEditClick={updateLot} onDeleteClick={deleteLot}/>
    </div>
  )
});

export default Lot;