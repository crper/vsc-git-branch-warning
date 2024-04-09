// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';
import { isEnableGitPlugin } from './utils';
import { setBranchStatusItem } from './branch-status-item';

let gitBranchWarningConfig: any;
export function activate(context: vscode.ExtensionContext) {

	gitBranchWarningConfig = vscode.workspace.getConfiguration().get('gitBranchWarning');
	const { status, API: gitAPI } = isEnableGitPlugin();





	function updateBranchStatusItem() {


		if (!status) {
			return;
		}

		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) {
			return;
		}


		const activeFileUri = activeEditor.document.uri;
		const activeFolder = vscode.workspace.getWorkspaceFolder(activeFileUri);
		if (!activeFolder) {
			return;
		}

		const repository = gitAPI.getRepository(activeFolder.uri);


		setBranchStatusItem({ repository, conf: gitBranchWarningConfig });
	}



	let disposable = vscode.workspace.onDidChangeConfiguration(event => {
		if (event.affectsConfiguration('gitBranchWarning')) {
			gitBranchWarningConfig = vscode.workspace.getConfiguration().get('gitBranchWarning');

			updateBranchStatusItem();
		}
	});


	vscode.workspace.onDidOpenTextDocument(updateBranchStatusItem);
	vscode.window.onDidChangeActiveTextEditor(updateBranchStatusItem);
	vscode.workspace.onDidChangeWorkspaceFolders(updateBranchStatusItem);


	context.subscriptions.push(disposable);
	context.subscriptions.push(
		vscode.commands.registerCommand('git-branch-warn.watch', () => {
			// The code you place here will be executed every time your command is executed
			// Display a message box to the user
		}),
	);
}

export function deactivate() { } 