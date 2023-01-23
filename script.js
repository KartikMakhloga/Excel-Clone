let body = document.querySelector("body");
body.spellcheck = false;
let columnTags = document.querySelector(".column-tags");
let rowNumbers = document.querySelector(".row-numbers");
let grid = document.querySelector(".grid");
let oldCell;
let formulaSelectCell = document.querySelector("#select-cell");

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
    cell.setAttribute("data-address", String.fromCharCode(i + 65) + j);

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
  }
  grid.append(row);
}

// NOTES
//  (1*)
// How can a cell have a value?
//   A- Direct input (not dependent on any other cell)
//   B- formula (dependent on cells which are present in formula)
//    for eg-> C1 = A1 + B1

//    here, C1 is dependent party and A1,B1 is not dependent party


// (2*)
// A cell can have four arrays possible
// A- value[]
// B- formuls[]
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