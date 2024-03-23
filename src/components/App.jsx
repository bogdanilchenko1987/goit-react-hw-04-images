import { useEffect, useState } from 'react';
import { Container } from './Container.styled';

import { Searchbar } from './Searchbar/Searchbar';
import { ButtonLoader } from './ButtonLoader/ButtonLoader';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loading } from './Loading/Loading';

import toast, { Toaster } from 'react-hot-toast';

import { fetchImages } from '../api';

export const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [loadmore, setLoadmore] = useState(true);

  useEffect(() => {
    if (!query) {
      return;
    }

    async function fetchImg() {
      try {
        const indexOfSlash = query.indexOf('/');
        const newSearchQuery = query.slice(indexOfSlash + 1);

        if (!newSearchQuery) {
          toast.error('Sorry, search field is empty!');
          return;
        }

        setIsLoading(true);
        setLoadmore(false);
        const response = await fetchImages(newSearchQuery, page);
        setImages(prevImages => [...prevImages, ...response.hits]);
        setIsLoading(false);
        setLoadmore(true);
        console.log(response);

        // if (response.totalHits===0 || response.hits.length===0)
        if (!response.totalHits || !response.hits.length) {
          toast.error('Sorry, thats all we got!');
          setLoadmore(false);
        } else {
          setLoadmore(true);
        }
      } catch (error) {
        setIsLoading(false);
        setError(true);
        toast.error('You catch an Error!');
      }
    }

    fetchImg();
  }, [query, page]);

  const handleSubmit = e => {
    e.preventDefault();

    const searchQuery = e.target.input.value;

    setQuery(`${Date.now()}/${searchQuery.trim('')}`);
    setPage(1);
    setImages([]);
    console.log(query);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const isListEmpty = Boolean(images.length);

  return (
    <Container>
      <Searchbar onSubmit={handleSubmit} />
      {error && (
        <b>Oops! Something went wrong! Please try reloading this page!</b>
      )}
      {isListEmpty && <ImageGallery items={images} />}
      <Loading isVisible={isLoading} />
      {loadmore && isListEmpty && <ButtonLoader onClick={handleLoadMore} />}
      <Toaster />
    </Container>
  );
};
