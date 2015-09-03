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

      var countChildren = function(tree) {
        if(!tree.children) {
          return;
        }
        var counter = 0
        var children = []
        tree.children.forEach(function(child, index) {
          if(!child.children) {
            delete tree.children[index];
            counter++;
          } else {
            children.push(child)
          }
        })
        tree.counter = counter;
        tree.title = tree.title + ' (' + counter + ')';
        tree.children = children;
        tree.children.forEach(function(child) {
          countChildren(child);
        })
      }

      countChildren(root)

      if (this.isMounted()) {
        var width = 960,
            height = 1800;

        var tree = d3.layout.tree()
            .size([height, width - 160]);

        var diagonal = d3.svg.diagonal()
            .projection(function(d) { return [d.y, d.x]; });

        var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(40,0)");

        var nodes = tree.nodes(root),
          links = tree.links(nodes);

        var link = svg.selectAll("path.link")
            .data(links)
          .enter().append("path")
            .attr("class", "link")
            .attr("d", diagonal);

        var node = svg.selectAll("g.node")
            .data(nodes)
          .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

        node.append("circle")
            .attr("r", 4.5);

        node.append("text")
            .attr("dx", function(d) { return d.children ? -8 : 8; })
            .attr("dy", 3)
            .attr("text-anchor", function(d) { return d.children ? "end" : "start"; })
            .text(function(d) { return d.title; });

        d3.select(self.frameElement).style("height", height + "px");
      }
    }.bind(this));
  },

  render: function() {
    return (
      <div>My bookmark's tilford flat folders structure: {this.state.numberOfBookmarks} bookmarks</div>
    );
  }
});

var render = function() {
  React.render(
    <D3Chart source='/api/v1/bookmarks/tree' />,
        document.getElementById('tilford-flat-folder-graph')
  );
}

module.exports = render;
