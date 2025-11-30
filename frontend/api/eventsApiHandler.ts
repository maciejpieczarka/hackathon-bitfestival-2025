import {URL} from '@/contexts/AuthContext'
import axios from "axios";

interface IEvents {
    id: number
    name: string,
    createdAt: string
    category: string,

}

export async function getEvents(token: string) {
    // const response = axios.get(URL+'users',
    //     )

    const response = await fetch(URL+'get_events', {
        method: 'GET',
        headers: {
            "Authorization": token,
            "Content-Type": "application/json"
        },
    }).then((value)=>value.json()).then(value => console.log(value))

}