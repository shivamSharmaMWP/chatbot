
This socket.io module running on port 7000 receives requests from Rasa WebChat UI running on browser.
WebChat ui code has been referenced from official repo
    https://github.com/botfront/rasa-webchat

colors have been changed and its built javascript file has been prepared and placed here in static folder.

## so this node socket.io does 3 tasks.
    serving Rasa WebChat UI files
    receives requests from Rasa WebChat socket.io client
    sends the request to Rasa Engine
    receives the callback response from Rasa Engine and respond it back to WebChat 
