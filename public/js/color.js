let all_rows = document.getElementsByClassName("tr");
let all_cells = document.getElementsByClassName("td");
color_btn.addEventListener("click", () => {
  if(color_btn.classList.contains("no-color")){
    legend.classList.remove("d-none")
    legend.classList.add("d-flex")
    color_btn.classList.remove("no-color")
  for (let i = 0; i < all_rows.length; i++) {
    const tds = all_rows[i].querySelectorAll("td");
    const array_of_numbers=[]
    for (let j = 1; j < tds.length; j++) {
        array_of_numbers.push(Number(tds[j].innerText))
    }
    const std =sd(array_of_numbers);
    const max =Math.max(...array_of_numbers);
    const min =Math.min(...array_of_numbers);
    const interval1 = [min,min+(0.7*std)];
    const interval2 = [min+(0.7*std),min+std*2.1];
    const interval3 = [min+std*2.1,min+std*3.3];
    const interval4 = [min + std*3.3, max];
    
    const color1 = "#D4EFDF";
    const color2 = "#82E0AA";
    const color3 = "#82E0AA";
    const color4 = "#196F3D";
    for (let j = 1; j < tds.length; j++) {
        const number = Number(tds[j].innerHTML);
        if (number >= interval1[0] && number < interval1[1]) {
          tds[j].style.backgroundColor = color1;
        } else if (number >= interval2[0] && number < interval2[1]) {
          tds[j].style.backgroundColor = color2;
        } else if (number >= interval3[0] && number < interval3[1]) {
          tds[j].style.backgroundColor = color3;
        } else {
          tds[j].style.backgroundColor = color4;
          tds[j].style.color = "white";
        }
        if(number==0){
          tds[j].style.backgroundColor = "white";
          tds[j].style.color = "black";
        }
      }   
  }
  }else{
    legend.classList.add("d-none")
    legend.classList.remove("d-flex")
    color_btn.classList.add("no-color");
    for (let i = 0; i < all_cells.length; i++) {
    all_cells[i].style.backgroundColor="transparent";
    all_cells[i].style.color="black";

  }
  }
   
});


