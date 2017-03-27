/**
 * Created by Administrator on 3/24/2017.
 */

class Errors {
	constructor() {
		this.errors = {};
	}

	has(field) {
		return this.errors.hasOwnProperty(field);
	}

	any() {
		return Object.keys(this.errors).length > 0;
	}

	get(field) {
		if (this.errors[field]) {
			return this.errors[field];
		}
	}

	record(errors) {
		this.errors = errors;
	}

	clear(field) {
		if (field) {
			delete this.errors[field];

			return;
		}

		this.errors = {};
	}
}

class Wallet {
	constructor(data, http) {
		this.originalData = data;
		this.http = http;

		for (let field in data) {
			this[field] = data[field];
		}

		this.error = new Errors();
	}

	set(name, value) {
		if (name) {
      this[name] = value;
    } else {
      for (let key in value) {
	      this[key] = value[key];
      }
		}
	}

	reset() {
		for (let field in this.originalData) {
			this[field] = '';
		}

		this.errors.clear();
	}

	get(url, data) {
		return this.submit('get', url, data)
	}

	post(url, data) {
		return this.submit('post', url, data)
	}

	submit(requestType, url, data) {
		const self = this;
		return new Promise((resolve, reject) => {
			self.http[requestType](url, data)
					.then(({ data }) => {
						resolve(data);
					},
							({ data }) => {
								this.error.record(data.error);
								reject(data.error)
							});
		})
	}
}

export default Wallet;