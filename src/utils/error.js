/**
 * Created by Amagi on 5/5/2017.
 */

export class Errors {
  constructor(errors = {}) { this.errors = errors }

  has(field) {
    if (field) return this.errors.hasOwnProperty(field)
    return Object.keys(this.errors).length > 0
  }

  update(field) {
    for (const i in field) {
      if (field.hasOwnProperty(i)) this.errors[i] = field[i]
    }
  }

  get(field) { return this.errors[field] }

  record(errors) { this.errors = errors }

  clear(field) {
    if (field) return delete this.errors[field]
    this.errors = {}
  }
}

export class Form {
  constructor(data) {
    this.originalData = data

    for (const field in data) {
      if (data.hasOwnProperty(field)) this[field] = data[field]
    }

    this.errors = new Errors()
  }

  data() { return this.originalData }

  reset() {
    for (const field in this.originalData) {
      if (this.originalData.hasOwnProperty(field)) this[field] = ''
    }

    this.errors.clear()
  }

  post(url) {
    return this.submit('post', url)
  }

  put(url) {
    return this.submit('put', url)
  }

  patch(url) {
    return this.submit('patch', url)
  }

  delete(url) {
    return this.submit('delete', url)
  }

  static submit(requestType, url) {
    return new Promise((resolve, reject) => {
      axios[requestType](url, this.data())
          .then(response => {
            this.onSuccess(response.data)

            resolve(response.data)
          })
          .catch(error => {
            this.onFail(error.response.data)

            reject(error.response.data)
          })
    })
  }

  onSuccess(data) {
    alert(data.message) // temporary

    this.reset()
  }

  onFail(errors) {
    this.errors.record(errors)
  }
}
