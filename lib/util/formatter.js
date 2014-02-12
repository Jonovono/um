exports.fileNameAndComment = fileNameAndComment;
exports.files = files;
exports.tags = tags;
exports.workspaces = workspaces;

function fileNameAndComment(files, cb) {
  var objs = [];

  for (var i = 0; i < files.length; i++) {
    objs.push({
      num: i + 1,
      file: files[i].file,
      comment: files[i].comment
    });
  }
  cb(objs);
}


function workspaces(w, cb) {
  var objs = [];

  for (var i = 0; i < w.length; i++) {
    objs.push({
      num: i + 1,
      workspace: w[i].name,
      description: w[i].description,
      files: w[i].files,
      tags: w[i].tags
    });
  }
  cb(objs);
}

function files(f, cb) {
  var objs = [];

  for (var i = 0; i < f.length; i++) {
    objs.push({
      num: i + 1,
      file: f[i].file,
      comment: f[i].comment,
      author: f[i].author,
      url: f[i].url,
      tags: f[i].tags
    });
  }
  cb(objs);
}

function tags(t, cb) {
  var objs = [];

  for (var i = 0; i < t.length; i++) {
    objs.push({
      num: i + 1,
      tag: t[i].tag
    });
  }
  cb(objs);
}