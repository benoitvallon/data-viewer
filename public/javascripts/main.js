'use strict'

var React = require('react');
var $ = require('jquery');
var d3 = require('d3');

var D3Chart = React.createClass({
  getInitialState: function() {
    return {};
  },

  componentDidMount: function() {
    $.get(this.props.source, function(result) {
      console.log('result', result);

      var myBkm = {}
      result.forEach(function(element) {
        if(element.folder === '') {
          element.folder = '/';
        }
        if(myBkm[element.folder] === undefined) {
          myBkm[element.folder] = {
            count: 0
          }
        }
        myBkm[element.folder].count++;
        myBkm[element.folder].name = element.url;
      })

      var final = {
        "nodes":[],
        "links":[]
      };

      for (var path in myBkm) {
        if (myBkm.hasOwnProperty(path)) {
          final.nodes.push({
            'name': path + ' (' + myBkm[path].count + ')',
            'group': Math.floor(Math.random()*10)
          });
        }
      }

      var graph = final;

      if (this.isMounted()) {
        var width = 960,
            height = 500;

        var color = d3.scale.category20();

        var force = d3.layout.force()
            .gravity(.05)
            .distance(150)
            .charge(-100)
            .size([width, height]);

        var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height);

        force
            .nodes(graph.nodes)
            .links(graph.links)
            .start();

        var link = svg.selectAll(".link")
            .data(graph.links)
          .enter().append("line")
            .attr("class", "link")
            .style("stroke-width", function(d) { return Math.sqrt(d.value); });

        var node = svg.selectAll(".node")
            .data(graph.nodes)
          .enter().append('g')
            .attr("class", "node")
            .call(force.drag);

        node.append("circle")
            .style("fill", function(d) { return color(d.group); })
            .attr("r", 10);
        node.append("text")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(function(d) { return d.name });

        force.on("tick", function() {
          link.attr("x1", function(d) { return d.source.x; })
              .attr("y1", function(d) { return d.source.y; })
              .attr("x2", function(d) { return d.target.x; })
              .attr("y2", function(d) { return d.target.y; });

          node.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
          })
        });

      }
    }.bind(this));
  },

  render: function() {
    return (
      <div>My bookmark's folders structure</div>
    );
  }
});

React.render(
  <D3Chart source="/api/v1/bookmarks" />,
  document.getElementById('example')
);
