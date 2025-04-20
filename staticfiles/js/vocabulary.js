class VocabularyManager {
    constructor() {
        this.words = [];
        this.dailyWords = [];
        this.currentLevel = 1;
        this.currentPage = 1;
        this.wordsPerPage = 20;
        this.viewMode = 'grid';
        
        // DOM elements
        this.initializeElements();
        
        // Event listeners
        this.setupEventListeners();
        
        // Load initial data
        this.loadDailyWords();
        this.loadAllWords();
        
        // Load progress from localStorage
        this.loadProgress();
    }
    
    initializeElements() {
        // Daily words elements
        this.hskLevelSelect = document.getElementById('hsk-level');
        this.refreshButton = document.getElementById('refresh-daily');
        this.dailyWordsContainer = document.getElementById('daily-words');
        this.progressBar = document.getElementById('daily-progress-bar');
        
        // Word list elements
        this.searchInput = document.getElementById('word-search');
        this.listLevelSelect = document.getElementById('list-hsk-level');
        this.wordListContainer = document.getElementById('complete-word-list');
        this.gridViewBtn = document.getElementById('grid-view');
        this.listViewBtn = document.getElementById('list-view');
        this.prevPageBtn = document.getElementById('prev-page');
        this.nextPageBtn = document.getElementById('next-page');
        this.pageInfo = document.getElementById('page-info');
        
        // Progress elements
        this.masteredCount = document.getElementById('mastered-count');
        this.dayStreak = document.getElementById('day-streak');
    }
    
    setupEventListeners() {
        this.hskLevelSelect.addEventListener('change', () => this.loadDailyWords());
        this.refreshButton.addEventListener('click', () => this.loadDailyWords());
        this.searchInput.addEventListener('input', () => this.filterWords());
        this.listLevelSelect.addEventListener('change', () => this.filterWords());
        this.gridViewBtn.addEventListener('click', () => this.changeView('grid'));
        this.listViewBtn.addEventListener('click', () => this.changeView('list'));
        this.prevPageBtn.addEventListener('click', () => this.changePage(-1));
        this.nextPageBtn.addEventListener('click', () => this.changePage(1));
    }
    
    async loadDailyWords() {
        try {
            const level = this.hskLevelSelect.value;
            const response = await fetch(`/static/asset/csv/hsk${level}.csv`);
            const data = await response.text();
            const words = this.parseCSV(data);
            this.dailyWords = this.getRandomWords(words, 20);
            this.displayDailyWords();
        } catch (error) {
            console.error('Error loading daily words:', error);
        }
    }
    
    async loadAllWords() {
        try {
            this.words = [];
            for (let level = 1; level <= 6; level++) {
                const response = await fetch(`/static/asset/csv/hsk${level}.csv`);
                const data = await response.text();
                const levelWords = this.parseCSV(data);
                levelWords.forEach(word => word.level = level);
                this.words = [...this.words, ...levelWords];
            }
            this.filterWords();
        } catch (error) {
            console.error('Error loading all words:', error);
        }
    }
    
    parseCSV(csv) {
        const lines = csv.split('\n').filter(line => line.trim());
        return lines.map(line => {
            const [chinese, pinyin, english] = line.split(',').map(item => item.trim());
            return { chinese, pinyin, english, mastered: false };
        });
    }
    
    getRandomWords(words, count) {
        const shuffled = [...words].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
    
    displayDailyWords() {
        this.dailyWordsContainer.innerHTML = this.dailyWords.map(word => `
            <div class="word-card ${word.mastered ? 'mastered' : ''}" data-word="${word.chinese}">
                <div class="word-chinese">${word.chinese}</div>
                <div class="word-pinyin">${word.pinyin}</div>
                <div class="word-english">${word.english}</div>
                <div class="word-controls">
                    <button class="word-btn" onclick="speak('${word.chinese}', 'zh')">🔊</button>
                    <button class="word-btn master-btn" onclick="vocabulary.toggleMastered('${word.chinese}')">
                        ${word.mastered ? '✓' : '○'}
                    </button>
                </div>
            </div>
        `).join('');
        
        this.updateProgress();
    }
    
    filterWords() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const level = parseInt(this.listLevelSelect.value);
        
        let filtered = [...this.words];
        
        if (searchTerm) {
            filtered = filtered.filter(word => 
                word.chinese.includes(searchTerm) ||
                word.pinyin.toLowerCase().includes(searchTerm) ||
                word.english.toLowerCase().includes(searchTerm)
            );
        }
        
        if (level > 0) {
            filtered = filtered.filter(word => word.level === level);
        }
        
        this.displayWordList(filtered);
    }
    
    displayWordList(words) {
        const start = (this.currentPage - 1) * this.wordsPerPage;
        const end = start + this.wordsPerPage;
        const pageWords = words.slice(start, end);
        
        this.wordListContainer.className = `word-list-container ${this.viewMode}-view`;
        this.wordListContainer.innerHTML = pageWords.map(word => `
            <div class="word-item ${word.mastered ? 'mastered' : ''}" data-word="${word.chinese}">
                <div class="word-chinese">${word.chinese}</div>
                <div class="word-pinyin">${word.pinyin}</div>
                <div class="word-english">${word.english}</div>
                <div class="word-level">HSK ${word.level}</div>
                <div class="word-controls">
                    <button class="word-btn" onclick="speak('${word.chinese}', 'zh')">🔊</button>
                    <button class="word-btn master-btn" onclick="vocabulary.toggleMastered('${word.chinese}')">
                        ${word.mastered ? '✓' : '○'}
                    </button>
                </div>
            </div>
        `).join('');
        
        const totalPages = Math.ceil(words.length / this.wordsPerPage);
        this.pageInfo.textContent = `Page ${this.currentPage} of ${totalPages}`;
        this.prevPageBtn.disabled = this.currentPage === 1;
        this.nextPageBtn.disabled = this.currentPage === totalPages;
    }
    
    changeView(mode) {
        this.viewMode = mode;
        this.gridViewBtn.classList.toggle('active', mode === 'grid');
        this.listViewBtn.classList.toggle('active', mode === 'list');
        this.filterWords();
    }
    
    changePage(delta) {
        this.currentPage += delta;
        this.filterWords();
    }
    
    toggleMastered(chinese) {
        // Update in daily words
        this.dailyWords = this.dailyWords.map(word => {
            if (word.chinese === chinese) {
                word.mastered = !word.mastered;
            }
            return word;
        });
        
        // Update in all words
        this.words = this.words.map(word => {
            if (word.chinese === chinese) {
                word.mastered = !word.mastered;
            }
            return word;
        });
        
        this.displayDailyWords();
        this.filterWords();
        this.saveProgress();
    }
    
    updateProgress() {
        const masteredCount = this.dailyWords.filter(word => word.mastered).length;
        this.progressBar.style.width = `${(masteredCount / 20) * 100}%`;
        this.progressBar.textContent = `${masteredCount}/20`;
        
        // Update total mastered count
        const totalMastered = this.words.filter(word => word.mastered).length;
        this.masteredCount.textContent = totalMastered;
    }
    
    saveProgress() {
        const progress = {
            masteredWords: this.words.filter(word => word.mastered).map(word => word.chinese),
            lastDate: new Date().toDateString(),
            streak: parseInt(this.dayStreak.textContent)
        };
        localStorage.setItem('vocabularyProgress', JSON.stringify(progress));
    }
    
    loadProgress() {
        try {
            const progress = JSON.parse(localStorage.getItem('vocabularyProgress'));
            if (progress) {
                const masteredWords = new Set(progress.masteredWords);
                this.words = this.words.map(word => ({
                    ...word,
                    mastered: masteredWords.has(word.chinese)
                }));
                
                // Update streak
                const lastDate = new Date(progress.lastDate);
                const today = new Date();
                if (today.toDateString() === lastDate.toDateString()) {
                    this.dayStreak.textContent = progress.streak;
                } else if ((today - lastDate) / (1000 * 60 * 60 * 24) <= 1) {
                    this.dayStreak.textContent = progress.streak + 1;
                } else {
                    this.dayStreak.textContent = 0;
                }
            }
        } catch (error) {
            console.error('Error loading progress:', error);
        }
    }
}

// Text-to-speech function
function speak(text, lang) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
}

// Initialize vocabulary system when DOM is loaded
let vocabulary;
document.addEventListener('DOMContentLoaded', () => {
    vocabulary = new VocabularyManager();
}); 