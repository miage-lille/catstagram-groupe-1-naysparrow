import { Loop, Cmd, liftState, loop } from 'redux-loop';
import { compose } from 'redux';
import { Actions } from './types/actions.type';
import { Picture } from './types/picture.type';
import * as O from 'fp-ts/lib/Option';
import { loading, success, failure } from './api';
import { cmdFetch } from './commands';
import { fetchCatsRequest } from './actions';
import fakeData from './fake-datas.json'; 

export type State = {
  counter: number;
  pictures: Picture[]; 
  pictureSelected: O.Option<Picture>;
};

export const defaultState: State = {
  counter: 3,
  pictures: fakeData.slice(0, 3), 
  pictureSelected: O.none,
};

export const reducer = (state: State | undefined, action: Actions): State | Loop<State> => {
  if (!state) return defaultState;
  
  switch (action.type) {
    case 'INCREMENT': {
      const incrementedState = {
        ...state,
        counter: state.counter + 1,
        pictures: fakeData.slice(0, Math.min(state.counter + 1, fakeData.length)),
      };
      return loop(incrementedState, Cmd.action(fetchCatsRequest(state.counter + 1)));
    }
    
    case 'DECREMENT': {
      if (state.counter <= 3) return state;
      const decrementedState = {
        ...state,
        counter: state.counter - 1,
        pictures: fakeData.slice(0, Math.min(state.counter - 1, fakeData.length)),
      };
      return loop(decrementedState, Cmd.action(fetchCatsRequest(state.counter - 1)));
    }

    case 'FETCH_CATS_REQUEST':
      return loop(
        { ...state, pictures: loading() as Picture[] },
        cmdFetch(action)
      );

    case 'FETCH_CATS_COMMIT':
      return {
        ...state,
        pictures: success(action.payload ? (action.payload as Picture[]) : []) as Picture[]
      };

    case 'FETCH_CATS_ROLLBACK':
      return {
        ...state,
        pictures: failure(action.error.message) as Picture[]
      };

    case 'SELECT_PICTURE':
      return {
        ...state,
        pictureSelected: O.some(action.picture)
      };

    case 'CLOSE_MODAL':
      return {
        ...state,
        pictureSelected: O.none
      };

    default:
      return state;
  }
};

export const counterSelector = (state: State): number => state.counter;
export const picturesSelector = (state: State) => state.pictures;
export const getSelectedPicture = (state: State) => state.pictureSelected;

export default compose(liftState, reducer);