'use strict'

const express = require('express')
const mysql = require('mysql')
const path = require('path')
const serveStatic = require('serve-static')

// Constants
const PORT = process.env.PORT
const HOST = '0.0.0.0'

process.env.VUE_APP_PORT = PORT // little trick so vue can see the env var

let con = createConnection()

function createConnection() {
  let con = mysql.createConnection({
    host: process.env.APP_ENV === 'dev' ? "db" : "us-cdbr-iron-east-05.cleardb.net",
    user: process.env.APP_ENV === 'dev' ? "user" : "b2410c064cd71a",
    password: process.env.APP_ENV === 'dev' ? "123456" : "05e06185",
    database: process.env.APP_ENV === 'dev' ? "test_db" : "heroku_d98b70fed13d7b3"
  })
  return con
}

function connectDB() {
  con.connect(function(err) {
    if (err) console.log(err)//throw err
    console.log("Connected!")
  })
}

con.on('error', (err) => {
  if(!err.fatal) return

  if(err.code === 'PROTOCOL_CONNECTION_LOST') {
    con = createConnection() // refresh connection object
    connectDB() // try to connect again
  }
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


app.listen(PORT, HOST, () => {
  console.log(`Running on port ${PORT}`)
  connectDB()
})