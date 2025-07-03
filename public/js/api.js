// API client for Dokkan Database
console.log('Loading api.js...');

class DokkanAPI {
    constructor() {
        this.baseURL = window.location.origin;
        this.socket = null;
        this.isConnected = false;
    }

    // Initialize WebSocket connection
    initializeSocket() {
        if (typeof io !== 'undefined') {
            this.socket = io();
            
            this.socket.on('connect', () => {
                console.log('WebSocket connected');
                this.isConnected = true;
            });

            this.socket.on('disconnect', () => {
                console.log('WebSocket disconnected');
                this.isConnected = false;
            });

            this.socket.on('scrapeProgress', (progress) => {
                this.handleScrapeProgress(progress);
            });

            this.socket.on('scrapeComplete', (result) => {
                this.handleScrapeComplete(result);
            });
        }
    }

    // Search characters with filters and pagination
    async searchCharacters(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            // Add all non-empty parameters
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    queryParams.append(key, value);
                }
            });

            const response = await fetch(`${this.baseURL}/api/characters?${queryParams}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Search failed');
            }
            
            return data.data;
        } catch (error) {
            console.error('Search error:', error);
            throw error;
        }
    }

    // Get character by ID
    async getCharacter(id) {
        try {
            const response = await fetch(`${this.baseURL}/api/characters/${encodeURIComponent(id)}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Character not found');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Failed to get character');
            }
            
            return data.data;
        } catch (error) {
            console.error('Get character error:', error);
            throw error;
        }
    }

    // Get database statistics
    async getStats() {
        try {
            const response = await fetch(`${this.baseURL}/api/characters/stats/summary`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Failed to get stats');
            }
            
            return data.data;
        } catch (error) {
            console.error('Get stats error:', error);
            throw error;
        }
    }

    // Get scrape status
    async getScrapeStatus() {
        try {
            const response = await fetch(`${this.baseURL}/api/scrape/status`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Failed to get scrape status');
            }
            
            return data.data;
        } catch (error) {
            console.error('Get scrape status error:', error);
            throw error;
        }
    }

    // Get scrape progress
    async getScrapeProgress() {
        try {
            const response = await fetch(`${this.baseURL}/api/scrape/progress`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Failed to get scrape progress');
            }
            
            return data.data;
        } catch (error) {
            console.error('Get scrape progress error:', error);
            throw error;
        }
    }

    // Trigger database update
    async triggerScrape() {
        try {
            const response = await fetch(`${this.baseURL}/api/scrape/trigger`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                if (response.status === 409) {
                    throw new Error('Scraping is already in progress');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Failed to trigger scrape');
            }
            
            return data;
        } catch (error) {
            console.error('Trigger scrape error:', error);
            throw error;
        }
    }

    // Handle scrape progress updates
    handleScrapeProgress(progress) {
        console.log('Scrape progress:', progress);
        
        // Dispatch custom event for components to listen to
        const event = new CustomEvent('scrapeProgress', { detail: progress });
        window.dispatchEvent(event);
    }

    // Handle scrape completion
    handleScrapeComplete(result) {
        console.log('Scrape complete:', result);
        
        // Dispatch custom event for components to listen to
        const event = new CustomEvent('scrapeComplete', { detail: result });
        window.dispatchEvent(event);
    }

    // Event listeners for progress updates
    onScrapeProgress(callback) {
        window.addEventListener('scrapeProgress', (event) => {
            callback(event.detail);
        });
    }

    onScrapeComplete(callback) {
        window.addEventListener('scrapeComplete', (event) => {
            callback(event.detail);
        });
    }

    // Helper method to format numbers
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // Helper method to format dates
    formatDate(dateString) {
        if (!dateString) return 'Never';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString();
        }
    }

    // Helper method to get rarity color
    getRarityColor(rarity) {
        const colors = {
            'LR': '#ff6b35',
            'UR': '#667eea',
            'SSR': '#fcb69f',
            'SR': '#a8edea',
            'R': '#d299c2',
            'N': '#ddd'
        };
        return colors[rarity] || '#ddd';
    }

    // Helper method to get type color
    getTypeColor(type) {
        const colors = {
            'PHY': '#ff6b35',
            'STR': '#e74c3c',
            'AGL': '#3498db',
            'TEQ': '#f39c12',
            'INT': '#9b59b6'
        };
        return colors[type] || '#666';
    }
}

// Create global API instance
console.log('Creating global DokkanAPI instance...');
window.dokkanAPI = new DokkanAPI();
console.log('DokkanAPI instance created:', window.dokkanAPI);