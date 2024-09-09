import axios from "axios";
import { commands, ExtensionContext, Uri, workspace } from "vscode";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { getToken } from "./general-util";

export const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

export const fetchWorkSpaces = async (context: ExtensionContext) => {
  try {
    const token = await getToken(context);
    const workspaces = await axios.get("http://127.0.0.1:5679/workspace", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = workspaces.data.data;
    return data;
  } catch (error) {
    return [];
  }
};

export const fetchProjects = async (
  context: ExtensionContext,
  workspaceId: string
) => {
  try {
    const token = await getToken(context);
    const projects = await axios.get("http://127.0.0.1:5679/project", {
      headers: {
        workspace_id: workspaceId,
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = projects.data.data;
    return data;
  } catch (error) {
    return [];
  }
};

export const fetchOrgs = async (
  context: ExtensionContext,
  workspaceName: string,
  workspaceId: string
) => {
  try {
    const token = await getToken(context);
    const orgs = await axios.get(
      `http://127.0.0.1:5679/org?workspace_name=${workspaceName}`,
      {
        headers: {
          workspace_id: workspaceId,
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = orgs.data.data;
    return data;
  } catch (error) {
    return [];
  }
};

export const login = async (context: ExtensionContext) => {
  try {
    const token = await getToken(context);
    const result = await client.post("http://localhost:3000/api/login", null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return result.data;
  } catch (error) {}
};

export const createScratchOrg = async (
  context: ExtensionContext,
  body: any,
  workspaceId: string
) => {
  try {
    const token = await getToken(context);
    const result = await axios.post("http://127.0.0.1:5679/scratchorg", body, {
      headers: {
        Authorization: `Bearer ${token}`,
        workspace_id: workspaceId,
      },
    });
    return result.data;
  } catch (error) {}
};
