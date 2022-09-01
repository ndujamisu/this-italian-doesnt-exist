import progressBar from './progress-bar.js'
import fetch from 'node-fetch'
import cheerio from 'cheerio'
import fs from 'fs'
 
const html = (URL) => {
	return fetch(URL)
			.then((resp) => resp.arrayBuffer())
			.then((data) => {
				return new TextDecoder('utf-8').decode(data)
			})
}

const filePath = "data/cognomi.json"
const url = "https://www.cognomix.it/origine-cognomi-italiani/"
const initials = []
const results = []

if( ! fs.existsSync(filePath)) {
	console.log("Scraping 'cognomi' avviato...")
	
	let $ = cheerio.load(await html(url))
	
	$("h3")[0].children
	.filter((tag) => tag.name !== undefined)
	.forEach((el) => {
		initials.push(el.children[0].data.trim())
	})
	
	progressBar.init(initials.length)
	
	for(let i=0; i<initials.length; i++) {
		if(initials[i] !== "A")
			$ = cheerio.load(await html(url+initials[i]))
		
		const val = $(".contenuto>div")[1].children
				.filter((el) => el.name === "a").at(-1)
		const pages = (val === undefined)
				? 1 : parseInt(val.children[0].data)
		
		for(let j=1; j<=pages; j++) {
			if(j !== 1)
				$ = cheerio.load(await html(url+initials[i]+"/"+j))
			
			$("ul")[6].children
			.forEach((el) => {
				results.push(
					el.children[0].children[0].data
					.split("-")[0].trim()
				)
			})
		}
		progressBar.update()
	}
	
	fs.writeFile(filePath, JSON.stringify(results), () => {})
}
console.log("Scraping 'cognomi' completato (disponibile qui: '"+filePath+"')")