window.onload = function() {
    // --- ELEMENT SELECTORS ---
    const caseElement = document.getElementById('case');
    const discField = document.getElementById('disc-field');
    const scoreText = document.getElementById('game-score');
    const startOverlay = document.getElementById('start-overlay');
    const startBtn = document.getElementById('start-btn');
    
    const gameOverOverlay = document.getElementById('game-over-overlay');
    const finalScoreText = document.getElementById('final-score');
    const restartBtn = document.getElementById('restart-btn');

    let score = 0;
    let gameActive = false;

    // --- BUTTON EVENT LISTENERS ---
    startBtn.addEventListener('click', () => {
        startOverlay.style.display = 'none';
        startGame();
    });

    restartBtn.addEventListener('click', () => {
        location.reload(); // Simplest way to reset the game state
    });

    // --- MOVEMENT & SCROLL PREVENTION ---
    document.addEventListener('keydown', (e) => {
        if (!gameActive) return;

        // Stops the browser from scrolling up/down when you play
        if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
            e.preventDefault();
        }

        const cur = caseElement.className;
        
        if (e.key === "ArrowUp") {
            if (cur === 'pos-bl') caseElement.className = 'pos-tl';
            if (cur === 'pos-br') caseElement.className = 'pos-tr';
        } else if (e.key === "ArrowDown") {
            if (cur === 'pos-tl') caseElement.className = 'pos-bl';
            if (cur === 'pos-tr') caseElement.className = 'pos-br';
        } else if (e.key === "ArrowLeft") {
            if (cur === 'pos-tr') caseElement.className = 'pos-tl';
            if (cur === 'pos-br') caseElement.className = 'pos-bl';
        } else if (e.key === "ArrowRight") {
            if (cur === 'pos-tl') caseElement.className = 'pos-tr';
            if (cur === 'pos-bl') caseElement.className = 'pos-br';
        }
    });

    // --- GAME ENGINE ---
    function startGame() {
        gameActive = true;
        score = 0;
        scoreText.innerText = score;
        scheduleNextSpawn();
    }

    function scheduleNextSpawn() {
        if (!gameActive) return;

        // The gap between movies gets shorter as you score
        let nextSpawnDelay = Math.max(600, 2000 - (score * 80));

        setTimeout(() => {
            if (gameActive) {
                createDisc();
                scheduleNextSpawn();
            }
        }, nextSpawnDelay);
    }

    function createDisc() {
        const sides = ['tl', 'bl', 'tr', 'br'];
        const startType = sides[Math.floor(Math.random() * sides.length)];
        const disc = document.createElement('div');
        disc.className = 'disc';
        
        // Positioning logic
        let startX = startType.includes('r') ? 450 : 20;
        let startY = startType.includes('t') ? 75 : 225;
        let targetX = startType.includes('r') ? 315 : 125; 

        disc.style.left = startX + 'px';
        disc.style.top = startY + 'px';
        discField.appendChild(disc);

        // Travel speed: The disc slides faster as score increases
        let travelDuration = Math.max(700, 2500 - (score * 120)); 
        
        const animation = disc.animate([
            { left: startX + 'px' },
            { left: targetX + 'px' }
        ], { duration: travelDuration, easing: 'linear' });

        animation.onfinish = () => {
            if (!gameActive) return;

            const casePos = caseElement.className.replace('pos-', '');
            if (casePos === startType) {
                // Success: Catch movie
                score++;
                scoreText.innerText = score;
                disc.remove();
            } else {
                // Failure: Game Over
                gameOver();
            }
        };
    }

    function gameOver() {
        gameActive = false;
        finalScoreText.innerText = score;
        gameOverOverlay.style.display = 'flex';
        
        // Remove any discs still sliding
        discField.innerHTML = '';
    }
};