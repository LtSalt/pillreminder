import 'dotenv/config';
import { Telegraf } from 'telegraf';
import keyboards from './keyboards';

const bot = new Telegraf(process.env.TELEGRAM_PILLBOT_TOKEN);

const tg = {
    notifyStandby: async () => {
        const message = bot.telegram.sendMessage(process.env.TELEGRAM_USER_ID, 'Heute ist der erste Tag der Pillenpause. In 7 Tagen erinnere ich dich wieder.');
        return message;
    },
    sendReminder: async () => {
        const message = await bot.telegram.sendMessage(process.env.TELEGRAM_USER_ID, 'Hast du die Pille genommen?', {
            reply_markup: {
                inline_keyboard: keyboards.get('?')
            }
        });

        return message;
    }


}

export default tg;