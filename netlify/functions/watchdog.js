import nt from '../nt.js';
import tg from '../tg.js';

export default async function handler() {
    try {
        const [hasTaken, isStandby] = await Promise.all([nt.hasTaken(), nt.isStandby()]);
        console.log('Watchdog status:', { hasTaken, isStandby });
        if (hasTaken || isStandby) return

        console.log('Alerting partner');
        await tg.alertPartner();
    } catch(err) {
        console.error('Watchdog encountered an error:', err);
    }
}

export const config = {
    schedule: '0 20 * * *'
}