// var util = require('./util');
var log = require('winston');
var _ = require('underscore');
var color = require('colors');
var path = require('path');
var config = require('../../config');
// var UM = require('../main');
var shell = require('shelljs');
var helpers = require('../util/helpers');
var fs = require('fs');

function Workspace(storage) {
  this.storage = storage;

  this.storage.ensureIndex({fieldName: 'name', unique: true});
}

Workspace.prototype.all = function(cb) {
  this.storage.find({}, function (err, docs) {
    cb(docs);
  });
};

Workspace.prototype.addWorkspaces = function(workspaces) {
  var that = this;
  _.each(workspaces, function(workspace) {
    that.addWorkspace(workspace, [], [], null);
  });
}

Workspace.prototype.addWorkspace = function(workspace, tags, files, description) {
  var that = this;

  description = (description !== undefined)? description: '';
  tags = (tags.length !== 0)? tags : [];
  files = (files.length !== 0)? files : [];

  var workspacePath = path.join(config.workspaces_path, workspace);
  if (!helpers.fileExistsOnComputer(workspacePath)) {
    fs.mkdirSync(workspacePath);
  }

  this.workspaceExistsInDatabase(workspace, function(exists) {
    if (exists) {
      log.warn('Workspace %s already exists.', color.blue(workspace));
      if (helpers.hasAny(tags)) that.addTags(workspace, tags);
      if (helpers.hasAny(files)) that.addFiles(workspace, files);
      if (helpers.containsText(description)) that.setDescription(workspace, description);
      return;
    }

    var w = { name: workspace,
              description: description,
              added: new Date(),
              files: files,
              tags: tags
      };
    that.storage.insert(w, function(err, doc) {
      if (err) {
        log.error('Workspace %s could not be added', color.blue(workspace));
        return;
      }
      log.info('Workspace %s has been created.', color.blue(workspace));
    });
  });
};

// Takes one file and will update the file accordingly
Workspace.prototype.updateWorkspace = function(workspace, tags, files, description) {
  var that = this;

  description = (description !== undefined)? description: '';

  this.workspaceExistsInDatabase(workspace, function(exists) {

    if (!exists) {
      log.warn('Workspace %s does not exist in database. Cannot be updated', colors.blue(workspace));
      return;
    }

    // If the file is already in the database
    // We will be appending/updating the comments or something
    if (exists) {
      if (helpers.hasAny(tags)) that.addTags(workspace, tags);
      if (helpers.hasAny(files)) that.addFiles(workspace, tags);
      if (helpers.containsText(description)) that.setDescription(workspace, description);
      return;
    }
  });
};

Workspace.prototype.deleteWorkspace = function(workspace) {
  this.workspaceExistsInDatabase(workspace, function(exists) {
    if (!exists) {
      log.error('Workspace %s does not exist in database.', color.blue(workspace));
      return;
    }

    this.storage.remove({name: workspace}, {}, function(err, num) {
    if (err) {
      log.error('Workspace %s could not be deleted.', color.blue(workspace));
      return;
    }
    log.info('Workspace %s has been deleted.', color.blue(workspace));
  });
  });
};

Workspace.prototype.deleteWorkspaces = function(workspaces) {
  var that = this;
  _.each(workspaces, function(workspace) {
    that.workspaceExistsInDatabase(workspace, function(exists) {
      if (!exists) {
        log.warn('Workspace %s does not exist in database.', color.blue(workspace));
        return;
      }
      that.deleteWorkspace(workspace);
    });
  });
};

Workspace.prototype.removeFromWorkspace = function(workspace, tags, files, description) {
  var that = this;

  this.workspaceExistsInDatabase(workspace, function(exists) {
    if (!exists) {
      log.warn('Workspace %s does not exist in database ...', color.blue(workspace));
      return;
    }

    if (helpers.hasAny(tags)) that.removeTagsFromWorkspace(workspace, tags);
    if (helpers.hasAny(files)) that.removeFilesFromWorkspace(workspace, files);
    if (description) that.removeDescriptionFromWorkspace(workspace);
  });
};

Workspace.prototype.removeTagsFromWorkspacesWithThoseTags = function(tags) {
  var that = this;

  _.each(tags, function(tag) {
    that.removeTagsFromWorkspacesWithThatTag(tag);
  });
};

