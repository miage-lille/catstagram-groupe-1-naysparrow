import { Decrement, FetchCatsCommit, FetchCatsRequest, FetchCatsRollback, Increment } from './types/actions.type';

export const increment = (): Increment => ({ type: 'INCREMENT' });
export const decrement = (): Decrement => ({ type: 'DECREMENT' });


export const fetchCatsRequest = (counter: number): FetchCatsRequest => ({
  type: 'FETCH_CATS_REQUEST',
  method: 'GET',
  path: `https://pixabay.com/api/?key=24523143-8a90135b40ac6e775ba6758cb&per_page=${counter}&q=cat`,
});

export const fetchCatsCommit = (payload: unknown): FetchCatsCommit => ({ type: 'FETCH_CATS_COMMIT', payload });

export const fetchCatsRollback = (error: Error): FetchCatsRollback => ({ type: 'FETCH_CATS_ROLLBACK', error });