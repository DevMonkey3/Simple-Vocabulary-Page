class VocabularyCalendar {
    constructor() {
        this.VERSION = "2.1";
        this.vocabularyStore = {};
        this.reviewWords = [];
        this.currentReviewIndex = 0;
        this.initializeYearSelect();
        this.bindEvents();
        this.renderCalendar();
    }

    initializeYearSelect() {
        const yearSelect = document.getElementById('yearSelect');
        const currentYear = new Date().getFullYear();
        for (let i = currentYear - 5; i <= currentYear + 5; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.text = i;
            if (i === currentYear) option.selected = true;
            yearSelect.appendChild(option);
        }
    }

    bindEvents() {
        document.getElementById('yearSelect').addEventListener('change', () => this.renderCalendar());
        document.getElementById('monthSelect').addEventListener('change', () => this.renderCalendar());
        document.getElementById('addWordBtn').addEventListener('click', () => this.addWord());
        document.getElementById('reviewBtn').addEventListener('click', () => this.startReview());
        document.getElementById('flipCardBtn').addEventListener('click', () => this.flipCard());
        document.getElementById('nextCardBtn').addEventListener('click', () => this.nextCard());
        document.getElementById('closeReviewBtn').addEventListener('click', () => this.closeReview());
    }

    renderCalendar() {
        const calendar = document.getElementById('calendar');
        const year = document.getElementById('yearSelect').value;
        const month = document.getElementById('monthSelect').value;

        calendar.innerHTML = '';

        const firstDay = new Date(year, month - 1, 1).getDay();
        const daysInMonth = new Date(year, month, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            calendar.appendChild(document.createElement('div'));
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'day-cell';

            const dateLabel = document.createElement('div');
            dateLabel.textContent = day;
            dateLabel.className = 'date';
            dayCell.appendChild(dateLabel);

            const key = `${year}-${month}-${day}`;
            const words = this.vocabularyStore[key] || [];
            
            words.forEach(word => {
                const wordTag = document.createElement('div');
                wordTag.textContent = word.word;
                wordTag.className = 'word-tag';
                wordTag.addEventListener('click', () => alert(word.definition));
                dayCell.appendChild(wordTag);
            });

            calendar.appendChild(dayCell);
        }
    }

    addWord() {
        const word = document.getElementById('wordInput').value.trim();
        const definition = document.getElementById('definitionInput').value.trim();

        if (!word || !definition) {
            alert('请输入单词和解释');
            return;
        }

        const year = document.getElementById('yearSelect').value;
        const month = document.getElementById('monthSelect').value;
        const day = new Date().getDate();

        const key = `${year}-${month}-${day}`;
        if (!this.vocabularyStore[key]) {
            this.vocabularyStore[key] = [];
        }

        this.vocabularyStore[key].push({ word, definition });
        this.renderCalendar();

        document.getElementById('wordInput').value = '';
        document.getElementById('definitionInput').value = '';
    }

    startReview() {
        this.reviewWords = [];
        for (const key in this.vocabularyStore) {
            this.reviewWords.push(...this.vocabularyStore[key]);
        }

        if (this.reviewWords.length === 0) {
            alert('没有可复习的词汇');
            return;
        }

        this.reviewWords.sort(() => Math.random() - 0.5);
        this.currentReviewIndex = 0;

        document.getElementById('reviewModal').style.display = 'flex';
        this.updateFlashCard();
    }

    updateFlashCard() {
        const currentWord = this.reviewWords[this.currentReviewIndex];
        document.getElementById('cardFront').textContent = currentWord.word;
        document.getElementById('cardBack').textContent = currentWord.definition;
        
        document.getElementById('flashCard').classList.remove('flipped');
    }

    flipCard() {
        document.getElementById('flashCard').classList.toggle('flipped');
    }

    nextCard() {
        this.currentReviewIndex = (this.currentReviewIndex + 1) % this.reviewWords.length;
        this.updateFlashCard();
    }

    closeReview() {
        document.getElementById('reviewModal').style.display = 'none';
    }
}

const vocabularyCalendar = new VocabularyCalendar();