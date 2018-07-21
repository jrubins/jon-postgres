import React from 'react'
import PropTypes from 'prop-types'

const SqlEditorIcon = ({ onClick }) => (
  <div className="icon icon-sql-editor" onClick={onClick}>
    SQL
  </div>
)

SqlEditorIcon.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default SqlEditorIcon
