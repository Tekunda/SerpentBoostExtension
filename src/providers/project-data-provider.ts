import * as vscode from "vscode";

class TreeNode extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly command?: vscode.Command,
    public readonly iconPath?: { light: string; dark: string },
    public readonly description?: string
  ) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.iconPath = iconPath;
    this.contextValue = "button";
    this.description = description;
  }
}

export class ProjectProvider implements vscode.TreeDataProvider<TreeNode> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    TreeNode | undefined | void
  > = new vscode.EventEmitter<TreeNode | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<TreeNode | undefined | void> =
    this._onDidChangeTreeData.event;

  constructor(private context: vscode.ExtensionContext) {}

  getTreeItem(element: TreeNode): vscode.TreeItem {
    return element;
  }

  getChildren(element?: TreeNode): TreeNode[] {
    return [];
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}

export function registerProjectProvider(context: vscode.ExtensionContext) {
  const projectProvider = new ProjectProvider(context);
  vscode.window.createTreeView("projectTreeView", {
    treeDataProvider: projectProvider,
  });
}
