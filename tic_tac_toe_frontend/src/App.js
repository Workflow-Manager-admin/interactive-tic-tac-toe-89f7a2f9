import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * Colors (from the specified palette):
 *  - primary:   #2196F3 (Blue)
 *  - secondary: #F44336 (Red)
 *  - accent:    #FFC107 (Yellow)
 */

/**
 * Utility: All possible winning line coordinates (row/col/diag).
 */
const WIN_LINES = [
  [0, 1, 2], // rows
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6], // cols
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8], // diags
  [2, 4, 6],
];

/** PUBLIC_INTERFACE
 * Determines if there is a winner on the current board.
 * @param {string[]} squares
 * @returns {{winner: string|null, line: number[]|null}}
 */
function calculateWinner(squares) {
  for (let line of WIN_LINES) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line };
    }
  }
  return { winner: null, line: null };
}

/** PUBLIC_INTERFACE
 * Determines if the board state is a draw (all squares filled, no winner).
 * @param {string[]} squares
 * @param {string|null} winner
 * @returns {boolean}
 */
function calculateDraw(squares, winner) {
  return squares.every(Boolean) && !winner;
}

/** PUBLIC_INTERFACE
 * Square component — individual clickable cell.
 */
function Square({ value, onClick, highlight }) {
  return (
    <button
      className={`ttt-square${highlight ? ' highlight' : ''}`}
      onClick={onClick}
      aria-label={`Tic Tac Toe cell${value ? ', occupied by ' + value : ', empty'}`}
    >
      {value}
    </button>
  );
}

/** PUBLIC_INTERFACE
 * Main App (Tic Tac Toe Game).
 */
function App() {
  // Board is a flat array of 9 (3x3 grid)
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);        // X always starts first.
  const [gameOver, setGameOver] = useState(false);
  const [winnerInfo, setWinnerInfo] = useState({ winner: null, line: null });

  // Styling state for modern theme (no dark mode toggle for simplicity as per light theme requirement).
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  // Evaluate winner/draw any time the board changes.
  useEffect(() => {
    const winResult = calculateWinner(board);
    setWinnerInfo(winResult);
    if (winResult.winner || calculateDraw(board, winResult.winner)) {
      setGameOver(true);
    } else {
      setGameOver(false);
    }
  }, [board]);

  // Handler for cell click
  const handleSquareClick = (idx) => {
    if (board[idx] || gameOver) return;
    const nextBoard = [...board];
    nextBoard[idx] = isXNext ? 'X' : 'O';
    setBoard(nextBoard);
    setIsXNext((x) => !x);
  };

  // Handler for restarting the game
  const handleRestart = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameOver(false);
    setWinnerInfo({ winner: null, line: null });
  };

  // Player display and status logic
  const currentPlayer = isXNext ? 'X' : 'O';
  const turnColor = isXNext ? 'var(--color-player-x)' : 'var(--color-player-o)';
  let statusMsg;
  if (winnerInfo.winner) {
    statusMsg = (
      <span>
        <span className="winner" style={{ color: winnerInfo.winner === 'X' ? 'var(--color-player-x)' : 'var(--color-player-o)' }}>
          {winnerInfo.winner}
        </span> wins!
      </span>
    );
  } else if (calculateDraw(board, winnerInfo.winner)) {
    statusMsg = <span>It&#39;s a draw!</span>;
  } else {
    statusMsg = (
      <span>
        <span className="turn" style={{ color: turnColor }}>
          {currentPlayer}
        </span>{' '}
        turn
      </span>
    );
  }

  return (
    <div className="ttt-app">
      <div className="ttt-container">
        <h1 className="ttt-header" tabIndex={0}>Tic Tac Toe</h1>
        <div className="ttt-status" aria-live="polite">{statusMsg}</div>

        <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
          {board.map((square, idx) =>
            <Square
              key={idx}
              value={square}
              onClick={() => handleSquareClick(idx)}
              highlight={winnerInfo.line && winnerInfo.line.includes(idx)}
            />
          )}
        </div>

        <div className="ttt-controls">
          <button className="ttt-btn" onClick={handleRestart} aria-label="Restart game">
            Restart
          </button>
        </div>
        {/* Attribution footer */}
        <footer className="ttt-footer">
          <span>Made with React</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
