import { ExtensionContext, window, workspace } from "vscode";

export function registerWelcomeMessageHandler(context: ExtensionContext) {
  const config = workspace.getConfiguration("serpent.welcome.message");
  const enableMessage = config.get<boolean>("enabled", false);

  if (enableMessage) {
    const message = config.get<string>("string", "Welcome");
    const emoji = config.get<string>("emoji", "🎉");

    window.showInformationMessage(`${message} ${emoji}`);
  }
}
