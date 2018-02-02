'use strict';
import * as vscode from 'vscode';

import Browser from './browser'
import {MakeInstance} from './integrations'

export const COMMANDS = {
    'tasktool.browser.open': (url) => Browser.open(url),
    'tasktool.test-connection': () => MakeInstance().test()
}