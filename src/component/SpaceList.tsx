import {Button, List, Space} from "tdesign-react";
import {BasicImageViewer} from "./BasicImageViewer.tsx";
import './SpaceList.less';

const {ListItem, ListItemMeta} = List;

interface listProps {
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
  onDeleteClick?: () => void;
  onEditClick?: () => void;
}

const SpaceList = (list: SpaceListProps) => {
  const action = list.type === "reservation" ?
    <Button theme="primary" onClick={list.onDeleteClick}>取消预约</Button> : list.type === "lot" ?
      (
        <Space>
          <Button theme="primary" onClick={list.onEditClick}>修改拍品</Button>
          <Button theme="danger" onClick={list.onDeleteClick}>删除拍品</Button>
        </Space>
      ) : <Button theme="danger" onClick={list.onDeleteClick}>删除历史</Button>;

  return (
    <List
      style={{cursor: 'pointer'}}
      split={true}
      size='large'
    >
      {
        list.list.map((item, index) => {
          return (
            <ListItem
              key={index}
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
                  <span style={{fontSize: 24}}>￥ </span>
                  <span style={{fontSize: 32, color: '#ff0000'}}>{item.price}</span>
                </div>
                <div>
                  {item.time}
                </div>
              </div>
            </ListItem>
          )
        })
      }
    </List>
  );
};

export default SpaceList;