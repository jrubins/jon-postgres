import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'
const {
  deleteRows,
  getTableColumns,
  getTableRows,
  query,
} = require('electron').remote.require('./db')

import { error } from '../../../utils/logs'

import SqlEditorIcon from '../../reusable/icons/SqlEditorIcon'
import SqlPane from './SqlPane'
import SqlTable from './SqlTable'
import TableIcon from '../../reusable/icons/TableIcon'

class HomePage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      columns: [],
      rows: [],
      sqlError: null,
      sqlMode: true,
    }

    this.fetchSelectedTableData = this.fetchSelectedTableData.bind(this)
    this.handleDeleteRows = this.handleDeleteRows.bind(this)
    this.runSqlQuery = this.runSqlQuery.bind(this)
  }

  async componentDidUpdate(prevProps) {
    const { selectedTable } = this.props

    // Refresh the data if we're looking at a new table.
    if (selectedTable !== prevProps.selectedTable) {
      this.fetchSelectedTableData()
    }
  }

  /**
   * Fetches table data for the currently selected table.
   */
  async fetchSelectedTableData() {
    const { selectedTable } = this.props
    const getTableColumnsPromise = getTableColumns(selectedTable)
    const getTableRowsPromise = getTableRows(selectedTable)

    const [columns, rows] = await Promise.all([
      getTableColumnsPromise,
      getTableRowsPromise,
    ])
    this.setState({
      columns,
      rows: _.reverse(rows),
    })
  }

  /**
   * Handles a deletion for the provided row indexes.
   *
   * @param {Array<Number>} rowIndexes
   */
  async handleDeleteRows(rowIndexes) {
    const { selectedTable } = this.props

    // TODO: This is inaccurate since the deleteRows fn expects row IDs, not row indexes.
    await deleteRows(this.props.selectedTable, rowIndexes)

    this.setState({
      rows: _.reverse(await getTableRows(selectedTable)),
    })
  }

  /**
   * Runs the provided SQL query and stores the results.
   *
   * @param {String} sql
   */
  async runSqlQuery(sql) {
    try {
      const queryResults = await query(sql)

      this.setState({
        columns: _.keys(queryResults[0]),
        rows: queryResults,
      })
    } catch (err) {
      error('Error running SQL query:', err)
      this.setState({
        sqlError: err.message,
      })
    }
  }

  /**
   * Toggles if SQL mode is active or not.
   *
   * @param {Boolean} sqlMode
   */
  toggleSqlMode(sqlMode) {
    if (sqlMode === this.state.sqlMode) {
      return
    }

    this.fetchSelectedTableData()
    this.setState({
      columns: [],
      rows: [],
      sqlError: null,
      sqlMode,
    })
  }

  render() {
    const { selectedTable } = this.props
    const { columns, rows, sqlError, sqlMode } = this.state

    return (
      <div className="page home-page">
        <div className="home-page-header">
          <h1 className="selected-table-name">{selectedTable}</h1>
          <div className="mode-changer">
            <div
              className={cn('mode', {
                'mode-active': !sqlMode,
              })}
            >
              <TableIcon onClick={() => this.toggleSqlMode(false)} />
            </div>
            <div
              className={cn('mode', {
                'mode-active': sqlMode,
              })}
            >
              <SqlEditorIcon onClick={() => this.toggleSqlMode(true)} />
            </div>
          </div>
        </div>

        <div className="home-page-content">
          {sqlMode && (
            <SqlPane
              columns={columns}
              onRunQuery={this.runSqlQuery}
              rows={rows}
              sqlError={sqlError}
            />
          )}

          {!sqlMode && (
            <SqlTable
              columns={columns}
              handleDelete={this.handleDeleteRows}
              rows={rows}
            />
          )}
        </div>
      </div>
    )
  }
}

HomePage.propTypes = {
  selectedTable: PropTypes.string,
}

export default HomePage
