// Framework7 App with Dokkan Database functionality
console.log('Loading app.js...');

class DokkanApp {
    constructor() {
        this.app = null;
        this.popup = null;
        this.updatePopup = null;
        this.currentPage = 1;
        this.currentFilters = {};
        this.characters = [];
        this.filters = {};
        this.isLoading = false;
        this.hasMoreResults = true;
        this.searchTimeout = null;
        
        this.init();
    }

    init() {
        console.log('Initializing DokkanApp...');
        
        // Initialize Framework7 app
        this.app = new Framework7({
            el: '#app',
            theme: 'auto',
            name: 'Dokkan Database',
            id: 'com.dokkan.database',
        });

        // Initialize API and WebSocket
        window.dokkanAPI.initializeSocket();

        // Initialize popups
        this.popup = this.app.popup.create({
            el: '#characterPopup',
            backdrop: true,
            closeByBackdropClick: true,
        });

        this.updatePopup = this.app.popup.create({
            el: '#updatePopup',
            backdrop: true,
            closeByBackdropClick: false,
        });

        // Setup event listeners
        this.setupEventListeners();
        
        // Load initial data
        this.loadInitialData();
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Search input
        document.getElementById('searchInput').addEventListener('input', (e) => {
            const query = e.target.value;
            this.handleSearch(query);
        });

        // Rarity filter buttons
        document.querySelectorAll('#rarityFilter .button').forEach(button => {
            button.addEventListener('click', (e) => {
                const rarity = e.currentTarget.getAttribute('data-rarity') || '';
                
                // Update active state
                document.querySelectorAll('#rarityFilter .button').forEach(b => b.classList.remove('button-active'));
                e.currentTarget.classList.add('button-active');
                
                this.currentFilters.rarity = rarity;
                this.searchCharacters(true);
            });
        });

        // Filter selects
        ['typeFilter', 'classFilter', 'categoryFilter', 'linkFilter'].forEach(id => {
            document.getElementById(id).addEventListener('change', () => {
                this.updateFiltersFromSelects();
                this.searchCharacters(true);
            });
        });

        // Sort controls
        document.getElementById('sortBy').addEventListener('change', () => {
            this.currentFilters.sortBy = document.getElementById('sortBy').value;
            this.searchCharacters(true);
        });

        document.getElementById('sortAsc').addEventListener('click', (e) => {
            document.querySelectorAll('#sortAsc, #sortDesc').forEach(b => b.classList.remove('button-active'));
            e.currentTarget.classList.add('button-active');
            this.currentFilters.sortOrder = 'asc';
            this.searchCharacters(true);
        });

        document.getElementById('sortDesc').addEventListener('click', (e) => {
            document.querySelectorAll('#sortAsc, #sortDesc').forEach(b => b.classList.remove('button-active'));
            e.currentTarget.classList.add('button-active');
            this.currentFilters.sortOrder = 'desc';
            this.searchCharacters(true);
        });

        // Update button
        document.getElementById('updateBtn').addEventListener('click', () => {
            this.triggerUpdate();
        });

        // Character list clicks (delegation for dynamic content)
        document.addEventListener('click', (e) => {
            const characterLink = e.target.closest('.character-list .item-link');
            if (characterLink) {
                e.preventDefault();
                const characterId = characterLink.getAttribute('data-character-id');
                if (characterId) {
                    this.showCharacterDetail(characterId);
                }
            }
        });

        // WebSocket events
        window.dokkanAPI.onScrapeProgress((progress) => {
            this.updateProgressDisplay(progress);
        });

        window.dokkanAPI.onScrapeComplete((result) => {
            this.handleScrapeComplete(result);
        });
    }

