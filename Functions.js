'use strict';

let Lime = require('lime-js');
let Globals = require('./Globals');

class Functions {
	constructor(){

	}

	helloMessage(response, message){
		Globals.userState = 1;
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
		return this.buildMenuMessage(message.from, text, options);
	}

	getUserData(response, message) {
	    var msgContent = "Ok "+ response.resource.fullName +"! Mas antes de tudo eu preciso saber o seu CPF, para que eu possa te encontrar no meu banco de dados";

	    Globals.userState = 2;
	    Globals.flowSelection = parseInt(message.content);
	    Globals.hasCPF = true;
	    return this.buildTextMessage(msgContent, message.from);
	}

	getUserDataAgain(response, message) {
	    var msgContent = "Ok "+ response.resource.fullName +"! Talvez você tenha digitado o CPF errado. Me informe novamente para que eu possa te procurar (Dessa vez vou te achar :) )";

	    return this.buildTextMessage(msgContent, message.from);
	}

	buildTextMessage(content, to) {
	  return {
	    id: Lime.Guid(),
	    type: "text/plain",
	    content: content,
	    to: to
	  };
	}

	buildMenuMessage(to, contentText, contentOptions){
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

module.exports = Functions;