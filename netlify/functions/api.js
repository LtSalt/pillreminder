import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters'

const bot = new Telegraf(process.env.TELEGRAM_PILLBOT_TOKEN);
bot.on(message('text'), ctx => {
    console.log('Received text message:', ctx.message.text);
})

export default async function handler(request, context) {
    console.log('Request received');

    const body = await request.json();
    bot.handleUpdate(body);

    return new Response('OK', { status: 200 });
}