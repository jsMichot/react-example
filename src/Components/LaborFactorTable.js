import React, { Component } from 'react';
import _ from 'lodash';

export function reducer(state, action = {}) {
  switch (action.type) {
    case 'GetLaborFactorData':
      return [
        { id: 1, size: 1, class: '150', schedule: '', laborFactor: 1.2 },
        { id: 2, size: 1, class: '300', schedule: '', laborFactor: 2.2 },
        { id: 3, size: 2, class: '150', schedule: '', laborFactor: 1.2 },
        { id: 4, size: 2, class: '300', schedule: '', laborFactor: 2.2 },
        { id: 5, size: 3, class: '150', schedule: '', laborFactor: 1.2 },
        { id: 6, size: 3, class: '300', schedule: '', laborFactor: 1.3 },
        { id: 7, size: 3, class: '450', schedule: '', laborFactor: 1.4 },
        { id: 8, size: 3, class: '450', schedule: '80', laborFactor: 1.4 },
      ];
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
      tempSizes: [],
      editing: false,
      addingColumn: false,
      addingRow: false,
      scheduleClassPairs: [],
      editValues: [],
      newRowId: 1,
      newRowClass: '',
      newRowSchedule: '',
    };
    this.getScheduleClassPairs = this.getScheduleClassPairs.bind(this);
    this.setLaborFactors = this.setLaborFactors.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.getSizes = this.getSizes.bind(this);
    this.editLaborFactors = this.editLaborFactors.bind(this);
    this.setLaborFactors = this.setLaborFactors.bind(this);
    this.addNewColumn = this.addNewColumn.bind(this);
    this.deleteNewColumn = this.deleteNewColumn.bind(this);
    this.saveNewColumn = this.saveNewColumn.bind(this);
    this.addNewRow = this.addNewRow.bind(this);
    this.saveNewRow = this.saveNewRow.bind(this);
    this.cancelNewRow = this.cancelNewRow.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changeLaborFactor = this.changeLaborFactor.bind(this);
    this.changeTempSize = this.changeTempSize.bind(this);
  }

  componentDidMount() {
    const items = reducer(this.state, { type: 'GetLaborFactorData' });
    const updatedSizes = this.getSizes(items);
    const updatedScheduleClassPairs = this.getScheduleClassPairs(items, updatedSizes);
    this.setState((state) => (
      {
        data: items,
        scheduleClassPairs: updatedScheduleClassPairs,
        sizes: updatedSizes,
      }
    ), () => {
      console.dir(this.state);
    });
  }

  getScheduleClassPairs(data, sizes) {
    return data.reduce((uniquePairs, item) => {
      const currentPair = {
        schedule: item.schedule,
        class: item.class,
      };
      if (_.find(uniquePairs, currentPair)) {
        return uniquePairs;
      }
      sizes.forEach(size => {
        const classScheduleSizeMatch = _.find(data, {
          class: currentPair.class,
          schedule: currentPair.schedule,
          size,
        }) || { laborFactor: 0 };

        currentPair[size] = classScheduleSizeMatch.laborFactor;
      });
      return uniquePairs.concat(currentPair);
    }, []);
  }

  getSizes(data) {
    // debugger;
    const sizeMap = data.reduce(
      (acc, item) => ({ ...acc, [item.size]: true }),
      {}
    );
    return Object.keys(sizeMap).map(x => parseInt(x, 10));
  }

  editLaborFactors() {
    const newLaborFactorValues = this.state.scheduleClassPairs.map(pair =>
      Object.assign({}, pair));
    this.setState(state => (
      {
        editValues: newLaborFactorValues,
        editing: true,
      }
    ));
  }

  setLaborFactors() {
    this.setState(() => ({ editing: false }));
  }

  cancelEdit() {
    const previousScheduleClassPairs = this.state.editValues.map(pair =>
      Object.assign({}, pair));
    this.setState(state => ({
      scheduleClassPairs: previousScheduleClassPairs,
      editing: false,
    }));
  }

  addNewColumn() {
    const { sizes } = this.state;
    const temporarySizes = sizes.slice().concat((
      Math.floor(parseInt(sizes[sizes.length - 1], 10) + 1)
    ));
    this.setState(state => ({
      tempSizes: temporarySizes || [],
      addingColumn: true,
    }));
  }

  deleteNewColumn() {
    this.setState(() => ({ addingColumn: false }));
  }

  saveNewColumn() {
    const newSizes = _.uniq(this.state.tempSizes).sort();
    const newScheduleClassPairs = this.getScheduleClassPairs(this.state.data, newSizes);
    this.setState(() => ({
      sizes: newSizes,
      scheduleClassPairs: newScheduleClassPairs,
      addingColumn: false,
    }));
  }

  addNewRow() {
    this.setState(() => ({ addingRow: true }));
  }

  saveNewRow() {
    const { data, newRowId, newRowClass, newRowSchedule, sizes } = this.state;
    const newData = data.push({
      id: newRowId,
      class: newRowClass,
      schedule: newRowSchedule,
    });
    const newScheduleClassPairs = this.getScheduleClassPairs(newData, sizes);
    this.setState(() => ({
      data: newData,
      scheduleClassPairs: newScheduleClassPairs,
    }))
      .then(() => {
        this.cancelNewRow();
      });
  }

  cancelNewRow() {
    this.setState(() => ({
      newRowId: 1,
      newRowClass: '',
      newRowSchedule: '',
      addingRow: false,
    }));
  }

  handleChange(event) {
    console.log(event.target);
    const { name, value } = event.target;
    this.setState(() => ({ [name]: value }), () => {console.dir(this.state)});
  }

  changeLaborFactor(value, outerIndex, size) {
    console.log(value);
    // chore: improve form validation
    value = !value ? 0 : value;
    this.setState((state) => {
      state.scheduleClassPairs[outerIndex][size] = value; 
      return state;
    });
  }

  changeTempSize(value, index) {
    this.setState((state) => {
      state.tempSizes[index] = value;
      return state;
    });
  }

  render() {
    const { editing, addingColumn, addingRow, sizes, tempSizes, scheduleClassPairs } = this.state;

    return (
      <div>
        {!addingRow ?
          <div>
            <h1>Labor Factor Table</h1>
            {editing ? <button onClick={this.setLaborFactors}>Update Labor Factors</button> : null}
            {editing ? <button onClick={this.cancelEdit}>Cancel Edit</button> : null}
            {!addingColumn ? <button onClick={this.addNewColumn}>Add New Column</button> : null}
            {addingColumn ? <button onClick={this.deleteNewColumn}>Delete New Column</button> : null}
            {addingColumn ? <button onClick={this.saveNewColumn}>Save New Column</button> : null}
            {!addingRow ? <button onClick={this.addNewRow}>Add New Row</button> : null}
            <table>
              <thead>
                <tr>
                  <th className="tablePadding">Schedule</th>
                  <th className="tablePadding">Class</th>
                  {sizes.map(size => (
                    <th key={size}>
                      <span>
                        {size}
                      </span>
                    </th>
                  ))}
                  {addingColumn ? <th> <input type="text" defaultValue={tempSizes[tempSizes.length - 1]} onChange={event => {
                    const index = tempSizes.length - 1;
                    this.changeTempSize(event.target.value, index);
                  }} /> </th> : null}
                </tr>
              </thead>
              <tbody>
                {scheduleClassPairs.map((pair, outerIndex) => (
                  <tr onClick={this.editLaborFactor} key={outerIndex}>
                    <td>
                      {pair.schedule}
                    </td>
                    <td>
                      {pair.class}
                    </td>
                    {sizes.map((size, innerIndex) => (
                      <td key={innerIndex}>
                        {!editing ? <span onClick={this.editLaborFactors}>{scheduleClassPairs[outerIndex][size]}</span> :
                          <input type="text" defaultValue={scheduleClassPairs[outerIndex][size]} onChange={event => {this.changeLaborFactor(event.target.value, outerIndex, size)}} />
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          :
          <form>
            <h2>Add New Item</h2>
            <label>ID:
              <input type="text" name="newRowID" onChange={this.handleChange} />
            </label>
            <br />
            <label>CLASS:
              <input type="text" name="newRowClass" onChange={this.handleChange} />
            </label>
            <br />
            <label>SCHEDULE:
              <input type="text" name="newRowSchedule" onChange={this.handleChange} />
            </label>
            <br />
            <button onClick="this.cancelNewRow">Cancel New Row</button>
            <button onClick="this.saveNewRow">Save New Row</button>
          </form>
        }
      </div>
    );
  }
}

export default LaborFactorTable;
