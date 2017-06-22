var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');


var app = express();
module.exports = app;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './github-fetcher.sqlite3'
  }
});


app.post('/repos/import', function (req, res) {
  for (var key in req.body) {
    var entry = req.body[key];
      knex.raw('INSERT OR REPLACE INTO repos (username, reponame, stargazers, url) values ("' + entry.username + '", "' + entry.reponame + '", "' + entry.stargazers + '", "' + entry.url  + ' ");')
         .then(function(response) {
             console.log("This bloody worked!")
             knex.select("*").from('repos').then(function(data) {console.log("Data successfully imported", data)})
         })
         .catch(function(err) {
             console.log(err);
         })
  }


  res.status(200);
  res.send("Repos Recieved.")
});


app.get('/repos', function (req, res) {
  res.status(200);
  res.type('html');

  knex.select("*").from("repos").orderBy('stargazers', 'desc')
      .then(function (data)  {
        data = data.splice(0,25);
        return data.map(function (repo) {
          return `<ul>
                <li><strong>Repository: </strong><a href="${repo.url}">"${repo.reponame}"</a></li>
                <li><i>Username: </i>"${repo.username}"</li>
                <li>Stargazers: "${repo.stargazers}"</li>
              </ul>`
        }).join('')
      })
      .then(function (data)  {res.send(data)})

});


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname,  '../client/', 'index.html'));
});

var port = process.env.PORT || 4040;
app.listen(port);
console.log("Listening on port " + port);
