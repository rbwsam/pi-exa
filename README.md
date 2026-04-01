# pi-exa

A minimal Pi extension that integrates the [Exa API](https://exa.ai/) for advanced web search and content retrieval capabilities directly within Pi.

## Features

- 🔍 **Web Search** - Full-text search with optional content extraction
- 📄 **Content Fetching** - Retrieve and extract text from specific URLs
- 🔗 **Find Similar Pages** - Discover related web pages based on a given URL
- 🔐 **Secure API Key Management** - Safely store and manage your Exa API key
- 📊 **Rich Search Options** - Filter by domains, content categories, and search types

## Installation

### Prerequisites

- Node.js 18+
- An Exa API key (get one at [exa.ai](https://exa.ai/))

### Setup

1. Clone or install the extension in your Pi extensions directory:

```bash
# Global installation (recommended)
git clone https://github.com/rbwsam/pi-exa ~/.pi/agent/extensions/exa
cd ~/.pi/agent/extensions/exa
npm install

# OR project-local installation
git clone https://github.com/rbwsam/pi-exa .pi/extensions/exa
cd .pi/extensions/exa
npm install
```

2. Configure your Exa API key:

```bash
pi /exa-config
```

This command will prompt you to enter your API key securely. The key will be saved to `~/.pi/config/exa-api-key` with restricted permissions (0o600).

## Usage

### Setup

#### `/exa-config`

First, configure your Exa API key:

```
/exa-config
```

This will prompt you to enter your API key securely. The key is saved to `~/.pi/config/exa-api-key` with restricted permissions.

### What Pi Can Do

Once configured, Pi has access to three web search and content retrieval tools:

1. **Web Search** - Search the web with optional content extraction
   - Ask Pi to "search for recent developments in AI"
   - Request searches filtered by domain, category, or type
   - Get full article text or just summaries

2. **Content Fetching** - Extract text from specific URLs
   - Ask Pi to "get the full content from this URL"
   - Useful for reading articles, blog posts, documentation

3. **Similar Pages** - Find related web pages
   - Ask Pi to "find pages similar to this URL"
   - Discover alternative sources on the same topic

### Example Interactions

Just ask Pi naturally:

- "Search for the latest breakthroughs in quantum computing"
- "Fetch the full text from this article: https://example.com/article"
- "Find similar pages to this GitHub repository"
- "Search for Python frameworks, include full text"
- "Find news articles about AI, excluding tech blogs"

Pi will use these tools when appropriate to help answer your questions and provide current web information.

## Configuration

### API Key Storage

Your API key is stored securely at:
```
~/.pi/config/exa-api-key
```

The file has restricted permissions (mode 0o600) and is only readable by your user.

### Environment

The extension respects the following environment variables:
- `HOME` - Used to determine config directory location

## Development

### Project Structure

```
pi-exa/
├── src/
│   └── index.ts          # Main extension implementation
├── package.json          # Dependencies and metadata
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

### Dependencies

- **exa-js** - Official Exa API client library
- **@sinclair/typebox** - Type validation and schema generation
- **typescript** - Static type checking

### Building

The extension uses TypeScript for type safety. To check for type errors:

```bash
npm run check
```

### Code Style

- Strict TypeScript mode enabled
- No unused variables or imports
- Consistent error handling with try-catch blocks
- User-friendly error messages

## Troubleshooting

### "Exa API key not configured"

Run the configuration command:
```
/exa-config
```

### "Search failed" errors

1. Verify your API key is valid at [exa.ai](https://exa.ai/)
2. Check your network connection
3. Ensure your API key has quota remaining

### "Failed to save API key"

Ensure the `~/.pi/config/` directory exists and is writable by your user.

## Best Practices

When working with Pi and the Exa search tools, follow these guidelines to get the best results:

### Writing Better Queries

1. **Be Specific** - More detailed queries yield more relevant results
   - ❌ "Search for AI"
   - ✅ "Search for recent developments in large language models"

2. **Include Context** - Specify what you're looking for and why
   - ❌ "Find Python stuff"
   - ✅ "Find web frameworks for building real-time Python applications"

3. **Use Domain Hints** - Mention sources when you have preferences
   - "Search for quantum computing research on academic sites"
   - "Find tutorials on GitHub, excluding corporate tech blogs"

### Requesting Different Content Types

4. **Specify Content Categories** - Tell Pi what type of content you need
   - For breaking news: "Search for recent developments in [topic]"
   - For research: "Find research papers on [topic]"
   - For companies/organizations: "Search for information about [company]"
   - For PDFs/documents: "Find PDF documentation about [topic]"

5. **Ask for Full Text When Needed** - Request comprehensive content for detailed analysis
   - "Search for this topic and fetch the full article text so we can analyze it"
   - "Get the complete content from these URLs to understand the full context"
   - For quick summaries, just ask: "Search for [topic]" without mentioning text extraction

### Refining Your Searches

6. **Use Find Similar for Related Content** - When you find a good source, ask Pi to find similar pages
   - "Find pages similar to this GitHub repository"
   - "Discover other articles like the one at [URL]"

7. **Request Multiple Refinements** - If initial results aren't perfect, ask Pi to:
   - Search with different keywords: "Try searching for [alternative terms]"
   - Focus on specific domains: "Search again, but only on [source] sites"
   - Exclude irrelevant sources: "Search again, excluding [irrelevant domains]"

### Optimizing for Your Needs

8. **Balance Detail vs. Speed** - Be explicit about what matters
   - For quick answers: "Do a fast search for [topic]"
   - For thorough research: "Do a deep search and fetch full text from top results"
   - For exploratory work: "Give me a quick overview of [topic]"

9. **Mention Your Use Case** - Provide context so Pi can tailor the search
   - "I'm writing a blog post about [topic], search for recent examples"
   - "I need to understand current best practices for [topic]"
   - "Find implementation examples of [feature] in real projects"

### Working with Results

10. **Ask for Content Extraction Wisely** - Don't always fetch everything
    - Fetch full text when you need: detailed analysis, code examples, thorough understanding
    - Use summaries when you need: quick overview, to find the right sources, initial research
    - Ask Pi to "fetch full content from [specific URL]" for articles that look promising

11. **Verify Multiple Sources** - Ask Pi to find similar or related content to confirm information
    - "Find other sources that discuss this topic"
    - "Are there other implementations of this approach?"

12. **Iterate on Search** - Treat search as a conversation
    - Start broad: "Search for [general topic]"
    - Refine based on results: "Now focus on [specific aspect] based on what we found"
    - Dig deeper: "Fetch full text from the most relevant result"

## API Reference

For detailed information about the Exa API, visit:
- [Exa API Documentation](https://docs.exa.ai/)
- [Getting Started Guide](https://docs.exa.ai/reference/getting-started)

## License

MIT

## Support

For issues or questions:
1. Check the [Exa API documentation](https://docs.exa.ai/)
2. Verify your API key configuration
3. Open an issue on the repository

## Related

- [Pi Coding Agent](https://github.com/badlogic/pi-mono) - The underlying framework
- [Exa API](https://exa.ai/) - Web search infrastructure
