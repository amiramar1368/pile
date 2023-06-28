import axios from 'axios';

export async function section_info(pile,config){
    try {
    const {data} = await axios.get(`http://192.168.10.20/crushers/piles/${pile}/sections-test`,config)
    return data;
    } catch (err) {
        console.log(err);
    }
    
}