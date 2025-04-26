import {Button, List, Space, Dialog, Input, Textarea, DatePicker, Upload, TagInput} from "tdesign-react";
import {useState, useRef, useEffect} from "react";
import {BasicImageViewer} from "./BasicImageViewer.tsx";
import './SpaceList.less';
import {useNavigate} from "react-router-dom";
import {getAuctionDetail} from "../api/auction.ts";

const {ListItem, ListItemMeta} = List;

interface listProps {
  aid: number;
  img: string;
  title: string;
  desc: string;
  price: string;
  time: string;
  link: string;
}

interface SpaceListProps {
  list: listProps[];
  type: string;
  onDeleteClick?: (aid: number) => void;
  onEditClick?: (data: AuctionInfoProps) => void;
}

export interface AuctionInfoProps {
  aid: number;
  title: string;
  desc: string;
  price: string;
  time: string;
  img: string;
  tags: string[];
}

const SpaceList = (list: SpaceListProps) => {
  const nav = useNavigate();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [auctionInfo, setAuctionInfo] = useState<AuctionInfoProps>({
    aid: 0,
    title: '',
    desc: '',
    price: '',
    time: '',
    img: '',
    tags: [],
  });
  const [data, setData] = useState({
    auction: {
      aid: 0,
      title: '',
      desc: '',
      img: '',
      price: '',
      time: '',
    },
    tags: [],
  });
  const uploadRef = useRef(null);
  const [files, setFiles] = useState([
    {
      url: '',
      status: '',
    }
  ]);

  const handleClose = () => {
    setLoading(false);
    setVisible(false);
    setAuctionInfo({
      aid: 0,
      title: '',
      desc: '',
      price: '',
      time: '',
      img: '',
      tags: [],
    });
    setFiles([
      {
        url: '',
        status: '',
      }
    ]);
  };

  const handleCloseAsync = () => {
    setLoading(true);
    list.onEditClick?.(auctionInfo);
    setLoading(false);
    handleClose();
  };

  useEffect(() => {
    if (data.auction.aid !== 0) {
      setAuctionInfo({
        aid: data.auction.aid,
        title: data.auction.title,
        desc: data.auction.desc,
        price: data.auction.price,
        img: data.auction.img,
        time: data.auction.time.replace('T', ' '),
        tags: data.tags,
      });
      setFiles([
        {
          url: data.auction.img,
          status: 'success',
        }
      ]);
      setVisible(true);
    }
  }, [data]);

  return (
    <List
      style={{cursor: 'pointer'}}
      split={true}
      size='large'
    >
      {
        list.list.map((item) => {
          const action = list.type === "reservation" ?
            (<Space>
                <Button theme="primary"
                        onClick={() => list.onDeleteClick?.(item.aid)}>取消预约</Button>
                <Button theme="default" onClick={() => {
                  nav(item.link)
                }}>前往拍卖</Button>
              </Space>
            )
            : list.type === "lot" ?
              (
                <Space>
                  <Button theme="primary" onClick={() => {
                    getAuctionDetail(item.aid).then((res) => {
                      if (res.data.code === 200) {
                        const data = res.data.data;
                        setData({
                          auction: data.auction,
                          tags: data.tags,
                        });
                      }
                    })
                  }}>修改拍品</Button>
                  <Button theme="danger" onClick={() => list.onDeleteClick?.(item.aid)}>删除拍品</Button>
                </Space>
              ) : <Button theme="danger" onClick={() => list.onDeleteClick?.(item.aid)}>删除历史</Button>;
          return (
            <div key={item.aid}>
              <ListItem
                key={item.aid}
                className='bid-q-space-list-item'
                action={action}
              >
                <ListItemMeta
                  image={
                    BasicImageViewer(item.img, item.title)
                  }
                  title={item.title}
                  description={item.desc}
                />
                <div>
                  <div>
                    <span style={{fontSize: 24}}>起拍价: ￥ </span>
                    <span style={{fontSize: 32, color: '#ff0000'}}>{item.price}</span>
                  </div>
                  <div>
                    拍卖截止: {item.time}
                  </div>
                </div>
              </ListItem>
              <Dialog
                header="修改拍品"
                visible={visible}
                confirmLoading={loading}
                onClose={handleClose}
                onConfirm={handleCloseAsync}
                top="5vh"
              >
                <div className='form-item'>
                  <div style={{width: '80px'}}>拍卖名字:</div>
                  <Input
                    value={auctionInfo?.title}
                    onChange={(item) => setAuctionInfo({...auctionInfo, title: item})}
                    clearable={true}
                    placeholder="请输入拍卖品名字"
                  />
                </div>
                <div className={'form-item'}>
                  <div style={{width: '80px'}}>拍卖图片:</div>
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
                        setAuctionInfo({...auctionInfo, img: response.data});
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
                <div className={'form-item'}>
                  <div style={{width: '80px'}}>拍卖价格:</div>
                  <Input
                    value={auctionInfo?.price}
                    onChange={(item) => setAuctionInfo({...auctionInfo, price: item})}
                    clearable={true}
                    placeholder="请输入拍卖品起拍价"
                  />
                </div>
                <div className={'form-item'}>
                  <div style={{width: '80px'}}>拍品标签:</div>
                  <TagInput
                    value={auctionInfo?.tags}
                    onChange={(item) => setAuctionInfo({...auctionInfo, tags: item as string[]})}
                    clearable={true}
                    placeholder="请输入拍卖品标签(按Enter为一个标签)"
                    maxRows={3}
                  />
                </div>
                <div className={'form-item'}>
                  <div style={{width: '80px'}}>拍卖描述:</div>
                  <Textarea
                    value={auctionInfo?.desc}
                    onChange={(item) => setAuctionInfo({...auctionInfo, desc: item})}
                    placeholder="请输入拍卖品描述"
                    rows={3}
                  />
                </div>
                <div className={'form-item'}>
                  <div style={{width: '80px'}}>拍卖时间:</div>
                  <DatePicker
                    enableTimePicker
                    value={auctionInfo?.time}
                    onChange={(item) => setAuctionInfo({...auctionInfo, time: item as string})}
                    clearable
                  />
                </div>
              </Dialog>
            </div>
          )
        })
      }
    </List>
  );
};

export default SpaceList;