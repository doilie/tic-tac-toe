import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    const className = `square${props.isWinner ? " square-highlight": ""}`;
    return (
        <button
            className={className}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i, isWinner) {
        return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            isWinner={isWinner}
        />;
    }

    render() {
        const numRows = 3;
        const numCols = 3;
        const rows = [];
        const winner = this.props.winner || [];
        for (let row = 0; row < numRows; row++) {
            const cols = [];
            for (let col = 0; col < numCols; col++) {
                const i = (row * numCols) + col;
                const isWinner = winner.indexOf(i) !== -1;
                cols.push(this.renderSquare(i, isWinner));
            }
            rows.push(<div className="board-row">{cols}</div>);
        }
        return (<div>{rows}</div>);
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                clicked: null,
            }],
            stepNumber: 0,
            xIsNext: true,
            sortAscending: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();  // copy
        const winner = calculateWinner(squares);
        if (winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares,
                clicked: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    handleToggleClick() {
      this.setState({
        sortAscending: !this.state.sortAscending,
      });
    }

    getSquareColumn(i) {
        return (i % 3) + 1;
    }

    getSquareRow(i) {
        return Math.floor(i / 3) + 1;
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        let history = this.state.history;
        let stepNumber = this.state.stepNumber;
        let gameStartIdx = 0;
        if (!this.state.sortAscending) {
          history = history.slice().reverse();
          stepNumber = history.length - 1 - stepNumber;
          gameStartIdx = history.length - 1;
        }
        const current = history[stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const col = this.getSquareColumn(step.clicked);
            const row = this.getSquareRow(step.clicked);
            const moveLabel = this.state.sortAscending ? move : history.length - 1 - move;
            const desc = move !== gameStartIdx ?
                `Go to move # ${moveLabel} (${col},${row})` :
                "Go to game start";
            const moveButtonClass = move === stepNumber ? "move-button-selected" : "";
            return (
                <li key={moveLabel}>
                    <button
                        onClick={() => this.jumpTo(moveLabel)}
                        className={moveButtonClass}
                    >
                        {desc}
                    </button>
                </li>
            );
        });

        let status;
        let winnerSquares = [];
        if (winner) {
            status = `Winner: ${winner.winner}`;
            winnerSquares = winner.squares;
        } else {
            status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
        }
        const sortButtonText = `Sort ${this.state.sortAscending ? "Descending" : "Ascending"}`;
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winner={winnerSquares}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ul>{moves}</ul>
                    <div>
                      <button onClick={() => this.handleToggleClick()}>{sortButtonText}</button>
                    </div>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
              winner: squares[a],
              squares: [a, b, c],
            };
        }
    }
    return null;
}