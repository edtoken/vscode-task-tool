"use strict";
import * as vscode from "vscode";

export interface Configuration {
  serverUrl: string;
  userName: string;
  userPassword: string;
  searchQuery: string;
}

export function getConfiguration(): Configuration {
  const config = vscode.workspace
    .getConfiguration()
    .get<Configuration>("tasktool");

  if (!config) {
    throw new Error("No configuration found. Probably an error in vscode");
  }
  return config;
}
