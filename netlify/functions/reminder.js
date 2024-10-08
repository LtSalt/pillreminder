import 'dotenv/config';
import { Telegraf } from 'telegraf';

export default async function handler() {
    const bot = new Telegraf(process.env.TELEGRAM_PILLBOT_TOKEN);

    try {
        bot.telegram.sendMessage(process.env.TELEGRAM_USER_ID, 'Hast du die Pille genommen?', {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '✅ Ja', callback_data: 'true' },
                        { text: '❌ Nein', callback_data: 'false' }
                    ]
                ]
            }
        });
    } catch(err) {
        console.error('Error sending message:', err);
    }
}

export const config = {
    schedule: '0 18 * * *'
}