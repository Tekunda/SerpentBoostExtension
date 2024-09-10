import { ExtensionContext } from "vscode";

interface GlobalStore {
  workspaces: any[];
  projects: any[];
}

class GlobalStoreManager {
  private static instance: GlobalStoreManager;
  private context: ExtensionContext;

  private constructor(context: ExtensionContext) {
    this.context = context;
  }

  public static getInstance(context: ExtensionContext): GlobalStoreManager {
    if (!GlobalStoreManager.instance) {
      GlobalStoreManager.instance = new GlobalStoreManager(context);
    }
    return GlobalStoreManager.instance;
  }

  get workspaces(): any[] {
    return this.context.globalState.get("workspaces", []);
  }

  set workspaces(value: any[]) {
    this.context.globalState.update("workspaces", value);
  }

  get projects(): any[] {
    return this.context.globalState.get("projects", []);
  }

  set projects(value: any[]) {
    this.context.globalState.update("projects", value);
  }
  clear() {
    this.context.globalState.update("workspaces", []);
    this.context.globalState.update("projects", []);
  }
}

export default GlobalStoreManager;
