// Listener
document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('.button-extract').addEventListener('click', function () {
    dumpBookmarks();
  });
});

var flattenChromeBookmarksTree = function(chromeBookmarkTree) {
  // for the moment only process "Bookmarks Bar" bookmarks
  var treeToProcess = chromeBookmarkTree[0].children[0].children;
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

// Traverse the bookmark tree, and print the folder and nodes.
var dumpBookmarks = function(query) {
  var bookmarkTreeNodes = chrome.bookmarks.getTree(
    function(bookmarkTreeNodes) {
      var bookmarks = flattenChromeBookmarksTree(bookmarkTreeNodes);

      $.ajax({
        type: "POST",
        url: 'http://localhost:3000/api/v1/bookmarks',
        data: JSON.stringify(bookmarks),
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
          console.log('posted', data);
        },
        dataType: 'json'
      });
    });
}
