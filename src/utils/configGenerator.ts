import type { MCPSelection, VSCodeMCPConfig, CursorMCPConfig, ConfigTarget } from '@/types/mcp';

export function generateConfig(
  selections: MCPSelection[],
  target: ConfigTarget
): VSCodeMCPConfig | CursorMCPConfig {
  const selectedMCPs = selections.filter(mcp => mcp.selected);
  
  const mcpServers: Record<string, {
    command: string;
    args: string[];
    env?: Record<string, string>;
  }> = {};

  for (const mcp of selectedMCPs) {
    const serverConfig: {
      command: string;
      args: string[];
      env?: Record<string, string>;
    } = {
      command: mcp.command,
      args: [...mcp.args],
    };

    // Merge base env with user-provided values
    const envEntries = Object.entries({ ...mcp.env, ...mcp.envValues });
    const nonEmptyEnv = envEntries.filter(([, value]) => value !== '');
    
    if (nonEmptyEnv.length > 0) {
      serverConfig.env = Object.fromEntries(nonEmptyEnv);
    }

    mcpServers[mcp.id] = serverConfig;
  }

  return { mcpServers };
}

export function generateConfigString(
  selections: MCPSelection[],
  target: ConfigTarget
): string {
  const config = generateConfig(selections, target);
  return JSON.stringify(config, null, 2);
}

export function getConfigFilePath(target: ConfigTarget, os: 'macos' | 'windows' | 'linux'): string {
  if (target === 'cursor') {
    switch (os) {
      case 'macos':
        return '~/.cursor/mcp.json';
      case 'windows':
        return '%APPDATA%\\Cursor\\mcp.json';
      case 'linux':
        return '~/.config/cursor/mcp.json';
    }
  } else {
    // VSCode
    switch (os) {
      case 'macos':
        return '~/Library/Application Support/Code/User/settings.json';
      case 'windows':
        return '%APPDATA%\\Code\\User\\settings.json';
      case 'linux':
        return '~/.config/Code/User/settings.json';
    }
  }
}

export function getVSCodeSettingsSnippet(selections: MCPSelection[]): string {
  const config = generateConfig(selections, 'vscode');
  // VSCode needs the config nested under "mcp" key
  return JSON.stringify({ mcp: config }, null, 2);
}

