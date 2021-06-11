#!/usr/bin/env node
/* jshint esversion: 6 */

/************ import all modules */
const fs = require('fs');
const Discord	= require('discord.js');
const client	= new Discord.Client();
const config	= require('./config.json');

const Owlie		= require('./class/Owlie.js');
const Owl = new Owlie(client);



/*********** add all listeners */
// on bot ready
client.on('ready', () => {
	console.log(`${client.user.tag} ready.`);
});


// attatch the [commands] directory
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('message', message => {
	if (message.author.bot) return;
	Owl.read(message);
});

/************** initiate bot */
console.debug('Initiating...');
client.login(config.BOT_KEY);
