// Character Grid Component with pagination
function CharacterGrid() {
    const {
        filteredCharacters,
        loading,
        error,
        currentPage,
        setCurrentPage
    } = useAppContext();
    
    const [selectedCharacter, setSelectedCharacter] = React.useState(null);
    const [viewMode, setViewMode] = React.useState('grid'); // 'grid' or 'list'
    
    const charactersPerPage = 24;
    const totalPages = Math.ceil(filteredCharacters.length / charactersPerPage);
    
    // Get current page characters
    const currentCharacters = React.useMemo(() => {
        const startIndex = (currentPage - 1) * charactersPerPage;
        return filteredCharacters.slice(startIndex, startIndex + charactersPerPage);
    }, [filteredCharacters, currentPage, charactersPerPage]);
    
    // Reset to first page when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [filteredCharacters.length, setCurrentPage]);
    
    // Handle character click
    const handleCharacterClick = (character) => {
        setSelectedCharacter(character);
    };
    
    // Handle pagination
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    
    // Generate pagination numbers
    const getPaginationNumbers = () => {
        const numbers = [];
        const maxVisible = 7;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                numbers.push(i);
            }
        } else {
            if (currentPage <= 4) {
                for (let i = 1; i <= 5; i++) numbers.push(i);
                numbers.push('...');
                numbers.push(totalPages);
            } else if (currentPage >= totalPages - 3) {
                numbers.push(1);
                numbers.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) numbers.push(i);
            } else {
                numbers.push(1);
                numbers.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) numbers.push(i);
                numbers.push('...');
                numbers.push(totalPages);
            }
        }
        
        return numbers;
    };
    
    if (loading) {
        return React.createElement('div', { className: 'loading-container' },
            React.createElement('div', { className: 'loading-spinner' }),
            React.createElement('p', null, 'Loading characters...')
        );
    }
    
    if (error) {
        return React.createElement('div', { className: 'error-container' },
            React.createElement('div', { className: 'error-message' },
                React.createElement('i', { className: 'fas fa-exclamation-triangle' }),
                React.createElement('h3', null, 'Error Loading Characters'),
                React.createElement('p', null, error),
                React.createElement('button', {
                    className: 'btn btn-primary',
                    onClick: () => window.location.reload()
                }, 'Retry')
            )
        );
    }
    
    return React.createElement('div', { className: 'character-grid-container' },
        // Grid Controls
        React.createElement('div', { className: 'grid-controls' },
            React.createElement('div', { className: 'results-info' },
                React.createElement('span', null, 
                    `Showing ${currentCharacters.length} of ${filteredCharacters.length} characters`
                ),
                totalPages > 1 && React.createElement('span', { className: 'page-info' },
                    `Page ${currentPage} of ${totalPages}`
                )
            ),
            
            React.createElement('div', { className: 'view-controls' },
                React.createElement('button', {
                    className: `view-btn ${viewMode === 'grid' ? 'active' : ''}`,
                    onClick: () => setViewMode('grid'),
                    title: 'Grid view'
                },
                    React.createElement('i', { className: 'fas fa-th' })
                ),
                React.createElement('button', {
                    className: `view-btn ${viewMode === 'list' ? 'active' : ''}`,
                    onClick: () => setViewMode('list'),
                    title: 'List view'
                },
                    React.createElement('i', { className: 'fas fa-list' })
                )
            )
        ),
        
        // Character Grid/List
        React.createElement('div', { className: `characters-container ${viewMode}-view` },
            currentCharacters.length > 0 ? currentCharacters.map(character =>
                React.createElement(CharacterCard, {
                    key: character.id || character.name,
                    character: character,
                    onClick: handleCharacterClick
                })
            ) : React.createElement('div', { className: 'no-results' },
                React.createElement('i', { className: 'fas fa-search' }),
                React.createElement('h3', null, 'No characters found'),
                React.createElement('p', null, 'Try adjusting your search or filters')
            )
        ),
        
        // Pagination
        totalPages > 1 && React.createElement('div', { className: 'pagination' },
            React.createElement('button', {
                className: 'pagination-btn',
                disabled: currentPage === 1,
                onClick: () => goToPage(currentPage - 1)
            },
                React.createElement('i', { className: 'fas fa-chevron-left' }),
                'Previous'
            ),
            
            React.createElement('div', { className: 'pagination-numbers' },
                getPaginationNumbers().map((num, index) =>
                    num === '...' ? React.createElement('span', { 
                        key: `ellipsis-${index}`, 
                        className: 'pagination-ellipsis' 
                    }, '...') : React.createElement('button', {
                        key: num,
                        className: `pagination-number ${currentPage === num ? 'active' : ''}`,
                        onClick: () => goToPage(num)
                    }, num)
                )
            ),
            
            React.createElement('button', {
                className: 'pagination-btn',
                disabled: currentPage === totalPages,
                onClick: () => goToPage(currentPage + 1)
            },
                'Next',
                React.createElement('i', { className: 'fas fa-chevron-right' })
            )
        ),
        
        // Character Modal
        selectedCharacter && React.createElement(CharacterModal, {
            character: selectedCharacter,
            onClose: () => setSelectedCharacter(null)
        })
    );
}