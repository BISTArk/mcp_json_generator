import { useState } from 'react';
import { Terminal, Folder, FileJson, AlertCircle, CheckCircle2, Monitor, Code2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { ConfigTarget } from '@/types/mcp';
import { getConfigFilePath } from '@/utils/configGenerator';

interface InstructionsProps {
  hasSelections: boolean;
}

type OS = 'macos' | 'windows' | 'linux';

export function Instructions({ hasSelections }: InstructionsProps) {
  const [target, setTarget] = useState<ConfigTarget>('cursor');
  const [os, setOs] = useState<OS>('macos');

  const filePath = getConfigFilePath(target, os);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Setup Instructions</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Target selector */}
        <div className="flex flex-wrap gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Editor</label>
            <Tabs value={target} onValueChange={(v) => setTarget(v as ConfigTarget)}>
              <TabsList>
                <TabsTrigger value="cursor" className="gap-2">
                  <Monitor size={16} />
                  Cursor
                </TabsTrigger>
                <TabsTrigger value="vscode" className="gap-2">
                  <Code2 size={16} />
                  VS Code
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Operating System</label>
            <div className="flex gap-1">
              {(['macos', 'windows', 'linux'] as OS[]).map((osOption) => (
                <Button
                  key={osOption}
                  variant={os === osOption ? 'default' : 'secondary'}
                  size="sm"
                  onClick={() => setOs(osOption)}
                >
                  {osOption === 'macos' ? 'macOS' : osOption === 'windows' ? 'Windows' : 'Linux'}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          <Step
            number={1}
            icon={<CheckCircle2 size={18} />}
            title="Select MCPs"
            completed={hasSelections}
          >
            <p className="text-muted-foreground text-sm">
              Choose the MCP servers you want to enable from the list above. Configure any required environment variables.
            </p>
          </Step>

          <Step
            number={2}
            icon={<FileJson size={18} />}
            title={target === 'cursor' ? 'Create the config file' : 'Update settings.json'}
          >
            <p className="text-muted-foreground text-sm mb-3">
              {target === 'cursor' 
                ? 'Copy the generated JSON and save it to:'
                : 'Add the MCP configuration to your VS Code settings.json:'}
            </p>
            <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 border rounded-lg">
              <Folder size={16} className="text-muted-foreground flex-shrink-0" />
              <code className="text-sm text-primary break-all">{filePath}</code>
            </div>
          </Step>

          {target === 'cursor' && (
            <Step number={3} icon={<Terminal size={18} />} title="Open config location">
              <p className="text-muted-foreground text-sm mb-3">
                You can quickly open the config directory using the terminal:
              </p>
              <div className="px-3 py-2 bg-secondary/50 border rounded-lg">
                <code className="text-sm text-warning">
                  {os === 'macos' && 'open ~/.cursor'}
                  {os === 'windows' && 'explorer %APPDATA%\\Cursor'}
                  {os === 'linux' && 'xdg-open ~/.config/cursor'}
                </code>
              </div>
            </Step>
          )}

          {target === 'vscode' && (
            <Step number={3} icon={<Terminal size={18} />} title="Open settings">
              <p className="text-muted-foreground text-sm mb-3">
                Open settings.json using the Command Palette:
              </p>
              <div className="px-3 py-2 bg-secondary/50 border rounded-lg">
                <code className="text-sm text-warning">
                  {os === 'macos' ? '⌘' : 'Ctrl'}+Shift+P → "Preferences: Open User Settings (JSON)"
                </code>
              </div>
            </Step>
          )}

          <Step
            number={4}
            icon={<AlertCircle size={18} />}
            title="Set environment variables"
          >
            <p className="text-muted-foreground text-sm">
              If any of your selected MCPs require API keys or tokens, make sure they're set in your environment or directly in the config. 
              {os === 'macos' || os === 'linux' 
                ? ' Add them to your ~/.zshrc or ~/.bashrc file.'
                : ' Set them in System Properties → Environment Variables.'}
            </p>
          </Step>

          <Step number={5} icon={<CheckCircle2 size={18} />} title="Restart your editor">
            <p className="text-muted-foreground text-sm">
              Restart {target === 'cursor' ? 'Cursor' : 'VS Code'} to load the new MCP configuration. 
              Your MCP servers will start automatically when the editor launches.
            </p>
          </Step>
        </div>
      </CardContent>
    </Card>
  );
}

interface StepProps {
  number: number;
  icon: React.ReactNode;
  title: string;
  completed?: boolean;
  children: React.ReactNode;
}

function Step({ number, icon, title, completed, children }: StepProps) {
  return (
    <div className="flex gap-4">
      <div className={cn(
        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
        completed 
          ? 'bg-success/20 text-success' 
          : 'bg-secondary text-muted-foreground'
      )}>
        {completed ? icon : <span className="text-sm font-medium">{number}</span>}
      </div>
      <div className="flex-1 pt-0.5">
        <h3 className="font-medium text-foreground mb-2">{title}</h3>
        {children}
      </div>
    </div>
  );
}
