
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('repos', function (table) {
      //table.increments('id').primary()
      table.string('username')
      table.string('reponame').primary()
      table.integer('stargazers')
      table.string('url').unique()
    })
  ])
}

exports.down = function(knex, Promise) {
    return Promise.all([
      knex.schema.dropTable('repos')
  ])
}
