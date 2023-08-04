const gameBoard = document.querySelector('#gameboard');
const playerDisplay = document.querySelector('#player');
const infoDisplay = document.querySelector('#info-display');
const width = 8;
let playerGo = 'black';
playerDisplay.textContent = 'black';

const startPieces = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn, 
    '','','','','','','','',
    '','','','','','','','',
    '','','','','','','','',
    '','','','','','','','',
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn, 
    rook, knight, bishop, queen, king, bishop, knight, rook,
];

function createBoard(){
    startPieces.forEach((startPiece, i) =>{
        const square = document.createElement('div');
        square.classList.add('square');
        square.innerHTML = startPiece;
        square.firstChild?.setAttribute('draggable', true);
        square.setAttribute('square-id', i);
        const row = Math.floor((63 - i) / width) + 1;
        if(row % 2 === 0){
            square.classList.add(i % 2 === 0 ? 'beige' : 'brown');
        }else{
            square.classList.add(i % 2 === 0 ? 'brown' : 'beige');
        }

        if(i <= 15){
            square.firstChild.firstChild.classList.add('black');
        }

        if(i >= 48){
            square.firstChild.firstChild.classList.add('white');
        }

        gameBoard.append(square);
    });
}
createBoard();

const allSquares = document.querySelectorAll(".square");

allSquares.forEach(square =>{
    square.addEventListener('dragstart', dragStart);
    square.addEventListener('dragover', dragOver);
    square.addEventListener('drop', dragDrop);
});

let startPositionId;
let draggedElement;

function dragStart(e){
    startPositionId = e.target.parentNode.getAttribute('square-id');
    draggedElement = e.target;

}

function dragOver(e){
    e.preventDefault();

}

function dragDrop(e){
    e.stopPropagation();
    console.log(e.target);
    const correctGo = draggedElement.firstChild.classList.contains(playerGo);
    const taken = e.target.classList.contains('piece');
    const valid = checkIfValid(e.target);
    const opponentGo = playerGo === 'white' ? 'black' : 'white';
    const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo);
    if(correctGo){
        if(takenByOpponent && valid){
            e.target.parentNode.append(draggedElement);
            e.target.remove();
            changePlayer();
            return;
        }
        if(taken && !takenByOpponent) return;
        if(valid){
            e.target.append(draggedElement);
            changePlayer();
        }
    }
}

function changePlayer(){
    if(playerGo === 'black'){
        reverseIds();
        playerGo = 'white';
        playerDisplay.textContent = 'white';
    }else{
        revertIds();
        playerGo = 'black';
        playerDisplay.textContent = 'black';
    }
}

function reverseIds(){
    const allSquares = document.querySelectorAll('.square');
    allSquares.forEach((square, i) => square.setAttribute('square-id', (width * width - 1) - i));

}

function revertIds(){
    const allSquares = document.querySelectorAll('.square')
    allSquares.forEach((square, i) => square.setAttribute('square-id',i));
}

function checkIfValid(target){
    const targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'));
    const startId = Number(startPositionId);
    const piece = draggedElement.id;
    console.log(targetId);
    console.log(startId);
    console.log(piece);

    function checkBishopMove(offset, targetId) {
        let currentId = startId;
        for (let i = 1; i <= 7; i++) {
          currentId += offset;
          const query = document.querySelector(`[square-id="${currentId}"]`);
          if (currentId === targetId) return true;
          if (i > 1 && (!query || query.firstChild)) return false;
        }
        return false;
    }

    function checkRookMove(startId, width, targetId, maxSteps) {
        let currentId = startId;
        for (let i = 1; i <= maxSteps; i++) {
          currentId += width;
          const squareIdToCheck = document.querySelector(`[square-id="${currentId}"]`);
      
          if (currentId === targetId) {
            return true;
          }
      
          if (i > 1 && (!squareIdToCheck || squareIdToCheck.firstChild)) {
            return false;
          }
        }
        return false;
      }
      
      // Usage example (assuming width represents the chessboard width):
      const chessboardWidth = 8; // Example width of the chessboard
      const maxSteps = Math.max(chessboardWidth, Math.abs(targetId - startId));

    switch(piece){
        case 'pawn':
            const starterRow = [8,9,10,11,12,13,14,15];
            if(starterRow.includes(startId) && startId + width * 2 === targetId 
            || startId + width === targetId 
            || startId + width - 1 === targetId && document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild
            || startId + width + 1 === targetId && document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild)
            {
                return true;
            }
            break;
        case 'knight':
            if(startId + width * 2 - 1 === targetId 
            || startId + width * 2 + 1 === targetId 
            || startId + width - 2 === targetId
            || startId + width + 2 === targetId
            || startId - width * 2 - 1 === targetId 
            || startId - width * 2 + 1 === targetId
            || startId - width - 2 === targetId
            || startId - width + 2 === targetId){
                return true;
            }
            break;
        case 'bishop':
              if (
                // RIGHT DIRECTION:
                checkBishopMove(width + 1, targetId) ||
                // LEFT DIRECTION:
                checkBishopMove(-width - 1, targetId) ||
                // BACKWARD:
                checkBishopMove(-width + 1, targetId) ||
                // BACKWARD:
                checkBishopMove(width - 1, targetId)
              ){
                return true;
            }
            break;
        case 'rook':
            if(
                checkRookMove(startId, chessboardWidth, targetId, maxSteps) ||
                checkRookMove(startId, -chessboardWidth, targetId, maxSteps) ||
                checkRookMove(startId, 1, targetId, maxSteps) ||
                checkRookMove(startId, -1, targetId, maxSteps)
            ){
                return true;
            }
            break;
        case 'queen':
            if(
                checkBishopMove(width + 1, targetId)

                || checkBishopMove(-width - 1, targetId)

                || checkBishopMove(-width + 1, targetId)

                || checkBishopMove(width - 1, targetId)

                || checkRookMove(startId, chessboardWidth, targetId, maxSteps)

                || checkRookMove(startId, -chessboardWidth, targetId, maxSteps)

                || checkRookMove(startId, 1, targetId, maxSteps)

                || checkRookMove(startId, -1, targetId, maxSteps)
            ){
                return true;
            }
            break;
        case 'king':
            if(
                startId + 1 === targetId
                || startId - 1 === targetId
                || startId + width === targetId
                || startId - width === targetId
                || startId + width - 1 === targetId
                || startId + width + 1 === targetId
                || startId - width - 1 === targetId
                || startId - width + 1 === targetId
            ){
                return true;
            }
            break;
    }
}