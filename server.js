'use strict'

const express = require('express')
const mysql = require('mysql')
const path = require('path')
const serveStatic = require('serve-static')

// Constants
const PORT = 8080
const HOST = '0.0.0.0'

const con = mysql.createConnection({
  host: "db",
  user: "user",
  password: "123456",
  database: "test_db"
})

con.connect(function(err) {
  if (err) console.log(err)//throw err
  console.log("Connected!")
})



// App
const app = express()
app.use(serveStatic(path.join(__dirname, 'dist')))
app.use(express.json())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

/**
 * Saves the repositories in the DB, each language having it's own table
 * First tries to create the table, if it fails, just truncate its data.
 * Then adds the new repos
 */
app.post('/', (req, res) => {
  if(!req.body.lang) // simple check
    return res.send('Incorrect data format')

  let sql_create_table = "CREATE TABLE " + req.body.lang +
                "(id int not null primary key, " +
                "name varchar(100) not null, " +
                // "description varchar(500), " +
                "star_count int not null, " +
                "url varchar(200) not null)"
  con.query(sql_create_table, (err, result) => {
    if(err)
      if(err.code === 'ER_TABLE_EXISTS_ERROR')
        con.query('TRUNCATE TABLE ' + req.body.lang, (err, result) => {
          if(err)
            console.log(err)
          // Proper handling would go here, but for now just do nothing
        })
      else
        console.log(err)
    else
        console.log(result)

    insertRepo(req.body.lang, req.body.repos)

  })
})

function insertRepo(table, repos) {
  let sql_insert = 'INSERT INTO ' + table + ' (id, name, url, star_count) VALUES ?'
  let values = []
  repos.forEach(repo => {
    let repo_values = [
      repo.id,
      repo.name,
      // repo.description,
      repo.html_url,
      repo.stargazers_count
    ]
    values.push(repo_values)
  });
  con.query(sql_insert, [values], (err, result) => {
    if(err) {
      console.log(err)
      return 0
    }
    return result
  })
}


app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)