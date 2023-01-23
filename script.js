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

// How can a cell have a value?
//   1- Direct input (not dependent on any other cell)
//   2- formula (dependent on cells which are present in formula)
//    for eg-> C1 = A1 + B1

//    here, C1 is dependent party and A1,B1 is not dependent party
