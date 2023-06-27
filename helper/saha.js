import axios from 'axios';

export async function saha_r(start_at,end_at,config){
    try {
    const {data:saha_E} = await axios.post(`http://192.168.10.20/report/weighbridge/w2`,{start_at,end_at,destination_id:1,weighbridge_id:6},config);
    const {data:saha_W} = await axios.post(`http://192.168.10.20/report/weighbridge/w2`,{start_at,end_at,destination_id:1,weighbridge_id:7},config);
    const all_service = [...saha_E,...saha_W]
    return all_service;

    } catch (err) {
        console.log(err);
    }
}