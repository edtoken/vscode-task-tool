"use strict";
import * as vscode from "vscode";
import { makeInstance } from "./integrations";
import * as store from "./store";

export interface Command<T = void> {
  id: string;

  run(...args: any[]): T | Promise<T>;
}

export class TestConnectionCommand implements Command {
  public id = "tasktool.test-connection";

  constructor() {
    this.run = this.run.bind(this);
  }

  public async run(): Promise<void> {
    return makeInstance()
      .test()
      .then(() => {
        vscode.window.showInformationMessage("Connection succeful");
      })
      .catch((err: string) => vscode.window.showErrorMessage(err));
  }
}

export class TaskListCommand implements Command {
  public id = "tasktool.list";

  constructor() {
    this.run = this.run.bind(this);
  }

  public async run(preselected): Promise<void> {
    return makeInstance()
      .getIssueList()
      .then(data => {
        const { issues } = data;

        // save issues list
        store.set("issues", issues);

        vscode.commands
          .executeCommand(
            "vscode.previewHtml",
            vscode.Uri.parse("css-preview://test"),
            vscode.ViewColumn.Two,
            "TaskTool List"
          )
          .then(
            success => {},
            reason => {
              vscode.window.showErrorMessage(reason);
            }
          );
      })
      .catch((err: string) =>
        vscode.window.showErrorMessage(`Error open issues list ${err}`)
      );
  }
}

export class TaskOpenIssueCommand implements Command {
  public id = "tasktool.open";

  constructor() {
    this.run = this.run.bind(this);
  }

  public async run(preselected): Promise<void> {
    // this.configuration = getConfiguration()
  }
}

export class TaskOpenIssueInBrowserCommand implements Command {
  public id = "tasktool.open-in-browser";

  constructor() {
    this.run = this.run.bind(this);
  }

  public async run(url: string): Promise<void> {
    vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(`${url}`));
  }
}

export class TaskCloseIssueCommand implements Command {
  public id = "tasktool.close";

  constructor() {
    this.run = this.run.bind(this);
  }

  public async run(preselected): Promise<void> {
    // this.configuration = getConfiguration()
  }
}
