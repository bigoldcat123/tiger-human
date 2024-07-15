'use server'
import { sql } from "@vercel/postgres";


export async function addRoom(r:Room) {
    sql` insert into room (roomtype,roomid) values (${r.roomtype},${r.roomid})`;
}
export async function delRoom(roomid:string) {
   sql` delete from room where roomid = ${roomid}`
}

export async function getRooms() {
    console.log('get rooms');
    const { rows } = await sql<Room>`SELECT * from room`;
    console.log(rows);
    return rows
}
