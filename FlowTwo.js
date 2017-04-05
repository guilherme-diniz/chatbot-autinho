'use strict';
let Lime = require('lime-js');

class FlowTwo {
	constructor(client) {
		this._userState = 2;
		this._client = client;
	}

	do (response, message) {
		console.log("Fluxo 2." + this._userState);
		var msg = this._notUnderstandMessage(response, message);
		switch (this._userState){
			case 2:
				return this._level2Message(response, message);
			case 3:
				return this._level3Message(response, message);
			case 4:
				return this._level4Message(response, message);
			case 5:
				return this._level5Message(response, message);
			case 6:
				return this._level6Message(response, message);
			case 7:
				return this._byeMessage(message);
			default:
				return this._notUnderstandMessage(response, message);
		}
	}

	_level2Message(response, message) {
		this._userState = 3;
		var msgContent = "Ok, te achei! Então, pelo o que eu vi esses são os seus dados: \n\nNome: " + response.resource.fullName + "\nIdade: 26 anos\nVeículo: Fusca Azul\nPagamentos atrasados: 6/20";
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
		var msgContent = "Então " + response.resource.fullName + ", eu posso emitir a 2ª via do boleto para você sem problemas!\nVocê deseja receber por email ou pegar o código do boleto por aqui?";
		var options = [
		  {
		    "order": 1,
		    "text": "Receber por email"
		  },
		  {
		    "order": 2,
		    "text": "Pegar código aqui"
		  }
		];
		return this._buildMenuMessage(message.from, msgContent, options);
	}

	_level4Message(response, message) {
		var resp = parseInt(message.content);
		var msgContent;
		var msg;

		if(resp == 1) {
			this._userState = 5;
			msgContent = "Ok! Então só me confirma isso: o seu email é persona.persona@gmail.com?";
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
			msg = this._buildMenuMessage(message.from, msgContent, options);
		} else if (resp == 2) {
			this._userState = 7;
			msgContent = "Aqui está o número do seu boleto : 1234567890 12345678901 23456789012 3 45678901234567\nPosso ajudar em algo mais?";
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
			msg = this._buildMenuMessage(message.from, msgContent, options);
		}		
		return msg;
	}

	_level5Message(response, message) {
		this._userState = 6;
		var msgContent = "Ok! Em instantes você receberá meu email. Ah, e aproveitando a deixa, uma dica: Se você quiser, posso te lembrar quando o próximo boleto estiver vencendo, por aqui ou por email.\nDeseja que eu faça isso?"
		var options = [
		  {
		    "order": 1,
		    "text": "Sim, por email"
		  },
		  {
		    "order": 2,
		    "text": "Sim, por aqui"
		  },
		  {
		    "order": 3,
		    "text": "Não, obrigada"
		  }
		];
		return this._buildMenuMessage(message.from, msgContent, options);
	}

	_level6Message(response, message){
		this._userState = 7;
		var resp = parseInt(message.content);
		var msgContent;
		
		if (resp == 1) {
			msgContent = "Entendido! Quando faltar 5 dias para o próximo boleto vencer, vou enviar uma mensagem por aqui. Posso te ajudar com algo mais?"
		} else if(resp == 2) {
			msgContent = "Entendido! Quando faltar 5 dias para o próximo boleto vencer, vou enviar um email. Posso te ajudar com algo mais?"
		} else {
			msgContent = "Entendido! Posso ajudar em algo mais?";
		}
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

	 _byeMessage(message){
	 	this._userState = 0;
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

module.exports = FlowTwo;