    async loadInitialData() {
        try {
            console.log('Starting loadInitialData...');
            this.setLoading(true);
            
            // Check if API is available
            if (!window.dokkanAPI) {
                console.error('DokkanAPI not available!');
                this.showError('API not available. Please refresh the page.');
                return;
            }
            
            console.log('API available, loading stats...');
            
            // Load stats first
            try {
                const stats = await window.dokkanAPI.getStats();
                console.log('Stats loaded successfully:', stats);
                this.updateStats(stats);
            } catch (statsError) {
                console.error('Failed to load stats:', statsError);
                this.showError('Failed to load statistics: ' + statsError.message);
            }
            
            console.log('Loading initial characters...');
            
            // Load initial characters
            try {
                const searchResult = await window.dokkanAPI.searchCharacters({ page: 1, limit: 20 });
                console.log('Search result loaded successfully:', searchResult);
                
                this.updateFiltersOptions(searchResult.filters);
                this.displayCharacters(searchResult.characters, true);
                this.updateResultsInfo(searchResult.pagination);
                this.hasMoreResults = searchResult.pagination.hasNext;
                
                console.log('Initial data loaded successfully!');
            } catch (searchError) {
                console.error('Failed to load characters:', searchError);
                this.showError('Failed to load characters: ' + searchError.message);
            }
            
        } catch (error) {
            console.error('Failed to load initial data:', error);
            this.showError('Failed to load data: ' + error.message);
        } finally {
            this.setLoading(false);
        }
    }

    updateStats(stats) {
        console.log('Updating stats display:', stats);
        
        document.getElementById('totalCharacters').textContent = window.dokkanAPI.formatNumber(stats.totalCharacters);
        document.getElementById('totalCategories').textContent = window.dokkanAPI.formatNumber(stats.totalCategories);
        document.getElementById('lastUpdate').textContent = window.dokkanAPI.formatDate(stats.lastUpdate);
    }

    updateFiltersOptions(filters) {
        console.log('Updating filter options:', filters);
        
        const updateSelect = (selectId, options) => {
            const select = document.getElementById(selectId);
            if (select) {
                // Remove all options except the first one
                while (select.children.length > 1) {
                    select.removeChild(select.lastChild);
                }
                // Add new options
                options.forEach(option => {
                    const optionEl = document.createElement('option');
                    optionEl.value = option;
                    optionEl.textContent = option;
                    select.appendChild(optionEl);
                });
            }
        };
        
        updateSelect('typeFilter', filters.types);
        updateSelect('classFilter', filters.classes);
        updateSelect('categoryFilter', filters.categories);
        updateSelect('linkFilter', filters.links);

        this.filters = filters;
    }

    updateFiltersFromSelects() {
        this.currentFilters.type = document.getElementById('typeFilter').value;
        this.currentFilters.class = document.getElementById('classFilter').value;
        this.currentFilters.category = document.getElementById('categoryFilter').value;
        this.currentFilters.link = document.getElementById('linkFilter').value;
    }

