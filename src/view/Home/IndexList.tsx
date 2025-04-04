import {memo} from "react";

import "./IndexList.less";

interface IndexListItem {
  title: string;
  items: {
    tag: string;
    url: string;
  }[]
}

interface IndexListProps {
  data: IndexListItem[];
}

const IndexList = memo((props: IndexListProps) => {
  return (
    <div className='bid-q-home-index-list'>
      {
        props.data.map((item, index) => {
          return (
            <div key={index}>
              <div className='bid-q-home-index-list-title'>{item.title}</div>
              <div className='bid-q-home-index-list-item'>
                {
                  item.items.map((item, index) => {
                    return (
                      <div className='bid-q-home-index-list-item-item' key={index}>
                        <a href={item.url}>{item.tag}</a>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          );
        })
      }
    </div>
  )
});

export default IndexList;