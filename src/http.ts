import meta from 'xuehai/meta'
import { LoginConfig } from 'xuehai/app'
import { UserMeta } from 'xuehai/interface'
import { merge } from 'lodash'
import superagent, { SuperAgentRequest, SuperAgentStatic } from 'superagent'

export interface HttpConfig {
	sign?: string
	headers?: {
		Tenant?: string
		AppCode?: string
		'XHCore-Version'?: string
	}
	appCode?: string
	apiRoot?: string
	userAgent?: string
}

export type HttpOptions = HttpConfig & {
	login: LoginConfig
}

export class Http {
	agent: SuperAgentStatic
	accessToken: string
	refreshToken: string

	handleRequest(req: SuperAgentRequest): SuperAgentRequest {
		req = req.set({
			'User-Agent': this.options.userAgent,
			'Tenant': this.options.headers.Tenant,
			'TenantCode': this.options.headers.Tenant,
			'AppCode': this.options.headers.AppCode,
			UserId: this.user.userId,
			SchoolId: this.user.schoolId,
		})
		if (this.refreshToken) { req = req.set('Authorization', `Bearer ${this.refreshToken}`) }
		return req
	}
	
	get(uri: string): SuperAgentRequest {
		return this.handleRequest(this.agent.get(this.options.apiRoot + uri))
	}
	post(uri: string): SuperAgentRequest {
		return this.handleRequest(this.agent.post(this.options.apiRoot + uri))
	}

	async login() {
		const res = await this.post('/api/v2/platform/login')
			.query({
				sign: this.options.sign,
				t: Date.now(),
			})
			.send({
				...this.options.login,
				password: this.options.login.passwordMd5,
			})

		this.user.userId = res.body.userId
		this.user.userName = res.body.userName
		this.user.schoolId = res.body.schoolId
		this.user.schoolName = res.body.schoolName
		this.user.avatar = res.body.avatar

		this.accessToken = res.body.accessToken
		this.refreshToken = res.body.refreshToken

		return res
	}

	constructor(public options: HttpOptions, public user: UserMeta) {
		this.options.login = merge({
			loginType: meta.loginType,
			mdmVersionCode: meta.mdmVersionCode,
			mdmVersionName: meta.mdmVersionName,
			osDisplay: 'SM-P335C',
		}, this.options.login)

		this.options = merge({
			headers: {
				AppCode: meta.appCode,
				'XHCore-Version': meta.coreVersion,
			},
			apiRoot: meta.apiRoot,
			userAgent: meta.userAgent
				.replace('{os}', options.login.osDisplay)
				.replace('{device}', options.login.deviceId),
		}, this.options)

		this.accessToken = ''
		this.refreshToken = ''

		this.agent = superagent.agent()
	}
}