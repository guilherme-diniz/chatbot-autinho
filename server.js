'use strict';

let Lime = require('lime-js');
let WebSocketTransport = require('lime-transport-websocket');
let MessagingHub = require('messaginghub-client');
let request = require('request-promise');
let FlowOne = require('./FlowOne');
let FlowThree = require('./FlowThree');

var userState = 0;
var flowSelection = 0;
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
var flowThree = new FlowThree(client);

// Conecta com o servidor de forma assíncrona.
// A conexão ocorre via websocket, na porta 8081.
client.connect()
    .then(() => console.log('Listening...'))
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
      console.log("\nUser State: " + userState);
      var msg;
      switch (userState) {
        case 0:
          msg = helloMessage(response, message);
          break;
        case 1:
          msg = getUserData(response, message);
          break;
        default :
          msg = selectFlow(response, message);
          // msg = notUnderstandMessage(response, message);
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

function getUserData(response, message) {
    var msgContent = "Ok "+ response.resource.fullName +"! Mas antes de tudo eu preciso saber o seu CPF, para que eu possa te encontrar no meu banco de dados";

    userState = 2;
    flowSelection = parseInt(message.content);
    return buildTextMessage(msgContent, message.from);
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

function selectFlow(response, message) {
  console.log(flowSelection);
  switch (flowSelection) {
    case 1:
        return flowOne.do(response, message);
    case 2:
        return FlowTwo.do(response, message);
    case 3:
        return flowThree.do(response, message);
    default:
        return notUnderstandMessage(response, message);
  }
}