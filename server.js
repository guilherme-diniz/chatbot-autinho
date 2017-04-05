'use strict';

let Lime = require('lime-js');
let WebSocketTransport = require('lime-transport-websocket');
let MessagingHub = require('messaginghub-client');
let request = require('request-promise');

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

// Registra um receiver para mensagens do tipo 'text/plain'
client.addMessageReceiver('text/plain', function(message) {
  console.log("OLA");
  console.log(message);
  var uri = "lime://messenger.gw.msging.net/accounts/" + message.from.split("@")[0]
  console.log(uri);

//OS COMANDOS TEM QUE PASSAR O ID DE ACORDO COM OS DOCS
  var command = {
    id: 1,
    uri: uri,
    method: Lime.CommandMethod.GET,
    to: "postmaster@messenger.gw.msging.net"
  };

  client.sendCommand(command)
    .then(function(response) {
      var msg = {
        id: Lime.Guid(),
        type: "text/plain",
        content: "Olá "+ response.resource.fullName +", em que posso ajudar?",
        to: message.from
      };
      client.sendMessage(msg);
    }).catch((err) => console.error(err));

      // send a message to some user

});

client.addMessageReceiver('application/json', function(message) {
  console.log("OLA2");
  console.log(message);
});

// Registra um receiver para qualquer notificação
client.addNotificationReceiver(true, function(notification) {
  // TODO: Processe a notificação recebida
});

// Conecta com o servidor de forma assíncrona.
// A conexão ocorre via websocket, na porta 8081.
client.connect()
    .then(() => console.log('Listening...'))
    .catch((err) => console.error(err));