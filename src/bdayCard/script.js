// Confetti effect for the main image
class ConfettiEffect {
    constructor() {
        this.confettiContainer = null;
        this.animationId = null;
        this.confettiPieces = [];
        this.isActive = false;
        this.spawnCounter = 0;
    }

    createConfettiContainer() {
        if (this.confettiContainer) return;
        
        this.confettiContainer = document.createElement('div');
        this.confettiContainer.className = 'confetti-container';
        document.body.appendChild(this.confettiContainer);
    }

    createConfettiPiece() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#e056fd', '#ff7675'];
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 10 + 6;
        
        // Position confetti randomly across the top of the screen
        const startX = Math.random() * window.innerWidth;
        const vx = (Math.random() - 0.5) * 1; // Slight horizontal drift
        
        piece.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
            left: ${startX}px;
            top: -20px;
            z-index: 1000;
            pointer-events: none;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            opacity: 0.9;
        `;
        
        this.confettiContainer.appendChild(piece);
        
        return {
            element: piece,
            x: startX,
            y: -20,
            vx: vx, // Slight horizontal drift
            vy: Math.random() * 1.5 + 1.5, // Downward velocity
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 8
        };
    }

    startConfetti() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.createConfettiContainer();
        this.confettiPieces = [];
        this.spawnCounter = 0;
        
        this.animate();
    }

    animate() {
        if (!this.isActive) return;
        
        // Spawn new confetti pieces continuously
        this.spawnCounter++;
        if (this.spawnCounter % 3 === 0) { // Spawn every 3 frames for much more confetti
            // Create multiple pieces from the top
            for (let i = 0; i < 6; i++) {
                const piece = this.createConfettiPiece();
                this.confettiPieces.push(piece);
            }
        }
        
        // Update existing confetti pieces
        for (let i = this.confettiPieces.length - 1; i >= 0; i--) {
            const piece = this.confettiPieces[i];
            
            piece.y += piece.vy;
            piece.x += piece.vx;
            piece.rotation += piece.rotationSpeed;
            piece.vy += 0.05; // Lighter gravity for slower fall
            
            piece.element.style.transform = `translate(${piece.x}px, ${piece.y}px) rotate(${piece.rotation}deg)`;
            
            // Remove pieces that have fallen off screen
            if (piece.y > window.innerHeight + 50) {
                piece.element.remove();
                this.confettiPieces.splice(i, 1);
            }
        }
        
        // Continue animation
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    stopConfetti() {
        this.isActive = false;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        // Let existing confetti finish falling naturally
        setTimeout(() => {
            // Clear any remaining confetti after a delay
            this.confettiPieces.forEach(piece => {
                if (piece.element && piece.element.parentNode) {
                    piece.element.remove();
                }
            });
            this.confettiPieces = [];
            
            if (this.confettiContainer) {
                this.confettiContainer.remove();
                this.confettiContainer = null;
            }
        }, 3000); // Let confetti fall for 3 seconds after hover ends
    }
}

// Initialize confetti effect
const confetti = new ConfettiEffect();

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const mainImage = document.querySelector('.main-pic');
    
    if (mainImage) {
        mainImage.addEventListener('mouseenter', () => {
            confetti.startConfetti();
        });
        
        mainImage.addEventListener('mouseleave', () => {
            confetti.stopConfetti();
        });
    }
});
// Background music functionality
function initBackgroundMusic() {
    const audio = document.getElementById('backgroundMusic');
    if (audio) {
        // Set volume to a comfortable level
        audio.volume = 0.1;
        
        // Try to unmute and play after user interaction
        document.addEventListener('click', function enableAudio() {
            audio.muted = false;
            audio.play().catch(e => console.log('Audio play failed:', e));
            document.removeEventListener('click', enableAudio);
        }, { once: true });
    }
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const mainImage = document.querySelector('.main-pic');
    
    if (mainImage) {
        mainImage.addEventListener('mouseenter', () => {
            confetti.startConfetti();
        });
        
        mainImage.addEventListener('mouseleave', () => {
            confetti.stopConfetti();
        });
    }
    
    // Initialize background music
    initBackgroundMusic();
});
