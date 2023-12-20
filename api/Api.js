import axios from "axios";

const API = 'http://212.112.105.196:3153/api';

export async function loginUser ( formData )
{
    try
    {
        const response = await axios.post(`${ API }/login`, formData );
        console.log( response );
        return response.data;
    } catch ( error )
    {
        console.log( error );
    }
}


export async function getUsedTalons(data){
    try
    {
        const response = await axios.post(`${ API }/get_history`, data );
        console.log( response );
        return response.data;
    } catch ( error )
    {
        console.log( error );
    }
}