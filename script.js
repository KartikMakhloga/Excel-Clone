let body = document.querySelector("body");
body.spellcheck = false;
let columnTags = document.querySelector(".column-tags");
let rowNumbers = document.querySelector(".row-numbers");
let grid = document.querySelector(".grid");
let oldCell;
let formulaSelectCell = document.querySelector("#select-cell");
let dataObj = {};

let menuBarPtags = document.querySelectorAll(".menu-bar p");

for (let i = 0; i < menuBarPtags.length; i++) {
  menuBarPtags[i].addEventListener("click", function (e) {
    if (e.currentTarget.classList.contains("menu-bar-option-selected")) {
      e.currentTarget.classList.remove("menu-bar-option-selected");
    } else {
      for (let j = 0; j < menuBarPtags.length; j++) {
        if (menuBarPtags[j].classList.contains("menu-bar-option-selected"))
          menuBarPtags[j].classList.remove("menu-bar-option-selected");
      }
      e.currentTarget.classList.add("menu-bar-option-selected");
    }
  });
}

for (let i = 0; i < 26; i++) {
  let div = document.createElement("div");
  div.classList.add("column-tag-cell");
  div.innerText = String.fromCharCode(65 + i);
  columnTags.append(div);
}

for (let i = 1; i <= 100; i++) {
  let div = document.createElement("div");
  div.classList.add("row-number-cell");
  div.innerText = i;
  rowNumbers.append(div);
}

for (let j = 1; j <= 100; j++) {
  let row = document.createElement("div");
  row.classList.add("row");
  for (let i = 0; i < 26; i++) {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    let address = String.fromCharCode(i + 65) + j;
    cell.setAttribute("data-address", address);

    dataObj[address] = {
      value:"",
      formula:"",
      upstream:[],
      downsteam: [],
    }

    cell.addEventListener("click", function (e) {
      //checking any cell selected already or not
      if (oldCell) {
        //if yes than deselect it
        oldCell.classList.remove("grid-selected-cell");
      }
      e.currentTarget.classList.add("grid-selected-cell");
      oldCell = e.currentTarget;
      let cellAddress = e.currentTarget.getAttribute("data-address");
      formulaSelectCell.value = cellAddress;
    });
    cell.contentEditable = true;
    row.append(cell);

    cell.addEventListener("input",function(e){
        let address = e.currentTarget.getAttribute("data-address");
        dataObj[address].value = Number(e.currentTarget.innerText);
        dataObj[address].formula = "";

        //upstream clear krni hai
        let currCellUpstream = dataObj[address].upstream;
      
        for(let i = 0;i<currCellUpstream.length;i++){
          removeFromUpstream(address,currCellUpstream[i]);
        }
        dataObj[address].upstream = [];

        //downstream ke cells ko update krna hai
        let currCellDownstream = dataObj[address].downsteam;

        for(let i = 0;i<currCellDownstream.length;i++){
          updateDownstreamElements(currCellDownstream[i])
        }
        

    });
  }
  grid.append(row);
}

function removeFromUpstream(dependent,onWhichIsDepending){
  let newDownstream = [];
  let oldDownstream = dataObj[onWhichIsDepending].downsteam;

  for(let i = 0;i<oldDownstream.length;i++){
    if(oldDownstream[i] != dependent)
      newDownstream.push(oldDownstream[i]);
  }
  dataObj[onWhichIsDepending].downsteam = newDownstream;
}

