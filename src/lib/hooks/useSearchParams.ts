import { useLocation } from 'react-router-dom';

export function useSearchParams() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  return {
    get: (key: string) => params.get(key),
    has: (key: string) => params.has(key),
    toString: () => params.toString(),
  };
}
