'use strict'

var React = require('react');
var D3Chart = require('./d3-force.js');

React.render(
  <D3Chart source='/api/v1/bookmarks' />,
      document.getElementById('force-graph')
);
