import EventSource = require("eventsource");
import { ExtensionContext, window } from "vscode";
import { getToken, isTokenExpired } from "./general-util";
import { CustomEvent } from "./custom-event";
import { MessageType } from "../types/message-type";
import { jar, login } from "./api-client";
require("dotenv").config();

export const registerSse = async (context: ExtensionContext) => {
  try {
    const token = await getToken(context);
    const tokenExpired = await isTokenExpired(context);

    if (!token || tokenExpired) {
      return;
    }

    await login(context);

    const cookies = await jar.getCookieString(`${process.env.NEXT_SERVER}`);

    const eventSource = new EventSource(`${process.env.NEXT_SERVER}/api/sse`, {
      headers: {
        cookie: cookies,
      },
    });

    eventSource.onmessage = (event) => {
      window.showInformationMessage(event.data);
    };

    eventSource.onerror = (error) => {
      window.showErrorMessage("An error occurred with the SSE connection");
      eventSource.close();
    };

    context.subscriptions.push({
      dispose: () => {
        eventSource.close();
      },
    });
  } catch (error) {
    console.error("Failed to register SSE:", error);
    window.showErrorMessage("Failed to register SSE");
  }
};
