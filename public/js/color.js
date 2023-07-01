let all_rows = document.getElementsByClassName("tr");
let all_cells = document.getElementsByClassName("td");
color_btn.addEventListener("click", () => {
  colorify_sections()
  colorify_grades("fe", 50, 52);
  colorify_grades("feo", 14, 16);
  colorify_grades("p", 0.75, 0.95);
  colorify_grades("m", 45, 55);
});

function colorify_sections() {
  if (color_btn.classList.contains("no-color")) {
    legend.classList.remove("d-none")
    legend.classList.add("d-flex")
    color_btn.classList.remove("no-color")
    for (let i = 0; i < all_rows.length; i++) {
      const tds = all_rows[i].querySelectorAll("td");
      const array_of_numbers = []
      for (let j = 1; j < tds.length; j++) {
        array_of_numbers.push(Number(tds[j].innerText))
      }

      var total = 0;
      for (let i = 0; i < array_of_numbers.length; i++) {
        total += array_of_numbers[i];
      }
      var avg = total / array_of_numbers.length;
      const std = sd(array_of_numbers);
      const max = Math.max(...array_of_numbers);
      const min = Math.min(...array_of_numbers);

      // const interval1 = [min, min + (0.7 * std)];
      // const interval2 = [min + (0.7 * std), min + std * 2.1];
      // const interval3 = [min + std * 2.1, min + std * 3.3];
      // const interval4 = [min + std * 3.3, max];

      const interval1 = [avg - std, avg + std];
      const interval2 = [avg + std, avg + 2 * std];
      const interval3 = [avg - 2 * std, avg - std];
      const interval4 = [min, avg - 2 * std];
      const interval5 = [avg + 2 * std, max];

      const color1 = "#D4EFDF";
      const color2 = "#82E0AA";
      const color3 = "#196F3D";
      for (let j = 1; j < tds.length; j++) {
        const number = Number(tds[j].innerHTML);
        if (number >= interval1[0] && number < interval1[1]) {
          tds[j].style.backgroundColor = color1;
        } else if ((number >= interval2[0] && number < interval2[1]) || (number >= interval3[0] && number < interval3[1])) {
          tds[j].style.backgroundColor = color2;
        } else {
          tds[j].style.backgroundColor = color3;
          tds[j].style.color = "white";
        }
        if (number == 0) {
          tds[j].style.backgroundColor = "white";
          tds[j].style.color = "black";
        }
      }
    }
  } else {
    legend.classList.add("d-none")
    legend.classList.remove("d-flex")
    color_btn.classList.add("no-color");
    for (let i = 0; i < all_cells.length; i++) {
      all_cells[i].style.backgroundColor = "transparent";
      all_cells[i].style.color = "black";

    }
  }
}

function colorify_grades(param, int1, int2) {
  const param_rows = document.getElementsByClassName(param);
  let param_cells = document.getElementsByClassName(`${param}-grades`);
  const red = "rgb(184, 18, 18)";
  const green = "rgb(34, 139, 34)";
  const yellow = "rgb(255, 215, 0";
  for (let i = 0; i < param_rows.length; i++) {
    for (let j = 1; j < param_cells.length; j++) {
      const number = Number(param_cells[j].innerHTML);
      if (number < int1) {
        param_cells[j].style.backgroundColor = red;
        if(param=="p"){
          param_cells[j].style.backgroundColor = yellow;
        }
      } else if (number >= int1 && number <= int2) {
        param_cells[j].style.backgroundColor = green;
      } else {
        param_cells[j].style.backgroundColor = yellow;
        if(param=="p"){
          param_cells[j].style.backgroundColor = red;
        }
      }
    }
  }

}
