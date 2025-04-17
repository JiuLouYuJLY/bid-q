import {useLocation, useNavigate} from "react-router-dom";
import './Header.less';
import {Dropdown, Input} from "tdesign-react";
import {useEffect, useState} from "react";
import {Avatar} from "tdesign-react/lib";
import {LoginIcon, LogoutIcon, UserIcon} from "tdesign-icons-react";
import {getUserInfo, isUserLogin} from "../../api/user.ts";

export interface userInfoProps {
  uid: number | null;
  name: string;
  avatar: string;
  lotName: string;
}

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
  const defaultAvatar = 'https://ss0.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2279408239,3825398873&fm=253&gp=0.jpg';
  const [userInfo, setUserInfo] = useState<userInfoProps>({
    uid: null,
    name: '',
    avatar: '',
    lotName: '',
  });

  const getUser = () => {
    getUserInfo().then((res) => {
      if (res.data.code === 200) {
        setUserInfo({
          uid: res.data.data.uid,
          name: res.data.data.name,
          avatar: res.data.data.avatar,
          lotName: res.data.data.lotName,
        });
        localStorage.setItem('uid', res.data.data.uid.toString());
      }
    });
  }

  useEffect(() => {
    if (isUserLogin()) {
      getUser();
    }
  }, []);

  return (
    <>
      {
        userInfo.uid ? (
          <Dropdown
            placement='bottom'
            popupProps={{
              delay: 100,
            }}
            panelTopContent={
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                <div style={{fontSize: '16px'}}>uid: <span style={{fontWeight: 'bold'}}>{userInfo.uid}</span></div>
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
                  localStorage.removeItem('uid');
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