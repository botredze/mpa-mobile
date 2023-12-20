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


export async function getUsedTalons(data, endpoint = '/get_history') {
    try {
        const response = await axios.post(`${API}${endpoint}`, data);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export async function getTalonData(data){
    try
    {
        const response = await axios.post(`${ API }/barcode`, data );
        console.log( response );
        return response.data;
    } catch ( error )
    {
        console.log( error );
    }
}



export async function useTalon(data){
    try
    {
        const response = await axios.post(`${ API }/use_talon`, data );
        console.log( response );
        return response.data;
    } catch ( error )
    {
        console.log( error );
    }
}

