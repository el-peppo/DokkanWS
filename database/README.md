# Database Integration

Simple MySQL integration for storing scraped Dokkan character data.

## Quick Start with Sample Data

1. **Install MySQL/MariaDB** (if not already installed)

2. **Load sample database with 100 real characters**:
   ```bash
   # Create database and load sample data
   mysql -u root -p < database/sample_data.sql
   ```

3. **Or create empty database and import your own data**:
   ```bash
   # Setup empty database schema
   npm run setup-db
   
   # Then import your JSON data
   npm run import-db your-data.json
   ```

## Sample Data

The `sample_data.sql` file contains:
- **100 real LR characters** from Dokkan Battle
- **Complete character data** including stats, skills, links, categories
- **SEZA support** (Super EZA fields)
- **All relationships** properly normalized across tables

This gives you a working database to test queries and functionality immediately.

## Setup from Scratch

1. **Install MySQL** (if not already installed)

2. **Create database and tables**:
   ```bash
   # Setup the database schema
   npm run setup-db
   ```

3. **Configure environment**:
   ```bash
   # Copy and edit the environment file
   cp .env.example .env
   # Edit .env with your MySQL credentials
   ```

## Usage

Import scraped JSON data into MySQL:

```bash
# Import the latest JSON file from data directory
npm run import-db latest

# Import all JSON files from data directory
npm run import-db all

# Import a specific file
npm run import-db /path/to/your/file.json
```

## Database Schema

- **characters**: Main character data (stats, skills, etc.)
- **character_links**: Character link skills (many-to-many)
- **character_categories**: Character categories (many-to-many) 
- **character_ki_meter**: Ki meter values
- **character_transformations**: Transformation data
- **transformation_links**: Links for transformed characters

## Features

- **Duplicate prevention**: Skips characters that already exist (by ID)
- **Transaction safety**: Uses database transactions for data integrity
- **Error handling**: Continues import even if individual characters fail
- **Progress logging**: Shows import progress and summary

## Environment Variables

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=dokkan_characters
DB_PORT=3306
```