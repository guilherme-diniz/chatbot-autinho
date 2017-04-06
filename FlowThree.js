'use strict';
let Lime = require('lime-js');
let Globals = require('./Globals');
let Functions = require('./Functions');
var functions = new Functions();

class FlowThree {
	constructor(client) {
		this._userState = 2;
		this._client = client;
	}

	do (response, message) {
		console.log("Fluxo 3." + this._userState);
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
				return this._byeMessage(response, message);
			default:
				return this._notUnderstandMessage(response, message);
		}
	}

	_level2Message(response, message) {
		this._userState = 3;
		var msgContent = "Ok, te achei! Então, pelo o que eu vi esses são os seus dados: \n\nNome: "+ response.resource.fullName +"\nIdade: 26 anos\nÚltimo pagamento: 10/2\nDia de vencimento: dia 5\n\n Esse é você mesmo? ";
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
        	var resp = parseInt(message.content);
    		if (resp == 1) {
			this._userState = 4;
			var msgContent = "Então " + response.resource.fullName + " eu posso te ajudar com uma das opções abaixo:";
			var options = [
			  {
			    "order": 1,
			    "text": "Mudar vencimento"
			  },
			  {
			    "order": 2,
			    "text": "Lembrar do pagamento"
			  },
			];
		} else if (resp == 2) {
	      	this._userState = 2;
	      	return functions.getUserDataAgain(response, message);
	      }
		return this._buildMenuMessage(message.from, msgContent, options);
	}

	_level4Question1(response, message) {
		var resp = parseInt(message.content);
		var msgContent;
		var options;

		if (resp == 1) {
			this._userState = 5;
			msgContent = "Ok! O seu dia atual é dia 5. Você deseja mudar para qual dia?";
			options = [
			  {
			    "order": 1,
			    "text": "Dia 10"
			  },
			  {
			    "order": 2,
			    "text": "Dia 15"
			  },
			  {
			    "order": 3,
			    "text": "Dia 20"
			  },
			];
		} else {
			this._userState = 6;
			msgContent = "Ok, posso te lembrar quando o próximo boleto estiver vencendo, por aqui ou por email. Deseja que eu faça isso por onde?";
			options = [
			  {
			    "order": 1,
			    "text": "Por aqui"
			  },
			  {
			    "order": 2,
			    "text": "Por email"
			  }
			];
		}


		return this._buildMenuMessage(message.from, msgContent, options);
	}

	_level5Question2(response, message) {
		day = parseInt(message.content) == 1 ? 10 : parseInt(message.content) == 2 ? 15 : 20;
		this._userState = 6;
		var msgContent = "Ok, a data do seu vencimento foi alterada do dia 5 para o dia " + day + ". Ah, e aproveitando a deixa, uma dica: Se você quiser, posso te lembrar quando o próximo boleto estiver vencendo, por aqui ou por email. Deseja que eu faça isso?";
		var options = [
		  {
		    "order": 1,
		    "text": "Sim, por aqui"
		  },
		  {
		    "order": 2,
		    "text": "Sim, por email"
		  },
		  {
		  	"order": 3,
		  	"text": "Não, obrigado"
		  }
		];
		return this._buildMenuMessage(message.from, msgContent, options);
	}

	_level6Message(response, message){
		var resp = parseInt(message.content);
		var msgContent;

		if (resp == 1) {
			msgContent = "Entendido! Quando faltar 5 dias para o próximo boleto vencer, vou enviar uma mensagem por aqui, tudo bem? E posso ajudar em algo mais?"
		} else if (resp == 2) {
			msgContent = "Entendido! Quando faltar 5 dias para o próximo boleto vencer, vou enviar uma mensagem por email, tudo bem? E posso ajudar em algo mais?"
		} else if (resp == 3) {
			msgContent = "Entendido! Posso ajudar em algo mais?"
		}

		this._userState = 7;
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


	_byeMessage(response, message){
	    	var resp = parseInt(message.content);
	    	var msgContent;
	 	if (resp == 1) {
	 		return functions.helloMessage(response, message);
	 	} else if (resp == 2) {
	        	var msgContent = "Ok então! Precisando é só me chamar ;)";
        	}

        	this._userState = 2;
	      Globals.userState = 0;
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

module.exports = FlowThree;