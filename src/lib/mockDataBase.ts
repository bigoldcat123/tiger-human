'use server'
import { sql } from "@vercel/postgres";
import mysql from 'mysql2/promise';

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
  host: '192.168.0.104',
  user: 'root',
  database: 'tiger',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  password:'root'
});

export async function addRoom(r:Room) {
    pool.query(` insert into room (roomtype,roomid) values ('${r.roomtype}','${r.roomid}')`);
    // sql` insert into room (roomtype,roomid) values (${r.roomtype},${r.roomid})`;
}
export async function delRoom(roomid:string) {
//    sql` delete from room where roomid = ${roomid}`
    pool.query(` delete from room where roomid = '${roomid}'`);
}

export async function getRooms() {
    console.log('get rooms');
    // const { rows } = await sql<Room>`SELECT * from room`;
    const [rows,fileds] = await pool.query(`SELECT * from room`);
    console.log(rows);
    console.log(fileds);
    return rows as Room[]
}
