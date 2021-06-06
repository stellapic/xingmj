import React, { useEffect, useState } from "react";
import Gallery from "react-photo-gallery";
import { Photo } from "../../models/photo.interface";
import { apiListPhotos } from "../../request/api";

interface ImageCollectionProps {}

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
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);

  useEffect(() => {
    apiListPhotos({
      size: 20,
      page: 0,
    }).then((res) => {
      const newPhotos: GalleryPhoto[] = res.data.map((item: Photo) => {
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
