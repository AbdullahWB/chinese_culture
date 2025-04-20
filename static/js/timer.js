class Timer {
    constructor() {
        this.timeLeft = 25 * 60; // 25 minutes in seconds
        this.timerId = null;
        this.isRunning = false;
        
        // DOM elements
        this.display = document.querySelector('.timer-display');
        this.startBtn = document.querySelector('.timer-btn[data-action="start"]');
        this.shortBreakBtn = document.querySelector('.timer-btn[data-action="short-break"]');
        this.longBreakBtn = document.querySelector('.timer-btn[data-action="long-break"]');
        
        // Bind event listeners
        this.startBtn.addEventListener('click', () => this.toggleTimer());
        this.shortBreakBtn.addEventListener('click', () => this.setShortBreak());
        this.longBreakBtn.addEventListener('click', () => this.setLongBreak());
    }
    
    toggleTimer() {
        if (this.isRunning) {
            this.pauseTimer();
            this.startBtn.textContent = 'start';
        } else {
            this.startTimer();
            this.startBtn.textContent = 'pause';
        }
    }
    
    startTimer() {
        this.isRunning = true;
        this.timerId = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            
            if (this.timeLeft <= 0) {
                this.pauseTimer();
                this.playAlarm();
            }
        }, 1000);
    }
    
    pauseTimer() {
        this.isRunning = false;
        clearInterval(this.timerId);
    }
    
    setShortBreak() {
        this.pauseTimer();
        this.timeLeft = 5 * 60; // 5 minutes
        this.updateDisplay();
        this.startBtn.textContent = 'start';
    }
    
    setLongBreak() {
        this.pauseTimer();
        this.timeLeft = 15 * 60; // 15 minutes
        this.updateDisplay();
        this.startBtn.textContent = 'start';
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    playAlarm() {
        const audio = new Audio('/static/sounds/alarm.mp3');
        audio.play();
    }
}

// Initialize timer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Timer();
}); 