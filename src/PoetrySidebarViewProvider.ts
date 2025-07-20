import * as vscode from 'vscode';

export class PoetrySidebarViewProvider implements vscode.WebviewViewProvider {
  // ✅ This MUST match package.json contributes.views.id
  public static readonly viewType = 'echoAndBrackets.poetrySidebar';

  private _view?: vscode.WebviewView;
  private _currentMood: string = 'default';

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    view: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = view;

    view.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };

    view.webview.html = this._getHtmlForWebview(this._currentMood);

    view.webview.onDidReceiveMessage(message => {
      if (message.command === 'setMood') {
        this._currentMood = message.mood;
        view.webview.html = this._getHtmlForWebview(this._currentMood);
      }
    });
  }

  private _getHtmlForWebview(mood: string): string {
    const echosByMood: Record<string, string[]> = {
      default: [
        "Curly braces hum\nSecrets in electric air —\nA soft loop begins.",
        "While loop whispers on\nIn a dance of logic flow —\nNight does not exist."
      ],
      love: [
        "Your code, like a rose,\nPetals opening in loops —\nI commit to you.",
        "My console.log\nEchoes soft affection now —\nTrue love in TypeScript."
      ],
      chaos: [
        "Infinite loop sings —\nRAM burns with poetic wrath,\nBug-born melodies.",
        "Tabs fight with the space,\nComments scream in silent wars,\nErrors dance with glee."
      ],
      zen: [
        "Whitespace and still minds,\nSemicolons take their breath —\nNothing left to fix.",
        "Echo in the void,\nBrackets curve like gentle waves —\nAll is syntax, peace."
      ]
    };

    const poems = echosByMood[mood] || echosByMood.default;
    const chosen = poems[Math.floor(Math.random() * poems.length)];

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: 'Georgia', serif;
            margin: 0;
            padding: 1rem;
            background: #121212;
            color: #e0e0e0;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.2rem;
          }

          select {
            padding: 0.6rem 1rem;
            border-radius: 10px;
            background: #1e1e1e;
            color: #fff;
            border: 1px solid #666;
            font-size: 1rem;
          }

          .poem {
            max-width: 400px;
            text-align: center;
            font-size: 1.2rem;
            background: #222;
            padding: 1.5rem;
            border-radius: 12px;
            border: 2px dashed #6c6cff;
            animation: fadeIn 0.7s ease-in-out;
            line-height: 1.8rem;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        </style>
      </head>
      <body>
        <h2>🌙 Mood of the Code</h2>
        <select id="moodPicker">
          <option value="default" ${mood === 'default' ? 'selected' : ''}>Default</option>
          <option value="love" ${mood === 'love' ? 'selected' : ''}>Love</option>
          <option value="chaos" ${mood === 'chaos' ? 'selected' : ''}>Chaos</option>
          <option value="zen" ${mood === 'zen' ? 'selected' : ''}>Zen</option>
        </select>
        <div class="poem">${chosen.replace(/\n/g, '<br>')}</div>

        <script>
          const moodPicker = document.getElementById('moodPicker');
          moodPicker.addEventListener('change', () => {
            const vscode = acquireVsCodeApi();
            vscode.postMessage({ command: 'setMood', mood: moodPicker.value });
          });
        </script>
      </body>
      </html>
    `;
  }
}
