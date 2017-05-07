/**
 * Created by Amagi on 5/5/2017.
 */

export class Errors {
  constructor(errors = {}) {
    this.errors = errors
  }

  has(field) {
    if (field) {
      return this.errors.hasOwnProperty(field)
    }
    return this.errors.length > 0
  }

  update(field) {
    for (let i in field) {
      if (field.hasOwnProperty(i)) this.errors[i] = field[i]
    }
  }

  get(field) {
    return this.errors[field]
  }

}
