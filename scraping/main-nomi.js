import WorkerPool from './worker-pool.js'
import Fetcher from './fetch.js'
import cheerio from 'cheerio'
import fs from 'fs'

const encoding = 'utf-8'
const filePath = 'data/nomi.json'
const prefix  = "https://www.nomix.it/nomi-italiani-"
const suffix  = ".php"
const infixes = ["maschili-e-femminili"]
const results = { "M": [], "F": [] }
const tasks = []

if( ! fs.existsSync(filePath)) {
	console.log("Scraping 'nomi' avviato...")
	
	const fetch = new Fetcher(encoding)
	const $ = cheerio.load(await fetch.html(prefix+infixes[0]+suffix))
	
	$("h2")[0].children
	.filter((el) => el.name === "a")
	.forEach((lett) => {
		infixes.push("lettera-"+lett.children[0].data.trim())
	})
	
	const pool = new WorkerPool('./scraping/worker-nomi.js', infixes.length)

	for(let i=0; i<infixes.length; i++) {
		tasks.push(new Promise((resolve, reject) => {
			let taskUrl = prefix+infixes[i]+suffix
			pool.runTask({ encoding, taskUrl }, (err, res) => {
				if(err)	return reject(err)
				results[i] = res
				return resolve(res)
			})
		}))
	}
	
	Promise.all(tasks).then(() => {
		const genders = ["M", "F"]
		const keys = Object.keys(results).filter(x => ! genders.includes(x))
		for(const key of keys) {
			for(const gender of genders)
				results[gender] = results[gender].concat(results[key][gender])
			delete results[key]
		}
		fs.writeFile(filePath, JSON.stringify(results), () => {})
		console.log("Scraping 'nomi' completato (disponibile qui: '"+filePath+"')")
	})
} else console.log("Scraping 'nomi' completato (disponibile qui: '"+filePath+"')")
