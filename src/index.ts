import { UserMeta } from 'xuehai/interface'
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
	http: Http
	user: UserMeta

	async login() { return this.http.login() }

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

		this.http = new Http({ ...options.http, login: options.login }, this.user)
	}
}