import React from 'react';
import {create} from 'react-test-renderer';
import {reducer, LaborFactorTable} from './App';

it('component: LaborFactorTable => derive row and size data from props', () => {
  const DATA = [
    {id: 1, size: 1, class: '150', schedule: '1', laborFactor: 1.2},
    {id: 2, size: 1, class: '300', schedule: '2', laborFactor: 2.2},
    {id: 3, size: 2, class: '150', schedule: '', laborFactor: 1.2},
  ];

  expect(LaborFactorTable.getDerivedStateFromProps({data: DATA})).toEqual({
    sizes: [1, 2],
    rows: [
      {
        schedule: '1',
        class: '150',
        1: {id: 1, size: 1, class: '150', schedule: '1', laborFactor: 1.2},
      },
      {
        schedule: '2',
        class: '300',
        1: {id: 2, size: 1, class: '300', schedule: '2', laborFactor: 2.2},
      },
      {
        schedule: '',
        class: '150',
        2: {id: 3, size: 2, class: '150', schedule: '', laborFactor: 1.2},
      },
    ],
  });
});

it('reducer: EDIT_ROW', () => {
  // arrange
  const state = {};
  const action = {
    type: 'EDIT_ROW',
    payload: {
      row: {},
      targetIndex: 0,
    },
  };

  // act
  const nextState = reducer(state, action);

  // assert
  expect(nextState).toEqual({
    editingRow: {},
    targetIndex: 0,
  });
});

it('reducer: ADD_CHANGED_RECORD', () => {
  // arrange
  const state = {mutations: {}};
  const record = {class: '123', schedule: '123', size: 1};
  const action = {
    type: 'ADD_CHANGED_RECORD',
    payload: {
      record,
    },
  };

  // act
  const nextState = reducer(state, action);

  // assert
  expect(nextState).toEqual({
    mutations: {
      [`${record.class}|${record.schedule}|${record.size}`]: record,
    },
  });
});

it('reducer: REMOVE_CHANGED_RECORD', () => {
  // arrange
  const record = {class: '123', schedule: '123', size: 1};
  const state = {
    mutations: {
      [`${record.class}|${record.schedule}|${record.size}`]: record,
    },
  };
  const action = {
    type: 'REMOVE_CHANGED_RECORD',
    payload: {
      record,
    },
  };

  // act
  const nextState = reducer(state, action);

  // assert
  expect(nextState).toEqual({
    mutations: {},
  });
});

it('render: default with data', () => {
  const DATA = [
    {id: 1, size: 1, class: '150', schedule: '80', laborFactor: 1.2},
    {id: 2, size: 1, class: '300', schedule: '', laborFactor: 2.2},
    {id: 3, size: 2, class: '150', schedule: '', laborFactor: 1.2},
  ];

  const component = create(<LaborFactorTable data={DATA} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it('render: default with edited row', () => {
  const DATA = [
    {id: 1, size: 1, class: '150', schedule: '80', laborFactor: 1.2},
    {id: 2, size: 1, class: '300', schedule: '', laborFactor: 2.2},
    {id: 3, size: 2, class: '150', schedule: '', laborFactor: 1.2},
  ];

  const component = create(<LaborFactorTable data={DATA} />);
  const editingRow = component.root.instance.state.rows[0];
  component.root.instance.setState({editingRow});
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it('render: default with cell autofocus', () => {
  const DATA = [
    {id: 1, size: 1, class: '150', schedule: '80', laborFactor: 1.2},
    {id: 2, size: 1, class: '300', schedule: '', laborFactor: 2.2},
    {id: 3, size: 2, class: '150', schedule: '', laborFactor: 1.2},
  ];

  const component = create(<LaborFactorTable data={DATA} />);
  const editingRow = component.root.instance.state.rows[0];
  component.root.instance.setState({editingRow, targetIndex: 1});
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it('render: cell click triggers editing & autofocus', () => {
  const DATA = [
    {id: 1, size: 1, class: '150', schedule: '80', laborFactor: 1.2},
    {id: 2, size: 1, class: '300', schedule: '', laborFactor: 2.2},
    {id: 3, size: 2, class: '150', schedule: '', laborFactor: 1.2},
  ];

  const component = create(<LaborFactorTable data={DATA} />);
  /**
   * |===========================|
   * | Class | Sched |  1  |  2  |
   * |===========================|
   * |  150  |  80   | 1.2 |  0  |
   * |  300  |       | 2.2 |  0  |
   * |  150  |       |  0  |  X  | <== 2.2
   * |===========================|
   */
  component.root
    .findByType('tbody')
    .findAllByType('tr')[1]
    .findAllByType('td')[3]
    .props.onClick();
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
