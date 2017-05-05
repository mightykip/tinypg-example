import { TinyPg } from 'tinypg'
const Path = require('path')

const db = new TinyPg({
   connection_string: `postgres://postgres@localhost:5432/tinypg_example?sslmode=disable`,
   root_dir: Path.join(__dirname, './queries'),
})

db.events.on('query', context => {
   console.log(`Executing query: ${context.name}`)
})

db.events.on('result', context => {
   console.log(`Query Complete: ${context.name} (${context.duration}ms)`)
})

db.transaction(transaction_db => { // BEGIN
   return transaction_db.sql('customer.create', { // INSERT
      first_name: 'Steve',
      last_name: 'Jobs',
   })
   .then(result => {
      const customer = result.rows[0]

      return transaction_db.sql('address.create', { // INSERT
         customer_id: customer.customer_id,
         street: '123 W 10th St',
         city: 'Palo Alto',
         state: 'California',
         zip: 94301,
      })
   .then(() => customer.customer_id)
   })
}) // COMMIT
.then(customer_id => {
   return db.sql('customer.fetch', { // SELECT
      customer_id: customer_id,
   })
   .then(result => result.rows[0])
})
.then(customer => {
   console.log(customer)
   db.close()
})