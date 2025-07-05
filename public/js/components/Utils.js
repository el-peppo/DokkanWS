// Utility functions for the Dokkan app

// Format passive skills with colored Ki spheres
function formatPassiveSkill(passiveText) {
    if (!passiveText || passiveText === 'Error') {
        return passiveText;
    }
    
    // Function to colorize Ki sphere references
    function colorizeKiSpheres(text) {
        const kiSphereColors = {
            '[PHY]': '#FFA500', // Orange
            '[STR]': '#FF0000', // Red  
            '[AGL]': '#0000FF', // Blue
            '[TEQ]': '#00FF00', // Green
            '[INT]': '#800080', // Purple
            '[Rainbow]': 'linear-gradient(45deg, #ff0000, #ffa500, #ffff00, #00ff00, #0000ff, #800080)'
        };
        
        let formattedText = text;
        
        Object.entries(kiSphereColors).forEach(([kiType, color]) => {
            const regex = new RegExp(`\\${kiType}`, 'gi');
            if (kiType === '[Rainbow]') {
                formattedText = formattedText.replace(regex, 
                    `<span style="background: ${color}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold;">${kiType}</span>`);
            } else {
                formattedText = formattedText.replace(regex, 
                    `<span style="color: ${color}; font-weight: bold;">${kiType}</span>`);
            }
        });
        
        return formattedText;
    }
    
    return colorizeKiSpheres(passiveText);
}

// Get rarity color
function getRarityColor(rarity) {
    const rarityColors = {
        'N': '#808080',
        'R': '#FFFF00', 
        'SR': '#FFA500',
        'SSR': '#FF69B4',
        'UR': '#9370DB',
        'LR': '#FFD700'
    };
    return rarityColors[rarity] || '#FFFFFF';
}

// Get type color
function getTypeColor(type) {
    const typeColors = {
        'PHY': '#FFA500',
        'STR': '#FF0000', 
        'AGL': '#0000FF',
        'TEQ': '#00FF00',
        'INT': '#800080'
    };
    return typeColors[type] || '#FFFFFF';
}

// Get class color
function getClassColor(characterClass) {
    const classColors = {
        'Super': '#87CEEB',
        'Extreme': '#FF6347'
    };
    return classColors[characterClass] || '#FFFFFF';
}

// Format large numbers
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Truncate text
function truncateText(text, maxLength = 100) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format time duration
function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    } else {
        return `${secs}s`;
    }
}

// Check if character has transformations
function hasTransformations(character) {
    return character.transformations && character.transformations.length > 0;
}

// Check if character has EZA
function hasEZA(character) {
    return character.ezaMaxLevel || character.ezaLeaderSkill || character.ezaSuperAttack || character.ezaPassive;
}

// Check if character has SEZA
function hasSEZA(character) {
    return character.sezaLeaderSkill || character.sezaSuperAttack || character.sezaPassive;
}

// Parse character stats
function parseStats(character) {
    const stats = {};
    
    // Basic stats
    if (character.maxLevelAttack) stats.attack = parseInt(character.maxLevelAttack.replace(/,/g, ''));
    if (character.maxLevelDefence) stats.defense = parseInt(character.maxLevelDefence.replace(/,/g, ''));
    if (character.maxLevelHP) stats.hp = parseInt(character.maxLevelHP.replace(/,/g, ''));
    
    // Rainbow stats
    if (character.rainbowAttack) stats.rainbowAttack = parseInt(character.rainbowAttack.replace(/,/g, ''));
    if (character.rainbowDefence) stats.rainbowDefense = parseInt(character.rainbowDefence.replace(/,/g, ''));
    if (character.rainbowHP) stats.rainbowHP = parseInt(character.rainbowHP.replace(/,/g, ''));
    
    return stats;
}

// Get character image URL with fallback
function getCharacterImageUrl(character, useFullSize = false) {
    const imageUrl = useFullSize ? character.fullImageURL : character.imageURL;
    if (imageUrl && imageUrl !== 'Error' && imageUrl.startsWith('http')) {
        return imageUrl;
    }
    
    // Fallback to a placeholder image
    return 'https://via.placeholder.com/150x200?text=No+Image';
}

// Validate character data completeness
function validateCharacterData(character) {
    const issues = [];
    
    if (!character.name || character.name === 'Error') issues.push('Missing name');
    if (!character.title || character.title === 'Error') issues.push('Missing title');
    if (!character.rarity || character.rarity === 'Error') issues.push('Missing rarity');
    if (!character.type || character.type === 'Error') issues.push('Missing type');
    if (!character.class || character.class === 'Error') issues.push('Missing class');
    
    return {
        isValid: issues.length === 0,
        issues
    };
}