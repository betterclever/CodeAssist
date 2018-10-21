const express = require('express');
const r = require('rethinkdb');

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
        case 'Push': {
            const branch = parameters.branch;

            let intent = {
                'type': 'git',
                'task': 'push',
                'branch': branch,
            };

            return intent;

        }
        case 'Commit': {
            const message = parameters.message;

            let intent = {
                'type': 'git',
                'task': 'commit',
                'message': message,
            };

            return intent;
        }
        case 'Snippet': {
            const task = parameters.task
            const language = (parameters.language) ? parameters.language : null
            
            let intent = {
                'type': 'snippetSearch',
                'query': task,
                'language': language
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
        r.table('UserCommands').update(i).run(conn, (err, cursor) => {
            console.log(cursor)
            console.log('err', err)
        })
    }).catch(err => {
        console.log(err);
    })

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))