// import React from 'react';
// import {create} from 'react-test-renderer';
// import {reducer} from './LaborFactorTable2';
// import App from './App';

// it('action: ComputeDataForLaborFactorTable should return the proper items', () => {
// arrange
// const currentState = {};
// const action = {
//   type: 'ComputeDataForLaborFactorTable',
//   payload: [
//     {id: 1, size: 1, class: '150', schedule: '1', laborFactor: 1.2},
//     {id: 2, size: 1, class: '300', schedule: '2', laborFactor: 2.2},
//     {id: 3, size: 2, class: '150', schedule: '', laborFactor: 1.2},
//     {id: 4, size: 2, class: '300', schedule: '2', laborFactor: 2.2},
//     {id: 5, size: 3, class: '150', schedule: '', laborFactor: 1.2},
//     {id: 6, size: 3, class: '300', schedule: '3', laborFactor: 1.3},
//     {id: 7, size: 3, class: '450', schedule: '', laborFactor: 1.4},
//   ],
// };
// act
// const nextState = reducer(currentState, action);
// assert
//   expect(nextState).toEqual({
//     sizes: [1, 2, 3],
//     dataMap: {
//       1: {id: 1, size: 1, class: '150', schedule: '1', laborFactor: 1.2},
//       2: {id: 2, size: 1, class: '300', schedule: '2', laborFactor: 2.2},
//       3: {id: 3, size: 2, class: '150', schedule: '', laborFactor: 1.2},
//       4: {id: 4, size: 2, class: '300', schedule: '2', laborFactor: 2.2},
//       5: {id: 5, size: 3, class: '150', schedule: '', laborFactor: 1.2},
//       6: {id: 6, size: 3, class: '300', schedule: '3', laborFactor: 1.3},
//       7: {id: 7, size: 3, class: '450', schedule: '', laborFactor: 1.4},
//     },
//     computedLookupTable: [
//       {schedule: '1', class: '150', 1: 1.2, 2: null, 3: null},
//       {schedule: '2', class: '300', 1: 2.2, 2: 2.2, 3: null},
//       {schedule: '', class: '150', 1: null, 2: 1.2, 3: 1.2},
//       {schedule: '3', class: '300', 1: null, 2: null, 3: 1.3},
//       {schedule: '', class: '450', 1: null, 2: null, 3: 1.4},
//     ],
//   });
// });
