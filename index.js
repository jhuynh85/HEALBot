require('dotenv').config(); //initialize dotenv

const { Client, Intents } = require('discord.js');
const axios = require('axios');
const MEMBERS = require("./members.json");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }

	if (msg.content.startsWith("!getList")) {
		// msg.reply(MEMBERS.emails);
		console.log(MEMBERS.emails);
	}
});

client.on('guildMemberAdd', async member => {	
	const res = await axios.get(`https://discord.com/api/v9/users/${member.id}`, {
		headers: {
			"Authorization": `Bot ${process.env.CLIENT_TOKEN}`
		}
	});

  console.log("res: ", res);

})
