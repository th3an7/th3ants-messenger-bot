'use strict'

const token = process.env.FB_ACCESS_TOKEN
const vtoken = process.env.FB_VERIFY_TOKEN

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === vtoken) {
        res.send(req.query['hub.challenge'])
    }
    res.send('No sir')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
      let event = req.body.entry[0].messaging[i]
      let sender = event.sender.id
      if (event.message && event.message.text) {
        let text = event.message.text
	if (text === 'Witaj' || text === 'witaj') {
		sendTextMessage(sender, "Witaj człowieku :)")
		continue
	}
	if (text === 'Hello' || text === 'hello') {
		sendTextMessage(sender, "Hello human :)")
		continue
	}
	if (text === 'help' || text === 'pomoc') {
		sendTextMessage(sender, "Witaj, jestem botem stworzonym przez Łukasza Ordona. Na chwilę obecną nie potrafię wiele ale szybko się uczę :)")
		sendTextMessage(sender, "Dostępne komendy: pomoc, twórca")
		continue
	}
	if (text === 'twórca' || text === 'tworca') {
		sendGenericMessage(sender)
		continue
	}
	if (text === 'szukaj') {
		SentSearchMessage(sender)
		continue
	}
        sendTextMessage(sender, "Niestety, ale nie rozumiem jeszcze tego polecenia - Dostępne komendy: pomoc, tworca")
      }
      if (event.postback) {
        let text = JSON.stringify(event.postback)
        sendTextMessage(sender, "Postback: " + text.substring(0, 200), token)
        continue
      }
    }
    res.sendStatus(200)
  })


function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function sendGenericMessage(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Łukasz Ordon",
                    "subtitle": "Twórca",
                    "image_url": "https://scontent.fwaw3-1.fna.fbcdn.net/v/t1.0-1/p160x160/12122500_916521868432464_2023659483745529837_n.jpg?oh=ad233366d70bb152d5aa74ffa8824df6&oe=590F3210",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.facebook.com/Th3Ant",
                        "title": "Profil"
                    }],
                }, {
                    "title": "Zapraszam na streamy ;)",
                    "subtitle": "twitch.tv/th3an7",
                    "image_url": "https://www-cdn.jtvnw.net/images/twitch_logo3.jpg",
                    "buttons": [{
                        "type": "web_url",
                        "title": "Link",
                        "url": "https://www.twitch.tv/th3an7",
                    }],
                }]
            }
        }
    }
    
    function sendSearchMessage(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Google",
                    "subtitle": "Szukaj",
                    "image_url": "http://www.underconsideration.com/brandnew/archives/google_2015_logo_detail.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.google.com",
                        "title": "Wyszukaj"
                }]
        }
    
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}
