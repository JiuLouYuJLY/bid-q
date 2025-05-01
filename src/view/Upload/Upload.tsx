import {memo, useRef, useState, useEffect} from "react";
import Header from "../../component/header/Header.tsx";
import Footer from "../../component/footer/Footer.tsx";
import './Upload.less';
import {Button, DatePicker, Form, Input, TagInput, Textarea, Upload, Skeleton} from "tdesign-react";
import {useTitle} from "../../hook";
import {createAuction} from "../../api/auction.ts";
import {isUserLogin, isUserReject} from "../../api/user.ts";
import {useNavigate} from "react-router-dom";

interface FormData {
  title: string;
  img: string;
  price: string;
  tags: string[];
  desc: string;
  time: string;
}

interface FileItem {
  url: string;
  status: string;
}

const myUpload = memo(() => {
  useTitle('上传');
  const uid = localStorage.getItem('uid') || '';
  const {FormItem} = Form;
  const [formData, setFormData] = useState<FormData>({
    title: '',
    img: '',
    price: '',
    tags: [],
    desc: '',
    time: '',
  });
  const uploadRef = useRef(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [tip, setTip] = useState('');
  const [nowTime, setNowTime] = useState(new Date().getTime());
  const [end, setEnd] = useState(0);
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(true);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUserLogin()) {
      navigate('/login', {replace: true});
    }
    isUserReject(Number(uid)).then((res) => {
      if (res.data.code === 200) {
        if (res.data.data.hasBreach) {
          setEnd(new Date(res.data.data.latestBreachTime.replace('T', ' ')).getTime() + 24 * 60 * 60 * 1000 * 7);
        }
      }
    })
  }, []);

  const validate = () => {
    if (!formData.title) {
      setTip('请输入拍品名字');
      return false;
    }
    if (!formData.img) {
      setTip('请上传拍品图片');
      return false;
    }
    if (!formData.price) {
      setTip('请输入拍品起拍价');
      return false;
    }
    if (formData.tags.length === 0) {
      setTip('请输入拍品标签');
      return false;
    }
    if (!formData.desc) {
      setTip('请输入拍品描述');
      return false;
    }
    if (!formData.time) {
      setTip('请选择拍品截止时间');
      return false;
    }
    setTip('');
    return true;
  };

  const handleUpload = () => {
    if (!validate()) {
      return;
    }
    const creatData = {
      ...formData,
      price: Number(formData.price),
      time: formData.time.replace(' ', 'T'),
      uid: Number(localStorage.getItem('uid') || ''),
    }
    createAuction(creatData).then((res) => {
      if (res.data.success) {
        navigate('/space/lot', {replace: true});
      }
    })
  }

  const getEndTime = (nowTime: number) => {
    const res = end - nowTime;
    if (res > 0) {
      const day = Math.floor(res / (24 * 60 * 60 * 1000));
      const hour = Math.floor((res / (60 * 60 * 1000)) % 24);
      const minute = Math.floor((res / (60 * 1000)) % 60);
      const second = Math.floor((res / 1000) % 60);
      setLoading(false);
      return `${day}天${hour}小时${minute}分钟${second}秒`;
    } else {
      return '';
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setNowTime(new Date().getTime());
      setEndTime(getEndTime(nowTime));
    }, 1000);
    return () => {
      clearInterval(timer);
    }
  }, [nowTime]);

  return (
    <div>
      <Header/>
      <div className='bid-q-upload-container'>
        <div className='bid-q-upload-content'>
          {
            end - nowTime > 0 ? (
              <>
                <div style={{margin: '20px auto 20px', fontSize: '30px', fontWeight: 'bold'}}>
                  由于你七天内有过违约不发货将禁止上传拍品
                </div>
                <Skeleton animation='flashed' loading={loading}>
                  <div style={{fontSize: '30px', fontWeight: 'bold'}}>
                    离违约解禁还有:{endTime}
                  </div>
                </Skeleton>
              </>
            ) : (
              <>
                <Form statusIcon={true} className='bid-q-upload-form' style={{margin: '0 auto'}}>
                  <FormItem name="name" label="拍品名字">
                    <Input
                      value={formData.title}
                      onChange={(item) => setFormData({...formData, title: item})}
                      clearable={true}
                      placeholder="请输入拍卖品名字"
                    />
                  </FormItem>
                  <FormItem name="img" label="拍品图片">
                    <Upload
                      ref={uploadRef}
                      files={files}
                      onChange={setFiles}
                      action="//localhost:8080/api/files/upload"
                      theme="image"
                      tips="请选择单张图片文件上传"
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
                          setFormData({...formData, img: response.data});
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
                  </FormItem>
                  <FormItem name="price" label="起拍价">
                    <Input
                      value={formData.price}
                      onChange={(item) => setFormData({...formData, price: item})}
                      clearable={true}
                      placeholder="请输入拍卖品起拍价"
                    />
                  </FormItem>
                  <FormItem name="tag" label="拍品标签">
                    <TagInput
                      value={formData.tags}
                      onChange={(item) => setFormData({...formData, tags: item as string[]})}
                      clearable={true}
                      placeholder="请输入拍卖品标签(按Enter为一个标签)"
                      maxRows={3}
                    />
                  </FormItem>
                  <FormItem name="desc" label="拍品描述">
                    <Textarea
                      value={formData.desc}
                      onChange={(item) => setFormData({...formData, desc: item})}
                      placeholder="请输入拍卖品描述"
                      rows={5}
                    />
                  </FormItem>
                  <FormItem name="time" label="拍卖截止时间">
                    <DatePicker
                      enableTimePicker
                      disableDate={{
                        before: tomorrow.toISOString(),
                      }}
                      value={formData.time}
                      onChange={(item) => setFormData({...formData, time: item as string})}
                      clearable
                    />
                  </FormItem>
                  {
                    tip && <div style={{color: 'red', marginBottom: 10}}>{tip}</div>
                  }
                  <FormItem>
                    <Button theme="primary" block onClick={handleUpload}>
                      上传
                    </Button>
                  </FormItem>
                </Form>
              </>
            )
          }
        </div>
      </div>
      <Footer/>
    </div>
  )
});

export default myUpload;