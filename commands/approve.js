const config	= require('./../config.json');
const Embeds	= require('./../class/Embeds.js');
const Replies	= require('./../class/Replies.js');

const { DiscordAPIError } = require("discord.js");
const { debug } = require('request');

function approve (message, args) {
	var member, adult, silent, is_adult, send_welcome;
	
	const member_id = args[0].replace(/<|!|@|>/gi, '');
	
	/* is the approved user specified as an adult? */
	if (typeof args[1] != 'undefined') {
		adult = args[1].search(/yes|true|taip|y|adult|yep|18\+/gi)
		if (adult >= 0) {
			is_adult = true;
		} else {
			is_adult = false;
		}
	} else {
		is_adult = false;
	}

	if (typeof args[2] != 'undefined') {
		silent = args[2].search(/silent|shh/gi)
		if (silent >= 0) {
			send_welcome = false;
		} else {
			send_welcome = true;
		}
	} else {
		send_welcome = true;
	}


	/* check if sent in the welcome channel */
	if (message.channel == config.WELCOME_CHANNEL) {
		/*********** check if sender has required role */
		/* couldn't figure out how to check for a specific role, so... */
		if (message.member.hasPermission('BAN_MEMBERS')) {
			/* get the member to approve */
			message.guild.members.fetch({user:member_id, cache:false})
				.then((member_to_approve)=> {
					/* refresh the lists of roles of server */
					message.guild.roles.fetch()
						.then(role_manager => {
							let approval_role = role_manager.cache.find(c_role => c_role.id == config.APPROVE_ROLE);

							/* add the 'approved' role */
							member_to_approve.roles.add(approval_role)
								.then(memb => {
									const main_channel = message.guild.channels.cache.find(c_chnl => c_chnl.id == config.MAIN_CHANNEL && c_chnl.type == 'text');
									const welcome_message = message.client.Owlie.replies.welcome(member_to_approve);
									const log_message =	`<@!${message.member.id}> approved <@!${member_to_approve.id}> (adult:${is_adult}, silent:${!send_welcome})`

									/* if was specified as an adult  - add adult role too */
									if (is_adult) {
										let adult_role = role_manager.cache.find(c_role => c_role.id == config.ADULT_ROLE);

										approved = member_to_approve.roles.add(adult_role)
											.then(memb2 => {
												console.info(log_message);
												message.client.Owlie.mod_report(message.guild, log_message)
												if (send_welcome) main_channel.send(welcome_message);
												message.react('✅').catch(console.error);
											})
											.catch(console.error);

									} else {
										console.info(log_message);
										message.client.Owlie.mod_report(message.guild, log_message)
										if (send_welcome) main_channel.send(welcome_message);
										message.react('✅').catch(console.error);
									}
								});
						})
						.catch(error => {
							console.error(error);
							message.react('❗').catch(console.error);
						});
				})
				.catch((error) => {
					/* ignore if requested to approve a inexisting member */
					if (
						error instanceof DiscordAPIError 
						&& (
							error.message.includes('Invalid Form Body')
							|| error.message.includes('Unknown Member')
						)
					) {
						message.react('❔').catch(console.error);

					} else {
						message.react('❗').catch(console.error);
						console.error('Error fetching member: ', args)
						console.error(error);
					}
			});
		} else {
			message.react('⛔').catch(console.error);;
			return;
		}
	} else {
		console.debug('Not in Welcome channel - ignoring.')
	}

	
	/*********** send welcome message to main channel */
	
	/*********** remove associated messages from #welcome */
}



module.exports = {
	name: 'approve',
	description: 'Add roles for new member',
	arg_no: 3,
	execute(message, args) {
		approve(message, args)
	}
}
