'use strict';

let Lime = require('lime-js');
let WebSocketTransport = require('lime-transport-websocket');
let MessagingHub = require('messaginghub-client');
let request = require('request-promise');

let FlowOne = require('./MessagingHubHttpClient');

var userState = 0;
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

// Conecta com o servidor de forma assíncrona.
// A conexão ocorre via websocket, na porta 8081.
client.connect()
    .then(() => console.log('Listening...'))
    .catch((err) => console.error(err));

// Registra um receiver para mensagens do tipo 'text/plain'
client.addMessageReceiver('text/plain', function(message) {
  console.log("\nMessage Received: " + message.content);
  var uri = "lime://messenger.gw.msging.net/accounts/" + message.from.split("@")[0]
  console.log("\nLime Uri: " + uri);

  var command = {
    id: 1,
    uri: uri,
    method: Lime.CommandMethod.GET,
    to: "postmaster@messenger.gw.msging.net"
  };

  client.sendCommand(command)
    .then(function(response) {
      var msg = "Olá";
      console.log("\nUser State: " + userState);
      switch (userState) {
        case 0:
          msg = helloMessage(response, message);
          break;
        default :
          msg = notUnderstandMessage(response, message);
      };
      console.log("\nSent Message" + msg);
      client.sendMessage(msg);
    }).catch((err) => console.error(err));

      // send a message to some user

});

// Registra um receiver para qualquer notificação
client.addNotificationReceiver(true, function(notification) {
  // TODO: Processe a notificação recebida
});

function buildTextMessage(content, to) {
  return {
    id: Lime.Guid(),
    type: "text/plain",
    content: content,
    to: to
  };
}

function buildMenuMessage(to, contentText, contentOptions){
  return {
    id: Lime.Guid(),
    to: to,
    type: "application/vnd.lime.select+json",
    content: {
      text: contentText,
      options: contentOptions
    }
  };
}

function helloMessage(response, message){
  userState = 1;
  var text = "Olá "+ response.resource.fullName +", em que posso ajudar?";
  var options = [
    {
      "order": 1,
      "text": "Estou inadimplente"
    },
    {
      "order": 2,
      "text": "Esqueci de pagar"
    },
    {
      "order": 3,
      "text": "Não lembro de pagar"
    }
  ];
  return buildMenuMessage(message.from, text, options);
}

function byeMessage(message){
  var msgContent = "Ok então! Precisando é só me chamar ;)";
  return buildTextMessage(msgContent, message.from);
}

function notUnderstandMessage(response, message){
  var msgContent = "Desculpe "+ response.resource.fullName +", não consegui te entender. Vamos tentar de novo?";
  return buildTextMessage(msgContent, message.from);
}

function canIHelpMessage(message){
  var msgContent = "\nPosso te ajudar com algo mais?"
  var options = [
    {
      "order": 1,
      "text": "Sim"
    },
    {
      "order": 2,
      "text": "Não"
    }
  ];
  return buildMenuMessage(message.from, msgContent, options);
}