    handleSearch(query) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.currentFilters.search = query;
            this.searchCharacters(true);
        }, 300);
    }

    async searchCharacters(reset = false) {
        if (this.isLoading) return;

        try {
            this.setLoading(true);

            if (reset) {
                this.currentPage = 1;
                this.characters = [];
            }

            const params = {
                ...this.currentFilters,
                page: this.currentPage,
                limit: 20
            };

            const result = await window.dokkanAPI.searchCharacters(params);
            
            if (reset) {
                this.displayCharacters(result.characters, true);
            } else {
                this.displayCharacters(result.characters, false);
            }

            this.updateResultsInfo(result.pagination);
            this.hasMoreResults = result.pagination.hasNext;
            
            if (!reset) {
                this.currentPage++;
            }

        } catch (error) {
            console.error('Search failed:', error);
            this.showError('Search failed. Please try again.');
        } finally {
            this.setLoading(false);
        }
    }

    displayCharacters(characters, replace = false) {
        console.log('Displaying characters:', characters.length, 'replace:', replace);
        
        const container = document.getElementById('characterList');

        if (replace) {
            container.innerHTML = '';
            this.characters = [];
        }

        this.characters.push(...characters);

        characters.forEach(character => {
            const characterHTML = this.createCharacterListItem(character);
            container.insertAdjacentHTML('beforeend', characterHTML);
        });
    }

    createCharacterListItem(character) {
        const imageUrl = character.image_url && character.image_url !== 'Error' 
            ? character.image_url 
            : '';

        const imageContent = imageUrl 
            ? `<img src="${imageUrl}" alt="${character.name}" loading="lazy">` 
            : `<i class="f7-icons placeholder">person_crop_circle</i>`;

        return `
            <li class="item-content item-link" data-character-id="${character.id}">
                <div class="item-media">
                    ${imageContent}
                    <div class="rarity-badge ${character.rarity}">${character.rarity}</div>
                </div>
                <div class="item-inner">
                    <div class="item-title-row">
                        <div class="item-title character-name">${character.name}</div>
                    </div>
                    <div class="item-subtitle character-title">${character.title}</div>
                    <div class="item-text character-meta">
                        <span class="character-type type-${character.type}">${character.type}</span>
                        <span class="character-class class-${character.class}">${character.class}</span>
                        <span class="character-cost">Cost: ${character.cost}</span>
                    </div>
                </div>
            </li>
        `;
    }

    updateResultsInfo(pagination) {
        const total = window.dokkanAPI.formatNumber(pagination.total);
        const text = `${total} characters found`;
        
        document.getElementById('resultsCount').textContent = text;
    }

    async showCharacterDetail(characterId) {
        try {
            this.setLoading(true);
            
            const character = await window.dokkanAPI.getCharacter(characterId);
            
            this.displayCharacterDetail(character);
            this.popup.open();
            
        } catch (error) {
            console.error('Failed to load character:', error);
            this.showError('Failed to load character details.');
        } finally {
            this.setLoading(false);
        }
    }

    displayCharacterDetail(character) {
        // Update popup title
        document.getElementById('popupTitle').textContent = character.name;

        // Create detailed character view
        const detailHTML = this.createCharacterDetailHTML(character);
        document.getElementById('popupContent').innerHTML = detailHTML;
    }

    createCharacterDetailHTML(character) {
        const imageUrl = character.image_url && character.image_url !== 'Error' 
            ? character.image_url 
            : '';

        const imageContent = imageUrl 
            ? `<img src="${imageUrl}" alt="${character.name}" class="character-detail-image">` 
            : `<div class="character-detail-image" style="display: flex; align-items: center; justify-content: center;"><i class="f7-icons" style="font-size: 3rem; opacity: 0.5;">person_crop_circle</i></div>`;

        let html = `
            <div class="character-detail-header">
                ${imageContent}
                <div class="character-detail-name">${character.name}</div>
                <div class="character-detail-title">${character.title}</div>
                <div class="character-detail-stats">
                    <div class="stat-box">
                        <div class="stat-box-value">${character.rarity}</div>
                        <div class="stat-box-label">Rarity</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-box-value">${character.type}</div>
                        <div class="stat-box-label">Type</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-box-value">${character.cost}</div>
                        <div class="stat-box-label">Cost</div>
                    </div>
                </div>
            </div>
        `;

        // Stats section
        html += `
            <div class="detail-section">
                <div class="detail-section-title">
                    <i class="f7-icons">chart_bar</i> Stats
                </div>
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-item-label">Max Level</div>
                        <div class="stat-item-value">${character.max_level}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-item-label">Max SA Level</div>
                        <div class="stat-item-value">${character.max_sa_level}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-item-label">Base HP</div>
                        <div class="stat-item-value">${window.dokkanAPI.formatNumber(character.base_hp)}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-item-label">Max HP</div>
                        <div class="stat-item-value">${window.dokkanAPI.formatNumber(character.rainbow_hp)}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-item-label">Base ATK</div>
                        <div class="stat-item-value">${window.dokkanAPI.formatNumber(character.base_attack)}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-item-label">Max ATK</div>
                        <div class="stat-item-value">${window.dokkanAPI.formatNumber(character.rainbow_attack)}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-item-label">Base DEF</div>
                        <div class="stat-item-value">${window.dokkanAPI.formatNumber(character.base_defence)}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-item-label">Max DEF</div>
                        <div class="stat-item-value">${window.dokkanAPI.formatNumber(character.rainbow_defence)}</div>
                    </div>
                </div>
            </div>
        `;

        // Skills section
        if (character.leader_skill && character.leader_skill !== 'Error') {
            html += `
                <div class="detail-section">
                    <div class="detail-section-title">
                        <i class="f7-icons">crown</i> Leader Skill
                    </div>
                    <div class="detail-section-content">
                        ${character.leader_skill}
                    </div>
                </div>
            `;
        }

        if (character.super_attack && character.super_attack !== 'Error') {
            html += `
                <div class="detail-section">
                    <div class="detail-section-title">
                        <i class="f7-icons">burst</i> Super Attack
                    </div>
                    <div class="detail-section-content">
                        ${character.super_attack}
                    </div>
                </div>
            `;
        }

        if (character.passive && character.passive !== 'Error') {
            html += `
                <div class="detail-section">
                    <div class="detail-section-title">
                        <i class="f7-icons">bolt</i> Passive Skill
                    </div>
                    <div class="detail-section-content">
                        ${this.formatPassiveSkill(character.passive)}
                    </div>
                </div>
            `;
        }

        // Links section
        if (character.links && character.links.length > 0) {
            html += `
                <div class="detail-section">
                    <div class="detail-section-title">
                        <i class="f7-icons">link</i> Links
                    </div>
                    <div class="tags-container">
                        ${character.links.map(link => `<span class="tag">${link}</span>`).join('')}
                    </div>
                </div>
            `;
        }

        // Categories section
        if (character.categories && character.categories.length > 0) {
            html += `
                <div class="detail-section">
                    <div class="detail-section-title">
                        <i class="f7-icons">folder</i> Categories
                    </div>
                    <div class="tags-container">
                        ${character.categories.map(category => `<span class="tag">${category}</span>`).join('')}
                    </div>
                </div>
            `;
        }

        // Transformations section
        if (character.transformations && character.transformations.length > 0) {
            html += `
                <div class="detail-section">
                    <div class="detail-section-title">
                        <i class="f7-icons">arrow_2_circlepath</i> Transformations
                    </div>
                    ${character.transformations.map(transformation => this.createTransformationHTML(transformation)).join('')}
                </div>
            `;
        }

        return html;
    }

    formatPassiveSkill(passiveText) {
        console.log('Formatting passive skill:', passiveText);
        
        if (!passiveText || passiveText === 'Error') {
            return passiveText;
        }
        
        // Split by semicolon and create bullet points
        const parts = passiveText.split(';').map(part => part.trim()).filter(part => part.length > 0);
        
        console.log('Split parts:', parts);
        
        if (parts.length <= 1) {
            return passiveText; // Return original if no semicolons found
        }
        
        const formatted = '<ul class="passive-bullets">' + 
               parts.map(part => `<li>${part}</li>`).join('') + 
               '</ul>';
        
        console.log('Formatted passive:', formatted);
        return formatted;
    }

    createTransformationHTML(transformation) {
        const imageUrl = transformation.transformed_image_url && transformation.transformed_image_url !== 'Error' 
            ? transformation.transformed_image_url 
            : '';

        const imageContent = imageUrl 
            ? `<img src="${imageUrl}" alt="${transformation.transformed_name}" class="transformation-image">` 
            : `<div class="transformation-image" style="display: flex; align-items: center; justify-content: center;"><i class="f7-icons">person_crop_circle</i></div>`;

        return `
            <div class="transformation-card">
                <div class="transformation-header">
                    ${imageContent}
                    <div class="transformation-info">
                        <h4>${transformation.transformed_name}</h4>
                        <div class="character-meta">
                            <span class="character-type type-${transformation.transformed_type}">${transformation.transformed_type}</span>
                            <span class="character-class class-${transformation.transformed_class}">${transformation.transformed_class}</span>
                        </div>
                    </div>
                </div>
                ${transformation.transformed_super_attack && transformation.transformed_super_attack !== 'Error' ? 
                    `<div class="skill-item">
                        <div class="skill-name">Super Attack</div>
                        <div class="skill-description">${transformation.transformed_super_attack}</div>
                    </div>` : ''
                }
                ${transformation.transformed_passive && transformation.transformed_passive !== 'Error' ? 
                    `<div class="skill-item">
                        <div class="skill-name">Passive Skill</div>
                        <div class="skill-description">${this.formatPassiveSkill(transformation.transformed_passive)}</div>
                    </div>` : ''
                }
            </div>
        `;
    }

    async triggerUpdate() {
        try {
            await window.dokkanAPI.triggerScrape();
            this.updatePopup.open();
            this.showUpdateProgress();
        } catch (error) {
            console.error('Failed to trigger update:', error);
            this.showError(error.message || 'Failed to start database update.');
        }
    }

    showUpdateProgress() {
        document.getElementById('updateStatusContent').innerHTML = `
            <div class="update-progress-container">
                <div class="update-status-item">
                    <span>Status</span>
                    <span>Starting...</span>
                </div>
                <div class="update-progress-bar">
                    <div class="update-progress-fill" style="width: 0%"></div>
                </div>
                <div class="update-status-item">
                    <span>Progress</span>
                    <span id="updateProgressText">0%</span>
                </div>
            </div>
        `;
    }

    updateProgressDisplay(progress) {
        if (progress.isRunning) {
            document.querySelector('.update-progress-fill').style.width = `${progress.progress}%`;
            document.getElementById('updateProgressText').textContent = `${Math.round(progress.progress)}%`;
            document.querySelector('.update-status-item span:last-child').textContent = `Processing ${progress.category}...`;
        }
    }

    handleScrapeComplete(result) {
        if (result.success) {
            document.getElementById('updateStatusContent').innerHTML = `
                <div class="update-progress-container">
                    <div class="block-title">Update Complete!</div>
                    <div class="update-status-item">
                        <span>Characters Processed</span>
                        <span>${result.charactersProcessed || 0}</span>
                    </div>
                    <div class="update-status-item">
                        <span>Status</span>
                        <span style="color: var(--f7-theme-color);">Success</span>
                    </div>
                </div>
            `;
            
            // Reload data after successful update
            setTimeout(() => {
                this.updatePopup.close();
                this.loadInitialData();
            }, 3000);
        } else {
            document.getElementById('updateStatusContent').innerHTML = `
                <div class="update-progress-container">
                    <div class="block-title">Update Failed</div>
                    <div class="update-status-item">
                        <span>Error</span>
                        <span style="color: #e74c3c;">${result.error || 'Unknown error'}</span>
                    </div>
                </div>
            `;
        }
    }

    setLoading(loading) {
        this.isLoading = loading;
        
        const el = document.getElementById('loadingIndicator');
        if (el) {
            el.style.display = loading ? 'inline' : 'none';
        }
    }

    showError(message) {
        console.error('Error:', message);
        alert(message);
    }
}

// Initialize app when DOM is ready
console.log('Setting up DOMContentLoaded event listener...');
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded, creating DokkanApp...');
    try {
        window.dokkanApp = new DokkanApp();
        console.log('DokkanApp created successfully:', window.dokkanApp);
    } catch (error) {
        console.error('Failed to create DokkanApp:', error);
    }
});