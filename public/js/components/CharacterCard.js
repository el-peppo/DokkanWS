// Character Card Component with new extraction features
function CharacterCard({ character, onClick }) {
    const [imageError, setImageError] = React.useState(false);
    const [showTransformations, setShowTransformations] = React.useState(false);
    
    // Character validation
    const validation = validateCharacterData(character);
    const stats = parseStats(character);
    
    // Get character image with fallback
    const imageUrl = getCharacterImageUrl(character, false);
    
    // Handle image error
    const handleImageError = () => {
        setImageError(true);
    };
    
    return React.createElement('div', {
        className: 'character-card',
        onClick: () => onClick(character)
    },
        // Character Image
        React.createElement('div', { className: 'character-image' },
            !imageError ? React.createElement('img', {
                src: imageUrl,
                alt: `${character.name} - ${character.title}`,
                onError: handleImageError,
                loading: 'lazy'
            }) : React.createElement('div', { className: 'image-placeholder' },
                React.createElement('i', { className: 'fas fa-user' }),
                React.createElement('span', null, 'No Image')
            ),
            
            // Rarity Badge
            React.createElement('div', { 
                className: 'rarity-badge',
                style: { backgroundColor: getRarityColor(character.rarity) }
            }, character.rarity),
            
            // Special Badges
            React.createElement('div', { className: 'special-badges' },
                hasEZA(character) && React.createElement('span', { className: 'badge eza-badge' }, 'EZA'),
                hasSEZA(character) && React.createElement('span', { className: 'badge seza-badge' }, 'SEZA'),
                hasTransformations(character) && React.createElement('span', { 
                    className: 'badge transform-badge',
                    onClick: (e) => {
                        e.stopPropagation();
                        setShowTransformations(!showTransformations);
                    }
                }, `${character.transformations.length} Forms`)
            )
        ),
        
        // Character Info
        React.createElement('div', { className: 'character-info' },
            React.createElement('h3', { className: 'character-name' }, 
                truncateText(character.name, 25)
            ),
            React.createElement('p', { className: 'character-title' }, 
                truncateText(character.title, 30)
            ),
            
            // Type and Class
            React.createElement('div', { className: 'character-attributes' },
                React.createElement('span', {
                    className: 'type-badge',
                    style: { backgroundColor: getTypeColor(character.type) }
                }, character.type),
                React.createElement('span', {
                    className: 'class-badge',
                    style: { backgroundColor: getClassColor(character.class) }
                }, character.class)
            ),
            
            // Cost and Level
            React.createElement('div', { className: 'character-stats' },
                React.createElement('div', { className: 'stat-item' },
                    React.createElement('span', { className: 'stat-label' }, 'Cost:'),
                    React.createElement('span', { className: 'stat-value' }, character.cost || 'N/A')
                ),
                React.createElement('div', { className: 'stat-item' },
                    React.createElement('span', { className: 'stat-label' }, 'Max Lv:'),
                    React.createElement('span', { className: 'stat-value' }, character.maxLevel || 'N/A')
                )
            ),
            
            // Stats Preview
            stats.attack && React.createElement('div', { className: 'stats-preview' },
                React.createElement('div', { className: 'stat-bar' },
                    React.createElement('span', null, 'ATK: ' + formatNumber(stats.attack)),
                    React.createElement('div', { className: 'stat-visual' },
                        React.createElement('div', { 
                            className: 'stat-fill attack-fill',
                            style: { width: `${Math.min(stats.attack / 20000 * 100, 100)}%` }
                        })
                    )
                ),
                React.createElement('div', { className: 'stat-bar' },
                    React.createElement('span', null, 'DEF: ' + formatNumber(stats.defense || 0)),
                    React.createElement('div', { className: 'stat-visual' },
                        React.createElement('div', { 
                            className: 'stat-fill defense-fill',
                            style: { width: `${Math.min((stats.defense || 0) / 15000 * 100, 100)}%` }
                        })
                    )
                )
            ),
            
            // Ki Multipliers for LR characters
            character.rarity === 'LR' && React.createElement('div', { className: 'ki-multipliers' },
                React.createElement('div', { className: 'ki-info' },
                    React.createElement('span', null, '12 Ki: ' + (character.ki12Multiplier || 'N/A')),
                    React.createElement('span', null, '18 Ki: ' + (character.ki18Multiplier || 'N/A')),
                    character.ki24Multiplier && React.createElement('span', null, '24 Ki: ' + character.ki24Multiplier)
                )
            ),
            
            // Links Preview
            character.links && character.links.length > 0 && React.createElement('div', { className: 'links-preview' },
                React.createElement('span', { className: 'links-label' }, 'Links:'),
                React.createElement('div', { className: 'links-count' },
                    React.createElement('i', { className: 'fas fa-link' }),
                    character.links.length
                )
            ),
            
            // Categories Preview
            character.categories && character.categories.length > 0 && React.createElement('div', { className: 'categories-preview' },
                React.createElement('span', { className: 'categories-label' }, 'Categories:'),
                React.createElement('div', { className: 'categories-count' },
                    React.createElement('i', { className: 'fas fa-tags' }),
                    character.categories.length
                )
            ),
            
            // Data Quality Indicator
            !validation.isValid && React.createElement('div', { className: 'data-quality-warning' },
                React.createElement('i', { className: 'fas fa-exclamation-triangle' }),
                React.createElement('span', null, `${validation.issues.length} issue(s)`)
            )
        ),
        
        // Transformations Quick View
        showTransformations && hasTransformations(character) && React.createElement('div', { 
            className: 'transformations-quick-view',
            onClick: (e) => e.stopPropagation()
        },
            React.createElement('h4', null, 'Transformations'),
            character.transformations.map((transform, index) =>
                React.createElement('div', { key: index, className: 'transform-item' },
                    React.createElement('span', { className: 'transform-name' }, transform.name),
                    React.createElement('span', { className: 'transform-condition' }, 
                        truncateText(transform.condition, 40)
                    )
                )
            )
        )
    );
}