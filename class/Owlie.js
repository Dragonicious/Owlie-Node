const Discord	= require('discord.js');
const config	= require('./../config.json');
// const embeds	= require('./Embeds.js');
const Memory	= require('./Memory.js');
const Replies	= require('./Replies.js');

class Owlie {
	constructor(client) {
		this.client = client;
		this.memory = new Memory();
		this.replies = new Replies();

		this.client.Owlie = this;
	}

	read(message) {
		this.parse_commands(message);
	}

	/**
	 * check message for commands;
	 * prefix commands (!roll 20) executes the first command only;
	 * mention commands (please mister #Owlie roll 20) can execute multiple;
	 */
	parse_commands(message) {
		var args, command;

		if (message.content.startsWith(config.COMMAND_PREFIX)) {
			/**
			 * if command is called with prefix - parse it simply
			 */
			const words = message.content
				.slice(config.COMMAND_PREFIX.length)
				.trim()
				.split(/\s+/);
				
			command = words.shift().toLowerCase();

			let final_word;
			let command_obj = this.client.commands.get(command) 
			if (typeof command_obj != 'undefined') {
				/**
				 * for each neede command - take one word, 
				 * for last argument - take entire remaining text .
				 */
				const needed_args = command_obj.arg_no
				if (needed_args > 0) {
					args = words.slice(0, needed_args -1 );
	
					for (let y = needed_args -1 ; y < words.length; y++) {
						if (words[y].search(/\.|;|!|\?|(\n|\r\n|\r)/i) >= 0) {
							final_word = y;
							break;
						}
					}
	
					args.push(words.slice(needed_args -1, ).join(' '))
				}
			}
			
			this.exec_command(message, command, args);

		} else if (message.content.includes(this.client.user.id)){
			/**
			 * if command is called by mentioning Owlie - 
			 * find command keywords and take arguments from words immediately after them
			 */
			const words = message.content.split(/\s+/);
			
			let start_at = null;
			for (let i = 0; i < words.length; i++) {
				const word = words[i];
				// console.log('-- ', word, i);

				let command_obj = this.client.commands.get(word.toLowerCase());
				if (typeof command_obj != 'undefined') {
					command = word.toLowerCase();
					args = [];
					let skip_to_word;
					/**
					 * for each neede command - take one word, 
					 * for last argument - take entire remaining text .
					 */
					const needed_args = command_obj.arg_no
					for (let j = 1; j < needed_args+1; j++) {
						if (j == needed_args) {
							/* find the nearest word with a terminating symbol */
							for (let y = i+j; y < words.length; y++) {
								if (words[y].search(/\.|;|!|\?|(\n|\r\n|\r)/i) >= 0) {
									skip_to_word = y+1;
									break;
								}
							}
							args.push(words.slice(i+j, skip_to_word).join(' '));
						} else {
							args.push(words[i+j]);
						}
					}

					/* skip over the executed words */
					i = skip_to_word - 1;
					this.exec_command(message, command, args);
				}
			}
		}
	}

	/**
	 * execute a pre-defined command function from /commands/ of the same name
	 */
	exec_command(message, command, args) {
		console.debug('Executing: ', command, args);

		try {
			if (typeof this.client.commands.get(command) == 'undefined') {
				/* if command is not found - ? */
				message.react('❔').catch(console.error);
			} else {
				/* execute command */
				this.client.commands.get(command).execute(message, args);
				message.client.Owlie.memory.command_call(message, command);
			}
		} catch (error) {
			console.error('Error on command execution -', command, args, message.content);
			console.error(error);
			message.react('❗').catch(console.error);
		}
	}

	mod_report(guild, text) {
		let mod_channel = guild.channels.cache.find(c_chnl => c_chnl.id == config.MOD_CHANNEL && c_chnl.type == 'text');
		console.info(text);
		mod_channel.send({embed: {
			description: text
		}})
			.catch(console.error)
		;
	}


}

// export default Owlie;
module.exports = Owlie;