function updateDownstreamElements(elementAddress){
  // step-1 jis element ko update kr rahe  hai unki upstream elements ki current value le aao
  // how-> unki upstream ke elements ka address use krke dataObj se unki value lao
  // unhe as key value pair store krdo valObj  naam ke obj me

  let valObj = {}
  let currCellUpstream = dataObj[elementAddress].upstream;
  for (let i =0;i<currCellUpstream.length;i++){
    let upstreamCellAddress = currCellUpstream[i]
    let upstreamCellValue = dataObj[upstreamCellValue].value
    valObj[upstreamCellAddress] = upstreamCellValue;
  }

  // step-2 jis element ko update kr rahe hai uska formula le aao
  let currFormula = dataObj[elementAddress].formula;
  //formula ko space ke basis pe split maro
  let formulaArr = currFormula.split(" ");
 //split  marne ke baad jo array mili uspr loop mara and formula me jo variable hai(cells) unko unki value se replace krdo using valObj
  for(let j = 0;j<formulaArr.length;j++){
    if(valObj[formulaArr[i]]){
      formulaArr[i] = valObj[formulaArr[i]];
    }
  }

  //step-3 create krlo wapis formula formula from the array by joining it
  currFormula = formulaArr.join(" ");
  //step-4 evaluate the new value using eval function
  let newValue = eval(currFormula);

  //update the cell(jispr function call hua) in dataObj
   dataObj[elementAddress].value = newValue;

   //step 5 UI par update krdo new value
   let cellOnUI = document.querySelector(`[data-address=${elementAddress}]`)
   cellOnUI.innerText = newValue;
   
   //step-6 downstream leke aao jis element ko update kra just abhi kuki uspr bhi kuch element depend kr sakte hai
   //unko bhi update krna padega
   let currCellDownstream = dataObj[elementAddress].downsteam;

   //check karo ki downstream me elements hai kya agr han to un sab par yehi function call krdo jise vo bhi update hojaye with newValue
   if(currCellDownstream.length>0){
      for(let k=0;k<currCellDownstream.length;k++){
        updateDownstreamElements(currCellDownstream[k]);
      }
   }
}

// NOTES
//  (1*)
// How can a cell have a value?
//   A- Direct input (not dependent on any other cell)
//   B- formula (dependent on cells which are present in formula)
//    for eg-> C1 = A1 + B1

//    here, C1 is dependent party and A1,B1 is not dependent party


// (2*)
// A cell can have four things possible
// A- value[]
// B- formula[]
// C- downStream[ jo cell humpar dependent hai ]
// D- upStream[ jis cell par hum dependent hai ]

// we have four cases (a) di -> di 
//                    (b) di -> formula 
//                    (c) f -> di
//                    (d) f -> f

// Case 1:    di -> di [worst case]
           
//            value: 50  se  60 hogya yaha pe
//            formula: ""  [no change]
//            upstream: [no change]
//            downstream: [A1,B1,C1] teeno update honge according to value array

// case 2:     di -> f  [worst case]    [Z6 + D9]  Z6=20, D9=50
            
//            value: 20 se 70 hojayega
//            formula: "" se "Z6 + D9" hojayega
//            upstream: empty se [Z6,D9]
//            downstream: [A1,B1,C1] teeno update honge according to value array

// case 3:      f -> f  [worst case]  C1 -> 2 * D2

//             value: 30 se update hojayega
//             formula: "3 * A1" se "2 * D2" hojayega
//             upstream: [A1] se [D2] and D2 downstream mei khudko daalna padega or A2 ki downstream se remove kardenge
//             downstream: [B1] update hoga according to value array

// case 4:      f -> di  [worst case]  

//             value: 20 se 30 update karenge
//             formula: "2 * B1" se "" hojayega
//             upstream: [B1] se [empty] hojayega lekin usse pehle B1 ki downstream se apne aap ko remove kr denge 
//             downstream: [D1,E1] update honge according to value array

// (3*)

// A- Grid -> (DI)

//    - update value
//    - if formula -> clear it 
//    - upstream ke elements ko bolo mujhe apni downstream se karo remove and apni upstream krdo empty
//    - downstream ke elements ko  bolo bhaiya apnil value update krlo

// B- Formula Bar (formula)
   
//    - formula evaluate update
//    - fomula Change 
//    - upstream purane elements ki downstream se remove hoge or new elements add karoge
//    - downstream khudko update krlo

