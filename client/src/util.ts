import { useState, useEffect } from 'react';
import IPostReddit from './interfaces/IPostReddit';

export function useConnection(url: string) {
  const [data, setData] = useState<IPostReddit[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(url)
      .then(async response => {
        if (response.status === 200 || response.statusText === 'ok') {
          const json = await response.json();
          setIsLoading(false);
          setHasError(false);
          setData(json);
        }
      }).catch((error) => { 
        setIsLoading(false);
        setHasError(true);
      });
  }, []);

  return  { data, isLoading, hasError }; 
}
