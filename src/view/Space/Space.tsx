import {memo, useEffect, useState} from "react";
import Header from "../../component/header/Header.tsx";
import Footer from "../../component/footer/Footer.tsx";
import './Space.less';
import {Tabs} from "tdesign-react";
import {useLocation, useNavigate} from "react-router-dom";
import Reservation from "./Reservation.tsx";
import History from "./History.tsx";
import Lot from "./Lot.tsx";
import Setting from "./Setting.tsx";
import {isUserLogin} from "../../api/user.ts";
import Buy from "./Buy.tsx";
import Sold from "./Sold.tsx";

const tabList = [
  {label: '拍卖预约', value: 1, panel: <Reservation/>},
  {label: '我的拍品', value: 2, panel: <Lot/>},
  {label: '已拍得', value: 3, panel: <Buy/>},
  {label: '已拍出', value: 4, panel: <Sold/>},
  {label: '拍卖历史', value: 5, panel: <History/>},
  {label: '设置', value: 6, panel: <Setting/>},
];

const tabMap: {
  [key: string]: number;
} = {
  space: 1,
  reservation: 1,
  lot: 2,
  buy: 3,
  sold: 4,
  history: 5,
  setting: 6,
};

const Space = memo(() => {
  const {pathname} = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {
    if (!isUserLogin()) {
      navigate('/login', {replace: true});
    }
  }, []);

  useEffect(() => {
    setActiveTab(tabMap[pathname.split('/').pop() || 'space']);
  }, [pathname]);

  return (
    <div>
      <Header/>
      <div className='bid-q-space-container'>
        <Tabs
          defaultValue={1}
          value={activeTab}
          onChange={(value) => {
            setActiveTab(value as number);
            navigate(`/space/${['reservation', 'lot', 'buy', 'sold', 'history', 'setting'][value as number - 1]}`);
          }}
          list={tabList}
          size='large'
        />
      </div>
      <Footer/>
    </div>
  )
});

export default Space;