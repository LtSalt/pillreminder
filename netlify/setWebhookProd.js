import 'dotenv/config';

fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_PILLBOT_TOKEN}/setWebhook`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: `${process.env.NETLIFY_URL_PROD}/.netlify/functions/api`
})})
.then(response => response.json())
.then(data => {
  console.log(data);
})
.catch(error => {
  console.error('Error setting webhook:', error);
});