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

## Dragon Ball Dokkan Battle Mechanics - Implementation Guide

### Understanding the Foundation

Dragon Ball Dokkan Battle operates on a complex system where character statistics change dynamically during battles based on various mechanics. Unlike simpler games where stats remain static, Dokkan characters can transform, exchange places with partners, temporarily leave the field, or undergo permanent upgrades that fundamentally alter their capabilities.

The key to implementing these mechanics correctly lies in understanding that almost everything in Dokkan follows a strict order of operations. Think of it like a mathematical equation where the order you apply bonuses determines the final result. Each mechanic builds upon the previous ones, creating exponential growth when multiple systems combine.

### EZA System - Mathematical Stat Enhancement

Extreme Z-Awakening represents a precise mathematical enhancement system that extends older characters beyond their original limitations. When a character undergoes EZA, their maximum level increases from 120 to 140, but this isn't just a simple addition of 20 levels.

The stat calculation follows this exact formula: **Level 140 stat = (Lv.120 stat - Lv.1 stat) × 0.4839 + Lv.120 stat**. This formula applies uniformly to HP, Attack, and Defense values. The multiplier 0.4839 isn't arbitrary - it represents the specific growth rate Bandai programmed to balance these enhanced characters.

EZA progression happens in seven distinct stages, each requiring specific medals. The medal requirements are standardized: 12 bronze medals, 20 silver medals, 12 gold medals, and 12 rainbow medals, totaling 77 medals. Super Attack levels also extend from 10 to 15 for regular units and from 20 to 25 for LR units.

SEZA (Super Extreme Z-Awakening) adds a single additional enhancement step beyond full EZA. Unlike EZA's stat-focused improvements, SEZA exclusively enhances passive skills without changing base statistics. The activation requires clearing a special "Lv. SUPER" stage under restrictive conditions: no continues, no support items, and no duplicate character names on the team.

### Standby Skills - Temporary Removal Mechanics

Standby Skills introduce a unique concept where characters temporarily leave the active battle rotation to charge powerful abilities. This mechanic breaks the traditional three-character rotation system by removing one character from play while they prepare a devastating attack.

Two distinct types exist, each requiring different implementation approaches. Charge type standby skills accumulate Ki over time, with the final damage output varying based on how much Ki the character collected during their standby period. Characters like PHY LR SSJ3 Goku & SSJ2 Vegeta exemplify this system, featuring two different attack animations depending on their Ki accumulation level.

Fixed type standby skills deliver predetermined effects regardless of how long the character remains in standby. Characters like STR Kid Goku and TEQ Goku use this system, having only one attack animation since their output doesn't vary with charging time.

The implementation challenge lies in state persistence. When a character enters standby, their pre-standby passive skill effects continue for exactly one additional turn before ending. This creates a complex timing system where you must track both the standby duration and the gradual expiration of previous effects.

### Exchange Characters - Dynamic Character Switching

Exchange characters represent one of Dokkan's most sophisticated mechanics, allowing players to switch between two completely different character profiles within a single team slot. Think of it as having two characters that share the same position but possess entirely different abilities.

Traditional exchange works as a one-way transformation triggered through Active Skills. When you exchange TEQ LR Gohan for Piccolo, Gohan permanently leaves and Piccolo takes over with his own independent stats, passive skills, and link skills. The key technical requirement here is maintaining two complete character profiles while only displaying the currently active one.

Reversible Exchange, introduced with 10th anniversary units, revolutionizes this system by allowing unlimited switching between characters once activation conditions are met. Characters like LR Super Saiyan Goku + Super Saiyan Vegeta (Angel) can exchange to their partner and then return to the original form multiple times during the same battle.

Each character form maintains completely independent stat calculations. When Goku is active, you calculate everything based on Goku's stats and passive skills. When Vegeta is active, you completely ignore Goku's data and use only Vegeta's profile. This requires careful state management to ensure the UI updates all relevant information when exchanges occur.

### Transformation System - Conditional Character Evolution

Transformations represent permanent changes to character data triggered by specific battle conditions. Unlike exchanges where both characters exist simultaneously, transformations replace the original character entirely with a new version.

