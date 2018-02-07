"use strict";
import * as https from "https";
import * as xml2js from "xml2js";

export class Api {
  private host: string;
  private basePath: string;
  private defaultHeaders: object;
  private https = https;

  constructor(
    host: string,
    basePath: string = "",
    defaultHeaders: object = {}
  ) {
    this.host = host;
    this.basePath = basePath;
    this.defaultHeaders = defaultHeaders;
  }

  private _call(
    method: string,
    url: string = "",
    body: object = {},
    query: object = {},
    headers: object = {}
  ) {
    const self = this;
    let loginRequest = false;

    return new Promise((resolve, reject) => {
      const options = {
        host: this.host,
        method,
        // port: 443,
        path: this.basePath + url,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          ...this.defaultHeaders,
          ...headers
        }
      };

      const postReq = this.https.request(options, function(res) {
        res.setEncoding("utf8");
        let data = "";
        res.on("data", function(chunk) {
          data += chunk;
        });
        res.on("end", function() {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            reject([data, res]);
            return;
          }
          resolve([data, res]);
        });

        res.on("error", function(e) {
          return reject([data, res]);
        });

        res.on("timeout", function(e) {
          return reject([data, res]);
        });
      });
      postReq.end();
    });
  }
  public get(url: string, query: object = {}, headers: object = {}) {
    return this._call("get", url, undefined, query, headers);
  }
  public post(
    url: string,
    body: object = {},
    query: object = {},
    headers: object = {}
  ) {
    return this._call("post", url, body, query, headers);
  }
  public put(
    url: string,
    body: object = {},
    query: object = {},
    headers: object = {}
  ) {
    return this._call("put", url, body, query, headers);
  }
  public del(url: string, query: object = {}, headers: object = {}) {
    return this._call("delete", url, undefined, query, headers);
  }
}