Workspace.prototype.removeTagsFromWorkspacesWithThatTag = function(tag) {
  this.storage.update({tags: tag}, {$pull: {tags: tag}}, {multi: true}, function(err, num) {
    if (err) {log.error('Could not remove tags from those workspaces'); return;}
  });
};

Workspace.prototype.removeDescriptionFromWorkspace = function(workspace) {
  this.storage.update({name: workspace}, { $set: {description: ''}}, {}, function(err, num) {
    if (err) {
      log.error('Could not remove description from workspace %s.', workspace);
      return;
    }

    log.info('Description removed from workspace %s', color.blue(workspace));
  });
};


Workspace.prototype.removeTagsFromWorkspace = function(workspace, tags) {
  this.storage.update({name: workspace}, {$pull: {tags: {$in: tags}}}, {}, function(err) {
    if (err) {log.error('Could not remove tags from workspace %s.', workspace); return; }

    log.info('%s Tags %s has been removed from workspace %s.', 
      color.green('✓'), color.blue(tags), color.blue(workspace));
  });
};

Workspace.prototype.removeFilesFromWorkspace = function(workspace, files) {
  this.storage.update({name: workspace}, {$pull: {files: {$in: files}}}, {}, function(err) {
    if (err) {log.error('Could not remove files from workspace %s.', workspace); return; }

    log.info('%s Files %s has been removed from workspace %s.', 
      color.green('✓'), color.blue(files), color.blue(workspace));
  });
};

Workspace.prototype.getTag = function(name, cb) {
  var that = this;

  this.storage.find({tag: name}, function(err, doc) {
    if (!doc.length) {
      cb(null);
      return;
    }

    cb(doc[0]);
  });
};

Workspace.prototype.tagPath = function(tag, cb) {
  this.getTag(tag, function(doc) {
    if (!doc) return cb(null);
    var sPath = path.join(config.um_path, tag);
    cb(sPath);
  });
};

Workspace.prototype.addTags = function(workspace, tags) {
  if (!helpers.hasAny(tags)) return;
  this.storage.update({name: workspace}, { $addToSet: {tags: { $each: tags}}}, {}, function() {
    log.info('%s Tag(s) %s has been added to workspace %s.', 
      color.green('✓'), color.blue(tags), color.blue(workspace));
  });
};

Workspace.prototype.addFilesToWorkspaces = function(workspaces, files) {
  var that = this;
  _.each(workspaces, function(workspace) {
    that.addFiles(workspace, files);
  });
};

Workspace.prototype.addTagsToWorkspaces = function(workspaces, tags) {
  var that = this;
  _.each(workspaces, function(workspace) {
    that.addTags(workspace, tags);
  });
};

Workspace.prototype.addFiles = function(workspace, files) {
  if (!helpers.hasAny(files)) return;
  this.storage.update({name: workspace}, { $addToSet: {files: { $each: files}}}, {}, function() {
    log.info('%s File(s) %s has been added to workspace %s.', 
      color.green('✓'), color.blue(files), color.blue(workspace));
  });
};

Workspace.prototype.addTag = function(workspace, tag) {
  this.storage.update({name: workspace}, { $addToSet: {tags: tag}}, {}, function() {
    log.info('Tag %s added to file %s', color.blue(tag), color.blue(file));
  });
};

Workspace.prototype.setDescription = function(workspace, description) {
  this.storage.update({name: workspace}, { $set: {description: description}}, {}, function() {
    log.info('Description has been replaced for workspace %s', color.blue(workspace));
  });
};

Workspace.prototype.deleteTag = function(tag) {
  this.storage.remove({tag: tag}, {}, function(err, num) {
    if (err) {
      log.error('Tag %s could not be deleted.', color.blue(tag));
      return;
    }
    log.info('Tag %s has been deleted.', color.blue(tag));
  });
};

Workspace.prototype.deleteTags = function(tags) {
  var that = this;
  _.each(tags, function(tag) {
    that.deleteTag(tag);
  });
};

// --------------------------------------------------------
// --------------------- HELPER FUNCTIONS -----------------
// --------------------------------------------------------

Workspace.prototype.workspaceExistsInDatabase = function(workspace, cb) {
  this.storage.find({name: workspace}, function (err, docs) {
    // Return true if file exists in the database
    // false otherwise
    cb(!!docs.length);
  });
};

module.exports = Workspace;