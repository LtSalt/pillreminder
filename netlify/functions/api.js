import tg from '../tg.js';

export default async function handler(request) {
    console.log('Request received');
    
    const body = await request.json();
    console.log('Request body:', body);
    const userID = body?.callback_query?.from?.id || body?.message?.from?.id;

    if (!userID) {
        console.error('Invalid request body:', body);
        return new Response('Invalid request body', { status: 400 });
    }

    if (userID !== Number(process.env.TELEGRAM_SUBSCRIBER_ID)) {
        console.error('Unauthorized request:', userID);
        return new Response('Unauthorized', { status: 401 });
    }

    console.log('Handling update');
    await tg.handleUpdate(body);

    return new Response('OK', { status: 200 });
}