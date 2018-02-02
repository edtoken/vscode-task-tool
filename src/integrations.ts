'use strict';
import * as vscode from 'vscode';

import {getConfiguration} from './configuration'
import {Issue, JiraIssue, YouTrackIssue} from './issue'

class Integration {

    protected readonly _issueClass: Issue
    
    protected readonly _serverUrl: string 
    protected readonly _userName: string 
    protected readonly _userPassword: string 
    protected readonly _searchQuery: string 

    protected readonly _loginUrl: string
    protected readonly _issueListUrl: string
    protected readonly _issueItemUrl: string 
    protected readonly _issueItemUpdateUrl: string 

    constructor(){
        
    }

    protected login(){

    }

    protected getIssuesList(){

    }

    protected getIssueById(id: string){

    }

    protected updateIssueById(id: string){

    }

    public test(){
        console.log('TEST')
    }
}

class Jira extends Integration {
    protected readonly _issueClass: Issue = JiraIssue
}

class YouTrack extends Integration {
    protected readonly _issueClass: Issue = YouTrackIssue

    protected readonly _loginUrl: string = "/rest/user/login?login={login}&password={password}"
    protected readonly _issueListUrl: string = "/rest/issue?filter={filter}"
    protected readonly _issueItemUrl: string = "/rest/issue/{issueId}"
    protected readonly _issueItemUpdateUrl: string = "/rest/issue/{issueId}/execute?command={command}"
}

export const MakeInstance = () => {
    const config = getConfiguration()
    console.log('config', config)
    
    return new Integration()
}