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
  // fileinput.addEventListener("dragover", fileDragHover);
  // fileinput.addEventListener("dragleave", fileDragHover);
  // fileinput.addEventListener("drop", fileSelectHandler);

  function fileDragHover (e) {
    inputLabel.setAttribute('data-dragover', (e.type == "dragover" ? true : false));
  }

  function fileSelectHandler (e) {
    if(e) fileDragHover(e)
    var files = e.target.files
    if(files && files[0]) labelIt(files[0].name)
    return false
  }

  function labelIt (newLabel) {
    inputLabel.innerHTML = newLabel
  }
}