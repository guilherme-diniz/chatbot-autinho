var userState = 0;

function identifyFlowLevel(response, message, userState){
	var msg = notUnderstandMessage(response, message);
	switch (userState){
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
			break;
	}
	return msg;
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