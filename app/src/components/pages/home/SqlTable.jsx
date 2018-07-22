import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'

import { KEYCODES } from '../../../utils/keyboards'

import SqlTableCell from './SqlTableCell'

class SqlTable extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedRows: [],
    }

    // Used when calculating selected rows on key presses.
    this.additionalIndexes = 0
    this.initialSelectedRow = 0

    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleRowClick = this.handleRowClick.bind(this)
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  /**
   * Handles a keydown event on the document.
   *
   * @param {Event} event
   */
  handleKeyDown(event) {
    const { handleDelete, rows } = this.props
    const { selectedRows } = this.state

    if (event.shiftKey && event.keyCode === KEYCODES.DOWN_ARROW) {
      // If we're going down from the initial index, we don't want to go beyond the amount of data we have.
      if (
        this.additionalIndexes > 0 &&
        this.initialSelectedRow + this.additionalIndexes === rows.length - 1
      ) {
        return
      }

      this.additionalIndexes = this.additionalIndexes + 1
    } else if (event.shiftKey && event.keyCode === KEYCODES.UP_ARROW) {
      // If we're going up from the initial index, we don't want to go beyond zero.
      if (
        this.additionalIndexes < 0 &&
        this.initialSelectedRow + this.additionalIndexes === 0
      ) {
        return
      }
      this.additionalIndexes = this.additionalIndexes - 1
    } else if (event.keyCode === KEYCODES.DOWN_ARROW) {
      // If multiple rows are selected, select the next row after all the selected ones.
      this.initialSelectedRow =
        this.additionalIndexes > 0
          ? this.initialSelectedRow + this.additionalIndexes + 1
          : this.initialSelectedRow + 1
      this.additionalIndexes = 0

      // Don't go beyond the number of rows being displayed.
      this.initialSelectedRow = Math.min(
        this.initialSelectedRow,
        rows.length - 1
      )
    } else if (event.keyCode === KEYCODES.UP_ARROW) {
      // If multiple rows are selected, select the row before all the selected ones.
      this.initialSelectedRow =
        this.additionalIndexes < 0
          ? this.initialSelectedRow + this.additionalIndexes - 1
          : this.initialSelectedRow - 1
      this.additionalIndexes = 0

      // Don't go beyond the first row.
      this.initialSelectedRow = Math.max(this.initialSelectedRow, 0)
    } else if (
      event.keyCode === KEYCODES.DELETE &&
      !_.isEmpty(selectedRows) &&
      _.isFunction(handleDelete)
    ) {
      handleDelete(selectedRows)
      return
    } else {
      return
    }

    let endIndex
    let startIndex

    if (this.additionalIndexes < 0) {
      endIndex = this.initialSelectedRow
      startIndex = this.initialSelectedRow + this.additionalIndexes
    } else {
      endIndex = this.initialSelectedRow + this.additionalIndexes
      startIndex = this.initialSelectedRow
    }

    const newSelectedRows = []
    for (let i = startIndex; i <= endIndex; i++) {
      newSelectedRows.push(i)
    }

    this.setState({
      selectedRows: newSelectedRows,
    })
  }

  /**
   * Handles a click on a row in the table.
   *
   * @param {Number} rowIndex
   */
  handleRowClick(rowIndex) {
    const { selectedRows } = this.state

    // Reset any selection logic.
    this.additionalIndexes = 0
    this.initialSelectedRow = rowIndex

    // If the user clicked on a single row that was selected, de-select it.
    if (selectedRows.length === 1 && selectedRows[0] === rowIndex) {
      this.setState({
        selectedRows: [],
      })
    } else {
      this.setState({
        selectedRows: [rowIndex],
      })
    }
  }

  render() {
    const { columns, rows } = this.props
    const { selectedRows } = this.state

    return (
      <table className="sql-table">
        <thead>
          <tr>{columns.map(column => <th key={column}>{column}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.id}
              className={cn({
                'table-row-selected': _.includes(selectedRows, i),
              })}
              onClick={() => this.handleRowClick(i)}
            >
              {columns.map(column => (
                <SqlTableCell key={column} value={row[column]} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}

SqlTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleDelete: PropTypes.func,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
    })
  ).isRequired,
}

export default SqlTable
