import progressBar from './progress-bar.js'
import fetch from 'node-fetch'
import cheerio from 'cheerio'
import fs from 'fs'
 
const html = (URL) => {
	return fetch(URL)
			.then((resp) => resp.arrayBuffer())
			.then((data) => {
				return new TextDecoder('ISO-8859-1').decode(data)
			})
}

const filePath = 'data/comuni.json'
const URL = "http://www.comuni-italiani.it/cap/"

if( ! fs.existsSync(filePath)) {
	console.log("Scraping 'comuni' avviato...")
	
	const suffixes = []
	let results = []
	
	let $ = cheerio.load(await html(URL))
	
	const rows = $("table.tabwrap")[0]
			.children[1].children
			.filter((el) => el.name === "tr")
	
	const keys = Object.keys(rows).length
	for(let i=0; i<keys; i++) {
		rows[i].children.forEach((col) => {
			if(col.children[0].name === "b")
				suffixes.push(
					col.children[0].children[0].attribs.href
				)
		})
	}
	
	progressBar.init(suffixes.length)
	
	for(const suffix of suffixes) {
		
		$ = cheerio.load(await html(URL+suffix))
		
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
					$ = cheerio.load(await html(URL+val.attribs.href))
					key = $("td.ival")[3].children[0].children[0].data
				}
				
				results.push(key+":"+val.children[0].data)
			}
		} 
		progressBar.update()
	}
	
	fs.writeFile(filePath, JSON.stringify(results), () => {})
}
console.log("Scraping 'comuni' completato (disponibile qui: '"+filePath+"')")