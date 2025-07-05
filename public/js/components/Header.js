// Header component with navigation and controls
function Header() {
    const { theme, toggleTheme } = useTheme();
    const { 
        isConnected, 
        isScrapingActive, 
        scrapingProgress, 
        stats 
    } = useAppContext();
    
    const [showMobileMenu, setShowMobileMenu] = React.useState(false);
    
    return React.createElement('header', { className: 'app-header' },
        React.createElement('div', { className: 'header-container' },
            // Logo and Title
            React.createElement('div', { className: 'header-brand' },
                React.createElement('div', { className: 'logo' },
                    React.createElement('i', { className: 'fas fa-dragon' })
                ),
                React.createElement('div', { className: 'brand-text' },
                    React.createElement('h1', null, 'Dokkan Database'),
                    React.createElement('span', { className: 'subtitle' }, 'Character Data & Analytics')
                )
            ),
            
            // Connection Status
            React.createElement('div', { className: 'connection-status' },
                React.createElement('div', { 
                    className: `status-indicator ${isConnected ? 'connected' : 'disconnected'}` 
                }),
                React.createElement('span', null, isConnected ? 'Connected' : 'Disconnected')
            ),
            
            // Stats Summary
            stats && React.createElement('div', { className: 'stats-summary' },
                React.createElement('div', { className: 'stat-item' },
                    React.createElement('span', { className: 'stat-value' }, formatNumber(stats.totalCharacters || 0)),
                    React.createElement('span', { className: 'stat-label' }, 'Characters')
                ),
                React.createElement('div', { className: 'stat-item' },
                    React.createElement('span', { className: 'stat-value' }, stats.lastUpdated || 'Never'),
                    React.createElement('span', { className: 'stat-label' }, 'Last Updated')
                )
            ),
            
            // Scraping Progress
            isScrapingActive && scrapingProgress && React.createElement('div', { className: 'scraping-progress' },
                React.createElement('div', { className: 'progress-info' },
                    React.createElement('span', null, `Scraping: ${scrapingProgress.current}/${scrapingProgress.total}`),
                    React.createElement('span', { className: 'progress-percent' }, 
                        `${Math.round((scrapingProgress.current / scrapingProgress.total) * 100)}%`)
                ),
                React.createElement('div', { className: 'progress-bar' },
                    React.createElement('div', { 
                        className: 'progress-fill',
                        style: { width: `${(scrapingProgress.current / scrapingProgress.total) * 100}%` }
                    })
                )
            ),
            
            // Actions
            React.createElement('div', { className: 'header-actions' },
                // Theme Toggle
                React.createElement('button', {
                    className: 'btn btn-icon',
                    onClick: toggleTheme,
                    title: `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`
                },
                    React.createElement('i', { 
                        className: theme === 'light' ? 'fas fa-moon' : 'fas fa-sun' 
                    })
                ),
                
                // Mobile Menu Toggle
                React.createElement('button', {
                    className: 'btn btn-icon mobile-menu-toggle',
                    onClick: () => setShowMobileMenu(!showMobileMenu)
                },
                    React.createElement('i', { className: 'fas fa-bars' })
                )
            )
        ),
        
        // Mobile Menu
        showMobileMenu && React.createElement('div', { className: 'mobile-menu' },
            React.createElement('div', { className: 'mobile-menu-content' },
                React.createElement('button', { 
                    className: 'btn btn-primary',
                    onClick: () => {
                        setShowMobileMenu(false);
                        // Add navigation logic here
                    }
                }, 'Dashboard'),
                React.createElement('button', { 
                    className: 'btn btn-secondary',
                    onClick: () => {
                        setShowMobileMenu(false);
                        // Add navigation logic here
                    }
                }, 'Analytics'),
                React.createElement('button', { 
                    className: 'btn btn-secondary',
                    onClick: () => {
                        setShowMobileMenu(false);
                        // Add scraping control logic here
                    }
                }, 'Scraper Control')
            )
        )
    );
}