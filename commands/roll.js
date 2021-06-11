const Discord	= require('discord.js');

function roll (message, args) {
	if (!args.length /*|| args.length > 1*/) {
		message.react('❗').catch(console.error);
	}

	const d = args[0]
	const number = Math.floor(Math.random() * parseInt(d)) + 1;

	var comment = '';
	if (d == 0) {
		comment = '(why?)';
	} else if (d < 0) {
		comment = '(..how?)';
	} else if (d > 150) {
		comment = '(..ok)';
	} else if (number == 69 || d == 69) {
		comment = '(Nice!)'
	} else if (d == number) {
		comment = '(wow!)'
	}

	const reply = new Discord.MessageEmbed()
		.setTitle(`${message.author.username} rolled ${number} ${comment}`)
		.setDescription(` `)
		.setColor('#0D1418')
	;
	message.channel.send(reply);
}


module.exports = {
	name: 'roll',
	description: 'Roll a digital dice',
	arg_no: 1,
	execute(message, args) {
		roll(message, args)
	}
}