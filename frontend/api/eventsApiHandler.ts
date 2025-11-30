import {URL} from '@/contexts/AuthContext'

interface IEvents {
    name: string,
    createdAt: string
    category: string,

}

export async function getEvents(token: string) {
    const response = await fetch(URL+'get_events', {
        method: 'GET',
        headers: {
            "Authorization": token,
            "Content-Type": "application/json"
        },
    })
    console.log(response)
}