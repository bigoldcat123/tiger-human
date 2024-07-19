import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
// import { sql } from "@vercel/postgres";
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
  password: 'root'
});
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const rooms = new Map()

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    connectionStateRecovery: {
      // the backup duration of the sessions and the packets
      maxDisconnectionDuration: 2 * 60 * 1000,
      // whether to skip middlewares upon successful recovery
      skipMiddlewares: true,
    }
  });

  io.on("connection", async (socket) => {
    console.log("connection", socket.id);
    socket.on('createRoom',(roomid,waitingfor) => {
      console.log('createRoom',roomid,waitingfor);
      pool.query(`insert into room (roomtype,roomid) values('${waitingfor}','${roomid}')`)
    })
    socket.on('joinRoom',(roomid,cb) => {
      console.log(roomid);
      io.to(roomid).emit('gameStart',socket.id)
      cb()
    })
    socket.on('move',(roomid,from,to) => {
      io.to(roomid).emit('peermove',from,to)
    })
    socket.on('gameover',(peerid,cb) => {
      console.log('gameover');
      io.to(peerid).emit('peergameover')
      cb()
    })
    socket.on("disconnect", () => {
      console.log("disconnect", socket.id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});