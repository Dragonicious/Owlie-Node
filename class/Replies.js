class Replies {
	welcome(user) {
		let hello 	= `${this.pick_random(this.hellos)}, <@!${user.id}>!`
		let welcome = this.pick_random(this.welcomes);
		return `> ${hello}\n> ${welcome}!`;
	}

	pick_random(from) {
		return from[Math.floor(Math.random() * from.length)];
	}



	hellos 	= [
		'Labas',
		'Hey',
		'Sveiki atvyke',
		'Eeeey',
		'**U**w**U**',

		'Hello hello'
	];
	welcomes = [
		'Gero pasibūvimo',
		'Malonaus būvimo',
		'Šutvė pagausėjo',


		'Hope you have fun',
		'Be sure to play nice'
	];
}

module.exports = Replies;
