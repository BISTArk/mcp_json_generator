export interface MCPEnvVar {
  name: string;
  description: string;
  required: boolean;
  default?: string;
}

export interface MCP {
  id: string;
  name: string;
  description: string;
  command: string;
  args: string[];
  env: Record<string, string>;
  envVars?: MCPEnvVar[];
  category: 'core' | 'data' | 'dev' | 'ai' | 'custom';
  docsUrl?: string;
  isCustom?: boolean;
}

export interface MCPSelection extends MCP {
  selected: boolean;
  envValues: Record<string, string>;
}

export interface VSCodeMCPConfig {
  mcpServers: Record<string, {
    command: string;
    args: string[];
    env?: Record<string, string>;
  }>;
}

export interface CursorMCPConfig {
  mcpServers: Record<string, {
    command: string;
    args: string[];
    env?: Record<string, string>;
  }>;
}

export type ConfigTarget = 'vscode' | 'cursor';

