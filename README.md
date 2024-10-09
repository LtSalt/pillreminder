# README

## Steps 
- [x] init `package.json`
- [x] init git
- [x] set up telegram bot & drop credentials in `.env`
- [x] init netlify
- [x] create netlify live server & drop dev url in `.env`
- [x] set webhook and verify at `https://api.telegram.org/bot<token>/getWebhookInfo`
- [x] pass update to bot 
- [x] add auth check
- [x] set up reminder with inline keyboard
- [x] integrate notion db
- [x] create entry when sending reminder
- [x] identify entry on callback query via message id
- [x] handle callback query: 
  - [x] toggle state by input data
  - [x] edit markup in message
- [x] added third 'pending/maybe' state to markup and db 

- set standby after 21 days in a row
- check duration in reminder

## Don't forget
- [ ] handle lingering messages 


## Also
- can't set global node version with `nvm.fish`
- maybe also nvm integration problem