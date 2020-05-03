const fetch = require('node-fetch');

async function downloadStatus() {
	const URL = process.env.STATUS_JSON_URL;
	const result = await fetch(URL);
	return await result.json();
}

function reformatStatusList(rawStatusObject) {
	const monitors = rawStatusObject.monitors;
	const hosts = [
		'ping-uberspace-wjbots',
		'ping-uberspace-alioth',
	];
	const bots = [
		'service-telegram-bot-album-creator',
		'service-telegram-bot-getids',
		'service-telegram-bot-wjclub-support',
		'service-telegram-bot-removekeyboard',
		'service-telegram-channel-webfail',
	]

	return {
		hosts: hosts.map(host => reformatStatus(monitors[host], host)),
		bots: bots.map(bot => reformatStatus(monitors[bot], bot))
	}
}

function reformatStatus(status, name) {
	if (status === undefined) {
		return {
			name: name.replace('ping-','').replace('service-',''),
			ok: false,
			emoji: '❓',
			down_since: 'unknown'
		}
	}

	const ok = status.status === 'OK';
	return {
		name: name.replace('ping-','').replace('service-',''),
		ok: ok,
		emoji: ok ? '✅' : '❌',
		down_since: ok ? '' : (status.first_failure_time + '')
	}
}


function status2TelegramHtml(reformattedStatus, generatedAt) {
	const {hosts, bots} = reformattedStatus;
	return '\nStatus of our systems:\n<u>Servers:</u>\n'
		+ hosts
			.map(({name, ok, emoji, down_since}) => emoji + ' ' + name + (ok?'':' ('+down_since+')'))
			.join('\n')
		+ '\n\n<u>Bots & Channels:</u>\n'
		+ bots
			.map(({name, ok, emoji, down_since}) => emoji + ' ' + name + (ok?'':' ('+down_since+')'))
			.join('\n')
		+ '\n\n<i>updated: '+generatedAt+'</i>'
}


exports.getStatusForTelegram = async function() {
	const freshStatus = await downloadStatus();
	return status2TelegramHtml(reformatStatusList(freshStatus), freshStatus.generated);
}
