export type EventCallback = (...args: any[]) => any
export class Event {
	name: string
	callback: EventCallback
}

export class LifeCycle {
	pool: { [N: string]: Array<Event> }

	async emit(eventName: string, lazyload?: Function)
	async emit(eventName: string, ...args: any[]): Promise<boolean> {
		if (!(eventName in this.pool)) { return false }
		if (args.length === 1 && (args[0] instanceof Function)) {
			args[0] = args[0]()
		}
		await Promise.all(this.pool[eventName].map(event => event.callback(...args)))
		return true
	}

	on(eventName: string, callback: EventCallback): void {
		console.log('on', eventName, callback, this.pool)
		if (!(eventName in this.pool)) { this.pool[eventName] = [] }
		this.pool[eventName].push({
			name: eventName,
			callback,
		})
	}

	constructor() {
		this.pool = {}
	}
}