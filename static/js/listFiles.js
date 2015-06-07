addEventListener('load', function () {
  new ListFiles()
})

function ListFiles () {
  getFileList(htmlPutter('fileList'))

  function htmlPutter (elemClass) {
    var elem = document.getElementsByClassName(elemClass)[0]
    return function putHTML (html) {
      elem.innerHTML += html
    }
  }

  function getAndDo (key, callback) {
    return function getAndDoThat (obj) {
      if(obj[key]) return callback(obj[key])
      return false
    }
  }

  function getFileList (callback) {
    var target = '/listFiles'
    var xhrO = new XMLHttpRequest()
    xhrO.open('GET', target, true)
    xhrO.addEventListener('load', getAndDo('response', callback).bind(null, xhrO))
    xhrO.send()
  }
}
