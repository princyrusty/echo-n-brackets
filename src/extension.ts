import * as vscode from 'vscode';
import { PoetrySidebarViewProvider } from './PoetrySidebarViewProvider';

export function activate(context: vscode.ExtensionContext) {
  console.log('✨ Echo & Brackets extension is now active!');

  // Sidebar Panel registration
  const sidebarProvider = new PoetrySidebarViewProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      'echoAndBrackets.poetrySidebar',
      sidebarProvider
    )
  );

  // On-save: show floating poetic panel
  const poetryOnSave = vscode.workspace.onDidSaveTextDocument(() => {
    PoeticPanel.createOrShow(context.extensionUri);
  });
  context.subscriptions.push(poetryOnSave);
}

class PoeticPanel {
  public static currentPanel: PoeticPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;

  private constructor(panel: vscode.WebviewPanel) {
    this._panel = panel;
    this._update();
  }

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.ViewColumn.Beside;

    if (PoeticPanel.currentPanel) {
      PoeticPanel.currentPanel._update();
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'poeticPopup',
      'Poetic Pulse 💫',
      column,
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );

    PoeticPanel.currentPanel = new PoeticPanel(panel);

    panel.onDidDispose(() => {
      PoeticPanel.currentPanel = undefined;
    });
  }

  private _update() {
    const echos = this._getPoems();
    const poem = echos[Math.floor(Math.random() * echos.length)];
    this._panel.webview.html = this._getHtmlContent(poem);
  }

  private _getPoems(): string[] {
    return [
      "Code whispers softly,\nIn the glow of midnight light,\nLogic writes our dreams.",
      "Each keystroke is breath,\nEach function a little prayer —\nFor it to just work.",
      "Let logic flow free,\nBut hold it with tender hands —\nBalance art and law.",
      // Add more poems or load from file/resource if needed
    ];
  }

  private _getHtmlContent(poem: string): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            margin: 0;
            padding: 0;
            background: radial-gradient(ellipse at center, #1a1a1a 0%, #0f0f0f 100%);
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #f5f5f5;
            font-family: 'Georgia', serif;
            animation: fadeIn 1.5s ease-in-out;
          }

          .poem-box {
            max-width: 600px;
            padding: 2.5rem 3rem;
            border-radius: 20px;
            background: #222;
            border: 2px dashed #6c6cff;
            text-align: center;
            font-size: 1.8rem;
            line-height: 2.6rem;
            box-shadow: 0 0 25px rgba(255, 255, 255, 0.1);
            transform: scale(0.92);
            animation: popUp 0.8s ease-out forwards;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes popUp {
            0% { opacity: 0; transform: scale(0.85); }
            100% { opacity: 1; transform: scale(1); }
          }
        </style>
      </head>
      <body>
        <div class="poem-box">
          ${poem.replace(/\n/g, '<br>')}
        </div>
      </body>
      </html>
    `;
  }
}

export function deactivate() {}