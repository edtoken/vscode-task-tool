"use strict";
import * as vscode from "vscode";

import {
  TestConnectionCommand,
  TaskListCommand,
  TaskOpenIssueCommand,
  TaskCloseIssueCommand,
  TaskOpenIssueInBrowserCommand
} from "./commands";

import { TDPanelProvider } from "./panel";

import { log } from "util";

function activate(_context) {
  const context = _context;
  const workspaceState = context.workspaceState;
  const channel = vscode.window.createOutputChannel("tasktool");
  context.subscriptions.push(channel);

  const config = vscode.workspace.getConfiguration("tasktool");

  const commands = [
    new TestConnectionCommand(),
    new TaskListCommand(),
    new TaskOpenIssueCommand(),
    new TaskCloseIssueCommand(),
    new TaskOpenIssueInBrowserCommand()
  ];

  // plugin panel
  const registration = vscode.workspace.registerTextDocumentContentProvider(
    "css-preview",
    new TDPanelProvider()
  );
  context.subscriptions.push(registration);

  // statusbar button
  const status = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    250
  );
  status.command = "tasktool.list";
  status.text = "TaskTool List";
  status.show();
  context.subscriptions.push(status);

  context.subscriptions.push(
    ...commands.map(command =>
      vscode.commands.registerCommand(command.id, command.run)
    )
  );
}

function deactivate() {}

exports.activate = activate;
exports.deactivate = deactivate;
