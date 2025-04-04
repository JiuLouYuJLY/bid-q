import {useLocation, useNavigate} from "react-router-dom";
import './Header.less';
import {Dropdown, Input} from "tdesign-react";
import {useEffect, useState} from "react";
import {Avatar} from "tdesign-react/lib";
import {LoginIcon, LogoutIcon, UserIcon} from "tdesign-icons-react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchData, setSearchData] = useState<string>('');

  const handleSearch = () => {
    if (!searchData) return;
    navigate(`/search/${encodeURIComponent(searchData.trim())}/1`);
  };

  useEffect(() => {
    if (location.pathname.startsWith('/search')) {
      const search = location.pathname.split('/')[2];
      setSearchData(decodeURIComponent(search));
    } else {
      setSearchData('');
    }
  }, [location.pathname, navigate]);

  return (
    <div className='bid-q-header-container'>
      <p
        className='bid-q-header-icon'
        onClick={() => {
          navigate('/home');
        }}
      >
        BidQ
      </p>
      <Input
        placeholder='搜索'
        className='bid-q-header-search'
        size='large'
        value={searchData}
        onChange={(item) => setSearchData(item)}
        onEnter={handleSearch}
      />
      <UserSection/>
      <div className={'bid-q-header-block'} onClick={() => {navigate('/space/reservation')}}>
        拍卖预约
      </div>
      <div className={'bid-q-header-block'} onClick={() => {navigate('/space/history')}}>
        拍卖历史
      </div>
      <div className={'bid-q-header-block'} onClick={() => {navigate('/upload')}}>
        上传拍品
      </div>
    </div>
  );
};

const UserSection = () => {
  const navigate = useNavigate();
  const defaultAvatar = 'https://tdesign.gtimg.com/site/avatar.jpg';
  const userInfo = {
    name: 'Tom',
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
  };

  return (
    <>
      {
        userInfo ? (
          <Dropdown
            placement='bottom'
            popupProps={{
              delay: 100,
            }}
            panelTopContent={
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{fontSize: '16px', fontWeight: 'bold'}}>{userInfo.name}</div>
              </div>
            }
            options={[
              {
                content: '个人中心',
                onClick: () => {
                  navigate('/space');
                },
                prefixIcon: <UserIcon/>,
              },
              {
                content: '退出登录',
                onClick: () => {
                  localStorage.removeItem('token');
                  window.location.reload();
                },
                prefixIcon: <LogoutIcon/>,
              },
            ]}
          >
            <Avatar
              image={userInfo.avatar || defaultAvatar}
              size='large'
              shape='circle'
              onClick={() => {
                navigate('/space');
              }}
              className='bid-q-header-avatar'
            />
          </Dropdown>
        ) : (
          <Dropdown
            placement='bottom'
            popupProps={{
              delay: 100,
            }}
            options={[
              {
                content: '登录',
                onClick: () => {
                  navigate('/login');
                },
                prefixIcon: <LoginIcon/>,
              },
            ]}
          >
            <Avatar
              image={defaultAvatar}
              size='large'
              shape='circle'
              onClick={() => {
                navigate('/login');
              }}
              className='bid-q-header-avatar'
            />
          </Dropdown>
        )
      }
    </>
  );
}

export default Header;