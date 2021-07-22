import React, { useState } from 'react';
import { GalleryPhoto } from "./index";
import styles from "./EachImage.less";

interface EachImageProps {
  photo: GalleryPhoto;
  margin?: string
}

const EachImage: React.FC<EachImageProps> = (props) => {
  const { photo, margin } = props;
  const [maskShow, setMaskShow] = useState<Boolean>(false);
  const showMask = () => {
    setMaskShow(true)
  }
  const hideMask = () => {
    setMaskShow(false)
  }

  return (
    <div className={styles.eachImage} onMouseOver={showMask} onMouseOut={hideMask} style={{ height: photo.height, width: photo.width, margin }}>
      {/* 遮罩 */}
      <div className={styles.mask + (maskShow ? ` ${styles.maskShow}` : "")}>
        
      </div>
      {/* 图片 */}
      <img  alt={photo.alt} src={ photo.src } width={photo.width} height={photo.height} />
    </div>
  );
}

export default EachImage;