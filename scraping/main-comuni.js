import WorkerPool from './worker-pool.js'
import Fetcher from './fetch.js'
import cheerio from 'cheerio'
import fs from 'fs'

const encoding = 'ISO-8859-1'
const filePath = 'data/comuni.json'
const url = "http://www.comuni-italiani.it/cap/"
const suffixes = []
const results = []
const tasks = []

if( ! fs.existsSync(filePath)) {
	console.log("Scraping 'comuni' avviato...")
	
	const fetch = new Fetcher(encoding)
	let $ = cheerio.load(await fetch.html(url))
	
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
	
	const pool = new WorkerPool('./scraping/worker-comuni.js', suffixes.length)
	
	for(let i=0; i<suffixes.length; i++) {
		tasks.push(new Promise((resolve, reject) => {
			const suffix = suffixes[i]
			pool.runTask({ encoding, url, suffix }, (err, res) => {
				if(err)	return reject(err)
				results[i] = res
				return resolve(res)
			})
		}))
	}

	Promise.all(tasks).then(() => {
		fs.writeFile(filePath, JSON.stringify(results.flat()), () => {})
		console.log("Scraping 'comuni' completato (disponibile qui: '"+filePath+"')")
	})
} else console.log("Scraping 'comuni' completato (disponibile qui: '"+filePath+"')")
