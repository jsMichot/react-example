import React, {Component} from 'react';
import {find, indexOf} from 'lodash';
import './App.css';

// FAKE API STUFF

function delayResponse(response, actionName) {
  console.log('calling:', actionName);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(response);
      console.log('completeing:', actionName, response);
    }, 500);
  });
}

let nextId = 9;
const api = {
  _data: [
    {id: 1, size: 1, class: '150', schedule: '', laborFactor: 1.2},
    {id: 2, size: 1.5, class: '300', schedule: '', laborFactor: 2.2},
    {id: 3, size: 2, class: '150', schedule: '', laborFactor: 1.2},
    {id: 4, size: 2, class: '300', schedule: '', laborFactor: 2.2},
    {id: 5, size: 3, class: '150', schedule: '', laborFactor: 1.2},
    {id: 6, size: 3, class: '300', schedule: '', laborFactor: 1.3},
    {id: 7, size: 3, class: '450', schedule: '', laborFactor: 1.4},
    {id: 8, size: 3, class: '450', schedule: '80', laborFactor: 1.4},
  ],
  get() {
    return delayResponse(this._data, 'get');
  },
  add(record) {
    const newRecord = {id: nextId++, ...record};
    this._data = [...this._data, newRecord];
    return delayResponse(newRecord, 'add');
  },
  update(record) {
    this._data = this._data.map(item => {
      if (item.id === record.id) {
        return record;
      }
      return item;
    });
    return delayResponse(record, 'update');
  },
};

class App extends Component {
  render() {
    return (
      <LaborFactorProvider>
        {({loading, data, ...rest}) =>
          loading ? 'Loading...' : <LaborFactorTable data={data} {...rest} />
        }
      </LaborFactorProvider>
    );
  }
}

export class LaborFactorProvider extends Component {
  state = {
    loading: true,
    data: [],
  };

  componentDidMount() {
    this._fetchData();
  }

  _fetchData = () => {
    this.setState({
      loading: true,
    });

    api.get().then(data => {
      this.setState({
        loading: false,
        data,
      });
    });
  };

  render() {
    return this.props.children({...this.state, fetch: this._fetchData});
  }
}

const getRecordKey = record =>
  `${record.class}|${record.schedule}|${record.size}`;

export function reducer(state, action = {}) {
  switch (action.type) {
    case 'EDIT_ROW':
      return {
        ...state,
        editingRow: action.payload.row,
        targetIndex: action.payload.targetIndex,
      };
    case 'ADD_CHANGED_RECORD':
      return {
        ...state,
        mutations: {
          ...state.mutations,
          [getRecordKey(action.payload.record)]: action.payload.record,
        },
      };
    case 'REMOVE_CHANGED_RECORD':
      let mutations = {...state.mutations};
      delete mutations[[getRecordKey(action.payload.record)]];
      return {
        ...state,
        mutations,
      };
    case 'CANCEL_CHANGES':
      return {
        ...state,
        mutations: {},
        editingRow: null,
      };
    case 'ENTER_ADDING_SIZE_MODE':
      return {
        ...state,
        addingSize: true,
      };
    case 'EXIT_ADDING_SIZE_MODE':
      return {
        ...state,
        addingSize: false,
      };
    case 'SAVE_NEW_SIZE':
      return {
        ...state,
        sizes: state.sizes.concat(action.payload).sort(),
        addingSize: false,
      };
    case 'ENTER_ADDING_CLASS|SCHEDULE_MODE':
      return {
        ...state,
        addingClassSchedule: true,
      };
    case 'EXIT_ADDING_CLASS|SCHEDULE_MODE':
      return {
        ...state,
        addingClassSchedule: false,
      };
    case 'SAVE_NEW_CLASS|SCHEDULE':
      return {
        ...state,
        rows: state.rows
          .concat(action.payload)
          .sort((a, b) => a.class - b.class),
        addingClassSchedule: false,
      };
    default:
      return state;
  }
}

