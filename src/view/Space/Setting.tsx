import {memo, useState, useEffect} from "react";
import './Setting.less';
import {useTitle} from "../../hook";
import {Divider, Input, Upload, MessagePlugin} from "tdesign-react";
import {getUserInfo, isUserLogin, updateUserInfo} from "../../api/user.ts";
import {useNavigate} from "react-router-dom";

const Setting = memo(() => {
  useTitle('设置');
  const navigate = useNavigate();
  const uid = localStorage.getItem('uid') || '';
  const [userInfo, setUserInfo] = useState({
    avatar: '',
    nickname: '',
    lotName: '',
  });
  const [files, setFiles] = useState([
    {
      url: userInfo.avatar || 'https://ss0.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2279408239,3825398873&fm=253&gp=0.jpg',
      status: 'success',
    },
  ]);
  const [flag, setFlag] = useState(false);

  const updateUser = (info: { nickname?: string; lotName?: string }) => {
    const data = {
      uid: Number(uid),
      nickname: info.nickname || userInfo.nickname,
      lotName: info.lotName || userInfo.lotName,
      avatar: userInfo.avatar,
    }
    updateUserInfo(data).then(res => {
      if (res.data.code === 200) {
        MessagePlugin.success('修改成功');
        getUserInfo().then(res => {
          if (res.data.code === 200) {
            setUserInfo({
              nickname: res.data.data.name,
              avatar: res.data.data.avatar,
              lotName: res.data.data.lotName,
            });
          }
        });
      }
    })
  }

  useEffect(() => {
    if (!isUserLogin()) {
      navigate('/login', {replace: true});
    }
  }, []);

  useEffect(() => {
    getUserInfo().then(res => {
      if (res.data.code === 200) {
        setUserInfo({
          nickname: res.data.data.name,
          avatar: res.data.data.avatar,
          lotName: res.data.data.lotName,
        });
        setFiles([
          {
            url: res.data.data.avatar,
            status: 'success',
          },
        ]);
      }
    });
  }, []);

  useEffect(() => {
    if (flag && userInfo.avatar) {
      updateUser({});
      window.location.reload();
    }
  }, [userInfo.avatar]);

  return (
    <div className='bid-q-space-setting-container'>
      <ValueField label={'用户名'} initValue={userInfo.nickname} onBlur={(value) => updateUser({nickname:value})}/>
      <Divider/>
      <ValueField label={'拍卖名'} initValue={userInfo.lotName} onBlur={(value) => updateUser({lotName:value})}/>
      <Divider/>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <div className='bid-q-space-setting-value-field-label'>用户头像</div>
        <Upload
          style={{
            borderRadius: '50%',
            overflow: 'hidden'
          }}
          files={files}
          onChange={setFiles}
          showImageFileName={false}
          action="//localhost:8080/api/files/upload"
          theme="image"
          accept="image/*"
          locale={{
            triggerUploadText: {
              image: '请选择图片',
            },
          }}
          formatResponse={(response) => {
            // 检查服务器返回的数据格式
            if (response.code === 200) {
              setFiles([
                {
                  url: response.data,
                  status: "success",
                },
              ]);
              setUserInfo({...userInfo, avatar: response.data});
              setFlag(true);
              return {
                url: response.data, // 图片 URL
                status: "success", // 上传状态
              };
            }
            return {
              error: "上传失败，请稍后重试", // 错误信息
              status: "fail", // 失败状态
            };
          }}
        />
      </div>
    </div>
  )
});

const ValueField = memo(
  (props: {
    label: string;
    initValue: string;
    onChange?: (value: string) => void;
    onBlur?: (value: string) => void;
  }) => {
    const {label, initValue, onChange, onBlur} = props;
    const [isEdit, setIsEdit] = useState(false);
    const [value, setValue] = useState(initValue);

    useEffect(() => {
      setValue(initValue);
    }, [initValue]);

    return (
      <div className='bid-q-space-setting-value-field-container'>
        <p className='bid-q-space-setting-value-field-label'>{label}</p>
        {isEdit ? (
          <Input
            autoWidth={true}
            value={value}
            onChange={(value) => {
              onChange?.(value);
              setValue(value);
            }}
            onBlur={() => {
              setIsEdit(false);
              onBlur?.(value);
            }}
            onKeydown={(value, context) => {
              if (context.e.key === 'Enter') {
                setIsEdit(false);
                onBlur?.(value);
                context.e.preventDefault();
              }
            }}
          />
        ) : (
          <p onClick={() => setIsEdit(true)}>{value || '请点击设置'}</p>
        )}
      </div>
    );
  },
);

export default Setting;