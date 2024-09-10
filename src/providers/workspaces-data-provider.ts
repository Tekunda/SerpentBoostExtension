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

import { CustomEvent } from "../utils/custom-event";
import { MessageType } from "../types/message-type";
import GlobalStoreManager from "../utils/global-store";
import { fetchOrgs, fetchProjects, fetchWorkSpaces } from "../utils/api-client";
import { isTokenExpired } from "../utils/general-util";

class TreeNode extends TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: TreeItemCollapsibleState,
    public readonly id?: string,
    public children?: TreeNode[],
    public command?: Command,
    public contextValue?: string,
    public readonly iconPath?: ThemeIcon
  ) {
    super(label, collapsibleState);
  }
}

export class WorkspacesDataProvider implements TreeDataProvider<TreeNode> {
  private _onDidChangeTreeData: EventEmitter<TreeNode | undefined | void> =
    new EventEmitter<TreeNode | undefined | void>();
  readonly onDidChangeTreeData: Event<TreeNode | undefined | void> =
    this._onDidChangeTreeData.event;

  private data: TreeNode[];
  private context: ExtensionContext;
  private globalStore: GlobalStoreManager;

  constructor(context: ExtensionContext) {
    this.context = context;
    this.data = [];
    this.globalStore = GlobalStoreManager.getInstance(context);

    CustomEvent.customEvent.subscribe((data: any) => {
      if (data?.type === MessageType.REFRESH_EVENT) {
        this.refreshData();
      }
    });
  }

  getTreeItem(element: TreeNode): TreeItem {
    return element;
  }

  private createTitleTreeNode(
    label: string,
    contextType: string,
    icon: string,
    children?: TreeNode[]
  ): TreeNode {
    return new TreeNode(
      label,
      TreeItemCollapsibleState.Collapsed,
      undefined,
      children,
      undefined,
      contextType,
      new ThemeIcon(icon)
    );
  }

  private async fetchData() {
    const workspaces = await fetchWorkSpaces(this.context);

    const projects = await Promise.all(
      workspaces.map(async (workspace: any) => ({
        [workspace._id]: await fetchProjects(this.context, workspace._id),
      }))
    );

    const orgs = await Promise.all(
      workspaces.map(async (workspace: any) => ({
        [workspace._id]: await fetchOrgs(
          this.context,
          workspace.name,
          workspace._id
        ),
      }))
    );

    this.globalStore.workspaces = workspaces;

    const projectsArray = projects.map(
      (project) => project[Object.keys(project)[0]]
    );

    const projectFlat = projectsArray.flat();

    this.globalStore.projects = projectFlat;

    return {
      workspaces,
      projects: Object.assign({}, ...projects),
      orgs: Object.assign({}, ...orgs),
    };
  }

  private createWorkspaceNodes(data: {
    workspaces: any[];
    projects: { [key: string]: any[] };
    orgs: { [key: string]: any[] };
  }): TreeNode[] {
    return data.workspaces.map((workspace: any) => {
      const projectNodes = (data.projects[workspace._id] || []).map(
        (project: any) => {
          return new TreeNode(
            project.name,
            TreeItemCollapsibleState.None,
            undefined,
            undefined,
            {
              command: "serpent-boost.open-project",
              title: "Open Project",
              arguments: [workspace.name, project.name],
            },
            "project"
          );
        }
      );
      const orgNodes = (data.orgs[workspace._id] || []).map((org: any) => {
        return new TreeNode(
          org.name,
          TreeItemCollapsibleState.None,
          undefined,
          undefined,
          undefined,
          "org"
        // );
      });
      const projectsTitle = this.createTitleTreeNode(
        "Projects",
        "projects",
        "repo",
        projectNodes
      );
      const orgsTitle = this.createTitleTreeNode(
        "Orgs",
        "orgs",
        "organization",
        orgNodes
      );
      return new TreeNode(
        workspace.name,
        TreeItemCollapsibleState.Collapsed,
        undefined,
        [projectsTitle, orgsTitle],
        {
          command: "serpent-boost.open-workspace",
          title: "Open Workspace",
          arguments: [workspace.name],
        },
        "workspace"
      );
    });
  }

  private async refreshData() {
    const tokenExpired = await isTokenExpired(this.context);
    if (tokenExpired) {
      return;
    }
    const data = await this.fetchData();
    const workspaceNodes = this.createWorkspaceNodes(data);
    const workspaceTitle = this.createTitleTreeNode(
      "Workspaces",
      "workspaces",
      "briefcase",
      workspaceNodes
    );
    this.data = [workspaceTitle];
    this.refresh();
  }

  async getChildren(element?: TreeNode): Promise<TreeNode[]> {
    if (element === undefined) {
      if (this.data.length === 0) {
        await this.refreshData();
      }
      return this.data;
    }
    return element.children || [];
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}

export function registerWorkspacesDataProvider(context: ExtensionContext) {
  const workspacesDataProvider = new WorkspacesDataProvider(context);
  window.createTreeView("workspacesTreeView", {
    treeDataProvider: workspacesDataProvider,
  });
}
