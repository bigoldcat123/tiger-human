import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { sql } from "@vercel/postgres";
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

    socket.on('createRoom', () => {
      const roomid = socket.id
      console.log('the room id is' + roomid);
      rooms.set(roomid, socket)
    })

    socket.on('joinRoom', (roomid) => {
      const peer = rooms.get(roomid)
      socket.join('_' + roomid)
      peer.join('_' + socket.id)
      io.to('_' + roomid).emit('gameStart', 'joiner')
      io.to('_' + socket.id).emit('gameStart', 'creater')
    })

    socket.on('gameover', () => {
      socket.rooms.forEach(room => {
        console.log(room + '->' + socket.id);
        if (room.startsWith('_')) {
          io.to(room.substring(1)).emit('gamecrash')
        }

        if (rooms.has(room)) {
          rooms.delete(room)
          sql` delete from room where roomid = ${room}`
        }
      })
    })
    socket.on('disconnect', () => {
      console.log('disconnect');
      console.log(socket.rooms);
      if (socket.rooms.size == 0) {
        rooms.delete(socket.id)
        sql` delete from room where roomid = ${socket.id}`
        return
      }
      socket.rooms.forEach(room => {
        console.log(room + '->' + socket.id);
        if (room.startsWith('_')) {
          io.to(room.substring(1)).emit('gamecrash')
        }

        if (rooms.has(room)) {
          rooms.delete(room)
          sql` delete from room where roomid = ${room}`
        }
      })
    })
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