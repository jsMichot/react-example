import React from 'react';
import {create} from 'react-test-renderer';
import {reducer, LaborFactorTable} from './App';

it('component: LaborFactorTable => derive row and size data from props', () => {
  const DATA = [
    {id: 1, size: 1, class: '150', schedule: '1', laborFactor: 1.2},
    {id: 4, size: 1.5, class: '150', schedule: '1', laborFactor: 1.2},
    {id: 2, size: 1, class: '300', schedule: '2', laborFactor: 2.2},
    {id: 3, size: 2, class: '150', schedule: '', laborFactor: 1.2},
  ];

  expect(LaborFactorTable.getDerivedStateFromProps({data: DATA})).toEqual({
    sizes: [1, 1.5, 2],
    rows: [
      {
        schedule: '1',
        class: '150',
        1: {id: 1, size: 1, class: '150', schedule: '1', laborFactor: 1.2},
        1.5: {id: 4, size: 1.5, class: '150', schedule: '1', laborFactor: 1.2},
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
  const record2 = {class: '222', schedule: '222', size: 2};
  const state = {
    testing: true,
    mutations: {
      [`${record.class}|${record.schedule}|${record.size}`]: record,
      [`${record2.class}|${record2.schedule}|${record2.size}`]: record2,
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
    mutations: {
      [`${record2.class}|${record2.schedule}|${record2.size}`]: record2,
    },
    testing: true,
  });
});

it('reducer: CANCEL_CHANGES', () => {
  // arrange
  const state = {
    mutations: {class: '123', schedule: '123', size: 1},
    editingRow: {
      class: '123',
      schedule: '123',
      1: {
        class: '123',
        schedule: '123',
        size: 1,
      },
    },
  };
  const action = {type: 'CANCEL_CHANGES'};

  //act
  const nextState = reducer(state, action);

  // assert
  expect(nextState).toEqual({mutations: {}, editingRow: null});
});

it('reducer: ENTER_ADDING_SIZE_MODE', () => {
  // arrange
  const state = {addingSize: false};
  // act
  const newState = reducer(state, {type: 'ENTER_ADDING_SIZE_MODE'});
  // assert
  expect(newState).toEqual({addingSize: true});
});

it('reducer: EXIT_ADDING_SIZE_MODE', () => {
  // arrange
  const state = {addingSize: true};
  // act
  const newState = reducer(state, {type: 'EXIT_ADDING_SIZE_MODE'});
  // assert
  expect(newState).toEqual({addingSize: false});
});

it('reducer: SAVE_NEW_SIZE', () => {
  // arrange
  const state = {sizes: [1, 2, 3]};
  // act
  const newState = reducer(state, {type: 'SAVE_NEW_SIZE', payload: 2.5});
  // assert
  expect(newState).toEqual({sizes: [1, 2, 2.5, 3], addingSize: false});
});

it('reducer: ENTER_ADDING_CLASS|SCHEDULE_MODE', () => {
  // arrange
  const state = {addingClassSchedule: false};
  // act
  const newState = reducer(state, {type: 'ENTER_ADDING_CLASS|SCHEDULE_MODE'});
  // assert
  expect(newState).toEqual({addingClassSchedule: true});
});

it('reducer: EXIT_ADDING_CLASS|SCHEDULE_MODE', () => {
  // arrange
  const state = {addingClassSchedule: true};
  // act
  const newState = reducer(state, {type: 'EXIT_ADDING_CLASS|SCHEDULE_MODE'});
  // assert
  expect(newState).toEqual({addingClassSchedule: false});
});

it('reducer: SAVE_NEW_CLASS|SCHEDULE', () => {
  // arrange
  const state = {rows: [], addingClassSchedule: true};
  // act
  const newState = reducer(state, {
    type: 'SAVE_NEW_CLASS|SCHEDULE',
    payload: {class: '400', schedule: ''},
  });
  // assert
  expect(newState).toEqual({
    rows: [{class: '400', schedule: ''}],
    addingClassSchedule: false,
  });
});

xit('render: default with data', () => {
  const DATA = [
    {id: 1, size: 1, class: '150', schedule: '80', laborFactor: 1.2},
    {id: 2, size: 1, class: '300', schedule: '', laborFactor: 2.2},
    {id: 3, size: 2, class: '150', schedule: '', laborFactor: 1.2},
  ];

  const component = create(<LaborFactorTable data={DATA} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

xit('render: default with edited row', () => {
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

xit('render: default with cell autofocus', () => {
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

xit('render: cell click triggers editing & autofocus', () => {
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
