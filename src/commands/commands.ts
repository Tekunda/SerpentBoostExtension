import {
  commands,
  env,
  ExtensionContext,
  OutputChannel,
  ProgressLocation,
  Uri,
  window,
  workspace,
} from "vscode";
import { getToken, openBrowser } from "../utils/general-util";
import GlobalStoreManager from "../utils/global-store";
import {
  createScratchOrgHelper,
  openProjectHelper,
  openWorkspaceHelper,
} from "./commands-helper";

export function registerCommands(context: ExtensionContext) {
  // will be removed
  const globalStore = GlobalStoreManager.getInstance(context);

  // will be removed
  context.subscriptions.push(
    commands.registerCommand("serpent-boost.get-token", async () => {
      const token = await getToken(context);
      if (token) {
        window.showInformationMessage(`Token: ${token}`);
      } else {
        window.showInformationMessage("Token not found");
      }
    })
  );

  // will be removed
  context.subscriptions.push(
    commands.registerCommand("serpent-boost.show-store-content", async () => {
      const workspaces = globalStore.workspaces;
      const projects = globalStore.projects;

      window.showInformationMessage(
        `Workspaces: ${JSON.stringify(workspaces, null, 2)}`
      );
      window.showInformationMessage(
        `Projects: ${JSON.stringify(projects, null, 2)}`
      );
    })
  );

  context.subscriptions.push(
    commands.registerCommand("serpent-boost.open-login/register-page", () => {
      openBrowser();
    }),
    commands.registerCommand("serpent-boost.open-workspace", (arg: any) =>
      openWorkspaceHelper(arg)
    ),
    commands.registerCommand("serpent-boost.open-project", (arg: any) =>
      openProjectHelper(arg)
    ),
    commands.registerCommand("serpent-boost.create-scratch-org", async () =>
      createScratchOrgHelper(context)
    )
  );
}
