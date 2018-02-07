"use strict";
import * as vscode from "vscode";

import { Api } from "./api";
import { Issue, JiraIssue, YouTrackIssue } from "./issue";

const url = require("url");
const xml2js = require("xml2js");

class Integration {
  protected readonly _api: Api;

  protected readonly _serverUrl: string;
  protected readonly _basePath: string;
  protected readonly _userName: string;
  protected readonly _userPassword: string;
  protected readonly _searchQuery: string;

  protected readonly _loginUrl: string;
  protected readonly _issueListUrl: string;
  protected readonly _issueItemUrl: string;
  protected readonly _issueItemUpdateUrl: string;
  protected _logged: boolean;
  protected _headers: object;

  constructor(
    serverUrl: string,
    basePath: string = "",
    userName: string,
    userPassword: string,
    searchQuery: string
  ) {
    this._logged = false;
    this._headers = {};
    this._serverUrl = serverUrl;
    this._basePath = basePath;
    this._userName = userName;
    this._userPassword = userPassword;
    this._searchQuery = searchQuery;

    this._api = new Api(this._serverUrl, this._basePath);
  }

  protected login(): Promise<void | string> {
    return undefined;
  }

  protected ensureLogin(): Promise<void> {
    if (this._logged) return Promise.resolve();
    return this.login()
      .then(() => Promise.resolve())
      .catch(err => Promise.reject(err));
  }

  public getIssueList() {}

  public getIssueById(id: string) {}

  public updateIssueById(id: string) {}

  public updateIssueStatusById(id: string, status: string) {}

  public test() {
    return new Promise((resolve, reject) => {
      this.login()
        .then(() => resolve())
        .catch(err => reject(String(err)));
    });
  }
}

class Jira extends Integration {}

class YouTrack extends Integration {
  protected readonly _loginUrl: string = "/rest/user/login?login={login}&password={password}";
  protected readonly _issueListUrl: string = "/rest/issue?filter={filter}&max=100";
  protected readonly _issueItemUrl: string = "/rest/issue/{issueId}";
  protected readonly _issueItemUpdateUrl: string = "/rest/issue/{issueId}/execute?command={command}";

  protected login(): Promise<void | string> {
    return new Promise((resolve, reject) => {
      const loginUrl = this._loginUrl
        .replace("{login}", encodeURIComponent(this._userName))
        .replace("{password}", encodeURI(this._userPassword));

      this._api
        .post(loginUrl)
        .then(result => {
          const [data, res] = result;

          if (data === "<login>ok</login>") {
            this._logged = true;
            this._headers = {
              Cookie: res.headers["set-cookie"]
            };
            return resolve();
          }

          reject(`Login Error: ${data}`);
        })
        .catch(result => {
          this._logged = false; // update logged value

          reject(String(result));
        });
    });
  }

  public updateIssueStatusById(
    id: string,
    status: string
  ): Promise<string | object> {
    return new Promise((resolve, reject) => {
      const config = vscode.workspace.getConfiguration("tasktool");
      const stateField = config.get("stateField", "state");

      this.ensureLogin()
        .then(() => {
          resolve();
          return;

          this._api
            .post(
              `/rest/issue/${id}/execute?command=${encodeURIComponent(
                stateField + " " + status
              )}`,
              undefined,
              undefined,
              this._headers
            )
            .then(data => {
              resolve(data);
            })
            .catch(err => {
              const [error, res] = err;
              reject(error);
            });
        })
        .catch((err: string) => reject(err));
    });
  }

  public getIssueList(): Promise<object> {
    const self = this;

    return new Promise((resolve, reject) => {
      this.ensureLogin()
        .then(() => {
          const ussieListUrl = this._issueListUrl.replace(
            "{filter}",
            encodeURIComponent(this._searchQuery)
          );

          this._api
            .get(ussieListUrl, undefined, this._headers)
            .then(result => {
              const [data, res] = result;
              const prs = new xml2js.Parser();

              prs.parseString(data, (e, r) => {
                resolve({ issues: r.issueCompacts.issue });
              });
            })
            .catch(result => {
              console.log("ERROR.RESP", result);
              reject(String(result));
            });
        })
        .catch((err: string) => reject(err));
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

  const servarUrlData = url.parse(config.serverUrl);

  return new YouTrack(
    servarUrlData.hostname,
    servarUrlData.pathname,
    config.userName,
    config.userPassword,
    config.searchQuery
  );

  // return isYouTrack
  //   ? new YouTrack(
  //       config.serverUrl.replace("/youtrack", "").replace("https://", ""),
  //       config.userName,
  //       config.userPassword,
  //       config.searchQuery
  //     )
  //   : new Jira(
  //       config.serverUrl,
  //       config.userName,
  //       config.userPassword,
  //       config.searchQuery
  //     );
}
