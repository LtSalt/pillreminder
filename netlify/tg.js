import { Telegraf } from 'telegraf';
import { callbackQuery, message } from 'telegraf/filters';
import nt from './nt.js';
import keyboards from './keyboards';

const bot = new Telegraf(process.env.TELEGRAM_PILLBOT_TOKEN);

bot.on(message('text'), async (ctx) => {
    try {
        const text = ctx.update.message.text;
        console.log('received message:', text);

        if (text === '/start') return
        await ctx.reply('Bitte schick mir keine Nachrichten. Ich reagiere nur auf Knopfdruck.');
    } catch (error) { 
        console.error('Error handling message:', error);
    }
})

bot.on(callbackQuery('data'), async (ctx) => {
    console.log('Received callback query');

    try {
        await Promise.all([nt.update(ctx), tg.update(ctx)]);
        console.log('Update handled');
    } catch (error) {
        console.error('Error handling update:', error);
    }
})

const tg = {
    notifyStandby: async () => {
        try {
            const message = await bot.telegram.sendMessage(process.env.TELEGRAM_SUBSCRIBER_ID, 'Heute ist der erste Tag der Pillenpause. In 7 Tagen erinnere ich dich wieder.');
            return message;
        } catch (error) {
            console.error('Error sending standby notification:', error);
            throw error;
        }
    },

    sendReminder: async () => {
        try {
            const message = await bot.telegram.sendMessage(process.env.TELEGRAM_SUBSCRIBER_ID, 'Hast du die Pille genommen?', {
                reply_markup: {
                    inline_keyboard: keyboards.get('Nein')
                }
            });
            return message;
        } catch (error) {
            console.error('Error sending reminder message:', error);
            throw error;
        }
    },
    
    update: async (ctx) => {
        try {
            console.log('Updating markup');
            await ctx.editMessageReplyMarkup({
                inline_keyboard: keyboards.get(ctx.callbackQuery.data)
            })
            console.log('Markup updated');
        } catch (error) {
            console.error('Error updating message markup:', error);
            throw error;
        }
    },

    handleUpdate: async (body) => {
        try {
            await bot.handleUpdate(body);
        } catch (error) {
            console.error('Error handling Telegram update:', error);
            throw error;
        }
    },

    alertPartner: async () => {
        try {
            await bot.telegram.sendMessage(process.env.TELEGRAM_PARTNER_ID, 'Pille noch nicht genommen');
        } catch (error) {
            console.error('Error sending partner alert:', error);
            throw error;
        }
    }
}

export default tg;