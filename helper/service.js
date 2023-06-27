import axios from 'axios';

export async function service(report_at,group_id,shift,unloading_id,config){
    try {
    const {data} = await axios.post("http://192.168.10.20/trips/all",{report_at,group_id,shift,unloading_id,review:1},config);
    return {data};
    } catch (err) {
        console.log(err);
    }
    
}