import { Box, Button } from '@chakra-ui/react';
import { AxiosResponse } from 'axios';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';
import { CardList } from '../components/CardList';
import { Error } from '../components/Error';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { api } from '../services/api';

type Image = {
  id: string;
  title: string;
  description: string;
  url: string;
  ts: number;
};

type FetchResponse = {
  after: string | null;
  data: Image[];
};

export default function Home(): JSX.Element {
  async function fetchImages({ pageParam = null }): Promise<FetchResponse> {
    const response = await api.get('/api/images', {
      params: {
        after: pageParam,
      },
    });

    return response.data;
  }

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchImages, {
    getNextPageParam: lastPage => lastPage.after ?? null,
  });

  const formattedData = useMemo(() => {
    return data?.pages.flatMap(unformatted => {
      return unformatted.data.flat();
    });
  }, [data]);

  if (isLoading) return <Loading />;

  if (isError) return <Error />;

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button
            mt="1rem"
            onClick={() => {
              fetchNextPage();
            }}
            isLoading={isFetchingNextPage}
            w={['100%', 'auto']}
            role="button"
          >
            Carregar mais
          </Button>
        )}
      </Box>
    </>
  );
}
