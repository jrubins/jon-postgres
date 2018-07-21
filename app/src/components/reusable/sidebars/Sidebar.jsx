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

  async componentDidMount() {
    const tableNames = await getTableNames()
    this.setState({
      tableNames,
    })

    this.props.onSelectTable(tableNames[0])
  }

  render() {
    const { onSelectTable, selectedTable } = this.props
    const { tableNames } = this.state

    return (
      <div className="sidebar">
        <ul>
          {tableNames.map(tableName => (
            <li key={tableName}>
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
