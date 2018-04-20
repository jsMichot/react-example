import React, {Component} from 'react';
import _ from 'lodash';

export function reducer(state, action = {}) {
  switch (action.type) {
    case 'GetLaborFactorData':
      return {
        data: [
          {id: 1, size: 1, class: '150', schedule: '', laborFactor: 1.2},
          {id: 1, size: 1, class: '300', schedule: '', laborFactor: 2.2},
          {id: 1, size: 2, class: '150', schedule: '', laborFactor: 1.2},
          {id: 1, size: 2, class: '300', schedule: '', laborFactor: 2.2},
          {id: 1, size: 3, class: '150', schedule: '', laborFactor: 1.2},
          {id: 1, size: 3, class: '300', schedule: '', laborFactor: 1.3},
          {id: 1, size: 3, class: '450', schedule: '', laborFactor: 1.4},
          {id: 1, size: 3, class: '450', schedule: '80', laborFactor: 1.4},
        ],
      };

    default:
      return state;
  }
}

class LaborFactorTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      sizes: [],
    };
  }
  componentDidMount() {
    const items = reducer(this.state, {type: 'GetLaborFactorData'});
    this.setState({data: items}, () => {
      console.dir(this.state);
    });
  }
  render() {
    return (
      <div>
        <h1>Labor Factor Table</h1>
      </div>
    );
  }
}

export default LaborFactorTable;
