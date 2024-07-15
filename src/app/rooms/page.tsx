'use client'
import { Tag_human, Tag_tiger } from "@/lib/constant"
import { getRooms } from "@/lib/mockDataBase"
import { redirect, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function RoomsPage () {

    const [rooms,setRooms] = useState<Array<Room>>([])
    const router = useRouter()
    useEffect(() => {
        getRooms().then(res => {
            setRooms(Array.from(res))
        })
    },[])
    const hadnleCick = (room:Room) => {
        console.log('5');
        router.push('/gameroom/' + (room.roomtype !== 'tiger' ? Tag_tiger : Tag_human) + '/' + '?' + 'roomid=' + room.roomid)
    }
    return (
        <>
        {
           rooms.map((room) => <li onClick={() => {hadnleCick(room)}} className="p-2 bg-green-200" key={room.roomid}>{room.roomid}-{room.roomtype}</li>)
        }
        </>
    )
}