
export function getPreDate(){
    var d = new Date();
    var beforeDate = d.setDate(d.getDate()-4)
    var date = (new Date(beforeDate));
    date = date.toLocaleString("fa-IR").substring(0,10);
    if(date.includes("،")){
    date=date.substring(0,9)
    }
    return date
}
