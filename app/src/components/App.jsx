import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'

import HomePage from './pages/home/HomePage'

import Sidebar from './reusable/sidebars/Sidebar'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedTable: null,
    }
  }

  render() {
    const { selectedTable } = this.state

    return (
      <div className="app-container">
        <Sidebar
          onSelectTable={tableName => {
            this.setState({
              selectedTable: tableName,
            })
          }}
          selectedTable={selectedTable}
        />

        <Switch>
          <Route
            exact
            path="/"
            render={() => <HomePage selectedTable={selectedTable} />}
          />
        </Switch>
      </div>
    )
  }
}

export default App
