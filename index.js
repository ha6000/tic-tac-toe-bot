
const discord = require('discord.js');
const Game = require('./tictactoe');

const client = new discord.Client({ ws: { intents: ['GUILDS', 'GUILD_MESSAGES'] } });

client.on('message', (message) => {
	if (message.author.bot) return;
	if (message.content.startsWith('!tictactoe')) {
		if (!message.mentions.members.size) return message.reply('Please mention user')
		const players = [
			message.member,
			message.mentions.members.first()
		]
		const game = new Game((...arguments) => {
			return message.channel.send(...arguments)
		}, () => {
			return message.channel.awaitMessages((collectedMessage) => {
				return collectedMessage.author.id == players[game.currentPlayer].id;
			}, {
				max: 1
			})
				.then(collectedMessages => {
					return collectedMessages.first().content;
				});
		});
		game.mainloop();
	}
});

client.once('ready', () => {
	console.log('Bot ready');
})

client.login(process.env.TOKEN) 