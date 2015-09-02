// Listener
$(document).ready(function () {
  $('.button-extract').on('click', function () {
    var button = $(this).button('loading')

    getBookmarks(function() {
      button.button('reset');
      $('.button-extract').after(
        '<div class="alert alert-success fade in">'+
          '<button type="button" class="close" ' +
            'data-dismiss="alert" aria-hidden="true">' + '&times;' +
          '</button>' +
          '<strong>Success!</strong> Bookmarks saved' +
        '</div>');
    });
  });

  $('.button-extract-tree').on('click', function () {
    var button = $(this).button('loading')

    getBookmarksTree(function() {
      button.button('reset');
      $('.button-extract-tree').after(
        '<div class="alert alert-success fade in">'+
          '<button type="button" class="close" ' +
            'data-dismiss="alert" aria-hidden="true">' + '&times;' +
          '</button>' +
          '<strong>Success!</strong> Bookmarks tree saved' +
        '</div>');
    });
  });
});

var flattenBookmarksTree = function(bookmarkTree) {
  // for the moment only process "Bookmarks Bar" bookmarks
  var treeToProcess = bookmarkTree[0].children[0].children;
  var flatTree = [];

  var browseTree = function(tree, parentTitle) {
    tree.forEach(function(subTree) {
      var childrenTree = subTree.children;
      if(!childrenTree) {
        var bookmark = {
          title           : subTree.title,
          url             : subTree.url,
          tags            : parentTitle.split('/').splice(1),
          chromeDateAdded : new Date(subTree.dateAdded),
          chromeId        : subTree.id,
          chromeParentId  : subTree.parentId,
          chromeIndex     : subTree.index,
          folder          : parentTitle
        };
        flatTree.push(bookmark);
      } else {
        if(parentTitle === '/') {
          parentTitle = '';
        }
        browseTree(childrenTree, parentTitle + '/' + subTree.title);
      }
    });
  };
  browseTree(treeToProcess, '/');

  console.log(flatTree);
  return flatTree;
};

// Browse the bookmark tree, and print the folder and nodes.
var getBookmarks = function(callback) {
  chrome.bookmarks.getTree(function(bookmarkTree) {
    var bookmarks = flattenBookmarksTree(bookmarkTree);

    $.ajax({
      type: "POST",
      url: 'http://localhost:3000/api/v1/bookmarks',
      data: JSON.stringify(bookmarks),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: callback
    });
  });
}


// Browse the bookmark tree, and print the folder and nodes.
var getBookmarksTree = function(callback) {
  chrome.bookmarks.getTree(function(bookmarkTree) {
    var bookmarks = bookmarkTree[0].children[0];

    $.ajax({
      type: "POST",
      url: 'http://localhost:3000/api/v1/bookmarks/tree',
      data: JSON.stringify(bookmarks),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: callback
    });
  });
}
