
window.addEventListener('load', function () {
  listenForFileUploads(document.getElementsByClassName('fileUploadForm')[0])
})

function listenForFileUploads (form) {
  form.onsubmit = function (event) {
    event.preventDefault()
    uploadFileFromForm(form)
    return false
  }
}

function uploadFileFromForm (form) {
  return uploadFile(form.getElementsByClassName('fileUpload__input')[0].files[0])
}

function uploadFile (file) {
  var formData = new FormData()
  formData.append('file', file, file.name)
  sendBack(formData)
}

sendBack = (function () {
  var reciever = 'upload'
  return function (data) {
    var upload = new XMLHttpRequest()
    upload.open('POST', reciever, true)
    upload.addEventListener('load', renderDone.bind(null, upload))
    upload.addEventListener('progress', updateProgress.bind(null, upload))
    upload.send(data)
  }
})()

function updateProgress (xhrReq, evt) {
  var progressBar = document.getElementsByClassName('progressBar')[0]
  if(xhrReq.status && xhrReq.status !== 200) progressBar.style.backgroundColor = 'hsl(1, 60%, 80%)'
  progressBar.style.height = ((evt.loaded / evt.total) * 100) + 'vh'
}

function renderDone (xhrReq, event) {
  document.getElementsByClassName('messages')[0].innerHTML = xhrReq.response

}
