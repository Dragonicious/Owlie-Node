const request = require("request");
const config	= require('./../config.json');

class Dictionary {
	constructor() {}

	parse_google_dict(response) {
		let result = JSON.parse(response);
		if (typeof result.title == 'undefined') {
			result.provider = 'Google Dictionary'

			/* parse the definitions */
			let parsed = {};
			for (let i = 0; i < result.length; i++) {
				const def = result[i];

				/* init result for the word */
				if (i==0) {
					parsed.word 		= def.word;
					parsed.types 		= {};
					if (typeof def.phonetics[0] != 'undefined') {
						parsed.phonetics 	= def.phonetics[0].text;	
						parsed.phonetics	= parsed.phonetics.replace(/^\//,'[ ');
						parsed.phonetics	= parsed.phonetics.replace(/\/$/,' ]');
					} else {
						parsed.phonetics = ' ';
					}
				}

				def.meanings.forEach(meaning => {
					/* add new language part to results */
					if (!Object.keys(parsed.types).includes(meaning.partOfSpeech)) {
						parsed.types[meaning.partOfSpeech] = [];
					}
					/* add definitions */
					meaning.definitions.forEach(definition => {
						parsed.types[meaning.partOfSpeech].push(definition.definition);
					});
				});
			
			}
			return parsed;
		} else {
			return false;
		}
	}
}



module.exports = Dictionary;