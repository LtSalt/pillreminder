import { Telegraf } from 'telegraf';
import { callbackQuery } from 'telegraf/filters';
import nt from './nt.js';
import keyboards from './keyboards';

const bot = new Telegraf(process.env.TELEGRAM_PILLBOT_TOKEN);

bot.on(callbackQuery('data'), async (ctx) => {
    try {
        await Promise.all([nt.update(ctx), tg.update(ctx)]);
        console.log('Update handled');
    } catch (error) {
        console.error('Error handling update:', error);
    }
})

const tg = {
    notifyStandby: async () => {
        const message = bot.telegram.sendMessage(process.env.TELEGRAM_SUBSCRIBER_ID, 'Heute ist der erste Tag der Pillenpause. In 7 Tagen erinnere ich dich wieder.');
        return message;
    },

    sendReminder: async () => {
        const message = await bot.telegram.sendMessage(process.env.TELEGRAM_SUBSCRIBER_ID, 'Hast du die Pille genommen?', {
            reply_markup: {
                inline_keyboard: keyboards.get('?')
            }
        });
        return message;
    },
    
    update: async (ctx) => {
        ctx.editMessageReplyMarkup({
            inline_keyboard: keyboards.get(ctx.callbackQuery.data)
        })
    },

    handleUpdate: (body) => {
        bot.handleUpdate(body);
    },

    alertPartner: async () => {
        await bot.telegram.sendMessage(process.env.TELEGRAM_PARTNER_ID, 'Pille noch nicht genommen');
    }
}

export default tg;