-- Dokkan Character Database Schema
-- This schema stores character data scraped from the Dokkan Battle Fandom wiki

CREATE DATABASE IF NOT EXISTS dokkan_characters;
USE dokkan_characters;

-- Main characters table
CREATE TABLE IF NOT EXISTS characters (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    max_level INT,
    max_sa_level VARCHAR(10),
    rarity ENUM('UR', 'LR', 'SSR', 'SR', 'R', 'N') NOT NULL,
    class ENUM('Super', 'Extreme') NOT NULL,
    type ENUM('PHY', 'STR', 'AGL', 'TEQ', 'INT') NOT NULL,
    cost INT,
    image_url TEXT,
    leader_skill TEXT,
    eza_leader_skill TEXT,
    super_attack TEXT,
    eza_super_attack TEXT,
    ultra_super_attack TEXT,
    eza_ultra_super_attack TEXT,
    passive TEXT,
    eza_passive TEXT,
    active_skill TEXT,
    active_skill_condition TEXT,
    eza_active_skill TEXT,
    eza_active_skill_condition TEXT,
    transformation_condition TEXT,
    ki_multiplier TEXT,
    base_hp INT DEFAULT 0,
    max_level_hp INT DEFAULT 0,
    free_dupe_hp INT DEFAULT 0,
    rainbow_hp INT DEFAULT 0,
    base_attack INT DEFAULT 0,
    max_level_attack INT DEFAULT 0,
    free_dupe_attack INT DEFAULT 0,
    rainbow_attack INT DEFAULT 0,
    base_defence INT DEFAULT 0,
    max_defence INT DEFAULT 0,
    free_dupe_defence INT DEFAULT 0,
    rainbow_defence INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_rarity (rarity),
    INDEX idx_type (type),
    INDEX idx_class (class)
);

-- Character links table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS character_links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    character_id VARCHAR(50),
    link_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    UNIQUE KEY unique_character_link (character_id, link_name),
    INDEX idx_character_id (character_id),
    INDEX idx_link_name (link_name)
);

-- Character categories table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS character_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    character_id VARCHAR(50),
    category_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    UNIQUE KEY unique_character_category (character_id, category_name),
    INDEX idx_character_id (character_id),
    INDEX idx_category_name (category_name)
);

-- Character ki meter table
CREATE TABLE IF NOT EXISTS character_ki_meter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    character_id VARCHAR(50),
    ki_value VARCHAR(50) NOT NULL,
    position INT NOT NULL,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    UNIQUE KEY unique_character_ki_position (character_id, position),
    INDEX idx_character_id (character_id)
);

-- Character transformations table
CREATE TABLE IF NOT EXISTS character_transformations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    character_id VARCHAR(50),
    transformation_order INT NOT NULL,
    transformed_name VARCHAR(255),
    transformed_id VARCHAR(50),
    transformed_class ENUM('Super', 'Extreme'),
    transformed_type ENUM('PHY', 'STR', 'AGL', 'TEQ', 'INT'),
    transformed_super_attack TEXT,
    transformed_eza_super_attack TEXT,
    transformed_ultra_super_attack TEXT,
    transformed_eza_ultra_super_attack TEXT,
    transformed_passive TEXT,
    transformed_eza_passive TEXT,
    transformed_active_skill TEXT,
    transformed_active_skill_condition TEXT,
    transformed_image_url TEXT,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    UNIQUE KEY unique_character_transformation (character_id, transformation_order),
    INDEX idx_character_id (character_id)
);

-- Transformation links table
CREATE TABLE IF NOT EXISTS transformation_links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transformation_id INT,
    link_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (transformation_id) REFERENCES character_transformations(id) ON DELETE CASCADE,
    UNIQUE KEY unique_transformation_link (transformation_id, link_name),
    INDEX idx_transformation_id (transformation_id)
);