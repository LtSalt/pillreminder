import keyboards from './keyboards';

const tg = {
    notifyStandby: async (bot) => {
        const message = bot.telegram.sendMessage(process.env.TELEGRAM_USER_ID, 'Heute ist der erste Tag der Pillenpause. In 7 Tagen erinnere ich dich wieder.');
        return message;
    },
    sendReminder: async (bot) => {
        const message = await bot.telegram.sendMessage(process.env.TELEGRAM_USER_ID, 'Hast du die Pille genommen?', {
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
    }
}

export default tg;