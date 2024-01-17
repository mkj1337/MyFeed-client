import { useEffect, useState } from 'react';
import axios from 'axios';

type useFetchProps = {
  baseURL: string;
  type?: string;
  sendData?: any;
  dep?: any;
  arr?: boolean;
};

export const useFetch = ({
  baseURL,
  type = 'GET',
  sendData,
  dep,
}: useFetchProps) => {
  const [data, setData] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios({
          method: type,
          url: `${baseURL}`,
          data: { sendData },
        });
        setIsLoading(false);
        setData(data);
      } catch (err: any) {
        setError(err.response.data);
      }
    };
    fetchData();
  }, [dep]);

  return { isLoading, error, data };
};
