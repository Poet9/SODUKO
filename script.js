/***************************data and backend function ************************/
let backendController = function(){
  const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
  ];
  const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3---",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
  ];
  const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
  ];
   //helper function
  let id = function(ID){return document.getElementById(ID);}
  let chosenBoard;
  return{
    /****data function ****/
    dataProvider: function(){ 
      if(id("easy").checked){chosenBoard = easy;return easy[0];}
      if(id("medium").checked){chosenBoard = medium;return medium[0];}
      if(id("hard").checked){chosenBoard = hard;return hard[0];}  
    },
    /******* test player choice function ******/
    testFitting : function(ID, table){
      if (table[ID] == chosenBoard[1][ID]){return true}
      else {return false;}
    },
    winTest: function (table){
      table = table.join("");
      console.log("table : " + table);
      if (table === chosenBoard[1]){console.log("dkhalna true");return true;}
      else {console.log("dkhalna false");return false;}
    }
  }
}();
/***************************User interface function ************************/
let UIController = function(){
  let table = Array(81).fill(0); //table of the user's game 
    //class names of html
    DOMStrings = {
      header: ".firstHeader",
      controlBtns: ".buttons",
      gameTable: "gameTable",
      theme : "#themes",
      numberSelector: "#digits",
      selected: "selected",
      tiles: "tableElement",
      bottomBorder: "bottomBorder",
      rightBorder: "rightBorder",
      hint: "#hints"
    }
    return{
      /******  changing themes  *****/
      changeTheme: function(ID){
        if (ID ==="light"){
          let html = '<div class="txtLight" style="font-size:40px">you are a psycho</div>';
          document.querySelector("body").classList.add("light");
          document.querySelector('header').insertAdjacentHTML("afterend", html);
        }
        else if (ID ==="dark"){
          let obj = document.querySelector(".txtLight");
          document.querySelector("body").classList.remove("light");
          obj.parentNode.removeChild(obj);
        }
      },
      /******** create board game *******/
      createBoard : function(data){
        for (let i = 0; i <81; i++){
          let tile = document.createElement("p");
          if(data[i] !== '-'){
            tile.textContent = data[i];
            tile.style.backgroundColor = "#00000040";
            table[i]= data[i];
          }
          else{tile.id = i;}
          tile.classList.add(DOMStrings.tiles);
          if((i> 17 && i<27) || (i >44 && i< 54)){
            tile.classList.add(DOMStrings.bottomBorder);
          }
          if((i+1) % 9 === 3 || (i+1) % 9 ===6){
            tile.classList.add(DOMStrings.rightBorder);
          }
          document.getElementById(DOMStrings.gameTable).appendChild(tile);
        }
        return table;
      },
      /******* adding numbers to the board ******/
      addNumber: function(ID, table, number){
        document.getElementById(ID).textContent = number;
        table[Number(ID)] = number;
      },
      /************adding hints to tiles ******/
      addHints: function(ID, number){
        let bool, arr, index; 
        bool = document.getElementById(ID).textContent.includes(number);
        arr = document.getElementById(ID).textContent;
        console.log('arr '+arr);
        if(bool){
          index = arr.indexOf(number);
          arr = arr.substring(0,index-1) + arr.substring(index+2);
          document.getElementById(ID).textContent = arr;
        }
        else{
          document.getElementById(ID).textContent +=number + "| ";
        }
      },
      /*********highlighting similar numbers to selected one *******/
      highlightSimilarNumbers: function(number, exID){
        let oldNumber = document.getElementById(exID).textContent;
        $("#"+DOMStrings.gameTable).each(function(){
          $(this).find('p').each(function(){
            console.log("zarbou3a "+this.textContent);
          if(this.textContent == number){
            if (!this.classList.contains('wrong')){
              this.style.backgroundColor = '#3268ff';}
            }
          else if( this.textContent == oldNumber){
            if(this.id){
              if (!this.classList.contains('wrong')){
                this.style.backgroundColor = 'unset';}
            }
            else {this.style.backgroundColor = '#00000040';}
            }
          })
        })
      },
      /*********highlighting wrong choices ****/
      wrongChoice: function(ID, choice){
        let value = document.getElementById(ID).classList.contains("wrong");
        if (choice === false && value === false){
          document.getElementById(ID).classList.add("wrong");
        }
        else if (choice === true && value=== true) {
          document.getElementById(ID).classList.remove("wrong");
        }
      },
      /****** providing class names  ******/
      getDOMStrings : function(){return DOMStrings;}
    }
}();

