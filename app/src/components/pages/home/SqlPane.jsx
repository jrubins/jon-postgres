import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Textarea } from '@jrubins/react-components'

import { KEYCODES } from '../../../utils/keyboards'

import SqlTable from './SqlTable'

class SqlPane extends Component {
  constructor(props) {
    super(props)

    this.state = {
      sql: null,
      sqlSubmitted: false,
    }

    this.handleSqlKeydown = this.handleSqlKeydown.bind(this)
  }

  /**
   * Handles a keydown inside the SQL textarea.
   *
   * @param {SyntheticEvent} event
   */
  async handleSqlKeydown(event) {
    if (event.keyCode === KEYCODES.ENTER && event.metaKey) {
      this.setState({
        sqlSubmitted: true,
      })

      this.props.onRunQuery(this.state.sql)
    }
  }

  render() {
    const { columns, rows, sqlError } = this.props
    const { sql, sqlSubmitted } = this.state

    return (
      <div className="sql-pane">
        <div className="sql-pane-editor" onKeyDown={this.handleSqlKeydown}>
          <Textarea handleChange={sql => this.setState({ sql })} value={sql} />

          {sqlError && <div className="sql-pane-error">{sqlError}</div>}
        </div>

        {sqlSubmitted && <SqlTable columns={columns} rows={rows} />}
      </div>
    )
  }
}

SqlPane.propTypes = {
  columns: PropTypes.array.isRequired,
  onRunQuery: PropTypes.func.isRequired,
  rows: PropTypes.array.isRequired,
  sqlError: PropTypes.string,
}

export default SqlPane
