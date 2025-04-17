import {memo, useState, useEffect} from "react";
import './History.less';
import {useTitle} from "../../hook";
import SpaceList from "../../component/SpaceList.tsx";
import {deleteHistory, getHistoryList} from "../../api/user.ts";
import {AuctionItem} from "../Home/Home.tsx";
import {MessagePlugin} from 'tdesign-react';

const History = memo(() => {
  useTitle('拍卖历史');
  const [historyList, setHistoryList] = useState([]);
  const uid = localStorage.getItem('uid') || '';

  const getHistory = () => {
    getHistoryList(Number(uid)).then(res => {
      if (res.data.code === 200) {
        const history = res.data.data.map((item: AuctionItem) => {
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
        setHistoryList(history);
      }
    })
  }

  const deleteHistoryItem = (aid: number) => {
    const confirm = window.confirm('确定删除该历史吗？');
    if (!confirm) {
      return;
    }
    deleteHistory(Number(uid), aid).then(res => {
      if (res.data.code === 200) {
        MessagePlugin.success('删除成功');
        getHistory();
      }
    })
  }

  useEffect(() => {
    getHistory();
  }, []);

  if (!historyList || historyList?.length === 0) {
    return <div className='bid-q-space-history-empty'>暂无拍卖记录</div>
  }

  return (
    <div className='bid-q-space-history-container'>
      <SpaceList list={historyList} type='history' onDeleteClick={deleteHistoryItem}/>
    </div>
  )
});

export default History;