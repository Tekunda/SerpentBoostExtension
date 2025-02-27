import { ExtensionContext, window } from "vscode";
import { CustomEvent } from "../utils/custom-event";
import { MessageType } from "../types/message-type";

export function registerCallbackHandler(context: ExtensionContext) {
  const handleUri = async (uri: any) => {
    const queryParams = new URLSearchParams(uri.query);
    if (!queryParams.has("token") || !queryParams.get("expires")) {
      return;
    }
    await context.secrets.store(
      "serpent-token",
      queryParams.get("token") as string
    );
    await context.secrets.store(
      "serpent-token-expires",
      queryParams.get("expires") as string
    );
    CustomEvent.customEvent.publish({ type: MessageType.DISABLE_BTN });
    CustomEvent.customEvent.publish({ type: MessageType.REFRESH_EVENT });
  };

  context.subscriptions.push(
    window.registerUriHandler({
      handleUri,
    })
  );
}
