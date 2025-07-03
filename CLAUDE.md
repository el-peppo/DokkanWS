# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DokkanWebScraper is a TypeScript web scraper that extracts character data from the Dragon Ball Z Dokkan Battle Fandom wiki and builds a comprehensive database. The scraper handles complex character pages including base forms, transformations, and EZA (Extreme Z-Awakening) variations.

## Essential Commands

```bash
# Run the scraper to collect all character data
npm run run

# Run all tests (193 test cases covering extraction accuracy)
npm test

# Build TypeScript to JavaScript 
npm run build

# Watch mode for development
npm run watch
```

**Note**: Uses modern Node.js ESM loader syntax (Node.js 18+). The deprecated `--experimental-loader` has been replaced with `--import` syntax.

Output files are saved to `./data/{YYYYMMDD}DokkanCharacterData.json`

## Architecture

### Core Components

**scraper.ts** - Main scraping engine with two key functions:
- `getDokkanData(rarity)`: Scrapes character lists by rarity (UR/LR) from category pages
- `extractCharacterData(document)`: Extracts detailed character data from individual character pages using complex DOM selectors

**character.ts** - Type definitions:
- `Character` interface: 40+ fields including stats, skills, transformations
- `Transformation` interface: For characters that can transform mid-battle
- Enums for `Classes` (Super/Extreme), `Types` (PHY/STR/AGL/TEQ/INT), `Rarities` (UR/LR)

**index.ts** - Orchestration layer that:
- Runs scraper across multiple UR batches (wiki pagination requires multiple requests)
- Combines LR and UR data sets
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