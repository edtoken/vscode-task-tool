'use strict';
import * as vscode from 'vscode';

import {COMMANDS} from './commands'

function activate(_context) {
    
    const context = _context;
    const workspaceState = context.workspaceState;
    const channel = vscode.window.createOutputChannel('TASKTOOL');

    context.subscriptions.push(channel);

    // register commands
    for(let commandName in COMMANDS){
        context.subscriptions.push(vscode.commands.registerCommand(commandName, COMMANDS[commandName])) 
    }

    // test connection to task tracker
    // vscode.commands.executeCommand('tasktool.test-connection')
}

function deactivate() {
}

exports.activate = activate;
exports.deactivate = deactivate;
