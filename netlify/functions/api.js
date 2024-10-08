import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { callbackQuery } from 'telegraf/filters';
import { Client } from "@notionhq/client";
import keyboards from '../keyboards.js';

const notion = new Client({
  auth: process.env.NOTION_INTEGRATION_SECRET,
})

const bot = new Telegraf(process.env.TELEGRAM_PILLBOT_TOKEN);

bot.on(callbackQuery('data'), async (ctx) => {
    const messageID = ctx.callbackQuery.message.message_id;

    const query = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID,
        filter: {
            property: 'MessageID',
            number: {
                equals: messageID
            }
        }
    })

    await notion.pages.update({
        page_id: query.results[0].id,
        properties: {
            Status: {
                select: {
                    name: ctx.callbackQuery.data 
                }
            }
        }
    })
    console.log(keyboards.get(ctx.callbackQuery.data))

    ctx.editMessageReplyMarkup({
        inline_keyboard: keyboards.get(ctx.callbackQuery.data)
    })
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