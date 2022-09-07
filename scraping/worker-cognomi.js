import { parentPort } from 'worker_threads'
import fetch from './fetch.js'
import cheerio from 'cheerio'

parentPort.on('message', (task) => {
	scrape(task.taskUrl).then((res) => {
		parentPort.postMessage(res)
	})
})

const scrape = async (url) => {
	const results = []
	let $ = cheerio.load(await fetch.html(url, 'utf-8'))
	
	const val = $(".contenuto>div")[1].children
			.filter((el) => el.name === "a").at(-1)
	const pages = (val === undefined)
			? 1 : parseInt(val.children[0].data)
			
	for(let i=1; i<=pages; i++) {
		if(i !== 1)
			$ = cheerio.load(await fetch.html(url+"/"+i, 'utf-8'))
		
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