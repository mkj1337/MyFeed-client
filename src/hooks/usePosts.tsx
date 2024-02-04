import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

type usePostsProps = {
  baseURL: string;
  type?: "POST" | "GET";
  sendData?: any;
  dep?: any;
};

export const usePosts = <T extends unknown>({
  baseURL,
  type = 'GET',
  sendData,
  dep,
}: usePostsProps) => {
  const [posts, setPosts] = useState<T[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const initialRenderRef = useRef<boolean>(true);

  const getData = () => {
    setTimeout(async () => {
      try {
        const { data } = await axios({
          method: type,
          url: `${baseURL}?page=${page}`,
          data: { sendData },
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
            Expires: '0',
          },
        });
        setPosts((prev: T[]) => {
          return [...prev, ...data];
        });
        setIsLoading(false);
      } catch (err: any) {
        console.log(err.response.data);
      }
    }, 150);
  };

  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }
    getData();
  }, [page]);

  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }
    setPage(1);
    setPosts([]);
    getData();
  }, [dep]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 600 >=
      document.documentElement.scrollHeight
    ) {
      setIsLoading(true);
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { isLoading, posts };
};
