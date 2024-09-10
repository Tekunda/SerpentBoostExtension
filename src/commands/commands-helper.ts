import {
  commands,
  ExtensionContext,
  ProgressLocation,
  Uri,
  window,
} from "vscode";
import GlobalStoreManager from "../utils/global-store";
import { createScratchOrg } from "../utils/api-client";
require("dotenv").config();

export function openWorkspaceHelper(arg: any) {
  if (!arg.command?.arguments) {
    return;
  }
  const workspaceName = arg.command?.arguments[0];
  commands.executeCommand(
    "vscode.open",
    Uri.parse(`${process.env.NEXT_SERVER}/${workspaceName}`)
  );
}

export function openProjectHelper(arg: any) {
  if (!arg.command?.arguments) {
    return;
  }
  const [workspaceName, projectName] = arg.command?.arguments;
  commands.executeCommand(
    "vscode.open",
    Uri.parse(`${process.env.NEXT_SERVER}/${workspaceName}/${projectName}`)
  );
}

export async function createScratchOrgHelper(context: ExtensionContext) {
  const globalStore = GlobalStoreManager.getInstance(context);

  const projects = globalStore.projects.map((project) => ({
    label: project.name,
    id: project._id,
    configNames: project.configurations.map((config: any) => config.name) || [],
    workspaceId: project.workspace_info._id,
  }));

  const selectedProject = await window.showQuickPick(projects, {
    placeHolder: "Select a project",
  });

  if (!selectedProject) {
    window.showErrorMessage("No project selected");
    return;
  }

  if (selectedProject.configNames.length === 0) {
    window.showErrorMessage(
      "No configurations available for the selected project"
    );
    return;
  }

  const selectedConfig = await window.showQuickPick(
    selectedProject.configNames,
    {
      placeHolder: "Select a configuration",
    }
  );

  if (!selectedConfig) {
    window.showErrorMessage("No configuration selected");
    return;
  }

  const alias = await window.showInputBox({
    placeHolder: "Enter an alias (optional)",
  });

  const body = {
    configuration_name: selectedConfig,
    project_id: selectedProject.id,
    validity: 7,
    scratch_org_alias: alias,
  };

  await window.withProgress(
    {
      location: ProgressLocation.Notification,
      title: "Creating Scratch Org...",
      cancellable: false,
    },
    async () => {
      try {
        await createScratchOrg(context, body, selectedProject.workspaceId);
        window.showInformationMessage(
          `Scratch Org created for project: ${selectedProject.label}`
        );
      } catch (error: any) {
        window.showErrorMessage(
          `Failed to create Scratch Org: ${error?.message}`
        );
      }
    }
  );
}
