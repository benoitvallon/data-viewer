'use strict'

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
        'nodes':[],
        'links':[]
      };

      var createParentIfNeeded = function(path) {
        if(path === '/') {
          return;
        }
        var newPath = path.split('/');
        newPath.pop();
        var parent = newPath.join('/') || '/'
        if(!myBkm[parent]) {
          myBkm[parent] = {
            count: 0
          }
          createParentIfNeeded(parent)
        }
        return;
      }

      // we must check for parent node if needed
      for (var path in myBkm) {
        if (myBkm.hasOwnProperty(path)) {
          createParentIfNeeded(path);
        }
      }

      for (var path in myBkm) {
        if (myBkm.hasOwnProperty(path)) {
          var id = final.nodes.push({
            'name': path + ' (' + myBkm[path].count + ')',
            'group': Math.floor(Math.random()*10)
          });
          myBkm[path].index = id - 1
        }
      }

      for (var path in myBkm) {
        if (myBkm.hasOwnProperty(path)) {
          var splitted = path.split('/');
          var target = splitted.join('/') || '/'
          splitted.pop();
          var source = splitted.join('/') || '/'

          if(!myBkm[source]) {
            var id = final.nodes.push({
              'name': path + ' (0)',
              'group': Math.floor(Math.random()*10)
            });
            myBkm[source] = {
              index: id - 1,
              count: 0
            }
          }

          if(myBkm[target] && myBkm[source]) {
            final.links.push({
              'source': myBkm[source].index,
              'target': myBkm[target].index,
              'value': 1
            })
          }
        }
      }

      var graph = final;

      if (this.isMounted()) {
        var width = 1100,
            height = 640;

        var color = d3.scale.category20();

        var force = d3.layout.force()
            .gravity(0.02)
            .distance(80)
            .charge(-100)
            .size([width, height]);

        var svg = d3.select('body').append('svg')
            .attr('width', width)
            .attr('height', height);

        force
            .nodes(graph.nodes)
            .links(graph.links)
            .start();

        var link = svg.selectAll('.link')
            .data(graph.links)
          .enter().append('line')
            .attr('class', 'link')
            .style('stroke-width', function(d) { return Math.sqrt(d.value); });

        var node = svg.selectAll('.node')
            .data(graph.nodes)
          .enter().append('g')
            .attr('class', 'node')
            .call(force.drag);

        node.append('circle')
            .style('fill', function(d) { return color(d.group); })
            .attr('r', 8);
        node.append('text')
            .attr('dx', 10)
            .attr('dy', '.35em')
            .text(function(d) { return d.name });

        force.on('tick', function() {
          link.attr('x1', function(d) { return d.source.x; })
              .attr('y1', function(d) { return d.source.y; })
              .attr('x2', function(d) { return d.target.x; })
              .attr('y2', function(d) { return d.target.y; });

          node.attr('transform', function(d) {
            return 'translate(' + d.x + ',' + d.y + ')';
          })
        });

      }
    }.bind(this));
  },

  render: function() {
    return (
      <div>My bookmark's folders structure: {this.state.numberOfBookmarks} bookmarks</div>
    );
  }
});

React.render(
  <D3Chart source='/api/v1/bookmarks' />,
  document.getElementById('example')
);
