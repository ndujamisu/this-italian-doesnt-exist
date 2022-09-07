import WorkerPool from './worker-pool.js'
import fetch from './fetch.js'
import cheerio from 'cheerio'
import fs from 'fs'

const filePath = "data/cognomi.json"
const url = "https://www.cognomix.it/origine-cognomi-italiani/"
const initials = []
const results = []
const tasks = []

if( ! fs.existsSync(filePath)) {
	console.log("Scraping 'cognomi' avviato...")
	
	let $ = cheerio.load(await fetch.html(url, 'utf-8'))
	
	$("h3")[0].children
	.filter((tag) => tag.name !== undefined)
	.forEach((el) => {
		initials.push(el.children[0].data.trim())
	})
	
	const pool = new WorkerPool('./scraping/worker-cognomi.js', initials.length)
	
	for(let i=0; i<initials.length; i++) {
		tasks.push(new Promise((resolve, reject) => {
			let taskUrl = url+initials[i]
			pool.runTask({ taskUrl }, (err, res) => {
				if(err)	return reject(err)
				results[i] = res
				return resolve(res)
			})
		}))
	}
	
	Promise.all(tasks).then(() => {
		[].concat.apply([], results)
		fs.writeFile(filePath, JSON.stringify(results[0]), () => {})
		console.log("Scraping 'cognomi' completato (disponibile qui: '"+filePath+"')")
	})
} else console.log("Scraping 'cognomi' completato (disponibile qui: '"+filePath+"')")