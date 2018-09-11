const smoochBot = require('smooch-bot');
const SmoochCore = require('smooch-core');
const MemoryLock = smoochBot.MemoryLock;
const SmoochApiStore = smoochBot.SmoochApiStore;
const SmoochApiBot = smoochBot.SmoochApiBot;
const StateMachine = smoochBot.StateMachine;
const jwt = require('./jwt');

const name = 'SmoochBot';
const avatarUrl = 'https://s.gravatar.com/avatar/f91b04087e0125153623a3778e819c0a?s=80';
const lock = new MemoryLock();
const store = new SmoochApiStore({
	jwt
});

const conv = (function() {
	const bots = {};
	const maps = {};

	function start(consumerId, partnerId) {
		maps[consumerId] = partnerId;
		maps[partnerId] = consumerId;

		bots[consumerId] = createBot(consumerId);
		bots[partnerId] = createBot(partnerId);
	}

	function userIsInConv(userId) {
		return userId in maps;
	}
	function sayToParticipant(userId, message) {
		if (!maps[userId] || !bots[maps[userId]]) return;
		bots[maps[userId]].say(message).then(() => {}).catch((err) => {
			debugger;
		});
	}
	function end(userId, message) {}
	function storeConversation(from, to) {}

	function createBot(userId) {
		return new SmoochApiBot({
			name,
			avatarUrl,
			lock,
			store,
			userId
		});
	}

	return {
		start: start,
		sayToParticipant: sayToParticipant
	};
})();

module.exports = conv;
