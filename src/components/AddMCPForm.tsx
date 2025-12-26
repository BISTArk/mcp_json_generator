import { useState } from 'react';
import { Plus, X, HelpCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import type { MCP, MCPEnvVar } from '@/types/mcp';

interface AddMCPFormProps {
  open: boolean;
  onAdd: (mcp: MCP) => void;
  onClose: () => void;
}

export function AddMCPForm({ open, onAdd, onClose }: AddMCPFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [command, setCommand] = useState('npx');
  const [args, setArgs] = useState('');
  const [envVars, setEnvVars] = useState<MCPEnvVar[]>([]);
  const [newEnvName, setNewEnvName] = useState('');
  const [newEnvRequired, setNewEnvRequired] = useState(true);

  const handleAddEnvVar = () => {
    if (!newEnvName.trim()) return;
    setEnvVars([
      ...envVars,
      {
        name: newEnvName.trim().toUpperCase().replace(/\s+/g, '_'),
        description: '',
        required: newEnvRequired,
      },
    ]);
    setNewEnvName('');
    setNewEnvRequired(true);
  };

  const handleRemoveEnvVar = (index: number) => {
    setEnvVars(envVars.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !command.trim()) return;

    const id = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const argsArray = args.trim() ? args.split(/\s+/) : [];
    
    const env: Record<string, string> = {};
    envVars.forEach((ev) => {
      env[ev.name] = '';
    });

    const newMcp: MCP = {
      id: `custom-${id}-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || 'Custom MCP server',
      command: command.trim(),
      args: argsArray,
      env,
      envVars,
      category: 'custom',
      isCustom: true,
    };

    onAdd(newMcp);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setCommand('npx');
    setArgs('');
    setEnvVars([]);
    setNewEnvName('');
    setNewEnvRequired(true);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Custom MCP</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Custom MCP"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this MCP do?"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="command">
                Command <span className="text-destructive">*</span>
              </Label>
              <Input
                id="command"
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="npx"
                required
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="args">Arguments</Label>
              <Input
                id="args"
                type="text"
                value={args}
                onChange={(e) => setArgs(e.target.value)}
                placeholder="-y @my/server --option"
              />
              <p className="text-xs text-muted-foreground">Space-separated list of arguments</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label>Environment Variables</Label>
              <HelpCircle size={14} className="text-muted-foreground" />
            </div>
            
            {envVars.length > 0 && (
              <div className="space-y-2">
                {envVars.map((ev, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 bg-secondary/50 border rounded-lg"
                  >
                    <code className="flex-1 text-sm text-primary">{ev.name}</code>
                    {ev.required && (
                      <Badge variant="outline" className="text-xs text-destructive border-destructive/30">
                        required
                      </Badge>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleRemoveEnvVar(index)}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                type="text"
                value={newEnvName}
                onChange={(e) => setNewEnvName(e.target.value)}
                placeholder="ENV_VAR_NAME"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddEnvVar();
                  }
                }}
              />
              <div className="flex items-center gap-2 px-3">
                <Checkbox
                  id="env-required"
                  checked={newEnvRequired}
                  onCheckedChange={(checked) => setNewEnvRequired(checked as boolean)}
                />
                <Label htmlFor="env-required" className="text-sm text-muted-foreground cursor-pointer">
                  Required
                </Label>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={handleAddEnvVar}
                disabled={!newEnvName.trim()}
              >
                <Plus size={18} />
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || !command.trim()}>
              Add MCP
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
