// Search and filtering component
function SearchAndFilters() {
    const {
        searchQuery,
        setSearchQuery,
        selectedFilters,
        setSelectedFilters,
        characters,
        setFilteredCharacters,
        setSortBy,
        sortBy,
        setSortOrder,
        sortOrder
    } = useAppContext();
    
    const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);
    
    // Get unique filter options from characters
    const filterOptions = React.useMemo(() => {
        const rarities = [...new Set(characters.map(c => c.rarity).filter(Boolean))];
        const types = [...new Set(characters.map(c => c.type).filter(Boolean))];
        const classes = [...new Set(characters.map(c => c.class).filter(Boolean))];
        const categories = [...new Set(characters.flatMap(c => c.categories || []).filter(Boolean))];
        
        return {
            rarities: rarities.sort(),
            types: types.sort(),
            classes: classes.sort(),
            categories: categories.sort()
        };
    }, [characters]);
    
    // Debounced search function
    const debouncedSearch = React.useCallback(
        debounce((query, filters) => {
            filterCharacters(query, filters);
        }, 300),
        [characters]
    );
    
    // Filter characters based on search and filters
    const filterCharacters = React.useCallback((query, filters) => {
        let filtered = [...characters];
        
        // Text search
        if (query.trim()) {
            const searchTerm = query.toLowerCase();
            filtered = filtered.filter(character => 
                character.name?.toLowerCase().includes(searchTerm) ||
                character.title?.toLowerCase().includes(searchTerm) ||
                character.leaderSkill?.toLowerCase().includes(searchTerm) ||
                character.superAttack?.toLowerCase().includes(searchTerm) ||
                character.passive?.toLowerCase().includes(searchTerm) ||
                character.links?.some(link => link.toLowerCase().includes(searchTerm)) ||
                character.categories?.some(cat => cat.toLowerCase().includes(searchTerm))
            );
        }
        
        // Apply filters
        if (filters.rarity) {
            filtered = filtered.filter(c => c.rarity === filters.rarity);
        }
        if (filters.type) {
            filtered = filtered.filter(c => c.type === filters.type);
        }
        if (filters.class) {
            filtered = filtered.filter(c => c.class === filters.class);
        }
        if (filters.category) {
            filtered = filtered.filter(c => c.categories?.includes(filters.category));
        }
        
        // Apply sorting
        filtered.sort((a, b) => {
            let aValue, bValue;
            
            switch (sortBy) {
                case 'name':
                    aValue = a.name || '';
                    bValue = b.name || '';
                    break;
                case 'rarity':
                    const rarityOrder = ['N', 'R', 'SR', 'SSR', 'UR', 'LR'];
                    aValue = rarityOrder.indexOf(a.rarity) || 0;
                    bValue = rarityOrder.indexOf(b.rarity) || 0;
                    break;
                case 'type':
                    aValue = a.type || '';
                    bValue = b.type || '';
                    break;
                case 'class':
                    aValue = a.class || '';
                    bValue = b.class || '';
                    break;
                case 'cost':
                    aValue = parseInt(a.cost) || 0;
                    bValue = parseInt(b.cost) || 0;
                    break;
                default:
                    aValue = a.name || '';
                    bValue = b.name || '';
            }
            
            if (typeof aValue === 'string') {
                return sortOrder === 'asc' 
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            } else {
                return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
            }
        });
        
        setFilteredCharacters(filtered);
    }, [characters, setFilteredCharacters, sortBy, sortOrder]);
    
    // Effect to filter when dependencies change
    React.useEffect(() => {
        debouncedSearch(searchQuery, selectedFilters);
    }, [searchQuery, selectedFilters, debouncedSearch]);
    
    // Handle filter changes
    const handleFilterChange = (filterType, value) => {
        const newFilters = {
            ...selectedFilters,
            [filterType]: value === selectedFilters[filterType] ? '' : value
        };
        setSelectedFilters(newFilters);
    };
    
    // Clear all filters
    const clearAllFilters = () => {
        setSearchQuery('');
        setSelectedFilters({
            rarity: '',
            type: '',
            class: '',
            category: ''
        });
    };
    
    // Handle sort change
    const handleSortChange = (newSortBy) => {
        if (sortBy === newSortBy) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(newSortBy);
            setSortOrder('asc');
        }
    };
    
    return React.createElement('div', { className: 'search-filters-container' },
        // Search Bar
        React.createElement('div', { className: 'search-bar' },
            React.createElement('div', { className: 'search-input-container' },
                React.createElement('i', { className: 'fas fa-search search-icon' }),
                React.createElement('input', {
                    type: 'text',
                    placeholder: 'Search characters, skills, links, categories...',
                    value: searchQuery,
                    onChange: (e) => setSearchQuery(e.target.value),
                    className: 'search-input'
                }),
                searchQuery && React.createElement('button', {
                    className: 'clear-search-btn',
                    onClick: () => setSearchQuery('')
                },
                    React.createElement('i', { className: 'fas fa-times' })
                )
            ),
            
            React.createElement('button', {
                className: `btn btn-secondary ${showAdvancedFilters ? 'active' : ''}`,
                onClick: () => setShowAdvancedFilters(!showAdvancedFilters)
            },
                React.createElement('i', { className: 'fas fa-filter' }),
                'Filters'
            )
        ),
        
        // Quick Filters
        React.createElement('div', { className: 'quick-filters' },
            React.createElement('div', { className: 'filter-group' },
                React.createElement('label', null, 'Rarity:'),
                React.createElement('div', { className: 'filter-buttons' },
                    filterOptions.rarities.map(rarity =>
                        React.createElement('button', {
                            key: rarity,
                            className: `filter-btn rarity-${rarity.toLowerCase()} ${selectedFilters.rarity === rarity ? 'active' : ''}`,
                            onClick: () => handleFilterChange('rarity', rarity),
                            style: { borderColor: getRarityColor(rarity) }
                        }, rarity)
                    )
                )
            ),
            
            React.createElement('div', { className: 'filter-group' },
                React.createElement('label', null, 'Type:'),
                React.createElement('div', { className: 'filter-buttons' },
                    filterOptions.types.map(type =>
                        React.createElement('button', {
                            key: type,
                            className: `filter-btn type-${type.toLowerCase()} ${selectedFilters.type === type ? 'active' : ''}`,
                            onClick: () => handleFilterChange('type', type),
                            style: { borderColor: getTypeColor(type) }
                        }, type)
                    )
                )
            ),
            
            React.createElement('div', { className: 'filter-group' },
                React.createElement('label', null, 'Class:'),
                React.createElement('div', { className: 'filter-buttons' },
                    filterOptions.classes.map(characterClass =>
                        React.createElement('button', {
                            key: characterClass,
                            className: `filter-btn class-${characterClass.toLowerCase()} ${selectedFilters.class === characterClass ? 'active' : ''}`,
                            onClick: () => handleFilterChange('class', characterClass),
                            style: { borderColor: getClassColor(characterClass) }
                        }, characterClass)
                    )
                )
            )
        ),
        
        // Advanced Filters
        showAdvancedFilters && React.createElement('div', { className: 'advanced-filters' },
            React.createElement('div', { className: 'filter-section' },
                React.createElement('label', null, 'Category:'),
                React.createElement('select', {
                    value: selectedFilters.category,
                    onChange: (e) => handleFilterChange('category', e.target.value),
                    className: 'filter-select'
                },
                    React.createElement('option', { value: '' }, 'All Categories'),
                    filterOptions.categories.map(category =>
                        React.createElement('option', { key: category, value: category }, category)
                    )
                )
            ),
            
            React.createElement('div', { className: 'filter-actions' },
                React.createElement('button', {
                    className: 'btn btn-danger',
                    onClick: clearAllFilters
                },
                    React.createElement('i', { className: 'fas fa-trash' }),
                    'Clear All'
                )
            )
        ),
        
        // Sort Controls
        React.createElement('div', { className: 'sort-controls' },
            React.createElement('label', null, 'Sort by:'),
            React.createElement('div', { className: 'sort-buttons' },
                ['name', 'rarity', 'type', 'class', 'cost'].map(sortOption =>
                    React.createElement('button', {
                        key: sortOption,
                        className: `sort-btn ${sortBy === sortOption ? 'active' : ''}`,
                        onClick: () => handleSortChange(sortOption)
                    },
                        sortOption.charAt(0).toUpperCase() + sortOption.slice(1),
                        sortBy === sortOption && React.createElement('i', { 
                            className: `fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}` 
                        })
                    )
                )
            )
        )
    );
}