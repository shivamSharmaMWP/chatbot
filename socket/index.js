var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const axios = require('axios')
var bodyParser = require('body-parser')

var jsonParser = bodyParser.json()

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/soc.html');
});

app.get('/health', (req, res) => {
    res.send("ok");
});

// serving static files
app.use(express.static('static'))

//Listen port
const PORT = 7000;

_socketIdLookUp = {
    "jovensalud_anonymous_user_id": "socket_id"
};

io.on('connect', function(socket) {
    
    socket.selfId = socket.id;

    console.log('a user connected' + socket.id);

    socket.on("session_request", function(data) {

        console.log("Connected userId " + this.selfId);
        console.log(`##### session request --> ${JSON.stringify(data)}`)

        if(!data.hasOwnProperty('session_id') || !data['session_id'])
            data["session_id"] = this.selfId;
            
        var userField = undefined;
        var customData = data['customData']
        if (customData == null)
            return;        
        if(customData.hasOwnProperty('chatbot_user_id'))
            userField = 'chatbot_user_id'
        else {
            console.error('chatbot_user_id is required')
            return;
        }
        console.log(`received session_request from UserId : ${customData['chatbot_user_id']}`)

        _socketIdLookUp[customData['chatbot_user_id']] = this.selfId;

        this.emit("session_confirm", data["session_id"])
        console.log(`User ${data.session_id} connected to socketIO endpoint!`)
    });

    socket.on('user_uttered', function(data)  {

        console.log('msg came : ' + JSON.stringify(data));

	    if (!data.hasOwnProperty('message'))
            return;
        var userField = undefined
        var customData = data['customData']

        payload = {
            'message': data['message'],
            'sender': customData[userField]
        }
        
        if(customData.hasOwnProperty('chatbot_user_id'))
            userField = 'chatbot_user_id'
        else
            console.error('chatbot_user_id is required')
        if (userField) {
            console.log(`recieved message from userId : ${customData[userField]}`);
            payload['sender'] = customData[userField];

            HEADERS = {'content-type': 'application/json'};
            RASA_URL = process.env.RASA_URL;

            console.log(`sending payload: ${JSON.stringify(payload)} to rasa : ${RASA_URL}`);
            axios.post(RASA_URL + '/webhooks/callback/webhook', payload).then(res=>{
                console.log(res.data);
            }).catch(error=>{
                console.error(error)
            });
        }      
    });

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

app.post('/api/chats', jsonParser,(req,res)=> {  
    console.log(`callback request received: ${JSON.stringify(req.body)}`)
    
    var payload = Object.assign({}, req.body);
    userId = payload.recipient_id;
    delete payload.recipient_id;
    
    io.to(_socketIdLookUp[userId]).emit('bot_uttered', payload);

    res.send("ok");
});

http.listen(PORT, () => {
   console.log('listening on *:'+PORT);
});
