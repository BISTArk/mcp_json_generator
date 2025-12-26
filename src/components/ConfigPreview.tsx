import { useState } from 'react';
import { Copy, Check, Download, Monitor, Code2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { MCPSelection, ConfigTarget } from '@/types/mcp';
import { generateConfigString, getVSCodeSettingsSnippet } from '@/utils/configGenerator';

interface ConfigPreviewProps {
  selections: MCPSelection[];
}

export function ConfigPreview({ selections }: ConfigPreviewProps) {
  const [target, setTarget] = useState<ConfigTarget>('cursor');
  const [copied, setCopied] = useState(false);

  const selectedMCPs = selections.filter(m => m.selected);
  const configString = target === 'vscode' 
    ? getVSCodeSettingsSnippet(selections)
    : generateConfigString(selections, target);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(configString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = target === 'cursor' ? 'mcp.json' : 'settings-mcp-snippet.json';
    const blob = new Blob([configString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (selectedMCPs.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Code2 className="mx-auto mb-4 text-muted-foreground" size={48} />
          <p className="text-muted-foreground">Select MCPs from the list to generate your configuration</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
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
          
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              {copied ? <Check size={16} className="text-success mr-2" /> : <Copy size={16} className="mr-2" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDownload}>
              <Download size={16} className="mr-2" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <ScrollArea className="h-[300px] rounded-lg border bg-secondary/30">
          <pre className="p-4 text-sm leading-relaxed">
            <code>
              {configString.split('\n').map((line, i) => (
                <div key={i} className="flex">
                  <span className="select-none w-8 text-right mr-4 text-muted-foreground/50">{i + 1}</span>
                  <span>{highlightJson(line)}</span>
                </div>
              ))}
            </code>
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function highlightJson(line: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const stringRegex = /"([^"\\]|\\.)*"/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = stringRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <span key={key++} className="text-muted-foreground">
          {line.slice(lastIndex, match.index)}
        </span>
      );
    }
    
    const str = match[0];
    const afterMatch = line.slice(match.index + str.length).trimStart();
    if (afterMatch.startsWith(':')) {
      parts.push(
        <span key={key++} className="text-primary">
          {str}
        </span>
      );
    } else {
      parts.push(
        <span key={key++} className="text-warning">
          {str}
        </span>
      );
    }
    
    lastIndex = match.index + str.length;
  }

  if (lastIndex < line.length) {
    parts.push(
      <span key={key++} className="text-muted-foreground">
        {line.slice(lastIndex)}
      </span>
    );
  }

  return parts.length > 0 ? parts : line;
}
