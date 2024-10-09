import { Client } from '@notionhq/client';
import { format, subDays, addDays} from 'date-fns';

const notion = new Client({ auth: process.env.NOTION_INTEGRATION_SECRET });
const today = format(new Date(), 'yyyy-MM-dd');

const nt = {
    isStandby: async () => {
        console.log('Checking if in standby');

        const query = await notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID,
            filter: {
                and: [
                    {
                        property: 'Date',
                        date: {
                            equals: today
                        }
                    },
                    {
                        property: 'Status',
                        select: {
                            equals: 'Pillenpause'
                        }
                    }
                ] 
            }
        })
        
        return query.results.length > 0;
    },

    hasTaken: async () => {
        const query = await notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID,
            filter: {
                and: [
                    {
                        property: 'Date',
                        date: {
                            equals: today
                        }
                    },
                    {
                        property: 'Status',
                        select: {
                            equals: 'Ja'
                        }
                    }
                ]
            }
        })

        return query.results.length > 0;
    },

    hasCompleted: async () => {
        console.log('Checking if 21 days have been completed');
        const twentyOneDaysAgo = format(subDays(new Date(), 21), 'yyyy-MM-dd');

        const query = await notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID,
            filter: {
                and: [
                    {
                        property: 'Date',
                        date: {
                            on_or_after: twentyOneDaysAgo,
                            before: today 
                        }
                    },
                    {
                        property: 'Status',
                        select: {
                            equals: 'Ja'
                        }
                    }
                ]
            }
        })

        return query.results.length === 21;
    },

    addToday: async (message) => {
        console.log('Adding entry for today');

        notion.pages.create({
            parent: {
                database_id: process.env.NOTION_DATABASE_ID
            },
            properties: {
                Name: {
                    title: [
                        {
                            text: {
                                content: 'Pille genommen?'
                            }
                        }
                    ]
                },
                Date: {
                    date: {
                        start: today
                    }
                },
                MessageID: {
                    number: message.message_id
                },
                Status: {
                    select: {
                        name: '?'
                    }
                }
            }
        })
    },

    addStandby: async (message) => {
        console.log('Adding standby entries');
        const days = [0, 1, 2, 3, 4, 5, 6];

        days.forEach(day => {
            const date = format(addDays(new Date(), day), 'yyyy-MM-dd');

            notion.pages.create({
                parent: {
                    database_id: process.env.NOTION_DATABASE_ID
                },
                properties: {
                    Name: {
                        title: [
                            {
                                text: {
                                    content: 'Pille genommen?'
                                }
                            }
                        ]
                    },
                    Date: {
                        date: {
                            start: date
                        }
                    },
                    MessageID: {
                        number: message.message_id
                    },
                    Status: {
                        select: {
                            name: 'Pillenpause'
                        }
                    }
                }
            })
        })
    },

    update: async (ctx) => {
        console.log('Updating entry in database');
        console.log('Message', ctx.update.callbackQuery.message);
        const messageID = ctx.update.callbackQuery.message.message_id;

        console.log('Querying database');
        const query = await notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID,
            filter: {
                property: 'MessageID',
                number: {
                    equals: messageID
                }
            }
        })

        console.log('Updating entry');
        await notion.pages.update({
            page_id: query.results[0].id,
            properties: {
                Status: {
                    select: {
                        name: ctx.callbackQuery.data
                    }
                }
            }
        })
    }

}

export default nt; 