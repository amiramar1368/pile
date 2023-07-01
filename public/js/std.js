const sum = arr => arr.reduce((partialSum, a) => partialSum + a, 0);
const mean = arr => sum(arr) / arr.length;
const variance = arr => {
  const m = mean(arr);
  return sum(arr.map(v => (v - m) ** 2))/arr.length;
};
const sd = arr => Math.sqrt(variance(arr));
// let myArr =[9,13,17,13,6,7,3,9,12,7,4,4,8,6,7,8,9,10,8,5,6,5,1,4,3,1,4]


// var total = 0;
//       for (let i = 0; i < myArr.length; i++) {
//         total += myArr[i];
//       }
//       var avg = total / myArr.length;

// console.log(sd(myArr));
// console.log(avg);

