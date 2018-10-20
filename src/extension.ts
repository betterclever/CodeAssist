'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as r from 'rethinkdb';

interface Intent {
    type: 'open'
}

interface OpenIntent extends Intent {
    target: 'folder' | 'file';
    name: string;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
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
            if (intent.type === 'open') {
                let openIntent = intent as OpenIntent
                if (openIntent.target === 'folder') {
                    let uri = vscode.Uri.file(`/home/betterclever/Projects/${openIntent.name}`)
                    vscode.commands.executeCommand('vscode.openFolder', uri)
                }
            }
        })
    })


    // r.table('UserCommands').changes().run(conn, (err, v) => {

    //     console.log(err);
    //     console.log(v);

    //     // let intent = v[0].new_val as Intent;
    //     // if(intent.type === 'open') {
    //     //     let openIntent = intent as OpenIntent
    //     //     if(openIntent.target === 'folder') {
    //     //         let uri = vscode.Uri.file(`/home/betterclever/Projects/${openIntent.name}`)
    //     //         vscode.commands.executeCommand('vscode.openFolder', uri)
    //     //     }
    //     // }
    // })

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "cossis" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {

    console.log('CodeAssist deactivated');
}