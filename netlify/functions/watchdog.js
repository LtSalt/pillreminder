import nt from '../nt.js';
import tg from '../tg.js';

export default async function handler() {
    try {
        console.log('Checking if pill has been taken');
        const hasTaken = await nt.hasTaken();
        if (hasTaken) return

        console.log('Alerting partner');
        await tg.alertPartner();
    } catch(err) {
        console.error('Watchdog encountered an error:', err);
    }
}

export const config = {
    schedule: '30 20 * * *'
}