import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'
const {
  getTable,
  getTableData,
  deleteRows,
} = require('electron').remote.require('./db')

import { formatDate } from '../../../utils/dates'

class HomePage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      tableColumns: [],
      tableData: [],
      selectedRows: [],
    }

    this.toggleRow = this.toggleRow.bind(this)
  }

  componentDidMount() {
    document.addEventListener('keydown', async event => {
      if (this.lastRowAdded && event.shiftKey) {
        console.log('ADD!')
        if (event.keyCode === 40) {
          // down
          if (!this.lastDirection || this.lastDirection === 'down') {
            const nextRow = this.lastRowAdded - 1
            this.lastRowAdded = nextRow
            this.lastDirection = 'down'
            this.toggleRow(nextRow)
          } else {
            const nextRow = this.lastRowAdded
            this.lastRowAdded = nextRow
            this.lastDirection = 'down'
            this.toggleRow(nextRow)
          }
          /* this.setState(({ selectedRows }) => ({
            selectedRows: [
              ...selectedRows,
              nextRow,
            ]
          }))*/
        } else if (event.keyCode === 38) {
          // up
          if (!this.lastDirection || this.lastDirection === 'up') {
            const nextRow = this.lastRowAdded + 1
            this.lastRowAdded = nextRow
            this.lastDirection = 'up'
            this.toggleRow(nextRow)
          } else {
            const nextRow = this.lastRowAdded
            this.lastRowAdded = nextRow
            this.lastDirection = 'up'
            this.toggleRow(nextRow)
          }

          /* this.setState(({ selectedRows }) => ({
            selectedRows: [
              ...selectedRows,
              nextRow,
            ]
          }))*/
        }
      } else if (event.keyCode === 8 && !_.isEmpty(this.state.selectedRows)) {
        console.log('Delete:', this.state.selectedRows)
        await deleteRows(this.props.selectedTable, this.state.selectedRows)
        this.setState({
          tableData: _.reverse(await getTableData(this.props.selectedTable)),
          selectedRows: [],
        })
      }
    })
  }

  async componentDidUpdate(prevProps) {
    if (this.props.selectedTable !== prevProps.selectedTable) {
      const res1 = getTable(this.props.selectedTable)
      const res2 = getTableData(this.props.selectedTable)

      const [columns, data] = await Promise.all([res1, res2])
      console.log(columns, data)
      this.setState({
        tableColumns: columns,
        tableData: _.reverse(data),
      })
    }
  }

  toggleRow(row) {
    this.setState(({ selectedRows }) => {
      if (_.includes(selectedRows, row)) {
        return {
          selectedRows: _.without(selectedRows, row),
        }
      }

      return {
        selectedRows: [...selectedRows, row],
      }
    })
  }

  render() {
    const { selectedTable } = this.props
    const { tableColumns, tableData, selectedRows } = this.state
    console.log(tableColumns)
    console.log(selectedRows)

    return (
      <div className="page home-page">
        <h1>{selectedTable}</h1>
        <div className="table-data">
          <table>
            <thead>
              <tr>{tableColumns.map(tc => <th key={tc}>{tc}</th>)}</tr>
            </thead>
            <tbody>
              {tableData.map(data => (
                <tr
                  key={data.id}
                  className={cn({
                    'table-row-selected': _.includes(selectedRows, data.id),
                  })}
                  onClick={() => {
                    this.initialRowClicked = data.id
                    this.lastRowAdded = data.id
                    if (
                      selectedRows.length === 1 &&
                      selectedRows[0] === data.id
                    ) {
                      this.setState({
                        selectedRows: [],
                      })
                    } else {
                      this.setState({
                        selectedRows: [data.id],
                      })
                    }
                  }}
                >
                  {tableColumns.map(tc => {
                    const dataPoint = data[tc]
                    if (dataPoint instanceof Date) {
                      return (
                        <td key={tc}>
                          {formatDate(dataPoint, 'M/DD/YY h:mm:ss a')}
                        </td>
                      )
                    }
                    console.log(_.isBoolean(data[tc]))

                    return (
                      <td key={tc}>
                        {_.isBoolean(data[tc]) ? `${data[tc]}` : data[tc]}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

HomePage.propTypes = {
  selectedTable: PropTypes.string.isRequired,
}

export default HomePage
