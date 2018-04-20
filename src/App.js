import React, {Component} from 'react';
import _ from 'lodash';

export function reducer(state, action = {}) {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + (action.payload || 1),
      };
    case 'DECREMENT':
      return {
        ...state,
        count: state.count - 1,
      };
    default:
      return state;
  }
}

class App extends Component {
  state = {
    count: 1,
  };
  render() {
    return (
      <div>
        <button
          onClick={() => {
            const action = {type: 'DECREMENT', payload: this.props.step || 1};
            this.setState(state => reducer(state, action));
          }}
        >
          {`+ ${this.props.step || 1}`}
        </button>
        <button
          onClick={() => {
            const action = {type: 'DECREMENT', payload: this.props.step || 1};
            this.setState(state => reducer(state, action));
          }}
        >
          {`- ${this.props.step || 1}`}
        </button>
        <h1>{this.state.count}</h1>
      </div>
    );
  }
}

export default App;
