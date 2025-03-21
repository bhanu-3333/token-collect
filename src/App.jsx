import { useEffect, useRef, useState } from 'react';
import './styles/App.css';

function App() {
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const player = useRef({ x: 375, y: 550, width: 50, height: 50, speed: 5 });
    const tokens = useRef([]);
    const keys = useRef({});
    const speedMultiplier = useRef(1);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 600;

        function createToken() {
            tokens.current.push({
                x: Math.random() * (canvas.width - 20),
                y: 0,
                width: 20,
                height: 20,
                speed: (1.5 + Math.random() * 2.5) * speedMultiplier.current // Speed scales over time
            });
        }

        function update() {
            if (keys.current['ArrowLeft'] && player.current.x > 0) player.current.x -= player.current.speed;
            if (keys.current['ArrowRight'] && player.current.x < canvas.width - player.current.width) player.current.x += player.current.speed;

            tokens.current.forEach((token, index) => {
                token.y += token.speed;
                if (token.y > canvas.height) tokens.current.splice(index, 1);
                if (
                    token.x < player.current.x + player.current.width &&
                    token.x + token.width > player.current.x &&
                    token.y < player.current.y + player.current.height &&
                    token.y + token.height > player.current.y
                ) {
                    tokens.current.splice(index, 1);
                    setScore((prev) => prev + 10);
                }
            });
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'blue';
            ctx.fillRect(player.current.x, player.current.y, player.current.width, player.current.height);

            tokens.current.forEach(token => {
                ctx.fillStyle = 'gold';
                ctx.fillRect(token.x, token.y, token.width, token.height);
            });

            ctx.fillStyle = 'black';
            ctx.font = '20px Arial';
            ctx.fillText('Score: ' + score, 10, 20);
        }

        function gameLoop() {
            update();
            draw();
            setTimeout(() => requestAnimationFrame(gameLoop), 20);
        }

        function increaseDifficulty() {
            speedMultiplier.current += 0.05; // Slowly increases speed every 5 seconds
        }

        window.addEventListener('keydown', (e) => (keys.current[e.key] = true));
        window.addEventListener('keyup', (e) => (keys.current[e.key] = false));
        setInterval(createToken, 1500);
        setInterval(increaseDifficulty, 5000); // Difficulty increases gradually
        gameLoop();
    }, [score]);

    return (
        <div className="game-container">
            <canvas ref={canvasRef}></canvas>
            <p className="score">Score: {score}</p>
        </div>
    );
}

export default App;