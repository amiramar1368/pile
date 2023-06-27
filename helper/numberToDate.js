
export function numberToDate(number){
    var h=number/3600;
  var m = (h-Math.floor(h))*60;
  h=Math.floor(h);
  m=Math.floor(m);
  if(h<10){
    h="0"+h
  }
  if(m<10){
    m="0"+m
  }
  var time = h+":"+m;
  return time
  }