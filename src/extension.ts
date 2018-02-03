"use strict";
import * as vscode from "vscode";

import {
  TestConnectionCommand,
  TaskListCommand,
  TaskOpenIssueCommand,
  TaskCloseIssueCommand
} from "./commands";

import { log } from "util";

function activate(_context) {

  const context = _context;
  const workspaceState = context.workspaceState;
  const channel = vscode.window.createOutputChannel("tasktool");
  context.subscriptions.push(channel);

  const config = vscode.workspace.getConfiguration('tasktool');

  const commands = [
    new TestConnectionCommand(),
    new TaskListCommand(),
    new TaskOpenIssueCommand(),
    new TaskCloseIssueCommand()
  ];

  context.subscriptions.push(
    ...commands.map(command =>
      vscode.commands.registerCommand(command.id, command.run)
    )
  );
}

function deactivate() {}

exports.activate = activate;
exports.deactivate = deactivate;
