const request = require("request");
const Embeds	= require('./../class/Embeds.js');
const embeds = new Embeds();
const Dictionary_class = require("./../class/Dictionary");
const Dictionary = new Dictionary_class;

function define (message, args) {
	var result;
	let word = args[0].trim();
	word = encodeURI(word);

	const language = 'en';

	/* first try to get definition from google */
	var options = {
		method: 'GET',
		url: `https://api.dictionaryapi.dev/api/v2/entries/${language}/${word}`,
	};

	request(options, function (error, response, body) {
		if (error) throw new Error(error);
		result = Dictionary.parse_google_dict(body);
		if (result !== false) {
			if (typeof result.word != 'undefined') {
				result.provider = 'Google Dictionary';
				embed = embeds.dictionary_card(result);
				message.channel.send({embed: embed});
			}
		} else {
			message.react('❔').catch(console.error);
		}
	});
}





module.exports = {
	name: 'define',
	description: 'Find a definition for a word.',
	arg_no: 1,
	timeout: 15,
	execute(message, args) {
		define(message, args)
	}
}