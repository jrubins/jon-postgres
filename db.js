const { Client } = require('pg')

const client = new Client({
  user: 'thor_user',
  host: 'localhost',
  database: 'thor',
  password: 'thor_password',
  port: 9432,
})
let initial = true

module.exports = {
  /**
   * Deletes the provided row IDs from the table.
   *
   * @param {String} tableName
   * @param {Array<Number>} rowIds
   * @returns {Number}
   */
  deleteRows: async (tableName, rowIds) => {
    return await client.query(`DELETE FROM ${tableName} WHERE id IN (${rowIds.join(',')})`)
  },

  /**
   * Returns the column names for the supplied table.
   *
   * @param {String} tableName
   * @returns {Array<String>}
   */
  getTableColumns: async tableName => {
    const res = await client.query('SELECT * FROM information_schema.columns WHERE table_schema = \'public\' AND table_name = \'' + tableName + '\'')

    return res.rows.map(({ column_name }) => column_name)
  },

  /**
   * Fetches and returns all the (user defined) table names for the current DB.
   *
   * @returns {Array<String>}
   */
  getTableNames: async () => {
    if (initial) {
      initial = false
      await client.connect()
    }

    const res = await client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\' ORDER BY table_name')

    return res.rows.map(({ table_name }) => table_name)
  },

  /**
   * Returns data rows for the supplied table.
   *
   * @param {String} tableName
   * @returns {Array<Object>}
   */
  getTableRows: async tableName => {
    const res = await client.query('SELECT * FROM ' + tableName)

    return res.rows
  },

  /**
   * Runs a generic SQL query and returns the resulting rows.
   *
   * @param {String} sql
   * @returns {Array<Object>}
   */
  query: async sql => {
    const res = await client.query(sql)
    return res.rows
  },
}
