import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { Client } from "@notionhq/client";
import keyboards from '../keyboards.js';

const notion = new Client({
  auth: process.env.NOTION_INTEGRATION_SECRET,
})

export default async function handler() {
    const bot = new Telegraf(process.env.TELEGRAM_PILLBOT_TOKEN);

    try {
        const message = await bot.telegram.sendMessage(process.env.TELEGRAM_USER_ID, 'Hast du die Pille genommen?', {
            reply_markup: {
                inline_keyboard: keyboards.get('?')
            }
        });
   
        await notion.pages.create({
            parent: {
                database_id: process.env.NOTION_DATABASE_ID
            },
            properties: {
                Name: {
                    title: [
                        {
                            text: {
                                content: 'Pille genommen?'
                            }
                        }
                    ]
                },
                Date: {
                    date: {
                        start: new Date().toISOString().split('T')[0]
                    }
                },
                MessageID: {
                    number: message.message_id
                },
                Status: {
                    select: {
                        name: '?'
                    }
                }
            }
        })
    } catch(err) {
        console.error('Error creating Notion entry:', err);
    }
}

export const config = {
    schedule: '0 18 * * *'
}