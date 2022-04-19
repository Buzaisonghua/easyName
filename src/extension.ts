import * as vscode from 'vscode';
const _ = require('lodash');
// @ts-ignore
const request = require('request');

export function activate(context: vscode.ExtensionContext) {
	
	let disposable = vscode.commands.registerCommand('easyname.main', () => {
		// The code you place here will be executed every time your command is executed
		let editor = vscode.window.activeTextEditor;
		let selection: any = editor?.selection
		let text = editor?.document.getText(selection)
		const url = 'https://aip.baidubce.com/rpc/2.0/mt/texttrans/v1?access_token=24.bb76e969627eb1a9cf886c98cfe69f06.2592000.1652968235.282335-26010830'
		const json = { q: text, from: "zh", to: "en", termIds: '' }
		request.post(url, {
			json: json
		}, (error: any, res: any, body: any) => {
			if (error) {
				vscode.window.showInformationMessage('网络错误，请重试');
				return
			}
			console.log(body)
			let text = body.result.trans_result[0].dst
			let replaceText = _.camelCase(text);
			editor?.edit(editorEdit => {
				// 这里可以做以下操作: 删除, 插入, 替换, 设置换行符
				editorEdit.replace(selection, replaceText);
			})
		})
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
