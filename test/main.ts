import { App } from 'xuehai'
import config from './config'

async function main() {
	const app = new App(config.app)

	const loginRsp = await app.login()
	console.log(loginRsp.body)
	console.log('user', app.user)

}

main()