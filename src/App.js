import React, {Component} from 'react';
import _ from 'lodash';
import LaborFactorTable from './Components/LaborFactorTable';

class App extends Component {
  state = {
    count: 1,
  };
  render() {
    return (
      <div>
        <LaborFactorTable />
      </div>
    );
  }
}

export default App;
