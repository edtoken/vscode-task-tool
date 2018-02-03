"use strict";
import * as vscode from "vscode";
import { Api } from "./api";
import { Issue, JiraIssue, YouTrackIssue } from "./issue";

class Integration {
  protected readonly _issueClass: Issue;
  protected readonly _api: Api;

  protected readonly _serverUrl: string;
  protected readonly _userName: string;
  protected readonly _userPassword: string;
  protected readonly _searchQuery: string;

  protected readonly _loginUrl: string;
  protected readonly _issueListUrl: string;
  protected readonly _issueItemUrl: string;
  protected readonly _issueItemUpdateUrl: string;
  protected _logged: boolean;

  constructor(
    serverUrl: string,
    userName: string,
    userPassword: string,
    searchQuery: string
  ) {
    this._logged = false;
    this._serverUrl = serverUrl;
    this._userName = userName;
    this._userPassword = userPassword;
    this._searchQuery = searchQuery;

    this._api = new Api(this._serverUrl);
  }

  protected login(): Promise {
    return new Promise((resolve, reject) => {});
  }

  protected getIssuesList() {}

  protected getIssueById(id: string) {}

  protected updateIssueById(id: string) {}

  public test() {
    return new Promise((resolve, reject) => {
      this.login()
        .then(() => resolve())
        .catch(err => reject(String(err)));
    });
  }
}

class Jira extends Integration {
  protected readonly _issueClass: Issue = JiraIssue;
}

class YouTrack extends Integration {
  // /youtrack
  protected readonly _issueClass: Issue = YouTrackIssue;

  protected readonly _loginUrl: string = "/rest/user/login?login={login}&password={password}";
  protected readonly _issueListUrl: string = "/rest/issue?filter={filter}";
  protected readonly _issueItemUrl: string = "/rest/issue/{issueId}";
  protected readonly _issueItemUpdateUrl: string = "/rest/issue/{issueId}/execute?command={command}";

  protected login(): Promise {
    return new Promise((resolve, reject) => {
      const loginUrl = this._loginUrl
        .replace("{login}", encodeURIComponent(this._userName))
        .replace("{password}", encodeURI(this._userPassword));
      this._api
        .post(loginUrl)
        .then(result => {
          this._logged = true; // update logged value
          resolve();
        })
        .catch(result => {
          this._logged = false; // update logged value
          console.log("ERROR.RESP", result);
          reject(String(result));
        });
    });
  }
}

export function makeInstance() {
  const config = vscode.workspace.getConfiguration("tasktool");
  const isYouTrack = config.serverUrl.includes("youtrack");
  const isJira = false;

  if (!isYouTrack && !isJira) {
    throw new Error("Undefined integration name");
  }

  return isYouTrack
    ? new YouTrack(
        config.serverUrl.replace("/youtrack", "").replace("https://", ""),
        config.userName,
        config.userPassword,
        config.searchQuery
      )
    : new Jira(
        config.serverUrl,
        config.userName,
        config.userPassword,
        config.searchQuery
      );
}
