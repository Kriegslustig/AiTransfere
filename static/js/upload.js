
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
    upload.onload = renderDone.bind(null, upload)
    upload.send(data)
  }
})()

function renderDone (xhrReq, event) {
  document.getElementsByClassName('messages')[0].innerHTML = xhrReq.response

}