import { Check, ExternalLink, Settings, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { MCPSelection } from '@/types/mcp';

interface MCPCardProps {
  mcp: MCPSelection;
  onToggle: (id: string) => void;
  onEnvChange: (id: string, envKey: string, value: string) => void;
  onDelete?: (id: string) => void;
}

const categoryVariants: Record<string, string> = {
  core: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/30',
  data: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30',
  dev: 'bg-violet-500/20 text-violet-400 border-violet-500/30 hover:bg-violet-500/30',
  ai: 'bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30',
  custom: 'bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500/30',
};

export function MCPCard({ mcp, onToggle, onEnvChange, onDelete }: MCPCardProps) {
  const hasEnvVars = mcp.envVars && mcp.envVars.length > 0;
  
  return (
    <Card
      className={cn(
        'transition-all duration-200',
        mcp.selected
          ? 'border-primary/50 bg-primary/5 shadow-lg shadow-primary/10'
          : 'hover:border-muted-foreground/30 hover:bg-secondary/50'
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="font-semibold text-foreground truncate">{mcp.name}</h3>
              <Badge variant="outline" className={cn('text-xs', categoryVariants[mcp.category])}>
                {mcp.category}
              </Badge>
              {mcp.isCustom && (
                <Badge variant="outline" className="text-xs">
                  custom
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{mcp.description}</p>
          </div>
          
          <div className="flex items-center gap-2">
            {mcp.isCustom && onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(mcp.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 size={16} />
              </Button>
            )}
            <Button
              variant={mcp.selected ? 'default' : 'secondary'}
              size="icon"
              onClick={() => onToggle(mcp.id)}
              className="h-10 w-10"
            >
              <Check size={20} className={cn(mcp.selected ? 'opacity-100' : 'opacity-0')} />
            </Button>
          </div>
        </div>

        {mcp.docsUrl && (
          <a
            href={mcp.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-3 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <ExternalLink size={12} />
            Documentation
          </a>
        )}

        {mcp.selected && hasEnvVars && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
              <Settings size={14} />
              <span>Environment Variables</span>
            </div>
            <div className="space-y-3">
              {mcp.envVars!.map((envVar) => (
                <div key={envVar.name}>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">
                    {envVar.name}
                    {envVar.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  <Input
                    type="text"
                    value={mcp.envValues[envVar.name] || ''}
                    onChange={(e) => onEnvChange(mcp.id, envVar.name, e.target.value)}
                    placeholder={envVar.default || envVar.description}
                    className="h-9 text-sm"
                  />
                  {envVar.description && (
                    <p className="mt-1 text-xs text-muted-foreground">{envVar.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
