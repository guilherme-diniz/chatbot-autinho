'use strict';

let Lime = require('lime-js');
let WebSocketTransport = require('lime-transport-websocket');
let MessagingHub = require('messaginghub-client');
let request = require('request-promise');
let Globals = require('./Globals');
let Functions = require('./Functions');

let FlowOne = require('./FlowOne');
let FlowTwo = require('./FlowTwo');
let FlowThree = require('./FlowThree');

// These are the MessagingHub credentials for this bot.
// If you want to create your own bot, see http://blip.ai
const IDENTIFIER = 'autozinho';
const ACCESS_KEY = 'bml1d1FSaVVuQWRHQklFQ1J3cEw=';

// Cria uma instância do cliente, informando o identifier e accessKey do seu chatbot
var client = new MessagingHub.ClientBuilder()
    .withIdentifier(IDENTIFIER)
    .withAccessKey(ACCESS_KEY)
    .withTransportFactory(() => new WebSocketTransport())
    .build();

var flowOne = new FlowOne(client);
var flowTwo = new FlowTwo(client);
var flowThree = new FlowThree(client);
var functions = new Functions();

// Conecta com o servidor de forma assíncrona.
// A conexão ocorre via websocket, na porta 8081.
client.connect()
    .then(() => {
    	console.log('Listening...')
    })
    .catch((err) => console.error(err));

// Registra um receiver para mensagens do tipo 'text/plain'
client.addMessageReceiver('text/plain', function(message) {
  var uri = "lime://messenger.gw.msging.net/accounts/" + message.from.split("@")[0]

  var command = {
    id: 1,
    uri: uri,
    method: Lime.CommandMethod.GET,
    to: "postmaster@messenger.gw.msging.net"
  };

  client.sendCommand(command)
    .then(function(response) {
      console.log("\nUser State: " + Globals.userState);
      var msg;
    	if (Globals.userState == 0) {
          msg = functions.helloMessage(response, message);
      } else if (Globals.userState == 1) {
          msg = functions.getUserData(response, message);
      } else {
          msg = selectFlow(response, message);
      }
	client.sendMessage(msg);
    }).catch((err) => console.error(err));

      // send a message to some user

});

// Registra um receiver para qualquer notificação
client.addNotificationReceiver(true, function(notification) {
  // TODO: Processe a notificação recebida
});

function notUnderstandMessage(response, message){
  var msgContent = "Desculpe "+ response.resource.fullName +", não consegui te entender. Vamos tentar de novo?";
  return functions.buildTextMessage(msgContent, message.from);
}

function selectFlow(response, message) {
  console.log(Globals.flowSelection);
  switch (Globals.flowSelection) {
    case 1:
        return flowOne.do(response, message);
    case 2:
        return flowTwo.do(response, message);
    case 3:
        return flowThree.do(response, message);
    default:
        return notUnderstandMessage(response, message);
  }
}