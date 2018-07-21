import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Textarea } from '@jrubins/react-components'
import _ from 'lodash'
const {
  deleteRows,
  getTableColumns,
  getTableRows,
  query,
} = require('electron').remote.require('./db')

import { KEYCODES } from '../../../utils/keyboards'

import SqlTable from './SqlTable'

class HomePage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      columns: [],
      rows: [],
      sql: null,
      sqlMode: false,
    }

    this.handleDeleteRows = this.handleDeleteRows.bind(this)
    this.handleSqlKeydown = this.handleSqlKeydown.bind(this)
  }

  async componentDidUpdate(prevProps) {
    const { selectedTable } = this.props

    if (selectedTable !== prevProps.selectedTable) {
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
   * Handles a keydown inside the SQL textarea.
   *
   * @param {SyntheticEvent} event
   */
  async handleSqlKeydown(event) {
    if (event.keyCode === KEYCODES.ENTER && event.metaKey) {
      const queryResults = await query(this.state.sql)

      this.setState({
        columns: _.keys(queryResults[0]),
        rows: queryResults,
        sqlSubmitted: true,
      })
    }
  }

  render() {
    const { selectedTable } = this.props
    const { columns, rows, sql, sqlMode, sqlSubmitted } = this.state

    return (
      <div className="page home-page">
        <div>
          {sqlMode && (
            <a onClick={() => this.setState({ sqlMode: false })}>table view</a>
          )}
          {!sqlMode && (
            <Fragment>
              <h1 className="selected-table-name">{selectedTable}</h1>
              <a onClick={() => this.setState({ sqlMode: true })}>SQL</a>
            </Fragment>
          )}
        </div>
        {sqlMode && (
          <div onKeyDown={this.handleSqlKeydown}>
            <Textarea
              handleChange={sql => this.setState({ sql })}
              value={sql}
            />

            {sqlSubmitted && <SqlTable columns={columns} rows={rows} />}
          </div>
        )}
        {!sqlMode && (
          <SqlTable
            columns={columns}
            handleDelete={this.handleDeleteRows}
            rows={rows}
          />
        )}
      </div>
    )
  }
}

HomePage.propTypes = {
  selectedTable: PropTypes.string,
}

export default HomePage
