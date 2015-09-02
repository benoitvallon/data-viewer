var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/dataviewer';

var client = new pg.Client(connectionString);
client.connect();

// use the double quote to make the column names case-sensitive
var query = client.query('CREATE TABLE bookmarks(' +
  '"id" SERIAL PRIMARY KEY,' +
  '"title" VARCHAR(1024) NOT NULL,' +
  '"url" VARCHAR(1024) NOT NULL,' +
  '"chromeDateAdded" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),' +
  '"chromeId" BIGINT,' +
  '"chromeParentId" BIGINT,' +
  '"chromeIndex" BIGINT,' +
  '"folder" VARCHAR(1024)' +
');'+
'CREATE TABLE bookmarkstree(' +
  '"id" SERIAL PRIMARY KEY,' +
  '"tree" TEXT NOT NULL' +
')');

query.on('end', function() { client.end(); });
