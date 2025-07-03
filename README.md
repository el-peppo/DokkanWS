# DokkanWebScraper 2.0

Advanced TypeScript web scraper for Dragon Ball Z Dokkan Battle character data extraction from the Fandom wiki.

## What's New in v2.0

### Performance Improvements
- **Parallel processing**: Categories and character batches processed concurrently  
- **Connection pooling**: HTTP keep-alive with optimized socket management
- **Smart retry logic**: Exponential backoff with configurable retry attempts
- **Batch processing**: Controlled concurrency to respect server limits

### Modern Architecture
- **Modular design**: Clean separation of concerns with dedicated services
- **TypeScript strict mode**: Full type safety with modern TS 5.4
- **Professional logging**: Winston-based structured logging with multiple outputs
- **Configuration management**: Environment variables and structured config
- **Error handling**: Comprehensive error tracking and reporting

### Enhanced Features
- **Real-time progress tracking**: Detailed progress reporting with ETA calculations
- **Comprehensive statistics**: Success rates, timing metrics, and error analysis
- **Multiple output formats**: Full metadata + characters-only for backward compatibility
- **Memory efficient**: Optimized DOM parsing and garbage collection

## Installation

```bash
# Install dependencies (requires Node.js 18+)
npm install

# Copy environment configuration
cp .env.example .env

# Build the project
npm run build
```

**Note**: This project uses modern Node.js ESM loader syntax (requires Node.js 18+). The deprecated `--experimental-loader` has been replaced with the new `--import` syntax for better compatibility.

## Usage

### Quick Start
```bash
# Run the modernized scraper
npm run run

# For development with file watching
npm run watch
```

### Configuration

Create a `.env` file or set environment variables:

```env
MAX_RETRIES=3
RETRY_DELAY=1000
BATCH_SIZE=10
CONCURRENT_LIMIT=5
REQUEST_TIMEOUT=15000
USER_AGENT="Mozilla/5.0 (compatible; DokkanScraper/2.0)"
LOG_LEVEL=info

# Corelog Remote Logging (Optional)
CORELOG_ENABLED=false
CORELOG_REMOTE_HOST=localhost
CORELOG_REMOTE_PORT=9020
CORELOG_TIMEOUT_CONNECT=3000
CORELOG_TIMEOUT_SEND=3000
```

## Project Structure

```
src/
├── types/           # TypeScript interfaces and types
├── config/          # Configuration management
├── services/        # Core business logic
│   ├── scraper.ts          # Main scraper orchestration
│   ├── character-extractor.ts  # Character data extraction
│   ├── http-client.ts      # HTTP client with pooling
│   └── dom-parser.ts       # DOM parsing utilities
├── utils/           # Utility functions
└── index.ts         # Application entry point
```

## Testing

```bash
# Run all tests (193 test cases)
npm test

# Run tests in watch mode  
npm run test:watch

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## Output Format

The scraper generates two output files:

### Full Result (`{timestamp}_DokkanCharacterData.json`)
```json
{
  "characters": [...],
  "stats": {
    "totalCharacters": 1250,
    "processingTime": 45000,
    "categoriesProcessed": ["UR", "LR", ...],
    "errors": [...]
  }
}
```

### Characters Only (`{timestamp}_DokkanCharacterData_characters_only.json`)
```json
[
  {
    "name": "Super Saiyan Goku",
    "title": "Legendary Super Saiyan", 
    "maxLevel": 120,
    "maxSALevel": "25",
    "rarity": "LR",
    ...
  }
]
```

## Database Integration (Optional)

Store scraped character data in MySQL for advanced querying and analysis.

### Setup Database

```bash
# Option 1: Quick start with sample data (100 real LR characters)
mysql -u root -p < database/sample_data.sql

# Option 2: Create empty database
npm run setup-db

# Configure database connection
cp .env.example .env
# Edit .env with your MySQL credentials
```

### Import Data

```bash
# Import latest JSON file
npm run import-db latest

# Import all JSON files  
npm run import-db all

# Import specific file
npm run import-db /path/to/data.json
```

### Features

- **Sample Data**: 100 real LR characters included for immediate testing
- **Normalized schema**: Separate tables for links, categories, transformations
- **SEZA Support**: Super EZA fields in all tables
- **Duplicate prevention**: Skips existing characters by ID
- **Transaction safety**: Rollback on errors for data integrity
- **Progress tracking**: Detailed import logs and statistics

See `database/README.md` for complete setup instructions.

## Corelog Integration (Optional)

Send logs to a remote corelog server for centralized logging and analysis.

### Setup Corelog Remote Logging

```bash
# Enable corelog in your .env file
CORELOG_ENABLED=true
CORELOG_REMOTE_HOST=your-corelog-server.com
CORELOG_REMOTE_PORT=9020
```

### Features

- **Remote-Only Logging**: When enabled, logs only to corelog server (winston on fallback)
- **Structured Context**: Rich context data sent with each log entry
- **Error Resilience**: Fallback to local logging if corelog server unavailable
- **TCP Protocol**: Uses corelog's native TCP JSON protocol
- **Async Operations**: Non-blocking log transmission

### Log Format

Logs are sent to corelog server in JSON format:

```json
{
  "ts": "2024-01-15T14:30:45.123Z",
  "app": "DokkanWS",
  "level": "INFO",
  "msg": "Category UR: 150 characters processed",
  "ctx": {
    "category": "UR",
    "characters_processed": 150,
    "total_processed": 450,
    "progress_percent": 65.2,
    "processing_rate": 12.5,
    "eta_seconds": 45
  }
}
```

Compatible with corelog Python suite for centralized home automation logging.

## Architecture Details

### HTTP Client
- Connection pooling with keep-alive
- Configurable retry logic with exponential backoff
- Request timeout management
- Error tracking and statistics

### Character Extraction  
- Robust DOM parsing with fallback selectors
- Text cleaning and normalization
- Transformation handling for multi-form characters
- EZA (Extreme Z-Awakening) data extraction
- SEZA (Super Extreme Z-Awakening) data extraction
- Support for all rarity tiers: N, R, SR, SSR, UR, LR

### Logging System
- Console output with colors and formatting
- File-based logging for errors and full logs
- Progress tracking with ETA calculations
- Performance metrics and statistics

## Performance

**v2.0 Performance Improvements:**
- ~3x faster than v1.0 due to parallel processing
- ~60% reduction in memory usage
- ~90% reduction in failed requests due to retry logic

**Typical Performance:**
- ~1,200+ characters scraped in 30-60 seconds
- ~20-30 characters per second average rate
- <2% failure rate with retry logic

## Error Handling

The scraper includes comprehensive error handling:
- Network timeouts and connection failures
- DOM parsing errors
- Missing character data
- Server rate limiting
- Invalid character pages

All errors are logged with context and don't stop the overall scraping process.

## Backward Compatibility

The modernized codebase maintains compatibility with existing workflows:
- Same output format for characters data
- Compatible test expectations (193 passing tests)
- Same CLI interface with `npm run run`

## Development Notes

This modernization focused on:
- **Updated dependencies**: Latest axios, TypeScript 5.4, Node 18+
- **Strict typing**: Full TypeScript strict mode compliance
- **Modern patterns**: ES modules, async/await throughout
- **Professional tooling**: ESLint, proper build pipeline
- **Maintainability**: Modular architecture, comprehensive logging

---

**Note**: This scraper is designed to be respectful to the Dokkan Battle Fandom wiki. It includes rate limiting, retry logic, and proper error handling to avoid overwhelming their servers.