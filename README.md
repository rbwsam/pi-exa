# pi-exa

A minimal Pi extension integrating the [Exa API](https://exa.ai/) for web search and content retrieval.

## Features

- Web search with optional content extraction
- Retrieve text from specific URLs
- Find similar pages based on a URL
- Secure API key management

## Installation

```bash
git clone https://github.com/rbwsam/pi-exa ~/.pi/agent/extensions/exa
cd ~/.pi/agent/extensions/exa
npm install
```

Then configure your API key with:

```
/exa-config
```

Your API key will be saved to `~/.pi/config/exa-api-key` with restricted permissions.

## Usage

Once configured, Pi can search the web and access current information. Just ask naturally:

- "Search for recent AI developments"
- "What's the latest news on quantum computing?"
- "Get the full text from this URL"
- "Find similar pages to this GitHub repository"

Pi automatically uses the following tools when appropriate:

- [Web Search](https://docs.exa.ai/reference/search) - Search the web with optional content extraction
- [Content Fetching](https://docs.exa.ai/reference/get-contents) - Retrieve text from specific URLs
- [Find Similar](https://docs.exa.ai/reference/find-similar-links) - Discover related web pages

No commands needed—just ask naturally.



## Development

```bash
npm run check  # Type check TypeScript
```

**Dependencies:**
- `exa-js` - Exa API client
- `@sinclair/typebox` - Type validation
- `@mariozechner/pi-tui` - Pi TUI components

**Dev Dependencies:**
- `typescript` - Type checking
- `@types/node` - Node.js type definitions

## Troubleshooting

**API key not configured:**
Run `/exa-config` to set your API key.

**Search failed:**
Verify your API key is valid and has quota remaining at [exa.ai](https://exa.ai/).



## License

MIT

## References

- [Exa API Documentation](https://docs.exa.ai/)
- [Pi Coding Agent](https://github.com/badlogic/pi-mono)
