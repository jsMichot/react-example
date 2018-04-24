import React, {Component} from 'react';

export function reducer(state, action = {}) {
  switch (action.type) {
    case 'GetLaborFactorTableData':
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([
            {id: 1, size: 1, class: '150', schedule: '1', laborFactor: 1.2},
            {id: 2, size: 1, class: '300', schedule: '2', laborFactor: 2.2},
            {id: 3, size: 2, class: '150', schedule: '', laborFactor: 1.2},
            {id: 4, size: 2, class: '300', schedule: '2', laborFactor: 2.2},
            {id: 5, size: 3, class: '150', schedule: '', laborFactor: 1.2},
            {id: 6, size: 3, class: '300', schedule: '3', laborFactor: 1.3},
            {id: 7, size: 3, class: '450', schedule: '', laborFactor: 1.4},
          ]);
        }, 500);
      });
    case 'ComputeDataForLaborFactorTable':
      console.log(action.payload);
      const stateMap = action.payload.reduce(
        (acc, item) => {
          acc.sizes[item.size] = true;

          const key = `${item.class}|${item.schedule}`;
          acc.computedLookupTable[key] = acc.computedLookupTable[key] || {
            class: item.class,
            schedule: item.schedule,
          };
          acc.computedLookupTable[key][item.size] = item;
          return acc;
        },
        {sizes: {}, computedLookupTable: {}}
      );
      stateMap.sizes = Object.keys(stateMap.sizes).map(x => parseInt(x, 10));
      stateMap.rows = Object.keys(stateMap.computedLookupTable).map(
        x => stateMap.computedLookupTable[x]
      );
      console.log(stateMap);
      return {
        ...state,
        sizes: stateMap.sizes,
        computedLookupTable: stateMap.rows,
      };
    default:
      return state;
  }
}

class LaborFactorTable2 extends Component {
  state = {};

  componentDidMount() {
    reducer(this.state, {type: 'GetLaborFactorTable'}).then(data => {
      reducer(this.state, {
        type: 'ComputeDataForLaberFactorTable',
        payload: data,
      });
    });
  }

  render() {
    return <div />;
  }
}

export default LaborFactorTable2;
