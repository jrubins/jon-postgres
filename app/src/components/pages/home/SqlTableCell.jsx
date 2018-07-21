import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { formatDate } from '../../../utils/dates'

const SqlTableCell = ({ value }) => {
  let formattedValue = value

  if (formattedValue instanceof Date) {
    formattedValue = formatDate(formattedValue, 'M/DD/YY h:mm:ss a')
  } else if (_.isBoolean(formattedValue)) {
    formattedValue = `${formattedValue}`
  }

  return <td>{formattedValue}</td>
}

SqlTableCell.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]),
}

export default SqlTableCell
