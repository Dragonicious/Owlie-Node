const { DiscordAPIError } = require("discord.js");

/*TIP
If you need to access your client instance from inside one of your command files, 
you can access it via message.client. 
If you need to access things such as external files or modules, you should re-require them at the top of the file.*/
function kick (message, args) {
	let member_id, reason;

	/*remove mention brackers <@!001>*/
	member_id = args[0].replace(/<|!|@|>/gi, '');
	
	/* get reason for kick (if provided) */
	if (typeof args[1] == 'undefined' || args[1].length == 0) {
		reason = '[No reason provided]'
	} else {
		reason = args[1];
	}

	/* limit reason to discord's reason input limit */
	const max_length = 512
	if (reason.length > max_length) {
		reason = reason.slice(0, max_length-6) + ' [...]';
	}


	/* check if command issuer has permission to kick */
	if (!message.member.hasPermission('KICK_MEMBERS')) {
		message.react('⛔').catch(console.error);;
		return;
	}
	/* get the member that will be kicked */
	message.guild.members.fetch({user:member_id, cache:false})
		.then((member_to_kick)=> {
			/* check if bot can kick the member */
			if (member_to_kick.kickable) {
				member_to_kick.kick(reason)
					.then((return_member) => {
						message.react('✅');
					})
					.catch((error) => {
						message.react('❗');
						console.error('Error kicking member: ', args)
						console.error(error);
					});
			} else {
				message.react('⛔').catch(console.error);
			}
		})
		.catch((error) => {
			/* ignore if requested to kick a inexisting member */
			if (
				error instanceof DiscordAPIError 
				&& (
					error.message.includes('Invalid Form Body')
					|| error.message.includes('Unknown Member')
				)
			 ) {
				message.react('❔').catch(console.error);

			} else {
				message.react('❗').catch(console.error);;
				console.error('Error fetching member: ', args)
				console.error(error);
			}
		})
}


module.exports = {
	name: 'kick',
	description: 'Kick a member of server',
	arg_no: 2,
	execute(message, args) {
		kick(message, args)
	}
}