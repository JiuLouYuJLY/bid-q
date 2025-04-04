import {memo, useState} from "react";
import Header from "../../component/header/Header.tsx";
import {useTitle} from "../../hook";
import './Search.less';
import {useParams} from "react-router-dom";
import Footer from "../../component/footer/Footer.tsx";
import {Image, Pagination} from "tdesign-react";

const Search = memo(() => {
  const {id, page = '1'} = useParams();
  useTitle(`搜索 - ${id}`);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchList, _setSearchList] = useState([
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
  ]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pageObj, _setPageObj] = useState({
    current: 1,
    pageSize: 10,
    total: 100,
  });

  if (!searchList || searchList?.length === 0) {
    return (
      <div>
        <Header/>
        <div className='bid-q-search-list-empty'>暂无搜索结果</div>
        <Footer/>
      </div>
    );
  }

  return (
    <div>
      <Header/>
      <div className='bid-q-search-container'>
        <div className='bid-q-search-list'>
          {
            searchList.length > 0 && searchList.map((item, index) => {
              return (
                <a href={item.link} className='bid-q-search-list-item' key={index}>
                  <div style={{position: 'relative'}}>
                    <Image lazy src={item.img} className='bid-q-search-list-item-img'/>
                    <div className='bid-q-search-list-item-info'>
                      <div className='bid-q-search-list-item-info-title'>{item.title}</div>
                      <div className='bid-q-search-list-item-info-price'>起拍价: ￥
                        <span style={{fontSize: 32, color: '#ff0000'}}>{item.price}</span>
                      </div>
                      <div className='bid-q-search-list-item-info-time'>拍卖时间:{item.time}</div>
                    </div>
                  </div>
                </a>
              )
            })
          }
        </div>
        <Pagination
          className='bid-q-search-pagination'
          showFirstAndLastPageBtn
          showPageNumber
          showPreviousAndNextBtn
          showPageSize={false}
          totalContent={false}
          current={pageObj.current}
          defaultCurrent={parseInt(page, 10)}
          total={pageObj.total}
          pageSize={pageObj.pageSize}
          onChange={(current) => {
            window.location.href = `/search/${id}/${current.current}`;
          }}
        />
      </div>
      <Footer/>
    </div>
  );
});

export default Search;