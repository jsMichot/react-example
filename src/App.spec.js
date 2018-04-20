import React from 'react';
import {create} from 'react-test-renderer';
import LaborFactorTable, {reducer} from './Components/LaborFactorTable';

xit('should render component and its current state', () => {
  const component = create(<App />);
  const initialState = {count: 3};
  component.root.instance.setState(initialState);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

xit('component should show increment size if provided', () => {
  const component = create(<App step={5} />);
  const initialState = {count: 3};
  component.root.instance.setState(initialState);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it('action: GetLaborFactorData should return the proper items', () => {
  // arrange
  const currentState = {data: []};
  const action = {type: 'GetLaborFactorData'};
  // act
  const nextState = reducer(currentState, action);
  // assert
  expect(nextState.data).toEqual([
    {id: 1, size: 1, class: '150', schedule: '', laborFactor: 1.2},
    {id: 1, size: 1, class: '300', schedule: '', laborFactor: 2.2},
    {id: 1, size: 2, class: '150', schedule: '', laborFactor: 1.2},
    {id: 1, size: 2, class: '300', schedule: '', laborFactor: 2.2},
    {id: 1, size: 3, class: '150', schedule: '', laborFactor: 1.2},
    {id: 1, size: 3, class: '300', schedule: '', laborFactor: 1.3},
    {id: 1, size: 3, class: '450', schedule: '', laborFactor: 1.4},
    {id: 1, size: 3, class: '450', schedule: '80', laborFactor: 1.4},
  ]);
});
