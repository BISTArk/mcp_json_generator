import { useState, useEffect } from 'react';
import { Plus, Sparkles, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MCPList } from '@/components/MCPList';
import { AddMCPForm } from '@/components/AddMCPForm';
import { ConfigPreview } from '@/components/ConfigPreview';
import { Instructions } from '@/components/Instructions';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { MCP, MCPSelection } from '@/types/mcp';

function App() {
  const [presetMCPs, setPresetMCPs] = useState<MCP[]>([]);
  const [customMCPs, setCustomMCPs] = useLocalStorage<MCP[]>('custom-mcps', []);
  const [selections, setSelections] = useState<MCPSelection[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load preset MCPs
  useEffect(() => {
    fetch('/mcps.json')
      .then((res) => res.json())
      .then((data) => {
        setPresetMCPs(data.mcps);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load MCPs:', err);
        setLoading(false);
      });
  }, []);

  // Merge preset and custom MCPs into selections
  useEffect(() => {
    const allMCPs = [...presetMCPs, ...customMCPs.map(m => ({ ...m, isCustom: true }))];
    
    setSelections((prev) => {
      return allMCPs.map((mcp) => {
        const existing = prev.find((s) => s.id === mcp.id);
        return {
          ...mcp,
          selected: existing?.selected ?? false,
          envValues: existing?.envValues ?? {},
        };
      });
    });
  }, [presetMCPs, customMCPs]);

  const handleToggle = (id: string) => {
    setSelections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s))
    );
  };

  const handleEnvChange = (id: string, envKey: string, value: string) => {
    setSelections((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, envValues: { ...s.envValues, [envKey]: value } }
          : s
      )
    );
  };

  const handleAddMCP = (mcp: MCP) => {
    setCustomMCPs((prev) => [...prev, mcp]);
  };

  const handleDeleteMCP = (id: string) => {
    setCustomMCPs((prev) => prev.filter((m) => m.id !== id));
    setSelections((prev) => prev.filter((s) => s.id !== id));
  };

  const hasSelections = selections.some((s) => s.selected);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading MCPs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23334155%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50 pointer-events-none" />
      
      <div className="relative">
        {/* Header */}
        <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
                  <Sparkles className="text-primary" size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">MCP Config Generator</h1>
                  <p className="text-sm text-muted-foreground">Build your perfect MCP setup</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button onClick={() => setShowAddForm(true)} variant="outline" className="gap-2">
                  <Plus size={18} />
                  <span className="hidden sm:inline">Add Custom</span>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <a
                    href="https://github.com/modelcontextprotocol/servers"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="MCP Servers Repository"
                  >
                    <Github size={20} />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* MCP Selection */}
            <div className="lg:col-span-3 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">Available MCPs</h2>
                <p className="text-sm text-muted-foreground">
                  Select the MCP servers you want to include in your configuration
                </p>
              </div>
              <MCPList
                mcps={selections}
                onToggle={handleToggle}
                onEnvChange={handleEnvChange}
                onDelete={handleDeleteMCP}
              />
            </div>

            {/* Config & Instructions */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">Generated Config</h2>
                <p className="text-sm text-muted-foreground">
                  Copy or download your configuration file
                </p>
              </div>
              <ConfigPreview selections={selections} />
              <Instructions hasSelections={hasSelections} />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-muted-foreground">
              Built for the{' '}
              <a
                href="https://modelcontextprotocol.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Model Context Protocol
              </a>{' '}
              community
            </p>
          </div>
        </footer>
      </div>

      {/* Add MCP Modal */}
      <AddMCPForm open={showAddForm} onAdd={handleAddMCP} onClose={() => setShowAddForm(false)} />
    </div>
  );
}

export default App;
