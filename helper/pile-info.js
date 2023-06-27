import axios from 'axios';

export async function pile_info(pile_number,config){
    
   try {
    const {data} = await axios.post("http://192.168.10.20/report/lab/lab-l5",{pile_number},config);
    return {data};
   } catch (err) {
    console.log(err);
   }
}