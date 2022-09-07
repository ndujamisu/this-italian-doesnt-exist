import { parentPort } from 'worker_threads'
import Fetcher from './fetch.js'
import cheerio from 'cheerio'

parentPort.on('message', (task) => {
	scrape(task.encoding, task.taskUrl).then((res) => {
		parentPort.postMessage(res)
	})
})

const scrape = async (encoding, url) => {
	const results = []
	const fetch = new Fetcher(encoding)
	
	let $ = cheerio.load(await fetch.html(url))
	const val = $(".contenuto>div")[1].children
			.filter((el) => el.name === "a").at(-1)
	const pages = (val === undefined)
			? 1 : parseInt(val.children[0].data)
			
	for(let i=1; i<=pages; i++) {
		if(i !== 1)
			$ = cheerio.load(await fetch.html(url+"/"+i))
		
		$("ul")[6].children
		.forEach((el) => {
			results.push(
				el.children[0].children[0].data
				.split("-")[0].trim()
			)
		})
	}
	return results
}