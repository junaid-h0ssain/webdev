
function updateScore(team, delta) {
    const scoreElement = document.getElementById(`score-${team}`);
    let currentScore = parseInt(scoreElement.textContent, 10);
    currentScore += delta;
    if (currentScore < 0) currentScore = 0;
    scoreElement.textContent = currentScore;
}

document.getElementById('increment-a').addEventListener('click', () => {
    updateScore('a', 1);
});
document.getElementById('increment-a-2').addEventListener('click', () => {
    updateScore('a', 2);
});
document.getElementById('increment-a-3').addEventListener('click', () => {
    updateScore('a', 3);
});

document.getElementById('increment-b').addEventListener('click', () => {
    updateScore('b', 1);
});
document.getElementById('increment-b-2').addEventListener('click', () => {
    updateScore('b', 2);
});
document.getElementById('increment-b-3').addEventListener('click', () => {
    updateScore('b', 3);
});

function leadingTeam() {
    const scoreA = parseInt(document.getElementById('score-a').textContent, 10);
    const scoreB = parseInt(document.getElementById('score-b').textContent, 10);
    if (scoreA > scoreB) {
        return 'a';
    } else if (scoreB > scoreA) {
        return 'b';
    }
    return 'tie';
}

setInterval(() => {
    const leader = leadingTeam();
    document.querySelector('.team-a').classList.toggle('leading', leader === 'a');
    document.querySelector('.team-b').classList.toggle('leading', leader === 'b');
    const leadElement = document.getElementById('lead');
        if (leader === 'tie') {
        leadElement.textContent = "It's a tie!";
    } else {
        leadElement.textContent = `Leading: Team ${leader.toUpperCase()}`;
    }
}, 500);