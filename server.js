'use strict';

let Lime = require('lime-js');
let WebSocketTransport = require('lime-transport-websocket');
let MessagingHub = require('messaginghub-client');
let request = require('request-promise');

// These are the MessagingHub credentials for this bot.
// If you want to create your own bot, see http://blip.ai
const IDENTIFIER = 'sdkbreno';
const ACCESS_KEY = 'OENvWVRtWUJUN2JjYWQ3S2xUSGI=';

// Cria uma instância do cliente, informando o identifier e accessKey do seu chatbot 
var client = new MessagingHub.ClientBuilder()
    .withIdentifier(identifier)
    .withAccessKey(accessKey)
    .withTransportFactory(() => new WebSocketTransport())
    .build();

// Registra um receiver para mensagens do tipo 'text/plain'
client.addMessageReceiver('text/plain', function(message) {
  // TODO: Processe a mensagem recebida
});

client.addMessageReceiver('application/json', function(message) {
  // TODO: Processe a mensagem recebida
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