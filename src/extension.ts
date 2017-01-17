'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as Q from 'q';
import * as mkdirp from 'mkdirp';

function createFile(newFileName): Q.Promise<string> {
	const deferred: Q.Deferred<string> = Q.defer<string>();
	let dirname: string = path.dirname(newFileName);
	let fileExists: boolean = fs.existsSync(newFileName);

	if (!fileExists) {
		mkdirp.sync(dirname);

		fs.appendFile(newFileName, '', (err) => {
			if (err) {
				deferred.reject(err);
				return;
			}

			deferred.resolve(newFileName);
		});
	} else {
		deferred.resolve(newFileName);
	}

	return deferred.promise;
}

function openFileInEditor(fileName): Q.Promise<TextEditor> {
	const deferred: Q.Deferred<TextEditor> = Q.defer<TextEditor>();

	vscode.workspace.openTextDocument(fileName).then((textDocument) => {
		if (!textDocument) {
			deferred.reject(new Error('Could not open file!'));
			return;
		}

		vscode.window.showTextDocument(textDocument).then((editor) => {
			if (!editor) {
				deferred.reject(new Error('Could not show document!'));
				return;
			}

			deferred.resolve(editor);
		});
	});
}

function getFolder(): string {
	var currentEditor = vscode.window.activeTextEditor;
	var currentFolder;

	if (currentEditor != undefined) {
		var filename = currentEditor.document.fileName;

		console.log("Current editor found, filename:" + filename);
		var tmp = filename.split("/");
		tmp.splice(tmp.length - 1, 1);
		currentFolder = tmp.join("/");
	}
	else {
		currentFolder = vscode.workspace.rootPath;

		console.log("No editor found, rootPath");
	}
	currentFolder += "/";
	console.log("Current folder: " + currentFolder)
	return currentFolder;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "basiccpp" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let classCommand = vscode.commands.registerCommand('basiccpp.class', () => {
		var folder = getFolder();
		const config = vscode.workspace.getConfiguration('basiccpp');

		vscode.window.showInputBox(
			{
				prompt: "Class name:",
				ignoreFocusOut: true
			}
		).then(name => {

			var cppName = name + "." + config.get('cppExtension');
			var hppName = name + "." + config.get('hppExtension');
			var cppPath = folder + cppName;
			var hppPath = folder + hppName;


			createFile(cppPath).then((fileName) => {
				const deferred: Q.Deferred<TextEditor> = Q.defer<TextEditor>();

				vscode.workspace.openTextDocument(fileName).then((textDocument) => {
					if (!textDocument) {
						deferred.reject(new Error('Could not open file!'));
						return;
					}

					vscode.window.showTextDocument(textDocument).then((editor) => {
						if (!editor) {
							deferred.reject(new Error('Could not show document!'));
							return;
						}

						deferred.resolve(editor);

						var cppFile = editor;
						if (cppFile !== undefined) {
							cppFile.edit(function (edit) {
								edit.insert(new vscode.Position(0, 0),
									`#include "${hppName}"

${name}::${name}()
{
}

${name}::${name}(${name} const &other)
{
}

${name}::~${name}()
{
}

${name} &${name}::operator=(${name} const &other)
{
  if (this != &other)
  {
  }
  return (*this);
}
`);
							});
						}
					});
				});
			})


			createFile(hppPath).then((fileName) => {
				const deferred: Q.Deferred<TextEditor> = Q.defer<TextEditor>();

				vscode.workspace.openTextDocument(fileName).then((textDocument) => {
					if (!textDocument) {
						deferred.reject(new Error('Could not open file!'));
						return;
					}

					vscode.window.showTextDocument(textDocument).then((editor) => {
						if (!editor) {
							deferred.reject(new Error('Could not show document!'));
							return;
						}

						deferred.resolve(editor);

						var hppFile = editor;
						var headGuard = hppName.toUpperCase().replace(".", "_") + "_";

						if (hppFile !== undefined) {
							hppFile.edit(function (edit) {
								edit.insert(new vscode.Position(0, 0),
									`#ifndef ${headGuard}
#define ${headGuard}

class ${name}
{
	public:
	${name}();
	${name}(${name} const &other);
	~${name}();

	${name} &operator=(${name} const &other);
	private:
};

#endif // !${headGuard}`);
							});
						}
					});

				});
			});
		});
	});

	context.subscriptions.push(classCommand);

	let abstractCommand = vscode.commands.registerCommand('basiccpp.abstract', () => {
		var folder = getFolder();
		const config = vscode.workspace.getConfiguration('basiccpp');

		vscode.window.showInputBox(
			{
				prompt: "Abstract Class name:",
				ignoreFocusOut: true
			}
		).then(name => {

			var cppName = name + "." + config.get('cppExtension');
			var hppName = name + "." + config.get('hppExtension');
			var cppPath = folder + cppName;
			var hppPath = folder + hppName;


			createFile(cppPath).then((fileName) => {
				const deferred: Q.Deferred<TextEditor> = Q.defer<TextEditor>();

				vscode.workspace.openTextDocument(fileName).then((textDocument) => {
					if (!textDocument) {
						deferred.reject(new Error('Could not open file!'));
						return;
					}

					vscode.window.showTextDocument(textDocument).then((editor) => {
						if (!editor) {
							deferred.reject(new Error('Could not show document!'));
							return;
						}

						deferred.resolve(editor);

						var cppFile = editor;
						if (cppFile !== undefined) {
							cppFile.edit(function (edit) {
								edit.insert(new vscode.Position(0, 0),
									`#include "${hppName}"

${name}::${name}()
{
}

${name}::${name}(${name} const &other)
{
}

${name}::~${name}()
{
}

${name} &${name}::operator=(${name} const &other)
{
  if (this != &other)
  {
  }
  return (*this);
}
`);
							});
						}
					});
				});
			})


			createFile(hppPath).then((fileName) => {
				const deferred: Q.Deferred<TextEditor> = Q.defer<TextEditor>();

				vscode.workspace.openTextDocument(fileName).then((textDocument) => {
					if (!textDocument) {
						deferred.reject(new Error('Could not open file!'));
						return;
					}

					vscode.window.showTextDocument(textDocument).then((editor) => {
						if (!editor) {
							deferred.reject(new Error('Could not show document!'));
							return;
						}

						deferred.resolve(editor);

						var hppFile = editor;
						var headGuard = hppName.toUpperCase().replace(".", "_") + "_";

						if (hppFile !== undefined) {
							hppFile.edit(function (edit) {
								edit.insert(new vscode.Position(0, 0),
									`#ifndef ${headGuard}
#define ${headGuard}

class ${name}
{
	public:
	${name}();
	${name}(${name} const &other);
	~${name}() = 0;

	${name} &operator=(${name} const &other);
	private:
};

#endif // !${headGuard}`);
							});
						}
					});

				});
			});
		});
	});

	context.subscriptions.push(abstractCommand);

	let interfaceCommand = vscode.commands.registerCommand('basiccpp.interface', () => {
		var folder = getFolder();
		const config = vscode.workspace.getConfiguration('basiccpp');

		vscode.window.showInputBox(
			{
				prompt: "Interface name:",
				ignoreFocusOut: true
			}
		).then(name => {

			var hppName = name + "." + config.get('hppExtension');
			var hppPath = folder + hppName;



			createFile(hppPath).then((fileName) => {
				const deferred: Q.Deferred<TextEditor> = Q.defer<TextEditor>();

				vscode.workspace.openTextDocument(fileName).then((textDocument) => {
					if (!textDocument) {
						deferred.reject(new Error('Could not open file!'));
						return;
					}

					vscode.window.showTextDocument(textDocument).then((editor) => {
						if (!editor) {
							deferred.reject(new Error('Could not show document!'));
							return;
						}

						deferred.resolve(editor);

						var hppFile = editor;
						var headGuard = hppName.toUpperCase().replace(".", "_") + "_";

						if (hppFile !== undefined) {
							hppFile.edit(function (edit) {
								edit.insert(new vscode.Position(0, 0),
									`#ifndef ${headGuard}
#define ${headGuard}

class ${name}
{
	public:
	~${name}() = 0;
};

#endif // !${headGuard}`);
							});
						}
					});

				});
			});
		});
	});

	context.subscriptions.push(interfaceCommand);
}

// this method is called when your extension is deactivated
export function deactivate() {
}