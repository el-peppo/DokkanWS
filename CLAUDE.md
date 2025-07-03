# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DokkanWebScraper is a TypeScript web scraper that extracts character data from the Dragon Ball Z Dokkan Battle Fandom wiki and builds a comprehensive database. The scraper handles complex character pages including base forms, transformations, and EZA (Extreme Z-Awakening) variations. Version 2.5 includes a Web UI, API server, enhanced MySQL integration, and full dependency updates.

## Essential Commands

```bash
# Run the scraper to collect all character data
npm run run

# Run with Web UI and API server (port 3000)
npm run api

# Run all tests (193 test cases covering extraction accuracy)
npm test

# Build TypeScript to JavaScript 
npm run build

# Watch mode for development
npm run watch

# Database commands (optional MySQL integration)
npm run setup-db        # Create database schema
npm run import-db latest # Import latest JSON to MySQL
npm run import-db all    # Import all JSON files

# Linting
npm run lint            # Check code style
npm run lint:fix        # Auto-fix linting issues
```

**Note**: Uses modern Node.js ESM loader syntax (Node.js 18+). The deprecated `--experimental-loader` has been replaced with `--import` syntax. Dependencies updated to latest versions including jsdom v26, mocha v11, and eslint v9.

Output files are saved to `./data/{YYYYMMDD}DokkanCharacterData.json`

## Optional MySQL Integration

The project includes optional database integration to store scraped character data in MySQL for advanced querying and analysis. Located in `src/database/` and `database/`:

- **Database Schema**: Normalized MySQL schema with separate tables for characters, links, categories, transformations
- **Full-size Images**: Both thumbnail and full-size character image URLs stored
- **JSON Importer**: Converts existing JSON output files to MySQL database entries  
- **Duplicate Prevention**: Skips characters that already exist in database (by ID)
- **CLI Interface**: Simple commands to import data from JSON files
- **SEZA Support**: Super Extreme Z-Awakening fields in all tables

This is completely optional - the core scraper works independently and outputs JSON files as before.

## Optional Corelog Integration

The project includes optional integration with corelog Python suite for centralized remote logging. Located in `src/utils/corelog-client.ts` and enhanced logging system:

- **Remote-Only Logging**: When enabled, logs are sent only to the remote corelog server (with winston fallback on errors)
- **TCP Protocol**: Uses corelog's native TCP JSON protocol for reliable transmission
- **Rich Context**: Sends detailed scraping metrics and structured data for analysis
- **Error Resilience**: Graceful fallback to local logging if corelog server unavailable
- **Environment Configuration**: Simple enable/disable via environment variables

Enable by setting `CORELOG_ENABLED=true` and configuring your corelog server endpoint. Compatible with existing corelog Python infrastructure for home automation logging.

Related repositories:
- **corelog**: Full-featured Python logging server and client suite (https://github.com/elpeppo/corelog)
- **corelog-min**: Minimal standalone Python logging server for lightweight deployments (https://github.com/elpeppo/corelog-min)

## Web UI and API Server

The project includes a modern web interface for real-time monitoring:

**api/index.ts** - Express.js server with Socket.IO:
- RESTful API endpoints for scraping control and data access
- WebSocket support for real-time progress updates
- Helmet security, CORS support, compression
- Static file serving for the web UI

**public/** - Web UI assets:
- `index.html`: Modern responsive dashboard
- `app.js`: Client-side JavaScript with Socket.IO integration
- Real-time progress tracking and character browsing
- Mobile-friendly responsive design

## Architecture

### Core Components

**scraper.ts** - Main scraping engine with two key functions:
- `getDokkanData(rarity)`: Scrapes character lists by rarity (N/R/SR/SSR/UR/LR) from category pages
- `extractCharacterData(document)`: Extracts detailed character data from individual character pages using complex DOM selectors

**character.ts** - Type definitions:
- `Character` interface: 40+ fields including stats, skills, transformations
- `Transformation` interface: For characters that can transform mid-battle
- Enums for `Classes` (Super/Extreme), `Types` (PHY/STR/AGL/TEQ/INT), `Rarities` (N/R/SR/SSR/UR/LR)

**index.ts** - Orchestration layer that:
- Runs scraper across multiple UR batches (wiki pagination requires multiple requests)
- Combines all rarity data sets (N, R, SR, SSR, UR, LR)
- Saves consolidated JSON output with date stamps

### Data Extraction Strategy

The scraper uses JSDOM to parse HTML and employs specific CSS selectors to extract:
- Basic stats from structured tables
- Skills from labeled sections (Leader Skill, Super Attack, Passive, etc.)
- EZA variations when available
- Multi-step transformations with full character data for each form
- Links, categories, and Ki meter information

**Text Cleaning**: The `cleanPassiveText()` function normalizes passive skill descriptions by removing wiki formatting artifacts like "Basic effect(s)-" prefixes.

### Test Architecture

**scraper.spec.ts** contains 193 comprehensive tests organized by data type:
- Tests cover 6 different character archetypes (standard, EZA, transform, multitransform, etc.)
- Each test validates extraction accuracy against known character data
- Tests ensure the scraper adapts to website changes (SA levels, category names, text formatting)

### Key Implementation Details

- **Error Handling**: DOM selectors return 'Error' when elements aren't found, allowing graceful degradation
- **Pagination**: UR characters require multiple requests due to wiki pagination (`?from=` parameter)
- **Concurrent Processing**: Character pages are scraped in parallel using `Promise.all()`
- **Website Evolution**: The scraper accounts for ongoing changes to the Dokkan wiki structure and content

When working with this codebase, prioritize maintaining test coverage as the wiki structure evolves. The comprehensive test suite serves as both validation and documentation of expected data formats.