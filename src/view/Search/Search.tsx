import {memo, useState, useEffect} from "react";
import Header from "../../component/header/Header.tsx";
import {useTitle} from "../../hook";
import './Search.less';
import {useParams, useNavigate} from "react-router-dom";
import Footer from "../../component/footer/Footer.tsx";
import {Image, Pagination} from "tdesign-react";
import {search} from "../../api/auction.ts";
import {AuctionItem} from "../Home/Home.tsx";

interface SearchListItem {
  img: string;
  title: string;
  link: string;
  price: number;
  time: string;
}

const Search = memo(() => {
  const {id = '', page = '1'} = useParams();
  useTitle(`搜索 - ${id}`);
  const [searchList, setSearchList] = useState<SearchListItem[]>([]);
  const [pageObj, setPageObj] = useState({
    current: parseInt(page, 10),
    pageSize: 20,
    total: -1,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const newPage = parseInt(page, 10);
    if (newPage <1 || newPage >= 100) {
      window.location.href = `/search/${id}/1`;
    }
  }, [page]);

  const getSearchList = (index: number) => {
    search(id, index, pageObj.pageSize).then((res) => {
      if (res.data.code === 200) {
        const searchData = res.data.data.content.map((item: AuctionItem) => {
          return {
            img: item.img,
            title: item.title,
            link: `/auction/${item.aid}`,
            price: item.price,
            time: item.time.replace('T', ' '),
          };
        });
        setSearchList(searchData);
        setPageObj({
          current: parseInt(page, 10),
          pageSize: res.data.data.size,
          total: res.data.data.totalElements,
        });
      }
    })
  }

  useEffect(() => {
    getSearchList(parseInt(page, 10) - 1);
  }, [id, pageObj.current]);

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
                      <div className='bid-q-search-list-item-info-time'>截止时间: {item.time}</div>
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
            getSearchList(current.current - 1);
            setPageObj({
              ...pageObj,
              current: current.current,
              total: -1,
            });
            setSearchList([]);
            navigate(`/search/${id}/${current.current}`);
            window.scrollTo({
              top: 0,
            });
          }}
        />
      </div>
      <Footer/>
    </div>
  );
});

export default Search;