export class LaborFactorTable extends Component {
  state = {
    editingRow: null,
    targetIndex: 0,
    mutations: {},
    addingSize: false,
    addingClassSchedule: false,
    sizes: {},
    rows: {},
  };

  static getDerivedStateFromProps(nextProps, state) {
    const stateMap = nextProps.data.reduce(
      (acc, item) => {
        const key = `${item.class}|${item.schedule}`;

        // add sizes to map
        acc.sizes[item.size] = true;

        // ensure class/schedule row exists
        acc.rows[key] = acc.rows[key] || {
          class: item.class,
          schedule: item.schedule,
        };

        // add reference to class/schedule row mapping
        // laborFactor record to size key
        acc.rows[key][item.size] = item;

        // return accumulator
        return acc;
      },
      {sizes: {}, rows: {}}
    );
    return {
      sizes: Object.keys(stateMap.sizes)
        .map(x => parseFloat(x, 10))
        .sort(),
      rows: Object.keys(stateMap.rows).map(x => stateMap.rows[x]),
    };
  }

  _dispatch = action => {
    this.setState(state => {
      console.groupCollapsed(`STATE CHANGING ::: ${action.type}`);
      console.log('current state', state);
      console.log('action', action);
      const nextState = reducer(state, action);
      console.log('next state', nextState);
      console.groupEnd('STATE CHANGING');
      return nextState;
    });
  };

  _handleClick = (editing, row, targetIndex) => {
    if (!editing) {
      this._dispatch({
        type: 'EDIT_ROW',
        payload: {
          row,
          targetIndex,
        },
      });
    }
  };

  _handleSaveChanges = () => {
    const promises = Object.keys(this.state.mutations || {}).map(x => {
      const mutation = this.state.mutations[x];
      if (mutation.id) {
        return api.update(mutation);
      } else {
        return api.add(mutation);
      }
    });

    Promise.all(promises).then(() => {
      this.props.fetch();
    });
  };

  _handleCancelChanges = () => {
    this._dispatch({type: 'CANCEL_CHANGES'});
  };

  _enterAddingSizeMode = () => {
    this._dispatch({type: 'ENTER_ADDING_SIZE_MODE'});
  };

  _exitAddingSizeMode = () => {
    this._dispatch({type: 'EXIT_ADDING_SIZE_MODE'});
  };

  _handleSaveNewSize = newSize => {
    this.state.sizes.includes(parseFloat(newSize))
      ? this._exitAddingSizeMode()
      : this._dispatch({type: 'SAVE_NEW_SIZE', payload: parseFloat(newSize)});
  };

  _enterAddingClassScheduleMode = () => {
    this._dispatch({type: 'ENTER_ADDING_CLASS|SCHEDULE_MODE'});
  };

  _exitAddingClassScheduleMode = () => {
    this._dispatch({type: 'EXIT_ADDING_CLASS|SCHEDULE_MODE'});
  };

  _handleSaveNewClassSchedule = newRow => {
    this.state.rows.filter(
      row => row.class === newRow.class && row.schedule === newRow.schedule
    ).length
      ? this._exitAddingClassScheduleMode()
      : this._dispatch({type: 'SAVE_NEW_CLASS|SCHEDULE', payload: newRow});
  };

