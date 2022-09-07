import { parentPort } from 'worker_threads'
import Fetcher from './fetch.js'
import cheerio from 'cheerio'

parentPort.on('message', (task) => {
	scrape(task.encoding, task.taskUrl).then((res) => {
		parentPort.postMessage(res)
	})
})

const scrape = async (encoding, url) => {
	const results = { "M": [], "F": [] }
	const fetch = new Fetcher(encoding)
	
	const $ = cheerio.load(await fetch.html(url))
	const tables = $(".pure-u-1.pure-u-md-1-2")
	
	const genders = ["M", "F"]
	for(let i=0; i<genders.length; i++) {
		const names = []
		tables[i].children[1].children[0].children
		.forEach((row) => {
			row.children.forEach((col) => {
				const tag = col.children[0]
				if(tag.name === "strong")
					names.push(tag.children[0].children[0].data)
			})
		})
		results[genders[i]] = results[genders[i]].concat(names)
	}
	return results
}