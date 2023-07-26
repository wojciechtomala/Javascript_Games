document.addEventListener('DOMContentLoaded', () =>{
    const gridDisplay = document.querySelector('.grid');
    const scoreDisplay = document.querySelector('#score');
    const resultDisplay = document.querySelector('#result');
    const width = 4;
    let squares = [];
    let score = 0;

    // CREATE GAMEBOARD:
    function createBoard(){
        for(let i = 0; i<width*width; i++){
            square = document.createElement('div');
            square.innerText = 0;
            gridDisplay.appendChild(square);
            squares.push(square); 
        }
        generate();
        generate();
    }
    createBoard();

    // GENERATE RANDOM NUMBER:
    function generate(){
        let randomNumber = Math.floor(Math.random() * squares.length);
        if(squares[randomNumber].innerText == 0){
            squares[randomNumber].innerText = 2;
            checkForLose();
        }else generate();
    }

    // SWIPE:
    moveLeft();
    function moveRight(){
        for(let i = 0; i<width*width; i++){
            if(i % 4 === 0){
                let totalOne = squares[i].innerText;
                let totalTwo = squares[i+1].innerText;
                let totalThree = squares[i+2].innerText;
                let totalFour = squares[i+3].innerText;
                let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];

                console.log(row)

                let filteredRow = row.filter(num => num);
                
                console.log(filteredRow);

                let missing = 4 - filteredRow.length;
                let zeros = Array(missing).fill(0);
                
                console.log(zeros)

                let newRow = zeros.concat(filteredRow);
                
                console.log(newRow)

                squares[i].innerText = newRow[0];
                squares[i+1].innerText = newRow[1];
                squares[i+2].innerText = newRow[2];
                squares[i+3].innerText = newRow[3];
            }
        }
    }

    function moveLeft(){
        for(let i = 0; i<width*width; i++){
            if(i % 4 === 0){
                let totalOne = squares[i].innerText;
                let totalTwo = squares[i+1].innerText;
                let totalThree = squares[i+2].innerText;
                let totalFour = squares[i+3].innerText;
                let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];

                console.log(row)

                let filteredRow = row.filter(num => num);
                console.log(filteredRow);

                let missing = 4 - filteredRow.length;
                let zeros = Array(missing).fill(0);
                
                console.log(zeros)

                let newRow = filteredRow.concat(zeros);
                
                console.log(newRow)

                squares[i].innerText = newRow[0];
                squares[i+1].innerText = newRow[1];
                squares[i+2].innerText = newRow[2];
                squares[i+3].innerText = newRow[3];
            }
        }
    }

    function moveDown(){
        for(let i=0; i < width; i++){
            let totalOne = squares[i].innerText;
            let totalTwo = squares[i+width].innerText;
            let totalThree = squares[i+(width*2)].innerText;
            let totalFour = squares[i+(width*3)].innerText;
            let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];

            let filteredColumn = column.filter(num => num);
            let missing = 4 - filteredColumn.length;
            let zeros = Array(missing).fill(0);
            let newColumn = zeros.concat(filteredColumn);

            squares[i].innerText = newColumn[0];
            squares[i+width].innerText = newColumn[1];
            squares[i+(width*2)].innerText = newColumn[2];
            squares[i+(width*3)].innerText = newColumn[3];
        }
    }

    function moveUp(){
        for(let i=0; i < width; i++){
            let totalOne = squares[i].innerText;
            let totalTwo = squares[i+width].innerText;
            let totalThree = squares[i+(width*2)].innerText;
            let totalFour = squares[i+(width*3)].innerText;
            let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];

            let filteredColumn = column.filter(num => num);
            let missing = 4 - filteredColumn.length;
            let zeros = Array(missing).fill(0);
            let newColumn = filteredColumn.concat(zeros);

            squares[i].innerText = newColumn[0];
            squares[i+width].innerText = newColumn[1];
            squares[i+(width*2)].innerText = newColumn[2];
            squares[i+(width*3)].innerText = newColumn[3];
        }
    }

    function combineRow(){
        for(let i = 0; i < width*width - 1; i++){
            if(squares[i].innerText === squares[i+1].innerText){
                let combinedTotal = parseInt(squares[i].innerText) + parseInt(squares[i+1].innerText);
                squares[i].innerText = combinedTotal;
                squares[i+1].innerText = 0;
                score += combinedTotal;
                scoreDisplay.innerText = score;
            }
        }
        checkForWin();
    }

    function combineCollumn(){
        for(let i = 0; i < 12; i++){
            if(squares[i].innerText === squares[i+width].innerText){
                let combinedTotal = parseInt(squares[i].innerText) + parseInt(squares[i+width].innerText);
                squares[i].innerText = combinedTotal;
                squares[i+width].innerText = 0;
                score += combinedTotal;
                scoreDisplay.innerText = score;
            }
        }
        checkForWin();
    }

    // KEYCODES:
    document.addEventListener('keyup', control);

    function control(e){
        if(e.keyCode === 39){
            keyRight();
        } else if(e.keyCode === 37){
            keyLeft();
        }else if(e.keyCode === 38){
            keyUp();
        }else if(e.keyCode === 40){
            keyDown();
        }
        gameboardColor();
    }

    function gameboardColor(){
        let color = "color-";
        squares.forEach(e => {
            e. removeAttribute('class');
            e.classList.toggle(color + e.innerText);
            console.log(e)
        });
    }
    function keyRight(){
        moveRight();
        combineRow();
        moveRight();
        generate();
    }

    function keyLeft(){
        moveLeft();
        combineRow();
        moveLeft();
        generate();
    }

    function keyDown(){
        moveDown();
        combineCollumn();
        moveDown();
        generate();
    }

    function keyUp(){
        moveUp();
        combineCollumn();
        moveUp();
        generate();
    }

    // CHECK FOR WIN:
    function checkForWin(){
        for(let i = 0; i < squares.length; i++){
            if(squares[i].innerText == 2048){
                resultDisplay.innerText = "You win!";
                document.removeEventListener('keyup', control);
            }
        }
    }

    // CHECK FOR LOSE:
    function checkForLose(){
        let zeros = 0;
        for(let i = 0; i < squares.length; i++){
            if(squares[i].innerText == 0) zeros ++;
        }
        if(zeros === 0){
            resultDisplay.innerText = "You Lose!";
            document.removeEventListener('keyup', control);
        }
    }

});