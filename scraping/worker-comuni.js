import { parentPort } from 'worker_threads'
import Fetcher from './fetch.js'
import cheerio from 'cheerio'

parentPort.on('message', (task) => {
	scrape(task.encoding, task.url, task.suffix).then((res) => {
		parentPort.postMessage(res)
	})
})

const scrape = async (encoding, url, suffix) => {
	const results = []
	const fetch = new Fetcher(encoding)
	
	let $ = cheerio.load(await fetch.html(url+suffix))
	const rows = $("table.tabwrap")[0]
			.children[1].children
			.filter((el) => el.name === "tr")
	
	for(let i=0; i<rows.length; i++) {
		const cols = rows[i].children
				.filter((el) => el.name === "td")
		const n = (cols.length === 4) ? 2 : 1
		
		for(let j=0; j<n; j++) {
			let key = cols[j*2].children[0].data
			const val = cols[j*2+1].children[0].children[0]

			if(key.includes("x")) {
				$ = cheerio.load(await fetch.html(url+val.attribs.href))
				key = $("td.ival")[3].children[0].children[0].data
			}
			results.push(key+':'+val.children[0].data)
		}
	}
	return results
}



