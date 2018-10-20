'use strict';

import * as vscode from 'vscode';
import * as r from 'rethinkdb';
import { open } from 'fs';

interface Intent {
    type: 'open' | 'git'
}

interface OpenIntent extends Intent {
    target: 'folder' | 'file';
    name: string;
}

interface GitIntent extends Intent {
    task: 'push' | 'pull' | 'fetch';
    remote?: string
}

export async function activate(context: vscode.ExtensionContext) {

    let conn = await r.connect({
        host: "149.28.137.113",
        port: 28015,
        db: "CodeAssist"
    });

    console.log(conn)

    // @ts-ignore
    r.table('UserCommands').changes().run(conn, function (err, cursor) {
        // cursor.each(console.log)
        cursor.each((e,v) => {
            console.log("here", v);
            let intent = v.new_val as Intent;

            switch(intent.type) {
                case 'open': {
                    let openIntent = intent as OpenIntent
                    if (openIntent.target === 'folder') {
                        let uri = vscode.Uri.file(`/home/betterclever/Projects/${openIntent.name}`)
                        vscode.commands.executeCommand('vscode.openFolder', uri)
                    }
                } break;
                case 'git': {
                    let gitIntent = intent as GitIntent
                    let remote = (gitIntent.remote !== null) ? gitIntent.remote : 'origin'
                    switch(gitIntent.task) {
                        case 'fetch': vscode.commands.executeCommand('git.fetch')
                        break
                        case 'pull': vscode.commands.executeCommand('git.pull', remote)
                        break
                        case 'push': vscode.commands.executeCommand('git.push', remote)
                    }
                }
            }
            
        })
    })


   
    console.log('Congratulations, your extension "cossis" is now active!');

}

export function deactivate() {

    console.log('CodeAssist deactivated');
}