Turn-based transformations activate after specific turn counts, commonly occurring on turns 4, 5, or 6. The implementation requires a simple counter that tracks battle progression and triggers the transformation when the specified turn arrives.

HP-based transformations require continuous monitoring of the character's health percentage. When health drops below the threshold (typically 50% or 70%), the transformation activates. This creates real-time calculation requirements where you must check transformation conditions after every damage calculation.

Multi-condition transformations combine multiple requirements using boolean logic. A character might need both "Turn 6 or later" AND "HP below 50%" to transform. Some transformations also include enemy-type requirements, activating only when facing specific categories of opponents.

Temporary transformations like Rage Mode provide complete damage immunity for one turn, while Giant Form transformations can last 1-3 turns with total invincibility. These require duration tracking and automatic reversion to the base form when the timer expires.

### Fusion Mechanics - Permanent Character Combination

Fusion represents the most dramatic transformation type, permanently combining two characters into a single powerful entity. When fusion occurs, the game removes both original characters and replaces them with a completely new character profile.

Fusion typically requires turn 6 or later plus HP at 50% or below, though specific requirements vary by character. Upon successful fusion, the character receives full HP recovery and massive stat multipliers ranging from 150% to 200% of base values.

The technical challenge lies in data replacement. You must store three complete character profiles: the two original characters plus the fused result. Once fusion activates, you permanently replace all original data with the fused character's stats, passive skills, and link skills.

### Giant Form - Special Battle State

Giant Form breaks traditional damage calculations entirely by granting complete invincibility while active. During transformation, Giant characters occupy all three attack positions, gain type advantage against all enemies, and deal fixed damage values rather than calculated attacks.

The activation varies significantly between characters. Most have a 10-20% random chance per turn, while others require HP thresholds or Active Skill activation. Special Giant Form leaders can increase the maximum number of transformations allowed per battle.

Giant Form characters lose all link skill activations while transformed, though category bonuses continue to apply. This requires switching between two completely different calculation systems: normal damage formulas when in base form, and fixed damage values when transformed.

### Damage Calculation Hierarchy

All bonuses follow a strict order of operations that determines final damage output. Understanding this hierarchy is crucial for accurate implementation:

Leader Skills apply first as multiplicative bonuses, typically providing 150-200% stat increases for specific categories. Passive Skills activate in two phases: start-of-turn effects apply early in the calculation, while when-attacking effects apply much later.

Support Items and Battlefield Memories add their bonuses after leader skills but before link skills. Link Skills provide additive bonuses within their category, with enhanced effects at level 10. These level up through repeated use and require adjacent positioning to activate.

Active Skill attack boosts apply after link skills, followed by the Ki Multiplier calculation. Ki Multipliers range from 100% to 200%+ and represent the only calculation that rounds up rather than down.

The final steps include when-attacking passive skill effects, Super Attack multipliers, and type advantage calculations. Critical hits and additional attacks from Hidden Potential apply last, with critical hits providing a flat 1.9x damage multiplier.

### Hidden Potential System Integration

The Hidden Potential system adds base stats through orb investment and enables three key abilities. Critical hits provide a 2-30% chance for 1.9x damage multiplier. Additional attacks offer a 6-30% chance for extra attacks that can trigger Super Attacks. Dodge grants a 2-20% chance to completely avoid incoming damage.

These percentages are player-controlled through orb investment, creating customizable character builds. The system also adds flat stat bonuses that integrate directly into the base stat calculations before other multipliers apply.

### Implementation Priorities for Web UI

Focus first on the core calculation engine that implements the exact order of operations. Each bonus type must be clearly categorized as additive or multiplicative, with proper handling of the rounding rules.

Build a robust state machine capable of tracking multiple character states simultaneously. Characters might be in standby while having transformation conditions checked while tracking link skill levels - all these states must persist correctly.

Create dynamic UI components that update in real-time as character states change. When a character transforms, every displayed stat must recalculate immediately. When characters exchange, the entire character profile display must swap to show the new active character.

Handle edge cases gracefully, particularly around transformation conflicts and rapid state changes. The system must maintain calculation accuracy even during complex interactions like simultaneous transformations and exchanges occurring in the same turn.