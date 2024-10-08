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
    const userID = body?.message?.from?.id;

    if (!userID) {
        console.error('Invalid request body:', body);
        return new Response('Invalid request body', { status: 400 });
    }

    if (userID !== Number(process.env.TELEGRAM_USER_ID)) {
        console.error('Unauthorized request:', userID);
        return new Response('Unauthorized', { status: 401 });
    }

    bot.handleUpdate(body);

    return new Response('OK', { status: 200 });
}