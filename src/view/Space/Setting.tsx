import {memo, useState} from "react";
import './Setting.less';
import {useTitle} from "../../hook";
import {Divider, Input, Upload} from "tdesign-react";

const Setting = memo(() => {
  useTitle('设置');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userInfo, _setUserInfo] = useState({
    avatar: '',
    nickname: 'Tom',
    lotName: '海阔天空',
  });
  const [files, setFiles] = useState([
    {
      url: userInfo.avatar || 'https://tdesign.gtimg.com/site/avatar.jpg',
      name: 'avatar.jpg',
      status: 'success',
    },
  ]);

  return (
    <div className='bid-q-space-setting-container'>
      <ValueField label={'用户名'} initValue={userInfo.nickname}/>
      <Divider/>
      <ValueField label={'拍卖名'} initValue={userInfo.lotName}/>
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
          action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
          theme="image"
          accept="image/*"
          locale={{
            triggerUploadText: {
              image: '请选择图片',
            },
          }}
          formatResponse={(response) => {
            // 检查服务器返回的数据格式
            if (response && response.url) {
              return {
                url: response.url, // 图片 URL
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
          <p onClick={() => setIsEdit(true)}>{value}</p>
        )}
      </div>
    );
  },
);

export default Setting;