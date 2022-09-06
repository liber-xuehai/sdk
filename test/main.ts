import { App } from 'xuehai'
import config from './config'

async function main() {
	const app = new App(config.app)

	app.on('login', ({ user }) => { console.log('登陆成功，你好', user.userName) })
	await app.login()
	
	console.log('user', app.user)
	console.log('quotation', await app.http.quotation())
}

main()