(function () {
    const homeDisplay = document.getElementById('homeDisplay');
    const guestDisplay = document.getElementById('guestDisplay');
    const buttons = document.querySelectorAll('.btn');
    const resetBtn = document.getElementById('reset');

    let homeScore = 0;
    let guestScore = 0;

    function render() {
        homeDisplay.textContent = homeScore;
        guestDisplay.textContent = guestScore;
    }

    function pulse(el) {
        el.style.transform = 'scale(1.04)';
        setTimeout(() => (el.style.transform = ''), 120);
    }

    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const team = btn.dataset.team;
            const add = Number(btn.dataset.add) || 0;
            if (team === 'home') homeScore += add;
            else guestScore += add;
            render();
            const disp = team === 'home' ? homeDisplay : guestDisplay;
            pulse(disp);
        });
    });

    resetBtn.addEventListener('click', () => {
        homeScore = 0;
        guestScore = 0;
        render();
    });

    // initialize
    render();
})();
