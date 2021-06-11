const Discord	= require('discord.js');

function test (message, args) {
	if (!args.length /*|| args.length > 1*/) {
		message.react('❗')
	}
	let arg1 = args[0]
	let arg2 = args[1]
	let arg3 = args[2]
	message.reply(`${arg1}, ${arg2}, ${arg3}`)
}


module.exports = {
	name: 'test',
	description: 'test',
	arg_no: 3,
	execute(message, args) {
		test(message, args)
	}
}