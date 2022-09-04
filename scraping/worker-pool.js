import { AsyncResource } from 'async_hooks'
import { EventEmitter } from 'events'
import { Worker } from 'worker_threads'
import os from 'os'

const kTaskInfo = Symbol('kTaskInfo')
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent')

class WorkerPoolTaskInfo extends AsyncResource {
	constructor(callback) {
		super('WorkerPoolTaskInfo')
		this.callback = callback
	}
	
	done(err, res) {
		this.runInAsyncScope(this.callback, null, err, res)
		this.emitDestroy()
	}
}

class WorkerPool extends EventEmitter {
	constructor(workerFile) {
		super()
		this.maxThreads = os.cpus().length
		this.workerFile = workerFile
		this.workers = []
		this.freeWorkers = []
		this.tasks = []
		
		for(let i=0; i < this.maxThreads; i++)
			this.newWorker()
		
		this.on(kWorkerFreedEvent, () => {
			if(this.tasks.length > 0) {
				const { task, callback } = this.tasks.shift()
				this.runTask(task, callback)
			}
		})
	}
	
	newWorker() {
		const worker = new Worker(this.workerFile)
		worker.on('message', (res) => {
			worker[kTaskInfo].done(null, res)
			worker[kTaskInfo] = null
			this.freeWorkers.push(worker)
			this.emit(kWorkerFreedEvent)
			if(this.freeWorkers.length === this.maxThreads)
				this.close()
		})
		worker.on('error', (err) => {
			if(worker[kTaskInfo])
				worker[kTaskInfo].done(err, null)
			else
				this.emit('error', err)
			this.workers.splice(this.workers.indexOf(worker), 1)
			this.newWorker()
		})
		this.workers.push(worker)
		this.freeWorkers.push(worker)
		this.emit(kWorkerFreedEvent)
	}
	
	runTask(task, callback) {
		if(this.freeWorkers.length === 0) {
			this.tasks.push({ task, callback })
			return
		}
		const worker = this.freeWorkers.pop()
		worker[kTaskInfo] = new WorkerPoolTaskInfo(callback)
		worker.postMessage(task)
	}
	
	close() {
		for(const worker of this.workers)
			worker.terminate()
	}
}

export default WorkerPool
