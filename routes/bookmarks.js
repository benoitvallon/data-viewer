'use strict';

var express = require('express');
var router = express.Router();

var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/dataviewer';

var selectFromIds = function(client, ids, callback) {
  var results = [];

  var queryString = 'SELECT * FROM bookmarks';
  if(ids && ids.length) {
    queryString += ' WHERE id IN (' + ids.join(',') + ')';
  }
  queryString += ' ORDER BY id ASC'

  // SQL Query > Select Data
  var query = client.query(queryString);

  // Stream results back one row at a time
  query.on('row', function(row) {
    results.push(row);
  });

  // After all data is returned, close connection and return results
  query.on('end', function() {
    client.end();
    // TODO Remove that or at least set a higher level
    // if(results.length > 1000) {
    //   results = results.splice(0, 1000);
    // }
    callback(null, results);
  });
}

router.get('/api/v1/bookmarks', function(req, res) {
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, function(err, client, done) {

    selectFromIds(client, [], function(err, results) {
      return res.json(results);
    });

    // Handle Errors
    if(err) {
      console.log(err);
    }
  });
});

router.post('/api/v1/bookmarks', function(req, res) {
  var results = [];

  // debug only
  // if(req.body.length > 5) {
  //   req.body = req.body.splice(0, 400);
  // }

  // Get a Postgres client from the connection pool
  pg.connect(connectionString, function(err, client, done) {

    if(req.body.length) {
      req.body.forEach(function(element) {
        // SQL Query > Insert Data
        client.query('INSERT INTO bookmarks("title", "url", "chromeDateAdded", "chromeId", "chromeParentId", "chromeIndex", "folder") values($1, $2, $3, $4, $5, $6, $7) RETURNING id', [
          element.title,
          element.url,
          element.chromeDateAdded,
          element.chromeId,
          element.chromeParentId,
          element.chromeIndex,
          element.folder
        ], function(err, result) {
          if(err) {
            return console.error('error running query', err);
          }
          console.log(result.rows[0], err);
          selectFromIds(client, [15654, 15655], function(err, results) {
            return res.json(results);
          });
        });
      });
    } else {
      // nothing was sent, so we return nothing
      return res.json([]);
    }

    // Handle Errors
    if(err) {
      console.log(err);
    }
  });
});

router.put('/api/v1/bookmarks/:bookmarks_id', function(req, res) {
  var results = [];

  // Grab data from the URL parameters
  var id = req.params.bookmarks_id;

  // Grab data from http request
  var data = {text: req.body.text, complete: req.body.complete};

  // Get a Postgres client from the connection pool
  pg.connect(connectionString, function(err, client, done) {
    // SQL Query > Update Data
    client.query("UPDATE items SET text=($1), complete=($2) WHERE id=($3)", [data.text, data.complete, id]);

    // SQL Query > Select Data
    var query = client.query("SELECT * FROM items ORDER BY id ASC");

    // Stream results back one row at a time
    query.on('row', function(row) {
        results.push(row);
    });

    // After all data is returned, close connection and return results
    query.on('end', function() {
        client.end();
        return res.json(results);
    });

    // Handle Errors
    if(err) {
      console.log(err);
    }
  });
});

router.delete('/api/v1/bookmarks/:bookmark_id', function(req, res) {
  var results = [];

  // Grab data from the URL parameters
  var id = req.params.bookmark_id;

  // Get a Postgres client from the connection pool
  pg.connect(connectionString, function(err, client, done) {
    // SQL Query > Delete Data
    client.query("DELETE FROM items WHERE id=($1)", [id]);

    // SQL Query > Select Data
    var query = client.query("SELECT * FROM items ORDER BY id ASC");

    // Stream results back one row at a time
    query.on('row', function(row) {
        results.push(row);
    });

    // After all data is returned, close connection and return results
    query.on('end', function() {
        client.end();
        return res.json(results);
    });

    // Handle Errors
    if(err) {
      console.log(err);
    }
  });
});

module.exports = router;
