import {Image, ImageViewer, ImageViewerProps, Space} from "tdesign-react";
import {BrowseIcon} from "tdesign-icons-react";

export const BasicImageViewer = (img: string, title: string) => {
  const trigger: ImageViewerProps['trigger'] = ({open}) => {
    const mask = (
      <div
        style={{
          background: 'rgba(0,0,0,.6)',
          color: '#fff',
          height: '100%',
          position: 'relative',
        }}
        onClick={open}
      >
        <span style={{position: 'absolute', left: 3, top: 16}}>
          <BrowseIcon size="16px" name={'browse'}/> 预览
        </span>
      </div>
    );

    return (
      <Image
        alt={title}
        src={img}
        overlayContent={mask}
        overlayTrigger="hover"
        fit="cover"
      />
    );
  };

  return (
    <Space breakLine size={16}>
      <ImageViewer trigger={trigger} images={[img]}/>
    </Space>
  );
}