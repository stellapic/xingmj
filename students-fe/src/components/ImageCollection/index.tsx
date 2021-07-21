import React, { useEffect, useState } from "react";
import Gallery from "react-photo-gallery";
import { Photo } from "../../models/photo.interface";
import { apiListPhotos, ListPhotosParam } from "../../request/api";

interface ImageCollectionProps { categoryName?: string }

interface GalleryPhoto {
  src: string;
  srcSet?: string | string[] | undefined;
  sizes?: string | string[] | undefined;
  width: number;
  height: number;
  alt?: string | undefined;
  key?: string | undefined;
}

const ImageCollection: React.FC<ImageCollectionProps> = (props) => {
  const { categoryName } = props;
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const params: ListPhotosParam = {
    size: 20,
    page: 0
  }
  if (categoryName !== "all") params.category = categoryName;

  useEffect(() => {
    apiListPhotos(params).then((res) => {
      console.log(res);
      
      const newPhotos: GalleryPhoto[] = res.data.data.map((item: Photo) => {
        return {
          src: item.image + '_medium.jpg',
          width: item.width,
          height: item.height,
          alt: item.title,
        }
      });
      setPhotos(newPhotos);
    });
  }, []);

  return (
    <Gallery photos={photos} />
  );
};

export default ImageCollection;
