var board = null;
var game = new Chess();
var $status = document.getElementById('status');
var $fen = document.getElementById('fen');
var $pgn = document.getElementById('pgn');

function onDragStart(source, piece, position, orientation) {
    if (game.game_over()) return false;
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false;
    }
}

function onDrop(source, target) {
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for simplicity
    });

    if (move === null) return 'snapback';

    updateStatus();
}

function onSnapEnd() {
    board.position(game.fen());
}

function updateStatus() {
    var status = '';
    var moveColor = 'White';
    if (game.turn() === 'b') {
        moveColor = 'Black';
    }

    if (game.in_checkmate()) {
        status = 'Game over, ' + moveColor + ' is in checkmate.';
    } else if (game.in_draw()) {
        status = 'Game over, drawn position';
    } else {
        status = moveColor + ' to move';
        if (game.in_check()) {
            status += ', ' + moveColor + ' is in check';
        }
    }

    $status.innerHTML = status;
    $fen.innerHTML = 'FEN: ' + game.fen();
    $pgn.innerHTML = 'PGN: ' + game.pgn();
}

var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
};
board = Chessboard('board', config);

updateStatus();

document.getElementById('reset').addEventListener('click', function() {
    game.reset();
    board.start();
    updateStatus();
});

document.getElementById('undo').addEventListener('click', function() {
    game.undo();
    board.position(game.fen());
    updateStatus();
});
