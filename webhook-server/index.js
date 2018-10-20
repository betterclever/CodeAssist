const express = require('express');
const rethinkdb = require('rethinkdb');

const app = express();
const port = 3000;

function getIntent(intentDN, parameters) {
    switch (intentDN) {
        case 'Open Folder': {
            const type = parameters.folder;
            const name = parameters.foldername;

            let intent = {
                'type': 'open',
                'target': type,
                'name': name
            };

            return intent;
        }
    }

    return null;
}

app.post('/incomingIntents', async (req, res) => {
    let body = req.body;

    let conn = await r.connect({
        host: "149.28.137.113",
        port: 28015,
        db: "CodeAssist"
    })

    console.log('conn', conn);
    const parameters = body.queryResult.parameters;
    const intentDN = body.intent.displayName;

    let i = getIntent(intentDN, parameters);
    i.id = 'betterclever';

    r.table('UserCommands').update(conn, i);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))