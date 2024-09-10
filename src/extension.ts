import { commands, ExtensionContext, window } from "vscode";
import { registerCallbackHandler } from "./handlers/callback-handler";
import { registerCommands } from "./commands/commands";
import { registerWelcomeMessageHandler } from "./handlers/welcome-message-handler";
import { CustomEvent } from "./utils/custom-event";
import { registerProjectProvider } from "./providers/project-data-provider";
import { registerWebViewProvider } from "./providers/register-webview-provider";
import { registerWorkspacesDataProvider } from "./providers/workspaces-data-provider";
import { registerSse } from "./utils/sse";
import { MessageType } from "./types/message-type";
import { registerActionsViewProvider } from "./providers/actions-view-provider";

export async function activate(context: ExtensionContext) {
  // const op = window.createOutputChannel("InfinitePOC");
  await context.secrets.delete("serpent-token");
  await context.secrets.delete("serpent-token-expires");
  // registerProjectProvider(context);

  registerCommands(context);
  registerWelcomeMessageHandler(context);
  registerWebViewProvider(context);
  registerWorkspacesDataProvider(context);
  registerCallbackHandler(context);
  registerSse(context);
  registerActionsViewProvider(context);

  CustomEvent.customEvent.subscribe((data: any) => {
    if (data?.type === MessageType.REFRESH_EVENT) {
      registerSse(context);
    }
  });
}

export function deactivate() {}
