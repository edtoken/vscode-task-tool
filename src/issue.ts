"use strict";
import * as vscode from "vscode";
import { Configuration } from "./configuration";

export class Issue {
  protected _data: object;

  constructor(id, data) {
    this._data = data;
  }

  fetch() {}
}

export class JiraIssue extends Issue {}

export class YouTrackIssue extends Issue {
  private _config;

  constructor(id, data) {
    super(id, data);
    this._config = vscode.workspace.getConfiguration("tasktool");
  }

  private _getCustomField(fieldName, defaultValue = ""): string {
    const field = this._data["field"].find(f => f.$.name === fieldName);
    return field ? field.value[0] : defaultValue;
  }

  public get id(): string {
    return this._data.$.id;
  }

  public get url(): string {
    return `${this._config.get("serverUrl", "")}/issue/${this.id}`;
  }

  public get title(): string {
    return this._data["field"][2]["value"][0];
  }

  public get description(): string {
    const value = this._data["field"].find(f => f.$.name === "description");
    return value ? value[0] : "";
  }

  public get created(): string {
    return undefined;
  }

  public get links() {
    const links = this._data["field"].find(f => f.$.name === "links").value;
    return links || [];
  }

  public get priority(): string {
    return this._getCustomField(this._config.get("priorityField", "priority"));
  }

  public get state(): string {
    return this._getCustomField(this._config.get("stateField", "state"));
  }

  public get assignee(): string {
    const fieldName = this._config.get("assigneeField", "assignee");
    const field = this._data["field"].find(f => f.$.name === fieldName);
    return field ? field.value[0]._ : "";
  }
}
