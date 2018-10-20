const express = require('express');
const rethinkdb = require('rethinkdb');

const bodyParser = require('body-parser');


const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

    console.log('body', body);

    const parameters = body.queryResult.parameters;
    const intentDN = body.queryResult.intent.displayName;

    let i = getIntent(intentDN, parameters);
    console.log(i);
    
    i.id = 'betterclever';

    r.connect({
        host: "149.28.137.113",
        port: 28015,
        db: "CodeAssist"
    }).then(conn => {
        r.table('UserCommands').update(conn, i);
    }).catch(err => {
        console.log(err);
    })

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))