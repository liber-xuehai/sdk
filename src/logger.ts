import 'colors'

export class Logger {

	log(level: number, ...args: Array<any>) {
		if (level < this.logLevel) { return }
		console.log(this.levelPrefix[level], ...args)
	}

	debug(...args: Array<any>) { return this.log(0, ...args) }
	info(...args: Array<any>) { return this.log(1, ...args) }
	warn(...args: Array<any>) { return this.log(2, ...args) }
	error(...args: Array<any>) { return this.log(3, ...args) }
	fatal(...args: Array<any>) { return this.log(4, ...args) }

	constructor(
		public logLevel: number,
		public levelPrefix = [
			'DEBUG'.gray,
			'INFO'.white,
			'WARNING'.yellow,
			'ERROR'.red,
			'FATAL'.black.bgRed,
		],
	) {
	}
}

export const logger = new Logger(process.env.NODE_ENV === 'production' ? 1 : 0)