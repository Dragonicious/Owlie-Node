const config	= require('./../config.json');

function clear(message, args) {
	if (message.channel == config.WELCOME_CHANNEL && message.member.hasPermission('BAN_MEMBERS')) {
		message.channel.messages.fetch({limit:99})
			.then(messages => {
				let to_delete = messages.filter(msg => msg.pinned == false);
				message.channel.bulkDelete(to_delete)
					.then(deleted => {
						//pass
						// message.client.Owlie.mod_report(message.guild, `<@!${message.author.id}> cleared the welcome channel.`);
					})
					.catch(error => {
						message.react('❗').catch(console.error);
						console.error(error);
					})

			})
			.catch(error => {
				message.react('❗').catch(console.error);
				console.error(error);
			})
	} else {
		console.debug('!clear called in non-welcome channel');
	}
}

module.exports = {
	name: 'clear',
	description: 'Clear the welcome channel',
	arg_no: 0,
	execute(message, args) {
		clear(message, args)
	}
}