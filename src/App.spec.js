import React from 'react';
import {create} from 'react-test-renderer';
import {reducer} from './Components/LaborFactorTable';
import App from '../App';

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

describe('LaborFactorTable', () => {
  beforeEach(() => {
    create(<App />);
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

  it('editLaborFactor should set editValues to scheduleClassPairs', () => {
    this.scheduleClassPairs = [{ foo: 1 }];
    this.editLaborFactor();

    expect(this.editing).toBe(true);
    expect(this.editValues).toEqual([{ foo: 1 }]);
  });

  it('setLaborFactor should set scheduleClassPairs to editValues', () => {
    this.editing = true;
    this.setLaborFactors();

    expect(this.editing).toBe(false);
  });

  it('cancelEdit should set scheduleClassPairs to editValues and editing to false', () => {
    this.editValues = [{ foo: 1 }];
    this.scheduleClassPairs = [{ foo: 2 }];
    this.cancelEdit();
    expect(this.scheduleClassPairs).toEqual([{ foo: 1 }]);
    expect(this.editing).toBe(false);
  });

  it('when editLaborFactor is called editValues and scheduleClassPairs should not point to the same array nor the same objects', () => {
    this.scheduleClassPairs = [{ foo: 1 }];
    this.editLaborFactor();
    this.editValues[0].foo = 2;

    expect(this.scheduleClassPairs).toEqual([{ foo: 1 }]);
  });

  it('when cancelEdit is called editValues and scheduleClassPairs should not point to the same array nor the same objects (i.e. editValues retains the pre-editing values of scheduleClassPairs)', () => {
    this.scheduleClassPairs = [{ foo: 1 }];
    this.editLaborFactor();
    this.scheduleClassPairs[0].foo = 2;
    this.cancelEdit();

    expect(this.editValues).toEqual([{ foo: 1 }]);
  });

  it('when addNewColumn is called sizes should be cloned to tempSizes (separate arrays) with an added size of the next whole number', () => {
    this.sizes = [1, 2, 3];
    this.addNewColumn();
    expect(this.tempSizes).toEqual([1, 2, 3, 4]);
    this.sizes = [1, 2, 3, 4.34];
    this.addNewColumn();
    expect(this.tempSizes).toEqual([1, 2, 3, 4.34, 5]);
  });

  it('when addNewColumn is called addingColumn should be set to true', () => {
    this.addNewColumn();
    expect(this.addingColumn).toBe(true);
  });
  it('when saveNewColumn is called sizes should not contain any duplicates', () => {
    this.sizes = [1, 2, 3, 3];
    this.tempSizes = [1, 2, 3, 3, 3];
    this.saveNewColumn();
    expect(this.sizes).toEqual([1, 2, 3]);
  });

  it('when deleteNewColumn is called addingColumn should be set to false', () => {
    this.deleteNewColumn();
    expect(this.addingColumn).toBe(false);
  });

  it('when saveNewColumn is called sizes should be sorted', () => {
    const data = [
      { id: 1, size: 1, class: '150', schedule: '1', laborFactor: 1.2 },
      { id: 1, size: 1, class: '300', schedule: '2', laborFactor: 2.2 },
      { id: 1, size: 2, class: '150', schedule: '', laborFactor: 1.2 },
      { id: 1, size: 2, class: '300', schedule: '2', laborFactor: 2.2 },
      { id: 1, size: 3, class: '150', schedule: '', laborFactor: 1.2 },
      { id: 1, size: 3, class: '300', schedule: '3', laborFactor: 1.3 },
      { id: 1, size: 3, class: '450', schedule: '', laborFactor: 1.4 },
    ];
    this.sizes = [1, 2, 3];
    this.addNewColumn();
    this.sizes.push(2.5);
    this.saveNewColumn();
    expect(this.sizes).toEqual([1, 2, 2.5, 3, 4]);
  });

  it('addNewRow should set addingRow to true', () => {
    this.addingRow = false;
    this.addNewRow();
    expect(this.addingRow).toBe(true);
  });

  it('saveNewRow should add the new item to data', () => {
    this.data = [
      { id: 1, size: 1, class: '150', schedule: '1', laborFactor: 1.2 },
      { id: 1, size: 1, class: '300', schedule: '2', laborFactor: 2.2 },
      { id: 1, size: 2, class: '150', schedule: '', laborFactor: 1.2 },
      { id: 1, size: 2, class: '300', schedule: '2', laborFactor: 2.2 },
      { id: 1, size: 3, class: '150', schedule: '', laborFactor: 1.2 },
      { id: 1, size: 3, class: '300', schedule: '3', laborFactor: 1.3 },
      { id: 1, size: 3, class: '450', schedule: '', laborFactor: 1.4 },
    ];
    this.newRowId = 1;
    this.newRowClass = '200';
    this.newRowSchedule = '';
    this.saveNewRow();
    expect(this.data).toEqual([
      { id: 1, size: 1, class: '150', schedule: '1', laborFactor: 1.2 },
      { id: 1, size: 1, class: '300', schedule: '2', laborFactor: 2.2 },
      { id: 1, size: 2, class: '150', schedule: '', laborFactor: 1.2 },
      { id: 1, size: 2, class: '300', schedule: '2', laborFactor: 2.2 },
      { id: 1, size: 3, class: '150', schedule: '', laborFactor: 1.2 },
      { id: 1, size: 3, class: '300', schedule: '3', laborFactor: 1.3 },
      { id: 1, size: 3, class: '450', schedule: '', laborFactor: 1.4 },
      { id: 1, class: '200', schedule: '' },
    ]);
  });

  it('cancelNewRow should set newRowId to 1', () => {
    this.newRowId = 4;
    this.cancelNewRow();
    expect(this.newRowId).toBe(1);
  });

  it('cancelNewRow should set newRowClass to an empty string', () => {
    this.newRowClass = '350';
    this.cancelNewRow();
    expect(this.newRowClass).toBe('');
  });

  it('cancelNewRow should set newRowSchedule to an empty string', () => {
    this.newRowSchedule = '3';
    this.cancelNewRow();
    expect(this.newRowSchedule).toBe('');
  });

  it('cancelNewRow should set addingRow to false', () => {
    this.addingRow = true;
    this.cancelNewRow();
    expect(this.addingRow).toBe(false);
  });

});
