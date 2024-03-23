import { useState } from 'react';
import { GalleryImg, GalleryItem } from './ImageGalleryItem.styled';
import { ImageModal } from '../Modal/Modal';

export const ImageGalleryItem = ({ url, src, tags }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <GalleryItem>
        <GalleryImg src={src} alt={tags} onClick={openModal} />

        <ImageModal isOpen={isModalOpen} onClose={closeModal} item={url} />
      </GalleryItem>
    </>
  );
};

