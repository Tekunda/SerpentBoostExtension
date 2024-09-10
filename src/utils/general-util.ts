import { commands, ExtensionContext, Uri, workspace } from "vscode";
require("dotenv").config();

export function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export const openLoginRegisterPage = () => {
  commands.executeCommand(
    "vscode.open",
    Uri.parse(
      `${process.env.NEXT_SERVER}?callback=vscode://Tekunda.serpent-boost`
    )
  );
};

export async function getToken(
  context: ExtensionContext
): Promise<string | undefined> {
  return await context.secrets.get("serpent-token");
}

export function openBrowser() {
  const sites = workspace
    .getConfiguration()
    .get<string[]>("serpent.open.browser.sites");
  commands.executeCommand(
    "vscode.open",
    Uri.parse(sites ? sites[0] : `https://serpent-test.tekunda.com`)
  );
}

export async function isTokenExpired(context: ExtensionContext) {
  const expiryDate = Number(await context.secrets.get("serpent-token-expires"));
  const currentTime = new Date();
  return new Date(expiryDate) < currentTime;
}
