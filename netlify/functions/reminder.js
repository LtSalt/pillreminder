import 'dotenv/config';
import { Telegraf } from 'telegraf';
import nt from '../nt.js';
import tg from '../tg.js';

const bot = new Telegraf(process.env.TELEGRAM_PILLBOT_TOKEN);

export default async function handler() {
    try {
        const [isStandby, hasCompleted] = await Promise.all([nt.isStandby(), nt.hasCompleted()]);
        
        if (isStandby) {
            console.log('Is in standby');

        } else if (hasCompleted) {
            console.log('Has completed 21 days, creating standby');

            const message = await tg.notifyStandby(bot);
            await nt.addStandby(message);

        } else {
            const message = await tg.sendReminder(bot)
            await nt.addToday(message);
        }
    } catch(err) {
        console.error('Error creating Notion entry:', err);
    }
}

export const config = {
    schedule: '0 18 * * *'
}