'use strict';
import {getConfiguration} from './configuration'

export interface Command<T = void> {
    id: string;
    configuration: object
  
    run(...args: any[]): T | Promise<T>;
}

export class TestConnectionCommand implements Command {

  public id = 'tasktool.test-connection';
  public configuration = undefined

  constructor(){
    this.run = this.run.bind(this)
  }

  public async run(preselected: Issue | null): Promise<void> {
    this.configuration = getConfiguration()
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

  public id = 'tasktool.list';
  public configuration = undefined

  constructor(){
    this.run = this.run.bind(this)
  }
  
  public async run(preselected: Issue | null): Promise<void> {
    this.configuration = getConfiguration()
  }
}


export class TaskOpenIssueCommand implements Command {

  public id = 'tasktool.open';
  public configuration = undefined

  constructor(){
    this.run = this.run.bind(this)
  }
  
  public async run(preselected: Issue | null): Promise<void> {
    this.configuration = getConfiguration()
  }
}

export class TaskCloseIssueCommand implements Command {

  public id = 'tasktool.close';
  public configuration = undefined

  constructor(){
    this.run = this.run.bind(this)
  }
  
  public async run(preselected: Issue | null): Promise<void> {
    this.configuration = getConfiguration()
  }
}