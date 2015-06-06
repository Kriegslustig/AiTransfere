window.addEventListener('load', function () {
  if(File && FileList && FileReader) {
    new FileInput(
      document.getElementsByClassName('fileUpload')[0],
      document.getElementsByClassName('fileUpload__label')[0]
    )
  }
})

function FileInput (fileinput, inputLabel) {

  fileinput.addEventListener('change', fileSelectHandler)
  fileinput.addEventListener("dragover", fileDragHover);
  fileinput.addEventListener("dragleave", fileDragHover);
  fileinput.addEventListener("drop", fileSelectHandler);

  function fileDragHover (e) {
    e.target.setAttribute('data-dragOver', (e.type == "dragover" ? true : false));
  }

  function fileSelectHandler (e) {
    fileDragHover(e)
    var file = (e.target.files || e.dataTransfer.files)[0]
    labelIt(file.name)
  }

  function labelIt (newLabel) {
    inputLabel.innerHTML = newLabel
  }
}