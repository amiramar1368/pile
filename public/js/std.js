const sum = arr => arr.reduce((partialSum, a) => partialSum + a, 0);
const mean = arr => sum(arr) / arr.length;
const variance = arr => {
  const m = mean(arr);
  return sum(arr.map(v => (v - m) ** 2))/arr.length;
};
const sd = arr => Math.sqrt(variance(arr));
// let myArr =[1,2,3,4,5,6,7,8]

// console.log(sd(myArr));