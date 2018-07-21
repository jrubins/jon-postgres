import React from 'react'
import PropTypes from 'prop-types'

const TableIcon = ({ onClick }) => (
  <svg className="icon icon-table" onClick={onClick} viewBox="0 0 24 24">
    <path fill="none" d="M0,0h24v24H0V0z" />
    <path d="M20,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h15c1.1,0,2-0.9,2-2V5C22,3.9,21.1,3,20,3z M20,5v3H5V5H20z M15,19h-5v-9h5V19z M5,10h3v9H5V10z M17,19v-9h3v9H17z" />
  </svg>
)

TableIcon.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default TableIcon
