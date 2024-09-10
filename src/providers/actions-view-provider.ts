import {
  TreeDataProvider,
  TreeItem,
  Event,
  EventEmitter,
  TreeItemCollapsibleState,
  ExtensionContext,
  window,
  Command,
  ThemeIcon,
} from "vscode";

class TreeNode extends TreeItem {
  constructor(
    public readonly label: string,
    public readonly command?: Command,
    public readonly iconPath?: ThemeIcon
  ) {
    super(label, TreeItemCollapsibleState.None);
  }
}

export class ActionsProvider implements TreeDataProvider<TreeNode> {
  private _onDidChangeTreeData: EventEmitter<TreeNode | undefined | void> =
    new EventEmitter<TreeNode | undefined | void>();
  readonly onDidChangeTreeData: Event<TreeNode | undefined | void> =
    this._onDidChangeTreeData.event;

  constructor(private context: ExtensionContext) {}

  getTreeItem(element: TreeNode): TreeItem {
    return element;
  }

  getChildren(element?: TreeNode): TreeNode[] {
    return [
      new TreeNode(
        "Create Scratch Org",
        {
          command: "serpent-boost.create-scratch-org",
          title: "Create Scratch Org",
        },
        new ThemeIcon("add")
      ),
    ];
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}

export function registerActionsViewProvider(context: ExtensionContext) {
  const actionsProvider = new ActionsProvider(context);
  window.createTreeView("actionsTreeView", {
    treeDataProvider: actionsProvider,
  });
}
