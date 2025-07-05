// Dashboard Component - Main view
function Dashboard() {
    const {
        characters,
        setCharacters,
        loading,
        setLoading,
        error,
        setError,
        stats,
        setStats
    } = useAppContext();
    
    const [lastRefresh, setLastRefresh] = React.useState(null);
    
    // Load characters on component mount
    React.useEffect(() => {
        loadCharacters();
        loadStats();
    }, []);
    
    const loadCharacters = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await DokkanAPI.getCharacters();
            if (response.success) {
                setCharacters(response.data);
                setLastRefresh(new Date());
            } else {
                setError(response.error || 'Failed to load characters');
            }
        } catch (err) {
            setError('Network error: ' + err.message);
            console.error('Error loading characters:', err);
        } finally {
            setLoading(false);
        }
    };
    
    const loadStats = async () => {
        try {
            const response = await DokkanAPI.getStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch (err) {
            console.error('Error loading stats:', err);
        }
    };
    
    const handleRefresh = () => {
        loadCharacters();
        loadStats();
    };
    
    // Quick stats from loaded characters
    const quickStats = React.useMemo(() => {
        if (!characters || characters.length === 0) return null;
        
        const rarityCount = characters.reduce((acc, char) => {
            acc[char.rarity] = (acc[char.rarity] || 0) + 1;
            return acc;
        }, {});
        
        const typeCount = characters.reduce((acc, char) => {
            acc[char.type] = (acc[char.type] || 0) + 1;
            return acc;
        }, {});
        
        const classCount = characters.reduce((acc, char) => {
            acc[char.class] = (acc[char.class] || 0) + 1;
            return acc;
        }, {});
        
        const ezaCount = characters.filter(char => hasEZA(char)).length;
        const sezaCount = characters.filter(char => hasSEZA(char)).length;
        const transformCount = characters.filter(char => hasTransformations(char)).length;
        
        return {
            total: characters.length,
            rarityCount,
            typeCount,
            classCount,
            ezaCount,
            sezaCount,
            transformCount
        };
    }, [characters]);
    
    return React.createElement('div', { className: 'dashboard' },
        // Dashboard Header
        React.createElement('div', { className: 'dashboard-header' },
            React.createElement('div', { className: 'header-content' },
                React.createElement('h2', null, 'Character Database Dashboard'),
                React.createElement('p', null, 'Explore the complete Dragon Ball Z Dokkan Battle character database with advanced search and filtering capabilities.')
            ),
            React.createElement('div', { className: 'header-actions' },
                React.createElement('button', {
                    className: 'btn btn-primary',
                    onClick: handleRefresh,
                    disabled: loading
                },
                    React.createElement('i', { className: loading ? 'fas fa-spinner fa-spin' : 'fas fa-sync-alt' }),
                    loading ? 'Loading...' : 'Refresh Data'
                ),
                lastRefresh && React.createElement('span', { className: 'last-refresh' },
                    'Last updated: ' + lastRefresh.toLocaleTimeString()
                )
            )
        ),
        
        // Quick Stats Cards
        quickStats && React.createElement('div', { className: 'stats-cards' },
            React.createElement('div', { className: 'stat-card total' },
                React.createElement('div', { className: 'stat-icon' },
                    React.createElement('i', { className: 'fas fa-users' })
                ),
                React.createElement('div', { className: 'stat-content' },
                    React.createElement('div', { className: 'stat-number' }, formatNumber(quickStats.total)),
                    React.createElement('div', { className: 'stat-label' }, 'Total Characters')
                )
            ),
            
            React.createElement('div', { className: 'stat-card eza' },
                React.createElement('div', { className: 'stat-icon' },
                    React.createElement('i', { className: 'fas fa-bolt' })
                ),
                React.createElement('div', { className: 'stat-content' },
                    React.createElement('div', { className: 'stat-number' }, formatNumber(quickStats.ezaCount)),
                    React.createElement('div', { className: 'stat-label' }, 'EZA Characters')
                )
            ),
            
            React.createElement('div', { className: 'stat-card transform' },
                React.createElement('div', { className: 'stat-icon' },
                    React.createElement('i', { className: 'fas fa-exchange-alt' })
                ),
                React.createElement('div', { className: 'stat-content' },
                    React.createElement('div', { className: 'stat-number' }, formatNumber(quickStats.transformCount)),
                    React.createElement('div', { className: 'stat-label' }, 'Transforming Characters')
                )
            ),
            
            React.createElement('div', { className: 'stat-card seza' },
                React.createElement('div', { className: 'stat-icon' },
                    React.createElement('i', { className: 'fas fa-star' })
                ),
                React.createElement('div', { className: 'stat-content' },
                    React.createElement('div', { className: 'stat-number' }, formatNumber(quickStats.sezaCount)),
                    React.createElement('div', { className: 'stat-label' }, 'SEZA Characters')
                )
            )
        ),
        
        // Rarity Distribution
        quickStats && React.createElement('div', { className: 'distribution-charts' },
            React.createElement('div', { className: 'chart-container' },
                React.createElement('h3', null, 'Characters by Rarity'),
                React.createElement('div', { className: 'rarity-chart' },
                    Object.entries(quickStats.rarityCount)
                        .sort(([a], [b]) => ['N', 'R', 'SR', 'SSR', 'UR', 'LR'].indexOf(a) - ['N', 'R', 'SR', 'SSR', 'UR', 'LR'].indexOf(b))
                        .map(([rarity, count]) =>
                            React.createElement('div', { key: rarity, className: 'rarity-bar' },
                                React.createElement('div', { className: 'rarity-label' },
                                    React.createElement('span', { 
                                        className: 'rarity-name',
                                        style: { color: getRarityColor(rarity) }
                                    }, rarity),
                                    React.createElement('span', { className: 'rarity-count' }, count)
                                ),
                                React.createElement('div', { className: 'rarity-progress' },
                                    React.createElement('div', { 
                                        className: 'rarity-fill',
                                        style: { 
                                            width: `${(count / quickStats.total) * 100}%`,
                                            backgroundColor: getRarityColor(rarity) + '40'
                                        }
                                    })
                                )
                            )
                        )
                )
            ),
            
            React.createElement('div', { className: 'chart-container' },
                React.createElement('h3', null, 'Characters by Type'),
                React.createElement('div', { className: 'type-chart' },
                    Object.entries(quickStats.typeCount).map(([type, count]) =>
                        React.createElement('div', { key: type, className: 'type-item' },
                            React.createElement('span', { 
                                className: 'type-badge',
                                style: { backgroundColor: getTypeColor(type) }
                            }, type),
                            React.createElement('span', { className: 'type-count' }, count)
                        )
                    )
                )
            )
        ),
        
        // Search and Filters
        React.createElement(SearchAndFilters),
        
        // Character Grid
        React.createElement(CharacterGrid)
    );
}