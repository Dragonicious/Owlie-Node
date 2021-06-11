const Discord	= require('discord.js');

class Embeds {
	constructor() {

	}

	dice_roll_card() {

	}
	
	dictionary_card(def) {
		const max_definitions_per_type = 5;

		const reply = {
			color: '#99BADD',
			title: `**${def.word}**`,
			description: `${def.phonetics}`,
			// footer: {
			// 	text: `Courtesy of ${def.provider}`,
			// 	icon_url: 'https://backlinko.com/wp-content/uploads/2018/03/google-logo-square.png',
			// },
		};

		reply.fields = [
			{ name: '\u200b', value:'\u200b'} /* spacer */
		];

		Object.keys(def.types).forEach(type => {
			let field = {};
			field.name = type;
			field.value = '';
			for (let i = 0; i < def.types[type].length; i++) {
				const definition = def.types[type][i];
				if (i != 0) field.value += '\n';
				field.value += `${(i+1).toString()}. ${definition}`;
				
				if (i+1 == max_definitions_per_type) {
					field.value += '\n[...]'
					break;
				}
			}
			reply.fields.push(field);
		});

		return reply;
	}

	welcome_card(title, message) {
		let embed = {
			color: '#BADA55',
			title: title,
			description : message
		}

		return embed;
	}
}


module.exports = Embeds;