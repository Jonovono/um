exports.fileNameAndComment = fileNameAndComment;
exports.files = files;
exports.tags = tags;

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

function files(files, cb) {
  var objs = [];

  for (var i = 0; i < files.length; i++) {
    objs.push({
      num: i + 1,
      file: files[i].file,
      comment: files[i].comment,
      author: files[i].author,
      url: files[i].url,
      tags: files[i].tags
    });
  }
  cb(objs);
}

function tags(tags, cb) {
  var objs = [];

  for (var i = 0; i < tags.length; i++) {
    objs.push({
      num: i + 1,
      tag: tags[i].tag
    });
  }
  cb(objs);
}