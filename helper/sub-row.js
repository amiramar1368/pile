import axios from 'axios';

export async function sub_row(pile,config){
    try {
    const {data} = await axios.get(`http://192.168.10.20/crushers/piles/${pile}/sub-rows`,config)
    return {data};
    } catch (err) {
        console.log(err);
    }
    
}