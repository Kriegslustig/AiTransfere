var fs = require('fs')
var path = require('path')
var _ = require('underscore')

module.exports = {
  callbacker: function (thisArg, sucCall, errCall) {
    return function (err, data) {
      if(errCall && err) return errCall.apply(thisArg, [err])
      sucCall.apply(thisArg, [data])
    }
  },
  readPlainText: function (filepath, callback) {
    fs.readFile(filepath, {encoding: 'utf8'}, callback)
  },
  rmF: function (filepath, callback) {
    var self = this
    fs.stat(filepath, function (err, stat) {
      if(err) throw err
      var dirIndex = []
      function endDir () {
        fs.rmdirSync(filepath)
        callback()
      }
      if(stat.isFile()) {
        fs.unlinkSync(filepath)
        callback()
        return
      }
      dirIndex = fs.readdirSync(filepath)
      if(dirIndex.length == 0) return endDir()
      dirIndex.forEach(function (element, ind, arr) {
        if(ind === arr.length - 1) {
          self.rmF(path.join(filepath, element), endDir)
        } else {
          self.rmF(element)
        }
      })
    })
  },
  asyncCall: function (fun/*, args*/) {
    setTimeout(function () {
      fun(_.rest(arguments))
    }, 1)
  }
}