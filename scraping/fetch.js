import fetch from 'node-fetch'

class Fetcher {
	constructor(encoding) {
		this.encoding = encoding
	}
	
	async html(URL) {
		return fetch(URL)
			.then((resp) => resp.arrayBuffer())
			.then((data) => {
				return new TextDecoder(this.encoding).decode(data)
			})
	}
}

export default Fetcher