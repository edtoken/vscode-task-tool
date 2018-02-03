"use strict";
import * as vscode from "vscode";
import { makeInstance } from "./integrations";
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

  // private async selectIssue(preselected: Issue | null): Promise<Issue | null | undefined> {
  //   if (preselected || preselected === null) {
  //     return preselected;
  //   }
  //   const activateIssue = getActiveIssue();
  //   const name = activateIssue ? `Deactivate ${activateIssue.key}` : undefined;
  //   return await vscode.commands.executeCommand<Issue | undefined | null>('vscode-jira.listMyIssues', name);
  // }
}

export class TaskListCommand implements Command {
  public id = "tasktool.list";

  constructor() {
    this.run = this.run.bind(this);
  }

  public async run(preselected): Promise<void> {
    // this.configuration = getConfiguration()
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

export class TaskCloseIssueCommand implements Command {
  public id = "tasktool.close";

  constructor() {
    this.run = this.run.bind(this);
  }

  public async run(preselected): Promise<void> {
    // this.configuration = getConfiguration()
  }
}
