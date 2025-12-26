# MCP Config Generator

A web app for generating Model Context Protocol (MCP) configuration files for Cursor and VS Code. Select from 36+ popular MCP servers, configure environment variables, and export ready-to-use config files.

![MCP Config Generator](https://img.shields.io/badge/MCP-Config%20Generator-22d3ee?style=for-the-badge)

## Features

- **36+ Preset MCPs** - Popular servers from the [MCP Registry](https://github.com/mcp) including GitHub, Notion, Supabase, Stripe, MongoDB, and more
- **Custom MCP Support** - Add your own MCP servers with custom commands, arguments, and environment variables
- **Multi-Editor Export** - Generate configs for both Cursor (`mcp.json`) and VS Code (`settings.json`)
- **Environment Variables** - Configure required API keys and tokens directly in the UI
- **Copy & Download** - One-click copy to clipboard or download as file
- **Setup Instructions** - Step-by-step guide with OS-specific file paths (macOS, Windows, Linux)
- **Persistent Storage** - Custom MCPs saved to localStorage

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Tech Stack

- **React 18** + TypeScript
- **Vite** for fast development
- **Tailwind CSS v4** for styling
- **shadcn/ui** components
- **Lucide React** icons

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── MCPCard.tsx      # Individual MCP card with env var inputs
│   ├── MCPList.tsx      # Searchable/filterable MCP grid
│   ├── AddMCPForm.tsx   # Modal to add custom MCPs
│   ├── ConfigPreview.tsx # JSON preview with syntax highlighting
│   └── Instructions.tsx  # Setup guide component
├── hooks/
│   └── useLocalStorage.ts
├── lib/
│   └── utils.ts         # cn() utility for class merging
├── types/
│   └── mcp.ts           # TypeScript interfaces
├── utils/
│   └── configGenerator.ts
└── App.tsx
```

## Adding New Preset MCPs

Edit `public/mcps.json` and add an entry:

```json
{
  "id": "my-server",
  "name": "My Server",
  "description": "What it does",
  "command": "npx",
  "args": ["-y", "@my/mcp-server"],
  "env": { "API_KEY": "" },
  "envVars": [
    {
      "name": "API_KEY",
      "description": "Your API key",
      "required": true
    }
  ],
  "category": "dev",
  "docsUrl": "https://..."
}
```

### Categories

- `core` - Essential utilities (Filesystem, Fetch, Time)
- `data` - Databases and data services (PostgreSQL, MongoDB, Notion)
- `dev` - Developer tools (GitHub, Playwright, Terraform)
- `ai` - AI/ML services (Hugging Face, Chroma, Context7)
- `custom` - User-added MCPs

## Theming

The app uses CSS variables for theming. Add a class to `<html>` to switch themes:

```html
<!-- Dark mode (default) -->
<html>

<!-- Light mode -->
<html class="light">

<!-- Color variants -->
<html class="theme-purple">
<html class="theme-green">
<html class="theme-orange">

<!-- Combine -->
<html class="light theme-purple">
```

## Included MCP Servers

| Category | Servers |
|----------|---------|
| **Core** | Filesystem, Fetch, Time, Markitdown |
| **Data** | PostgreSQL, SQLite, MongoDB, Notion, Supabase, Stripe, Elasticsearch, Neon, Google Drive, Slack, Todoist, Monday.com, Atlassian, Apify, Firecrawl |
| **Dev** | GitHub, GitLab, Playwright, Puppeteer, Sentry, Terraform, Azure DevOps, Netdata, Dynatrace, shadcn/ui |
| **AI** | Brave Search, Memory, Sequential Thinking, Context7, Hugging Face, Chroma, EverArt |

## Output Formats

### Cursor (`mcp.json`)

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token"
      }
    }
  }
}
```

### VS Code (`settings.json`)

```json
{
  "mcp": {
    "mcpServers": {
      "github": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-github"],
        "env": {
          "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token"
        }
      }
    }
  }
}
```

## Config File Locations

| OS | Cursor | VS Code |
|----|--------|---------|
| macOS | `~/.cursor/mcp.json` | `~/Library/Application Support/Code/User/settings.json` |
| Windows | `%APPDATA%\Cursor\mcp.json` | `%APPDATA%\Code\User\settings.json` |
| Linux | `~/.config/cursor/mcp.json` | `~/.config/Code/User/settings.json` |

## License

MIT
