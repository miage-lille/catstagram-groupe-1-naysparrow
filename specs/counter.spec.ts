import * as fc from 'fast-check';
import { getCmd, getModel } from 'redux-loop';
import reducer, { counterSelector, State } from '../src/reducer';
import { getState, getStateWithCounterEquals3 } from './generators';

describe('Counter Component', () => {
  // Test initial state
  test('initial state should have counter set to 3', () => {
    const initialState = reducer(undefined, { type: 'INIT' } as any);
    expect(counterSelector(getModel(initialState))).toBe(3);
  });

  // Test counter minimum value constraint
  test('counter should not go below 3', () => {
    fc.assert(
      fc.property(getStateWithCounterEquals3(), (state: State) => {
        const nextState = reducer(state, { type: 'DECREMENT' });
        expect(counterSelector(getModel(nextState))).toBeGreaterThanOrEqual(3);
      })
    );
  });

  // Test increment functionality
  test('increment should always increase counter by 1', () => {
    fc.assert(
      fc.property(getStateWithCounterEquals3(), (state: State) => {
        const nextState = reducer(state, { type: 'INCREMENT' });
        expect(counterSelector(getModel(nextState))).toBe(counterSelector(state) + 1);
      })
    );
  });

  // Test decrement functionality when counter > 3
  test('decrement should decrease counter by 1 when counter > 3', () => {
    fc.assert(
      fc.property(
        getState().filter((s: State) => s.counter > 3),
        (state: State) => {
          const nextState = reducer(state, { type: 'DECREMENT' });
          expect(counterSelector(getModel(nextState))).toBe(counterSelector(state) - 1);
        }
      )
    );
  });

  // Test decrement when counter is 3
  test('decrement should not change counter when counter is 3', () => {
    fc.assert(
      fc.property(getStateWithCounterEquals3(), (state: State) => {
        const nextState = reducer(state, { type: 'DECREMENT' });
        expect(counterSelector(getModel(nextState))).toBe(3);
      })
    );
  });
});