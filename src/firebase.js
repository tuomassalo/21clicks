function post(operation, data) {
  // const base = 'http://localhost:5000/clicks-21/us-central1/'
  const base = 'https://us-central1-clicks-21.cloudfunctions.net/'
  return new Promise((resolve, reject) => {
    function error(e) {
      console.log(e)
      alert('Network error.')
      reject()
    }

    fetch(base + operation, {
      method: 'post',
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then(response => {
        if (response) {
          resolve(response.json())
        } else {
          error('invalid response')
        }
      })
      .catch(err => {
        error(err)
      })
  })
}

export default {
  save(recording) {
    return post('save', recording)
  },
  load(recordingId) {
    return post('load', {recordingId})
  },
}
