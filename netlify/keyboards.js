const keyboards = new Map([
    ['?', [
        [
            { text: 'Ja', callback_data: 'Ja' },
            { text: 'Nein', callback_data: 'Nein' },
            { text: '🤔 ?', callback_data: '?' }
        ]
    ]],
    ['Ja', [
        [
            { text: '✅ Ja', callback_data: 'Ja' },
            { text: 'Nein', callback_data: 'Nein' },
            { text: '?', callback_data: '?' }
        ]
    ]],
    ['Nein', [
        [
            { text: 'Ja', callback_data: 'Ja' },
            { text: '❌ Nein', callback_data: 'Nein' },
            { text: '?', callback_data: '?' }
        ]
    ]]
])

export default keyboards;