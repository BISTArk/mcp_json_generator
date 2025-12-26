import { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MCPCard } from './MCPCard';
import type { MCPSelection } from '@/types/mcp';

interface MCPListProps {
  mcps: MCPSelection[];
  onToggle: (id: string) => void;
  onEnvChange: (id: string, envKey: string, value: string) => void;
  onDelete: (id: string) => void;
}

const categories = [
  { id: 'all', label: 'All' },
  { id: 'core', label: 'Core' },
  { id: 'data', label: 'Data' },
  { id: 'dev', label: 'Dev Tools' },
  { id: 'ai', label: 'AI' },
  { id: 'custom', label: 'Custom' },
];

export function MCPList({ mcps, onToggle, onEnvChange, onDelete }: MCPListProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredMCPs = useMemo(() => {
    return mcps.filter((mcp) => {
      const matchesSearch = 
        mcp.name.toLowerCase().includes(search.toLowerCase()) ||
        mcp.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'all' || mcp.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [mcps, search, activeCategory]);

  const selectedCount = mcps.filter(m => m.selected).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search MCPs..."
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-muted-foreground" />
          <div className="flex gap-1 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveCategory(cat.id)}
                className="whitespace-nowrap"
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {selectedCount > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg">
          <Badge variant="secondary" className="bg-primary/20 text-primary">
            {selectedCount} MCP{selectedCount !== 1 ? 's' : ''} selected
          </Badge>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMCPs.map((mcp) => (
          <MCPCard
            key={mcp.id}
            mcp={mcp}
            onToggle={onToggle}
            onEnvChange={onEnvChange}
            onDelete={mcp.isCustom ? onDelete : undefined}
          />
        ))}
      </div>

      {filteredMCPs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No MCPs found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
