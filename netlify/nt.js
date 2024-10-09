import 'dotenv/config';
import { Client } from '@notionhq/client';
import { format, subDays, addDays} from 'date-fns';

const notion = new Client({ auth: process.env.NOTION_INTEGRATION_SECRET });

const nt = {
    isStandby: async () => {
        const today = format(new Date(), 'yyyy-MM-dd');

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

    hasCompleted: async () => {
        const today = format(new Date(), 'yyyy-MM-dd');
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
        const today = format(new Date(), 'yyyy-MM-dd');

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
    }

}

export default nt; 