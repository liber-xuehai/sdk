import { App } from 'xuehai'
import config from './config'

async function main() {
	const app = new App(config.app)

	const loginInfo = await app.login()
	console.log(loginInfo)
}

main()