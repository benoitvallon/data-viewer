'use strict';

var React = require('react');
var $ = require('jquery');
var d3 = require('d3');

var D3Chart = React.createClass({
  getInitialState: function() {
    return {
      numberOfBookmarks: 0
    };
  },

  componentDidMount: function() {

    $.get(this.props.source, function(result) {
      this.setState({
        'numberOfBookmarks': result.length
      });

      var root = JSON.parse(result[0].tree);

      if (this.isMounted()) {
        var diameter = 960;

        var tree = d3.layout.tree()
            .size([360, diameter / 2 - 120])
            .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

        var diagonal = d3.svg.diagonal.radial()
            .projection(function(d) {
              // console.log('d', d);
              return [d.y, d.x / 180 * Math.PI];
            });

        var svg = d3.select("body").append("svg")
            .attr("width", diameter)
            .attr("height", diameter - 150)
          .append("g")
            .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

        var nodes = tree.nodes(root),
            links = tree.links(nodes);

        var link = svg.selectAll(".link")
            .data(links)
          .enter().append("path")
            .attr("class", "link")
            .attr("d", diagonal);

        var node = svg.selectAll(".node")
            .data(nodes)
          .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

        node.append("circle")
            .attr("r", 4.5);

        node.append("text")
            .attr("dy", ".31em")
            .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
            .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
            .text(function(d) { return d.title; });

        d3.select(self.frameElement).style("height", diameter - 150 + "px");
      }
    }.bind(this));
  },

  render: function() {
    return (
      <div>My bookmark's tilford folders structure: {this.state.numberOfBookmarks} bookmarks</div>
    );
  }
});

var render = function() {
  React.render(
    <D3Chart source='/api/v1/bookmarks/tree' />,
        document.getElementById('tilford-graph')
  );
}

module.exports = render;
