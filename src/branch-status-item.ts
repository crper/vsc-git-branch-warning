import * as vscode from 'vscode';

interface RepositoryState {
    rootUri: any;
    indexChanges: any;
    workingTreeChanges: any;
    HEAD: { name: string; };
}

interface Repository {
    rootUri: any;
    state: RepositoryState;
}

interface CustomStatusItemOptions {
    repository?: Repository;
    conf?: {
        sensitiveBranches?: string[]; // Use a specific union type for sensitive branches
        sensitiveTooltip?: string;
        sensitiveText?: string;
    };
}

function mergeOptionArrays(arr1: string[] = [''], arr2: string[] = ['']) {
    return [...new Set([...arr1, ...arr2])]
}


let branchStatusItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 120);
const defaultOptions = {
    sensitiveBranches: ["main", "master", "product"],
    sensitiveText: '⚠️ BRANCH WARNING :',
    sensitiveTooltip: 'This branch is a sensitive branch',
    backgroundColor: new vscode.ThemeColor('statusBarItem.errorBackground'),
    showBranchStatusItem: true,
};


export function setBranchStatusItem({ repository, conf = {} }: CustomStatusItemOptions): void {



    if (!repository) {
        branchStatusItem.tooltip = '';
        branchStatusItem.text = '';
        return;

    };




    const mergedConf = {
        ...defaultOptions,
        ...conf,
        sensitiveBranches: mergeOptionArrays(defaultOptions.sensitiveBranches, conf.sensitiveBranches)
    };



    const currentBranchName = repository?.state.HEAD?.name;

    const branches: string[] = mergedConf.sensitiveBranches;

    const repositoryRoot = repository?.rootUri?.fsPath;

    const isMatch = branches.includes(currentBranchName?.split('/')?.pop() || '');



    if (isMatch) {
        branchStatusItem.backgroundColor = mergedConf.backgroundColor;
        const markdownString = new vscode.MarkdownString();
        markdownString.supportThemeIcons = true;

        branchStatusItem.text = `${mergedConf.sensitiveText} ${currentBranchName}`;
        markdownString.appendMarkdown(`##  ⚠️ WARNING :  ${mergedConf.sensitiveTooltip || defaultOptions.sensitiveTooltip}`);
        markdownString.appendMarkdown(`\n- RepositoryRoot: ${repositoryRoot} \n- Current Branch : ${currentBranchName}`);
        branchStatusItem.tooltip = markdownString
        branchStatusItem.show();
    } else {
        branchStatusItem.tooltip = '';
        branchStatusItem.hide();
    }

}
