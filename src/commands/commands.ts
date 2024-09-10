import { commands, ExtensionContext } from "vscode";
import { openBrowser } from "../utils/general-util";
import {
  createScratchOrgHelper,
  openProjectHelper,
  openWorkspaceHelper,
} from "./commands-helper";

export function registerCommands(context: ExtensionContext) {
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
