import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { callbackQuery } from 'telegraf/filters';
import nt from '../nt.js';
import tg from '../tg.js';

const bot = new Telegraf(process.env.TELEGRAM_PILLBOT_TOKEN);

bot.on(callbackQuery('data'), async (ctx) => {
    await Promise.all([nt.update(ctx), tg.update(ctx)]);
    })

export default async function handler(request) {
    console.log('Request received');
    
    const body = await request.json();
    const userID = body?.callback_query?.from?.id;

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