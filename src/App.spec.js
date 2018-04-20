import React from 'react';
import {create} from 'react-test-renderer';
import App, {reducer} from './App';

it('should render component and its current state', () => {
  const component = create(<App />);
  const initialState = {count: 3};
  component.root.instance.setState(initialState);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it('component should show increment size if provided', () => {
  const component = create(<App step={5} />);
  const initialState = {count: 3};
  component.root.instance.setState(initialState);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it('action: INCREMENT should increment state by 1', () => {
  // arrange
  const currentState = {count: 1};
  const action = {type: 'INCREMENT'};
  // act
  const nextState = reducer(currentState, action);
  // assert
  expect(nextState).toEqual({count: 2});
});

it('action: INCREMENT should increment state by payload', () => {
  // arrange
  const currentState = {count: 1};
  const action = {type: 'INCREMENT', payload: 5};
  // act
  const nextState = reducer(currentState, action);
  // assert
  expect(nextState).toEqual({count: 6});
});

it('action: DECREMENT should increment state by -1', () => {
  // arrange
  const currentState = {count: 1};
  const action = {type: 'DECREMENT'};
  // act
  const nextState = reducer(currentState, action);
  // assert
  expect(nextState).toEqual({count: 0});
});
