'use strict';
let Lime = require('lime-js');

class FlowOne {
	constructor(client) {
		this._userState = 2;
		this._client = client;
	}

	do (response, message) {
		console.log("Fluxo 1" + this._userState);
		var msg = this._notUnderstandMessage(response, message);
		switch (this._userState){
			case 2:
				return this._level2Message(response, message);
			case 3:
				return this._level3Message(response, message);
			case 4:
				return this._level4Question1(response, message);
			case 5:
				return this._level5Question2(response, message);
			case 6:
				return this._level6Message(response, message);
			case 7:
				return this._level7Message(response, message);
			case 8:
				return this._level8Message(response, message);
			case 9:
				return this._byeMessage(message);
			default:
				return this._notUnderstandMessage(response, message);
		}
	}

	_level2Message(response, message) {
		this._userState = 3;
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

		return this._buildMenuMessage(message.from, msgContent, options);
	}

	_level3Message(response, message) {
		this._userState = 4;
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
		return this._buildMenuMessage(message.from, msgContent, options);
	}

	_level4Question1(response, message) {
		this._userState = 5;
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
		return this._buildMenuMessage(message.from, msgContent, options);
	}

	_level5Question2(response, message) {
		this._userState = 6;
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
		return this._buildMenuMessage(message.from, msgContent, options);
	}

	_level6Message(response, message){
		this._userState = 7;
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
		return this._buildMenuMessage(message.from, msgContent, options);
	}

	_level7Message(response, message) {
		this._userState = 8;
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
		return this._buildMenuMessage(message.from, msgContent, options);
	}

	_level8Message(response, message) {
		var msg = this._buildTextMessage("Ah, você prefere por email? Sem problemas!\nEm breve você receberá um email nosso então :)", message.from);
		this._client.sendMessage(msg);

		this._userState = 9;
		return this._canIHelpMessage(message);
	}

	 _byeMessage(message){
		var msgContent = "Ok então! Precisando é só me chamar ;)";
		return this._buildTextMessage(msgContent, message.from);
	}

	 _notUnderstandMessage(response, message){
		var msgContent = "Desculpe "+ response.resource.fullName +", não consegui te entender. Vamos tentar de novo?";
		return this._buildTextMessage(msgContent, message.from);
	}

	 _canIHelpMessage(message){
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
		return this._buildMenuMessage(message.from, msgContent, options);
	}

	_buildTextMessage(content, to) {
		return {
		  id: Lime.Guid(),
		  type: "text/plain",
		  content: content,
		  to: to
		};
	}

	_buildMenuMessage(to, contentText, contentOptions){
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
}

module.exports = FlowOne;