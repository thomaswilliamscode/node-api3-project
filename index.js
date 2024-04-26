// require your server and launch it
const server = require('./api/server.js')

const port = 8000

server.listen( port, () => {
	console.log(`server Listening on port ${port}`)
})
