const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

const token = process.env.FB_VERIFY_TOKEN
const access = process.env.FB_ACCESS_TOKEN

app.set('port', (process.env.PORT || 5000))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', function (req, res) {
	res.send('Finally')
})

app.get('/webhook/', function(req, res){
	if(req.query['hub.verify_token'] === token){
		res.send(req.query['hub.challenge'])
	}
	res.send('No entry')
})

app.post('/webhook/', function(req, res){
	let messaging_events = req.body.entry[0].messaging
	for (let i=0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i]
	}
})

app.listen(app.get('port'), function(){
	console.log('running on port', app.get('port'))
})