import progressBar from './progress-bar.js'
import fetch from 'node-fetch'
import cheerio from 'cheerio'
import fs from 'fs'

const filePath = 'data/nomi.json'
 
const html = (URL) => {
	return fetch(URL)
			.then((resp) => resp.arrayBuffer())
			.then((data) => {
				return new TextDecoder('utf-8').decode(data)
			})
}

const data = (table) => {
	const data = []
	table.children[1].children[0].children
	.forEach((row) => {
		row.children.forEach((col) => {
			const tag = col.children[0]
			if(tag.name === "strong")
				data.push(tag.children[0].children[0].data)
		})
	})
	return data
}

if( ! fs.existsSync(filePath)) {
	console.log("Scraping 'nomi' avviato...")
	
	const prefix  = "https://www.nomix.it/nomi-italiani-"
	const suffix  = ".php"
	const infixes = ["maschili-e-femminili"]
	const results = { "M": [], "F": [] }
	
	let $ = cheerio.load(await html(prefix+infixes[0]+suffix))
	
	$("h2")[0].children
	.filter((el) => el.name === "a")
	.forEach((lett) => {
		infixes.push("lettera-"+lett.children[0].data.trim())
	})
	
	progressBar.init(infixes.length)
	
	for(const infix of infixes) {
		$ = cheerio.load(await html(prefix+infix+suffix))
		const tables = $(".pure-u-1.pure-u-md-1-2")
		
		results["M"] = results["M"].concat(data(tables[0]))
		results["F"] = results["F"].concat(data(tables[1]))
		
		progressBar.update()
	}
	
	fs.writeFile(filePath, JSON.stringify(results), () => {})
}
console.log("Scraping 'nomi' completato (disponibile qui: '"+filePath+"')")