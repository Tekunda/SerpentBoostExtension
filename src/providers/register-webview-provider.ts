import {
  CancellationToken,
  ExtensionContext,
  Uri,
  Webview,
  WebviewView,
  WebviewViewProvider,
  WebviewViewResolveContext,
  window,
} from "vscode";
import { CustomEvent } from "../utils/custom-event";
import * as path from "path";
import * as fs from "fs";
import {
  getToken,
  isTokenExpired,
  openLoginRegisterPage,
} from "../utils/general-util";
import { MessageType } from "../types/message-type";

export function registerWebViewProvider(context: ExtensionContext) {
  const provider = new SidebarWebViewProvider(context.extensionUri, context);
  context.subscriptions.push(
    window.registerWebviewViewProvider("serpentWelcome", provider)
  );
}

export class SidebarWebViewProvider implements WebviewViewProvider {
  constructor(
    private readonly _extensionUri: Uri,
    public extensionContext: ExtensionContext
  ) {
    CustomEvent.customEvent.subscribe((data: any) => {
      if (data?.type === MessageType.DISABLE_BTN) {
        this.sendMessageToWebview({ type: MessageType.DISABLE_BTN });
      }
    });
  }
  view?: WebviewView;

  async resolveWebviewView(
    webviewView: WebviewView,
    webViewContext: WebviewViewResolveContext,
    token: CancellationToken
  ) {
    this.view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    const secToken = await getToken(this.extensionContext);
    const tokenExpired = await isTokenExpired(this.extensionContext);
    if (secToken && !tokenExpired) {
      this.sendMessageToWebview({ type: "DISABLE_BTN" });
    } else {
      this.sendMessageToWebview({
        type: "ENABLE_BTN",
      });
    }

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case MessageType.LOGIN_REGISTER: {
          openLoginRegisterPage();
          break;
        }
        case MessageType.INFO: {
          window.showInformationMessage(data.value);
          break;
        }
        case MessageType.WARNING: {
          window.showWarningMessage(data.value);
          break;
        }
        case MessageType.ERROR: {
          window.showErrorMessage(data.value);
          break;
        }
      }
    });
  }

  private _getHtmlForWebview(webview: Webview) {
    const manifestPath = path.join(
      this._extensionUri.fsPath,
      "serpent-extension-ui",
      "dist",
      ".vite",
      "manifest.json"
    );
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

    const scriptUri = webview.asWebviewUri(
      Uri.joinPath(
        this._extensionUri,
        "serpent-extension-ui",
        "dist",
        "assets",
        manifest["index.html"].file.split("/").pop()
      )
    );
    const cssUri = webview.asWebviewUri(
      Uri.joinPath(
        this._extensionUri,
        "serpent-extension-ui",
        "dist",
        "assets",
        manifest["index.html"].css.pop().split("/")[1]
      )
    );

    const scriptUriJs = webview.asWebviewUri(
      Uri.joinPath(this._extensionUri, "media", "js", "onboarding.js")
    );

    const scriptUriCss = webview.asWebviewUri(
      Uri.joinPath(this._extensionUri, "media", "css", "onboarding.css")
    );

    return `<html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Onboarding</title>
        <link rel="stylesheet" type="text/css" href="${scriptUriCss}">
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root"></div>
        <script src="${scriptUriJs}"></script>
        <div class="container" />
      </body>
    </html>`;
  }

  private sendMessageToWebview(message: any) {
    if (this.view) {
      this.view.webview.postMessage(message);
    }
  }
}
