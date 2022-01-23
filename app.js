import { Markup, Telegraf } from 'telegraf';
import CloudConvert from 'cloudconvert';
import fs from 'fs'
import https from 'https'
import { telegram_token, cloudconvert_token } from './token'

const bot = new Telegraf(telegram_token)
const cloudConvert = new CloudConvert(cloudconvert_token)

const data = {
	file_id: "",
	file_name: "",
	file_size: "",
	file_link: "",
	format: {
		before: "",
		after: ""
	}
}

bot.command("start", (ctx) => {
	console.log(ctx.from);
	bot.telegram.sendMessage(
		ctx.chat.id,
		"hello there! Welcome to my new telegram bot.",
		{}
	);
});

// Test Only
bot.command("test", ctx => {
	ctx.reply("Hey", Markup.forceReply())
})

bot.on("message", (ctx, next) => {
	if (ctx.message.document) {
		ctx.reply("target format is?", Markup.forceReply())

		data.file_id = ctx.message.document.file_id
		data.file_name = ctx.message.document.file_name
		data.file_size = ctx.message.document.file_size

		let l = bot.telegram.getFileLink(data.file_id)
		l.then(link => {
			data.file_link = link.href
			console.log(link.href)
			console.log(data.file_link, data.file_name, data.format.after)
			// CC(data.file_url, data.file_name, data.format.after)
		})
	}

	if (ctx.message.reply_to_message) {
		data.format.after = ctx.message.text
	}
})

bot.launch()

// CC
async function CC(url, name, format) {
	let job = await cloudConvert.jobs.create({
		"tasks": {
			"import-my-file": {
				"operation": "import/url",
				"url": url
			},
			"convert-my-file": {
				"operation": "convert",
				"input": "import-my-file",
				"output_format": data.format.after
			},
			"export-my-file": {
				"operation": "export/url",
				"input": "convert-my-file"
			}
		}
	});


	// const uploadTask = job.tasks.filter(task => task.name === 'import-my-file')[0];
	// const inputFile = fs.createReadStream("./2.epub");
	// await cloudConvert.tasks.upload(uploadTask, inputFile, '2.epub');


	job = await cloudConvert.jobs.wait(job.id);

	const exportTask = job.tasks.filter(task => task.operation === 'export/url' && task.status === 'finished')[0];
	const file = exportTask.result.files[0];

	const writeStream = fs.createWriteStream('./out/' + `${name}.${format}`);

	// TODO: Send to telegram
	https.get(file.url, function (response) {
		response.pipe(writeStream);
	});

	await new Promise((resolve, reject) => {
		writeStream.on('finish', resolve);
		writeStream.on('error', reject);
	});
}
