var fs = require('fs')
var express = require('express')
var expressBusboy = require('express-busboy')

var u = require('./utilities')

var app = express()
var viewsLoc = 'view/'
var dataLoc = 'data/'
var dataPath = '/download/'
var staticLoc = 'static/'

module.exports = {
  listen: listen
}

function listen (port) {
  app.use(express.static(staticLoc))
  expressBusboy.extend(app, {
    upload: true,
    path: dataLoc
  })
  return app = route(app).listen(port)
}

function route (localApp) {
  console.log('Routing...')
  localApp.get('/', viewer(viewIndex, localApp))
  localApp.get('/listFiles', viewer(viewListFiles, localApp))
  localApp.get('/download/:filename', viewer(viewDownload, localApp))
  localApp.post('/upload', viewer(viewUpload, localApp))
  return localApp
}

function viewer (fun, localApp) {
  return function (req, res) {
    fun(req, res, localApp)
  }
}

function getView (name, callback) {
  u.readPlainText(viewsLoc + name, callback)
}

function viewIndex (req, res, localApp) {
  getView('index.html', u.callbacker(res, res.send, console.error))
  return localApp
}

function viewDownload (req, res, localApp) {
  var filepath = dataLoc + req.params.filename
  fs.exists(filepath, function (exists) {
    if(exists) {
      res.sendFile(req.params.filename, {
        root: dataLoc
      })
    } else {
      statusReturner(res, 'No such file', 406)
    }
  })
}

function viewUpload (req, res, localApp) {
  var filename = req.files.file.filename
  moveNotThere(
    req.files.file.file,
    dataLoc + filename,
    u.callbacker(
      res,
      tmpDirRemover(
        dataLoc + req.files.file.uuid,
        statusReturner(res, 'File Successfully uploaded: ' + linkToData(filename), 200)
      ),
      tmpDirRemover(
        dataLoc + req.files.file.uuid,
        statusReturner(res, 'File Already Exsists', 406)
      )
    )
  )
}

function viewListFiles (req, res, localApp) {
  getFileList(res.send.bind(res))
}

function getFileList (callback) {
  fs.readdir(dataLoc, function (err, dirList) {
    var dirListHTML = '<ul>'
    if(err) throw err
    dirList.forEach(function (filename) {
      dirListHTML += '<li>'
      dirListHTML += linkToData(filename)
      dirListHTML += '</li>'
    })
    dirListHTML += '</ul>'
    callback(dirListHTML)
  })
}

function linkToData (fileName) {
  return '<a href="' + dataPath + fileName + '">' + fileName + '</a>'
}

function statusReturner (res, msg, status) {
  return function throwError () {
    console.error(msg)
    res.status(status)
    res.send(msg)
  }
}

function tmpDirRemover (filepath, callback) {
  return function () {
    var res = this
    u.rmF(filepath, callback)
  }
}

function moveNotThere (moveThis, toHere, callback) {
  if(!fs.existsSync(toHere)) {
    fs.rename(moveThis, toHere, callback)
  } else {
    callback(true)
  }
}
