"use strict";

import vscode = require("vscode");
import cp = require("child_process");

export class Pub {
	private pubCmd : string;

	constructor() {
		this.pubCmd = vscode.workspace.getConfiguration("dart")["pubPath"];
		console.log("PubPath: " + this.pubCmd);
	}

	runGet() {
		vscode.window.showInformationMessage("Pub get starting...");
		cp.exec(this.pubCmd + " get", (err, stdout : Buffer, stderr : Buffer) => {
			console.log(stdout.toString());
			console.log(err);
			if (err != null) {
				let error = stderr.toString();
				if (error.includes("file named \"pubspec.yaml\"")) {
					vscode.window.showErrorMessage("Could not find a file named 'pubspec.yaml'");
				}
			} else {
				vscode.window.showInformationMessage("Pub get finish.");
			}
		});
	}

	runBuild(mode : string) {
		vscode.window.showInformationMessage("Pub Build finish.");
		cp.exec(this.pubCmd + " build" + " --format json" +" --mode " + mode, (err, stdout : Buffer, stderr : Buffer) => {
			console.log(stdout.toString());
			console.log(err);
			if (err != null) {
				let error = stderr.toString();
				if (error.includes("file named \"pubspec.yaml\"")) {
					vscode.window.showErrorMessage("Could not find a file named 'pubspec.yaml'");
				} else {
					vscode.window.showErrorMessage("Error during the build process in mode " + mode);
				}
			} else {
				vscode.window.showInformationMessage("Pub build in " + mode + " mode finish.");
			}
		});
	}

	setPubCmd(context: vscode.ExtensionContext) {
		console.log("Set pub cmd");
		context.subscriptions.push(vscode.commands.registerCommand("dart.pubGet", 			 () => this.runGet()));
		context.subscriptions.push(vscode.commands.registerCommand("dart.pubBuild", 		 () => this.runBuild("release")));
		context.subscriptions.push(vscode.commands.registerCommand("dart.pubBuildDebug", () => this.runBuild("debug")));
}
}