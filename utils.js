export default {
  download(contents) {
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(contents)))
    element.setAttribute('download', 'recording.json')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  },
  handleUpload(files, cb) {
    const reader = new FileReader()
    reader.onload = e => {
      cb(JSON.parse(e.target.result))
    }
    reader.readAsText(files[0])
  },
}
