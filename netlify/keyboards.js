const keyboards = new Map([
    ['Ja', [
        [
            { text: '✅ Ja', callback_data: 'Ja' },
            { text: 'Nein', callback_data: 'Nein' },
        ]
    ]],
    ['Nein', [
        [
            { text: 'Ja', callback_data: 'Ja' },
            { text: '❌ Nein', callback_data: 'Nein' },
        ]
    ]]
])

export default keyboards;