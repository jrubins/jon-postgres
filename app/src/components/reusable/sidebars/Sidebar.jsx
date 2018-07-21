import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
const { getTableNames } = require('electron').remote.require('./db')

class Sidebar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      tableNames: [],
    }
  }

  render() {
    const { onSelectTable, selectedTable } = this.props
    const { tableNames } = this.state

    return (
      <div className="sidebar">
        {tableNames.length === 0 && (
          <a
            onClick={async () => {
              const tableNames = await getTableNames()
              this.setState({
                tableNames,
              })
            }}
          >
            Click Me
          </a>
        )}

        <ul>
          {tableNames.map(tableName => (
            <li>
              <a
                className={cn({
                  'sidebar-link-active': tableName === selectedTable,
                })}
                onClick={() => onSelectTable(tableName)}
              >
                {tableName}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

Sidebar.propTypes = {
  onSelectTable: PropTypes.func.isRequired,
  selectedTable: PropTypes.string,
}

export default Sidebar
