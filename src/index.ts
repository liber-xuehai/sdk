import { UserMeta } from 'xuehai/interface'
import { LifeCycle } from 'xuehai/lifecycle'
import { Http, HttpConfig } from 'xuehai/http'
import md5 from 'md5'
import assert from 'assert'
import { assign } from 'lodash'

export interface LoginConfig {
	userName: string
	deviceId: string
	password?: string
	passwordMd5?: string
	loginType?: number
	osDisplay?: string
	mdmVersionCode?: number
	mdmVersionName?: string
}

export interface AppConfig {
	login: LoginConfig
	http: HttpConfig
	user?: UserMeta
}

const maintainArguments = [
	'http.status',
	'user',
]

export class App {
	user: UserMeta

	http: Http
	login: Http['login']

	lifecycle: LifeCycle
	on: LifeCycle['on']
	emit: LifeCycle['emit']

	dumps(): string {
		const data = {} as any
		for (const args of maintainArguments) {
			let pointer = this as any
			for (const key of args.split('.')) {
				pointer = pointer[key]
			}
			data[args] = pointer
		}
		return JSON.stringify(data)
	}
	loads(plain: string) {
		const data = JSON.parse(plain)
		for (const args of maintainArguments) {
			let pointer = this as any
			for (const key of args.split('.')) {
				pointer = pointer[key]
			}
			assign(pointer, data[args])
			delete data[args]
		}
		assert(Object.keys(data).length === 0)
	}

	constructor(public options: AppConfig) {
		assert(options.login.userName && options.login.deviceId && (options.login.password || options.login.passwordMd5))
		if (options.login.password && !options.login.passwordMd5) {
			options.login.passwordMd5 = md5(options.login.password)
		}
		options.login.passwordMd5 = options.login.passwordMd5.toUpperCase()

		this.user = {
			schoolId: -1,
			userId: -1,
			...(options.user || {}),
		}

		this.lifecycle = new LifeCycle()
		this.on = this.lifecycle.on.bind(this.lifecycle)
		this.emit = this.lifecycle.emit.bind(this.lifecycle)

		this.http = new Http({ ...options.http, login: options.login }, this.user, this.lifecycle)
		this.login = this.http.login.bind(this.http)
	}
}