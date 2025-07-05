// Character Modal Component with full details including new extraction features
function CharacterModal({ character, onClose }) {
    const [activeTab, setActiveTab] = React.useState('overview');
    const [selectedTransform, setSelectedTransform] = React.useState(0);
    
    // Handle ESC key to close modal
    React.useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [onClose]);
    
    // Prevent body scroll when modal is open
    React.useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);
    
    const stats = parseStats(character);
    const imageUrl = getCharacterImageUrl(character, true);
    
    const renderOverviewTab = () => React.createElement('div', { className: 'tab-content overview-tab' },
        // Character Images
        React.createElement('div', { className: 'character-images' },
            React.createElement('div', { className: 'main-image' },
                React.createElement('img', {
                    src: imageUrl,
                    alt: `${character.name} - ${character.title}`,
                    onError: (e) => {
                        e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                    }
                })
            )
        ),
        
        // Basic Info
        React.createElement('div', { className: 'basic-info' },
            React.createElement('div', { className: 'info-grid' },
                React.createElement('div', { className: 'info-item' },
                    React.createElement('label', null, 'Rarity:'),
                    React.createElement('span', { 
                        className: 'rarity-value',
                        style: { color: getRarityColor(character.rarity) }
                    }, character.rarity)
                ),
                React.createElement('div', { className: 'info-item' },
                    React.createElement('label', null, 'Type:'),
                    React.createElement('span', { 
                        className: 'type-value',
                        style: { color: getTypeColor(character.type) }
                    }, character.type)
                ),
                React.createElement('div', { className: 'info-item' },
                    React.createElement('label', null, 'Class:'),
                    React.createElement('span', { 
                        className: 'class-value',
                        style: { color: getClassColor(character.class) }
                    }, character.class)
                ),
                React.createElement('div', { className: 'info-item' },
                    React.createElement('label', null, 'Cost:'),
                    React.createElement('span', null, character.cost || 'N/A')
                ),
                React.createElement('div', { className: 'info-item' },
                    React.createElement('label', null, 'Max Level:'),
                    React.createElement('span', null, character.maxLevel || 'N/A')
                ),
                React.createElement('div', { className: 'info-item' },
                    React.createElement('label', null, 'Max SA:'),
                    React.createElement('span', null, character.maxSALevel || 'N/A')
                )
            )
        ),
        
        // Special Features
        React.createElement('div', { className: 'special-features' },
            hasEZA(character) && React.createElement('div', { className: 'feature-badge eza' },
                React.createElement('i', { className: 'fas fa-bolt' }),
                React.createElement('span', null, 'EZA Available'),
                character.ezaMaxLevel && React.createElement('small', null, `Max Level: ${character.ezaMaxLevel}`)
            ),
            hasSEZA(character) && React.createElement('div', { className: 'feature-badge seza' },
                React.createElement('i', { className: 'fas fa-star' }),
                React.createElement('span', null, 'SEZA Available')
            ),
            hasTransformations(character) && React.createElement('div', { className: 'feature-badge transform' },
                React.createElement('i', { className: 'fas fa-exchange-alt' }),
                React.createElement('span', null, `${character.transformations.length} Transformation(s)`)
            )
        )
    );
    
    const renderSkillsTab = () => React.createElement('div', { className: 'tab-content skills-tab' },
        // Leader Skill
        React.createElement('div', { className: 'skill-section' },
            React.createElement('h4', null, 'Leader Skill'),
            React.createElement('div', { className: 'skill-content' },
                React.createElement('p', { 
                    dangerouslySetInnerHTML: { 
                        __html: formatPassiveSkill(character.leaderSkill || 'Not available') 
                    } 
                })
            ),
            hasEZA(character) && character.ezaLeaderSkill && React.createElement('div', { className: 'eza-skill' },
                React.createElement('h5', null, 'EZA Leader Skill'),
                React.createElement('p', { 
                    dangerouslySetInnerHTML: { 
                        __html: formatPassiveSkill(character.ezaLeaderSkill) 
                    } 
                })
            ),
            hasSEZA(character) && character.sezaLeaderSkill && React.createElement('div', { className: 'seza-skill' },
                React.createElement('h5', null, 'SEZA Leader Skill'),
                React.createElement('p', { 
                    dangerouslySetInnerHTML: { 
                        __html: formatPassiveSkill(character.sezaLeaderSkill) 
                    } 
                })
            )
        ),
        
        // Super Attack
        React.createElement('div', { className: 'skill-section' },
            React.createElement('h4', null, 'Super Attack'),
            React.createElement('div', { className: 'skill-content' },
                React.createElement('p', { 
                    dangerouslySetInnerHTML: { 
                        __html: formatPassiveSkill(character.superAttack || 'Not available') 
                    } 
                })
            ),
            hasEZA(character) && character.ezaSuperAttack && React.createElement('div', { className: 'eza-skill' },
                React.createElement('h5', null, 'EZA Super Attack'),
                React.createElement('p', { 
                    dangerouslySetInnerHTML: { 
                        __html: formatPassiveSkill(character.ezaSuperAttack) 
                    } 
                })
            )
        ),
        
        // Passive Skill
        React.createElement('div', { className: 'skill-section' },
            React.createElement('h4', null, 'Passive Skill'),
            React.createElement('div', { className: 'skill-content' },
                React.createElement('p', { 
                    dangerouslySetInnerHTML: { 
                        __html: formatPassiveSkill(character.passive || 'Not available') 
                    } 
                })
            ),
            hasEZA(character) && character.ezaPassive && React.createElement('div', { className: 'eza-skill' },
                React.createElement('h5', null, 'EZA Passive Skill'),
                React.createElement('p', { 
                    dangerouslySetInnerHTML: { 
                        __html: formatPassiveSkill(character.ezaPassive) 
                    } 
                })
            ),
            hasSEZA(character) && character.sezaPassive && React.createElement('div', { className: 'seza-skill' },
                React.createElement('h5', null, 'SEZA Passive Skill'),
                React.createElement('p', { 
                    dangerouslySetInnerHTML: { 
                        __html: formatPassiveSkill(character.sezaPassive) 
                    } 
                })
            )
        ),
        
        // Active Skill
        (character.activeSkill || character.ezaActiveSkill) && React.createElement('div', { className: 'skill-section' },
            React.createElement('h4', null, 'Active Skill'),
            character.activeSkill && React.createElement('div', { className: 'skill-content' },
                React.createElement('p', { 
                    dangerouslySetInnerHTML: { 
                        __html: formatPassiveSkill(character.activeSkill) 
                    } 
                }),
                character.activeSkillCondition && React.createElement('div', { className: 'condition' },
                    React.createElement('strong', null, 'Condition: '),
                    React.createElement('span', null, character.activeSkillCondition)
                )
            ),
            character.ezaActiveSkill && React.createElement('div', { className: 'eza-skill' },
                React.createElement('h5', null, 'EZA Active Skill'),
                React.createElement('p', { 
                    dangerouslySetInnerHTML: { 
                        __html: formatPassiveSkill(character.ezaActiveSkill) 
                    } 
                })
            )
        )
    );
    
    const renderStatsTab = () => React.createElement('div', { className: 'tab-content stats-tab' },
        // Statistics Table
        React.createElement('div', { className: 'stats-table' },
            React.createElement('table', null,
                React.createElement('thead', null,
                    React.createElement('tr', null,
                        React.createElement('th', null, 'Level'),
                        React.createElement('th', null, 'HP'),
                        React.createElement('th', null, 'ATK'),
                        React.createElement('th', null, 'DEF')
                    )
                ),
                React.createElement('tbody', null,
                    React.createElement('tr', null,
                        React.createElement('td', null, 'Max Level'),
                        React.createElement('td', null, character.maxLevelHP || 'N/A'),
                        React.createElement('td', null, character.maxLevelAttack || 'N/A'),
                        React.createElement('td', null, character.maxLevelDefence || 'N/A')
                    ),
                    React.createElement('tr', null,
                        React.createElement('td', null, 'Free Dupe'),
                        React.createElement('td', null, character.freeDupeHP || 'N/A'),
                        React.createElement('td', null, character.freeDupeAttack || 'N/A'),
                        React.createElement('td', null, character.freeDupeDefence || 'N/A')
                    ),
                    React.createElement('tr', null,
                        React.createElement('td', null, 'Rainbow'),
                        React.createElement('td', null, character.rainbowHP || 'N/A'),
                        React.createElement('td', null, character.rainbowAttack || 'N/A'),
                        React.createElement('td', null, character.rainbowDefence || 'N/A')
                    )
                )
            )
        ),
        
        // Ki Multipliers (for LR characters)
        character.rarity === 'LR' && React.createElement('div', { className: 'ki-multipliers-section' },
            React.createElement('h4', null, 'Ki Multipliers'),
            React.createElement('div', { className: 'ki-grid' },
                React.createElement('div', { className: 'ki-item' },
                    React.createElement('label', null, '12 Ki:'),
                    React.createElement('span', null, character.ki12Multiplier || 'N/A')
                ),
                React.createElement('div', { className: 'ki-item' },
                    React.createElement('label', null, '18 Ki:'),
                    React.createElement('span', null, character.ki18Multiplier || 'N/A')
                ),
                character.ki24Multiplier && React.createElement('div', { className: 'ki-item' },
                    React.createElement('label', null, '24 Ki:'),
                    React.createElement('span', null, character.ki24Multiplier)
                )
            )
        )
    );
    
    const renderTransformationsTab = () => React.createElement('div', { className: 'tab-content transformations-tab' },
        hasTransformations(character) ? React.createElement('div', { className: 'transformations-content' },
            // Transformation selector
            React.createElement('div', { className: 'transform-selector' },
                character.transformations.map((transform, index) =>
                    React.createElement('button', {
                        key: index,
                        className: `transform-btn ${selectedTransform === index ? 'active' : ''}`,
                        onClick: () => setSelectedTransform(index)
                    }, transform.name || `Form ${index + 1}`)
                )
            ),
            
            // Selected transformation details
            React.createElement('div', { className: 'transform-details' },
                React.createElement('h4', null, character.transformations[selectedTransform].name),
                React.createElement('div', { className: 'transform-condition' },
                    React.createElement('strong', null, 'Condition: '),
                    React.createElement('span', null, character.transformations[selectedTransform].condition)
                ),
                character.transformations[selectedTransform].passive && React.createElement('div', { className: 'transform-skill' },
                    React.createElement('h5', null, 'Passive Skill'),
                    React.createElement('p', { 
                        dangerouslySetInnerHTML: { 
                            __html: formatPassiveSkill(character.transformations[selectedTransform].passive) 
                        } 
                    })
                ),
                character.transformations[selectedTransform].superAttack && React.createElement('div', { className: 'transform-skill' },
                    React.createElement('h5', null, 'Super Attack'),
                    React.createElement('p', { 
                        dangerouslySetInnerHTML: { 
                            __html: formatPassiveSkill(character.transformations[selectedTransform].superAttack) 
                        } 
                    })
                ),
                character.transformations[selectedTransform].links && character.transformations[selectedTransform].links.length > 0 && 
                React.createElement('div', { className: 'transform-links' },
                    React.createElement('h5', null, 'Link Skills'),
                    React.createElement('div', { className: 'links-list' },
                        character.transformations[selectedTransform].links.map((link, idx) =>
                            React.createElement('span', { key: idx, className: 'link-badge' }, link)
                        )
                    )
                )
            )
        ) : React.createElement('div', { className: 'no-transformations' },
            React.createElement('i', { className: 'fas fa-info-circle' }),
            React.createElement('p', null, 'This character has no transformations.')
        )
    );
    
    const renderLinksTab = () => React.createElement('div', { className: 'tab-content links-tab' },
        React.createElement('div', { className: 'links-categories-grid' },
            // Link Skills
            React.createElement('div', { className: 'section' },
                React.createElement('h4', null, 'Link Skills'),
                character.links && character.links.length > 0 ? React.createElement('div', { className: 'links-list' },
                    character.links.map((link, index) =>
                        React.createElement('span', { key: index, className: 'link-badge' }, link)
                    )
                ) : React.createElement('p', { className: 'no-data' }, 'No link skills available')
            ),
            
            // Categories
            React.createElement('div', { className: 'section' },
                React.createElement('h4', null, 'Categories'),
                character.categories && character.categories.length > 0 ? React.createElement('div', { className: 'categories-list' },
                    character.categories.map((category, index) =>
                        React.createElement('span', { key: index, className: 'category-badge' }, category)
                    )
                ) : React.createElement('p', { className: 'no-data' }, 'No categories available')
            )
        )
    );
    
    return React.createElement('div', { className: 'modal-overlay', onClick: onClose },
        React.createElement('div', { 
            className: 'character-modal',
            onClick: (e) => e.stopPropagation()
        },
            // Modal Header
            React.createElement('div', { className: 'modal-header' },
                React.createElement('div', { className: 'character-title' },
                    React.createElement('h2', null, character.name),
                    React.createElement('h3', null, character.title)
                ),
                React.createElement('button', {
                    className: 'close-btn',
                    onClick: onClose
                },
                    React.createElement('i', { className: 'fas fa-times' })
                )
            ),
            
            // Tab Navigation
            React.createElement('div', { className: 'tab-nav' },
                ['overview', 'skills', 'stats', 'transformations', 'links'].map(tab =>
                    React.createElement('button', {
                        key: tab,
                        className: `tab-btn ${activeTab === tab ? 'active' : ''}`,
                        onClick: () => setActiveTab(tab)
                    }, tab.charAt(0).toUpperCase() + tab.slice(1))
                )
            ),
            
            // Tab Content
            React.createElement('div', { className: 'modal-content' },
                activeTab === 'overview' && renderOverviewTab(),
                activeTab === 'skills' && renderSkillsTab(),
                activeTab === 'stats' && renderStatsTab(),
                activeTab === 'transformations' && renderTransformationsTab(),
                activeTab === 'links' && renderLinksTab()
            )
        )
    );
}