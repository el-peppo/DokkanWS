# Database Integration

Simple MySQL integration for storing scraped Dokkan character data.

## Setup

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