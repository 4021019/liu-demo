
  function mergeViewHeight(mergeView) {
    function editorHeight(editor) {
      if (!editor) return 0;
      return editor.getScrollInfo().height;
    }
    return Math.max(editorHeight(mergeView.leftOriginal()),
                    editorHeight(mergeView.editor()),
                    editorHeight(mergeView.rightOriginal()));
  }
  
  function resize(mergeView) {
      debug;
    var height = mergeViewHeight(mergeView);
    for(;;) {
      if (mergeView.leftOriginal())
        mergeView.leftOriginal().setSize(null, height);
      mergeView.editor().setSize(null, height);
      if (mergeView.rightOriginal())
        mergeView.rightOriginal().setSize(null, height);
  
      var newHeight = mergeViewHeight(mergeView);
      if (newHeight >= height) break;
      else height = newHeight;
    }
    mergeView.wrap.style.height = height + "px";
  }