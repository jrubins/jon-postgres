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
  getTableNames: async () => {
    if (initial) {
      initial = false
      await client.connect()
    }

    const res = await client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\' ORDER BY table_name')
    const tableNames = res.rows.map(({ table_name }) => table_name)
    //await client.end()

    return tableNames
  },

  getTable: async tableName => {
    const res = await client.query('SELECT * FROM information_schema.columns WHERE table_schema = \'public\' AND table_name = \'' + tableName + '\'')
    return res.rows.map(({ column_name }) => column_name)
  },

  getTableData: async tableName => {
    const res = await client.query('SELECT * FROM ' + tableName)
    return res.rows
  },

  deleteRows: async (tableName, rows) => {
    return await client.query(`DELETE FROM ${tableName} WHERE id IN (${rows.join(',')})`)
  }
}
