import * as vscode from 'vscode';

type GitRepositoryAPI = {
    /**
     * Retrieves the Git repository associated with the given workspace folder URI.
     *
     * @param uri - The URI of the workspace folder representing the Git repository.
     * @returns An object representing the Git repository, or `undefined` if no repository is found at the specified location.
     */
    getRepository(uri: vscode.Uri): { state: { HEAD: { name: string } } } | undefined;
};

/**
 * Checks whether the Git plugin is enabled in the current Visual Studio Code environment.
 *
 * @returns An object containing the following properties:
 * - `status`: A boolean indicating whether the Git plugin is currently active (`true`) or not (`false`).
 * - `message`: A string describing the status of the Git plugin, either `'Git plugin is enabled'` or `'Git plugin is not enabled'`.
 * - `API`: The Git plugin API object if the plugin is enabled and its version is compatible (version >= 1), otherwise `undefined`.
 */
export const isEnableGitPlugin = (): { status: boolean; message: string; API: any | undefined } => {
    const vscodeGit = vscode.extensions.getExtension('vscode.git');
    const isEnableGitPlugin = vscodeGit?.isActive;
    return {
        status: !!isEnableGitPlugin,
        message: isEnableGitPlugin ? 'Git plugin is enabled' : 'Git plugin is not enabled',
        API: isEnableGitPlugin && vscodeGit?.exports.getAPI(1) as GitRepositoryAPI | undefined
    };
};