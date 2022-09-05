import fetch from 'node-fetch'

export default {
	html: async function(URL, encoding) {
		return fetch(URL)
			.then((resp) => resp.arrayBuffer())
			.then((data) => {
				return new TextDecoder(encoding).decode(data)
			})
	}
}