/***************************application link function ************************/
let appController = function(backendCtrl, UICtrl){
  let DOMY, chosenNbr, startGame, table;
  let winning = false;
  let hinting = false;
  DOMY = UICtrl.getDOMStrings();
    /*********setting up event listeners********/
  let eventListeners = function(){
    document.querySelector(DOMY.theme).addEventListener('click',changeTheme);
    document.querySelector(DOMY.controlBtns).addEventListener('click',gameSetting);
    document.querySelector(DOMY.numberSelector).addEventListener('click',numberSelected);
    document.querySelector("#"+DOMY.gameTable).addEventListener('click',addNumberTable);
  }
  /*******  changing themes  ******/
  let changeTheme = function(event){
    let themeID;
    themeID = event.target.id;
    UICtrl.changeTheme(themeID);
  }
  let gameSetting = function(event){
    let itemID;
    //start game 
    itemID = event.target.parentNode.id;
    if(!startGame){
      if (itemID === 'startGame'){startGame = true;addBoard();}
    }
    else {
      if (itemID === 'hints'){
        hinting = toggleHinting(hinting);
        document.getElementById(itemID).classList.toggle('hintas', hinting);
        console.log('hinting '+hinting);
      }
    }
  }
  /******** create board ********/
  let addBoard = function(){
    if(startGame === true){
      let board  = backendCtrl.dataProvider();
      table = UICtrl.createBoard(board);
    }
  }
  /************user add hints  ******/
  let toggleHinting= function(hint){
    if(hint === true){return false;}
    else if(hint === false){return true;}
  }
  /******** selecting a number ******/
  let exItemID;
  let numberSelected = function (event){
    let itemID;
    itemID = event.target.id;
    if(exItemID === undefined){exItemID = itemID;}
    if(itemID !== "digits" && winning === false){
      document.getElementById(itemID).classList.add(DOMY.selected);
      chosenNbr = document.getElementById(itemID).textContent;
      if (itemID !== exItemID){
        document.getElementById(exItemID).classList.remove(DOMY.selected);
      }
    UICtrl.highlightSimilarNumbers(chosenNbr, exItemID);
    exItemID = itemID;
    
    }
  }
  /******** add number to table ******/
  let addNumberTable = function(event){
    let elementID, choiceVerification;
    elementID = event.target.id;
    if((elementID && elementID !== 'gameTable') && chosenNbr && !winning){
      if(hinting){
        document.getElementById(elementID).classList.add('hinted');
        UICtrl.addHints(elementID, chosenNbr);
      }
      //adding actual numbers to table and testing win and all
      else if(!hinting){
        let bool = document.getElementById(elementID).classList.contains('hinted');
        if (bool){document.getElementById(elementID).classList.remove('hinted');}
        UICtrl.addNumber(elementID, table, chosenNbr);
        choiceVerification = backendCtrl.testFitting(elementID, table);
        UICtrl.wrongChoice(elementID, choiceVerification);
        // highlighting the number if its right 
        let right = document.getElementById(elementID).classList.contains('wrong');
        if (!right){
          document.getElementById(elementID).style.backgroundColor = '#3268ff';
        }
         //full table test and calling win function
        if(!table.includes(0)){
          console.log( "hey " + table.includes("0"));
          winning = backendCtrl.winTest(table);
        }
        if (winning === true){
          let html = '<div class="winText">You win</div>';
          console.log("we have a winner ladies and gentlmen!");
          document.getElementById(exItemID).classList.remove(DOMY.selected);
          document.querySelector('header').insertAdjacentHTML('beforeend',html);
        }
      }
    }
  }
  return{
    init : function(){
      eventListeners();
      addBoard();
    },
  }
}(backendController,UIController);

appController.init();