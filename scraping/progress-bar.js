import process from 'process'
import rdl from 'readline'

class ProgressBar {
	
	constructor(partitions) {
		this.barLength = 60
		this.increment = this.barLength / partitions
		this.cursor = 0
		this.done   = 0
		
		for(let i=0; i<this.barLength; i++) {
			process.stdout.write('\u2591')
		}
		rdl.cursorTo(process.stdout, this.cursor)
	}
	
	update() {
		this.done += this.increment
		const last = this.done >= this.barLength
		const step = ! last
				? Math.ceil(this.done) - this.cursor
				: this.barLength - this.cursor
		
		for(let i=0; i<step; i++) {
			process.stdout.write('\u2588')
			this.cursor++
		}
		
		if(last) {
			console.log()
			instance = null
		}
	}
}

var instance = null
export default {
	init: function(partitions) {
		if(instance === null)
			instance = new ProgressBar(partitions)
		else throw new Error('Progress bar already initialized!')
	},
	update: function() {
		if(instance === null)
			throw new Error('Progress bar not initialized!')
		else instance.update()
	}
}