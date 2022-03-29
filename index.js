require("dotenv").config(); //initialize dotenv

const { Client, Intents } = require("discord.js");
const axios = require("axios");
const MEMBERS = require("./members.json");

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS],
});

// EVENT HANDLERS
client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.CLIENT_TOKEN); //login bot using token

/**
 * Message sent
 */
client.on("messageCreate", async (message) => {
	const prefix = "!";
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	if (command === "ping") {
		message.reply("Pong!");
	}

	if (command === "getList") {
		// message.reply(MEMBERS.emails);
		console.log(MEMBERS.emails);
	}

	/**
	 *	Command: !member add/remove "username#1234"
	 *  Description: Adds or removes the Membership+ role to the user with the
	 *  given Discord user tag.
	 */
	if (command === "member") {
		// Check format of user tag format
		const userName = message.content.match(/"([a-zA-Z]+\s?[a-zA-Z]*#\d{4})"/);

		if (userName && userName[1]) {
			// Look up username
			const queryOptions = {
				cache: false,
			};

			const memberList = await message.channel.guild.members.fetch(queryOptions);
			const member = memberList.find(
				(member) => member.user.tag.toLowerCase() === userName[1].toLocaleLowerCase()
			);

			// Valid user
			if (member) {
				const membershipPlus = message.guild.roles.cache.find(
					(role) => role.name === "Membership+"
				);

				// Adds Membership+ role to specified user
				if (args[0] === "add") {
					member.roles.add(membershipPlus);
					message.channel.send(`User added to Membership+: ${userName[1]}`);
				}

				// Removes Membership+ role from specified user
				if (args[0] === "remove") {
					member.roles.remove(membershipPlus);
					message.channel.send(`User removed from Membership+: ${userName[1]}`);
				}
			} else {
				message.channel.send(`${userName[1]}: User not found`);
			}
		} else {
			message.channel.send(`User tag format is invalid`);
		}
	}
});