  render() {
    return (
      <React.Fragment>
        {this.state.addingSize
          ? this._renderAddNewSizeInput()
          : this._renderAddNewSizeButton()}{' '}
        {this.state.addingClassSchedule
          ? this._renderAddNewClassScheduleInput()
          : this._renderAddNewClassScheduleButton()}
        <br />
        <table>
          <thead>
            <tr>
              <th>Class</th>
              <th>Schedule</th>
              {this.state.sizes.map(size => <th key={size}>{size}</th>)}
            </tr>
          </thead>
          <tbody>{this.state.rows.map(this._renderRow)}</tbody>
        </table>
        <div>
          Mutations:
          <strong>
            Adds ={' '}
            {
              Object.keys(this.state.mutations || {}).filter(
                x => !this.state.mutations[x].id
              ).length
            }
          </strong>
          {` | `}
          <strong>
            Updates ={' '}
            {
              Object.keys(this.state.mutations || {}).filter(
                x => !!this.state.mutations[x].id
              ).length
            }
          </strong>
          {!!Object.keys(this.state.mutations || {}).length && (
            <React.Fragment>
              <button onClick={this._handleSaveChanges}>Save Changes</button>
              <button onClick={this._handleCancelChanges}>
                Cancel Changes
              </button>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }

  _renderRow = row => {
    const {editingRow, sizes} = this.state;
    const editing = editingRow && find([row], editingRow);
    const onClick = () => this._handleClick(editing, row, 0);
    return (
      <tr key={`${row.class}|${row.schedule}`}>
        <td onClick={onClick}>{row.class}</td>
        <td onClick={onClick}>{row.schedule}</td>
        {sizes.map(size => this._renderCell({row, size, editing}))}
      </tr>
    );
  };

  _renderCell = ({row, size, editing}) => {
    const mutation = this.state.mutations[
      `${row.class}|${row.schedule}|${size}`
    ];
    const record = mutation ||
      row[size] || {
        class: row.class,
        schedule: row.schedule,
        laborFactor: 0,
        size,
      };
    const {sizes, targetIndex} = this.state;
    const idx = indexOf(sizes, size);
    const onClick = () => {
      this._handleClick(editing, row, idx);
    };
    return (
      <td key={`${row.class}|${row.schedule}|${size}`} onClick={onClick}>
        {editing ? (
          <input
            onBlur={e => {
              const laborFactor = parseFloat(e.target.value, 10);
              if (laborFactor !== record.laborFactor) {
                this._dispatch({
                  type: 'ADD_CHANGED_RECORD',
                  payload: {
                    record: {
                      ...record,
                      laborFactor,
                    },
                  },
                });
              } else {
                this._dispatch({
                  type: 'REMOVE_CHANGED_RECORD',
                  payload: {
                    record: {
                      ...record,
                      laborFactor,
                    },
                  },
                });
              }
            }}
            name="laborFactor"
            autoFocus={targetIndex === idx}
            defaultValue={record.laborFactor}
          />
        ) : (
          <React.Fragment>
            {mutation ? <mark>{record.laborFactor}</mark> : record.laborFactor}
          </React.Fragment>
        )}
      </td>
    );
  };

  _renderAddNewSizeInput = () => {
    return (
      <React.Fragment>
        <label>Enter Size: </label>
        <input
          type="text"
          defaultValue={Math.floor(
            this.state.sizes[this.state.sizes.length - 1] + 1
          )}
          autoFocus={true}
          id="newSize"
        />{' '}
        <button
          type="submit"
          onClick={() => {
            this._handleSaveNewSize(document.getElementById('newSize').value);
          }}
        >
          Save
        </button>{' '}
        <button onClick={this._exitAddingSizeMode}>Cancel</button>
      </React.Fragment>
    );
  };

  _renderAddNewSizeButton = () => {
    return (
      <React.Fragment>
        <button onClick={this._enterAddingSizeMode}>
          <em>Add Size</em>
        </button>
      </React.Fragment>
    );
  };

  _renderAddNewClassScheduleInput = () => {
    return (
      <React.Fragment>
        <label>Enter Class: </label>
        <input
          type="text"
          placeholder="class"
          autoFocus={true}
          id="newClass"
        />{' '}
        <label>Enter Schedule: </label>
        <input type="text" placeholder="schedule" id="newSchedule" />{' '}
        <button
          type="submit"
          onClick={() => {
            this._handleSaveNewClassSchedule({
              class: document.getElementById('newClass').value,
              schedule: document.getElementById('newSchedule').value,
            });
          }}
        >
          Save
        </button>{' '}
        <button onClick={this._exitAddingClassScheduleMode}>Cancel</button>
      </React.Fragment>
    );
  };

  _renderAddNewClassScheduleButton = () => {
    return (
      <React.Fragment>
        <button onClick={this._enterAddingClassScheduleMode}>
          <em>Add Class|Schedule</em>
        </button>
      </React.Fragment>
    );
  };
}

export default App;
