class HSKVocabulary {
    constructor() {
        this.currentLevel = 1;
        this.words = [];
        this.currentIndex = 0;
        
        // DOM elements
        this.levelSelect = document.getElementById('hsk-level');
        this.newWordsBtn = document.getElementById('new-words');
        this.reviewBtn = document.getElementById('review-words');
        this.container = document.querySelector('.vocabulary-container');
        
        // Event listeners
        this.levelSelect.addEventListener('change', () => this.changeLevel());
        this.newWordsBtn.addEventListener('click', () => this.loadNewWords());
        this.reviewBtn.addEventListener('click', () => this.startReview());
        
        // Initial load
        this.loadWords();
    }
    
    async loadWords() {
        try {
            const response = await fetch(`/static/asset/csv/hsk${this.currentLevel}.csv`);
            const data = await response.text();
            this.words = this.parseCSV(data);
            this.displayWord(this.words[0]);
        } catch (error) {
            console.error('Error loading vocabulary:', error);
            this.container.innerHTML = '<div class="error-message">Error loading vocabulary. Please try again.</div>';
        }
    }
    
    parseCSV(csv) {
        const lines = csv.split('\n').filter(line => line.trim());
        return lines.map(line => {
            const [chinese, pinyin, english] = line.split(',').map(item => item.trim());
            // Create example sentence using the word
            const example = this.createExample(chinese);
            return { chinese, pinyin, english, example };
        });
    }
    
    createExample(word) {
        // Simple example sentences based on the word
        const templates = [
            `这是一个${word}。`,
            `我喜欢${word}。`,
            `${word}很好。`,
            `你看这个${word}。`
        ];
        return templates[Math.floor(Math.random() * templates.length)];
    }
    
    changeLevel() {
        this.currentLevel = this.levelSelect.value;
        this.loadWords();
    }
    
    loadNewWords() {
        const randomWords = this.getRandomWords(5);
        this.displayWords(randomWords);
    }
    
    startReview() {
        // Get words that haven't been shown recently
        const wordsToReview = this.getWordsForReview();
        this.displayWords(wordsToReview);
    }
    
    getRandomWords(count) {
        const shuffled = [...this.words].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
    
    getWordsForReview() {
        // For now, just return random words
        // In a full implementation, this would use spaced repetition
        return this.getRandomWords(5);
    }
    
    displayWords(words) {
        if (!words || words.length === 0) {
            this.container.innerHTML = '<div class="error-message">No words available.</div>';
            return;
        }

        this.container.innerHTML = words.map(word => `
            <div class="word-card">
                <div class="word-chinese">${word.chinese}</div>
                <div class="word-pinyin">${word.pinyin}</div>
                <div class="word-english">${word.english}</div>
                <div class="word-example">${word.example}</div>
                <div class="word-controls">
                    <button class="word-btn" onclick="speak('${word.chinese}', 'zh')">
                        🔊 Listen
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    displayWord(word) {
        if (word) {
            this.displayWords([word]);
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
document.addEventListener('DOMContentLoaded', () => {
    new HSKVocabulary();
}); 