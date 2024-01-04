import axios from "axios";

const API = 'http://mpa-new.333.kg/api';

export async function loginUser ( formData )
{
    try
    {
        const response = await axios.post(`${ API }/login`, formData );
        //console.log( response );
        return response.data;
    } catch ( error )
    {
        //console.log( error );
    }
}


export async function getUsedTalons(data) {
    try {
        console.log(data)
        const response = await axios.post(`${API}/get_history`, data);
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
        //console.log( response );
        return response.data;
    } catch ( error )
    {
        //console.log( error );
    }
}

