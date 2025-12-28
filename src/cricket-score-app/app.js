// Simple single-innings scoreboard logic
let runs = 0;
let wickets = 0;
let balls = 0; // balls in current over (0-5)
let totalBalls = 0; // total balls bowled

// player stats
const batsmen = {};
const bowlers = {};
const battingBody = document.querySelector('#batting-table tbody');
const bowlingBody = document.querySelector('#bowling-table tbody');

// Simple single-innings scoreboard logic
let runs = 0;
let wickets = 0;
let balls = 0; // balls in current over (0-5)
let totalBalls = 0; // total balls bowled

const strikerEl = document.getElementById('striker');
const nonstrikerEl = document.getElementById('nonstriker');
const bowlerEl = document.getElementById('bowler');
    // Count the ball for normal scoring (not wides/no-balls)
    totalBalls += 1;
    runs += n;
    // ensure players exist in stats
    ensureBatsman(strikerEl.textContent);
    ensureBowler(bowlerEl.textContent);
    // update batsman and bowler stats
    batsmen[strikerEl.textContent].runs += n;
    batsmen[strikerEl.textContent].balls += 1;
    bowlers[bowlerEl.textContent].runsConceded += n;
    bowlers[bowlerEl.textContent].balls += 1;

    addEventToScorecard(`${n} run${n>1?"s":""}`, n);
    // rotate strike on odd runs
    if (n % 2 === 1) swapStrike();
    // if over completed, swap strike
    if (totalBalls % 6 === 0) swapStrike();
    renderPlayerTables();
    refreshDisplay();
}

function addRuns(n) {
    // Wicket on a legal delivery
    totalBalls += 1;
    wickets += 1;
    ensureBowler(bowlerEl.textContent);
    bowlers[bowlerEl.textContent].wickets += 1;
    // mark striker as out
    ensureBatsman(strikerEl.textContent);
    batsmen[strikerEl.textContent].out = true;
    addEventToScorecard('WICKET', 0);
    // prompt for replacement batsman
    const replacement = prompt('Enter new batsman name:', 'Player ' + (Object.keys(batsmen).length + 1));
    const newName = replacement && replacement.trim() ? replacement.trim() : 'Sub ' + (Object.keys(batsmen).length + 1);
    ensureBatsman(newName);
    strikerEl.textContent = newName;
    // bowler gets a ball
    ensureBowler(bowlerEl.textContent);
    bowlers[bowlerEl.textContent].balls += 1;
    renderPlayerTables();
    refreshDisplay();

function addBall() {
    totalBalls += 1;
    totalBalls += 1;
    // count as a dot ball for striker and bowler
    ensureBatsman(strikerEl.textContent);
    batsmen[strikerEl.textContent].balls += 1;
    ensureBowler(bowlerEl.textContent);
    bowlers[bowlerEl.textContent].balls += 1;
    addEventToScorecard('BALL', 0);
    // on over completion, swap striker
    if (totalBalls % 6 === 0) swapStrike();
    renderPlayerTables();
    refreshDisplay();

function resetAll() {
    runs = 0; wickets = 0; balls = 0; totalBalls = 0;
    scorecardBody.innerHTML = '';
    strikerEl.textContent = document.getElementById('input-striker').value || 'Player 1';
    nonstrikerEl.textContent = document.getElementById('input-nonstriker').value || 'Player 2';
    bowlerEl.textContent = document.getElementById('input-bowler').value || 'Bowler 1';
    refreshDisplay();
}

// Hook up controls
document.getElementById('add-1').addEventListener('click', () => addRuns(1));
document.getElementById('add-4').addEventListener('click', () => addRuns(4));
document.getElementById('add-6').addEventListener('click', () => addRuns(6));
document.getElementById('add-wicket').addEventListener('click', addWicket);
document.getElementById('add-ball').addEventListener('click', addBall);
document.getElementById('reset').addEventListener('click', resetAll);

document.getElementById('update-names').addEventListener('click', () => {
    strikerEl.textContent = document.getElementById('input-striker').value || strikerEl.textContent;
    nonstrikerEl.textContent = document.getElementById('input-nonstriker').value || nonstrikerEl.textContent;
    bowlerEl.textContent = document.getElementById('input-bowler').value || bowlerEl.textContent;
});

// init display
refreshDisplay();
