
class Memory {
	constructor() {
		this.store = {
			commands : []
		}
	}


	command_call(message, command) {
		this.store.commands.push({
			command	: command,
			time	: message.createdAt.getTime() ,
			user	: message.author.id
		});

		this.prune_log();
	}

	prune_log() {
		let now = Date.now();
		let limit = (60*60);

		[
			'commands'
		].forEach(type => {
			let tmp = [];
			this.store[type].forEach(record => {
				if (record.time+limit < now) {
					tmp.push(record);
				}
			});
			this.store[type] = tmp;
		});
	}
}

module.exports = Memory;