'use strict';

let Lime = require('lime-js');
let WebSocketTransport = require('lime-transport-websocket');
let MessagingHub = require('messaginghub-client');
let request = require('request-promise');

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
        case 1:
          msg = level1Message(response, message);
          break;
        case 2:
          msg = level2Message(response, message);
          break;
        case 3:
          msg = level3Message(response, message);
          break;
        case 4:
          msg = level4Question1(response, message);
          break;
        case 5:
          msg = level5Question2(response, message);
          break; 
        case 6:
          msg = level6Message(response, message);
          break;
        case 7:
          msg = level7Message(response, message);
          break;
        case 8:
          msg = level8Message(response, message);
          break;
        case 9:
          msg = byeMessage(message);
        default :
          msg = notUnderstandMessage(response, message);
      };
      console.log("\nMANDOU")
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

function level1Message(response, message){
  var msg = notUnderstandMessage(response, message);
  switch (message.content){
    case "1":
      userState = 2;
      var msgContent = "Ok "+ response.resource.fullName +"! Mas antes de tudo eu preciso saber o seu CPF, para que eu possa te encontrar no meu banco de dados";
      msg = buildTextMessage(msgContent, message.from);
      break;
    case 2:
      userState = 99;
      break;
    case 3:
      userState = 98;
      break;
  };

  return msg;
}

function level2Message(response, message) {
  var msg = buildTextMessage("Só um minuto", message.from);
  client.sendMessage(msg);

  userState = 3;
  var msgContent = "Ok, te achei! Então, pelo o que eu vi esses são os seus dados: \n\nNome: Lucas Bhering\nIdade: 26 anos\nVeículo: Fusca Azul\nPagamentos atrasados: 6/20";
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

function level3Message(response, message) {
  userState = 4;
  var msgContent = "Então " + response.resource.fullName + " eu posso te ajudar com uma das opções abaixo:";
  var options = [
    {
      "order": 1,
      "text": "Renegociar dívida"
    },
    {
      "order": 2,
      "text": "Pagar parcial dívida"
    },
    {
      "order": 3,
      "text": "Quitar dívida"
    },
  ];
  return buildMenuMessage(message.from, msgContent, options);
}

function level4Question1(response, message) {
  userState = 5;
  var msgContent = "Ok! Infelizmente eu não posso fazer a renegociação toda por aqui (desvantagens de ser um rob :/) \nmas posso ajudar a adiantar o processo. Só que para isso eu preciso que você me responda 2 perguntas, tudo bem? \n\nA primeira é: quanto você poderia pagar por mês?";
  var options = [
    {
      "order": 1,
      "text": "R$ 250"
    },
    {
      "order": 2,
      "text": "De R$ 260 a R$ 350"
    },
    {
      "order": 3,
      "text": "De R$ 360 a R$ 450"
    },
    {
      "order": 4,
      "text": "De R$ 450 a R$ 560"
    },
    {
      "order": 5,
      "text": "R$ 560 em diante"
    }
  ];
  return buildMenuMessage(message.from, msgContent, options);
}

function level5Question2(response, message) {
  userState = 6;
  var msgContent = "De R$ 360 a R$ 450. E você pode começar a pagar imediatamente?";
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

function level6Message(response, message){
  userState = 7;
  var msgContent = "Maravilha! :)\nMas antes de falar sobre você com o pessoal do financeiro, uma dica: Se você pagar entre R$ 460 e R$ 550, não só poderemos te dar um desconto de 5% no valor da dívida e diminuir os juros em 5% como você entra no nosso programa de pontuação já com 300 pontos!\nE então, deseja rever o quanto você pode pagar?"
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

function level7Message(response, message) {
  userState = 8;
  var msgContent = "Entendo. Passei seus dados para o pessoal do financeiro e em breve eles vão te ligar para que juntos vocês possam resolver isso, tudo bem?"
  var options = [
    {
      "order": 1,
      "text": "Claro!"
    },
    {
      "order": 2,
      "text": "Pode ser email?"
    }
  ];
  return buildMenuMessage(message.from, msgContent, options);
}

function level8Message(response, message) {
  var msg = buildTextMessage("Ah, você prefere por email? Sem problemas!\nEm breve você receberá um email nosso então :)", message.from);
  client.sendMessage(msg);

  userState = 9;
  return canIHelpMessage(message);
}