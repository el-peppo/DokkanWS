// App Context for managing global state
const AppContext = React.createContext();
const ThemeContext = React.createContext();

// App State Provider
function AppStateProvider({ children }) {
    const [characters, setCharacters] = React.useState([]);
    const [filteredCharacters, setFilteredCharacters] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [stats, setStats] = React.useState(null);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedFilters, setSelectedFilters] = React.useState({
        rarity: '',
        type: '',
        class: '',
        category: ''
    });
    const [currentPage, setCurrentPage] = React.useState(1);
    const [sortBy, setSortBy] = React.useState('name');
    const [sortOrder, setSortOrder] = React.useState('asc');
    
    // Socket connection state
    const [isConnected, setIsConnected] = React.useState(false);
    const [scrapingProgress, setScrapingProgress] = React.useState(null);
    const [isScrapingActive, setIsScrapingActive] = React.useState(false);
    
    const contextValue = {
        // Character data
        characters,
        setCharacters,
        filteredCharacters,
        setFilteredCharacters,
        
        // UI state
        loading,
        setLoading,
        error,
        setError,
        stats,
        setStats,
        
        // Search and filters
        searchQuery,
        setSearchQuery,
        selectedFilters,
        setSelectedFilters,
        currentPage,
        setCurrentPage,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        
        // Socket state
        isConnected,
        setIsConnected,
        scrapingProgress,
        setScrapingProgress,
        isScrapingActive,
        setIsScrapingActive
    };
    
    return React.createElement(AppContext.Provider, { value: contextValue }, children);
}

// Theme Provider
function ThemeProvider({ children }) {
    const [theme, setTheme] = React.useState(
        localStorage.getItem('theme') || 'dark'
    );
    
    React.useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };
    
    const themeValue = {
        theme,
        setTheme,
        toggleTheme
    };
    
    return React.createElement(ThemeContext.Provider, { value: themeValue }, children);
}

// Hooks for using contexts
function useAppContext() {
    const context = React.useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within AppStateProvider');
    }
    return context;
}

function useTheme() {
    const context = React.useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}