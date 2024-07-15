"use client";

import { useEffect, useState } from "react";
import { socket } from "../../../socket";
import { addRoom, getRooms } from "@/lib/mockDataBase";
import Image from "next/image";
// import map from '../../../../public/map.jpg'
import { createRoot } from "react-dom/client";

const Chess = ({ OnClick }: {
  OnClick: (e: any) => void
}) => {
  return (
    <div onClick={(e) => OnClick(e.target)}>
      chess
    </div>
  )
}

export default function Home({ params, searchParams }:
  Readonly<{ params: Readonly<{ type: RoomType }>, searchParams: Readonly<{ roomid: string }> }>) {

  useEffect(() => {



    if (socket.connected) {
      onConnect();
    }
    function onConnect() {
      window.addEventListener('beforeunload', () => {
        socket.emit('gameover')
      })
      if (!searchParams.roomid) {
        socket.emit('createRoom')
        addRoom({ roomtype: params.type, roomid: socket.id as string })
      } else {
        socket.emit('joinRoom', searchParams.roomid)
      }
      socket.on('gameStart', () => {
        console.log('gameStart')
      })
      socket.on('gamecrash', () => {
        alert('gamecrash')
      })
    }
    socket.on("connect", onConnect);
    return () => {
      socket.off("connect", onConnect);
    };
  }, []);

  const s = Array.from({ length: 5 }, (_, i) => Array.from({ length: 5 }, (_, j) => ({ x: i, y: j })))


  useEffect(() => {
    const c = Chess({
      OnClick: (e: HTMLDivElement) => {
        console.log('i am clicked');
        console.log(e);
      }
    })
    const e = document.getElementById('00') as HTMLDivElement
    const s = createRoot(e)
    s.render(c)
  }, [])


  return (
    <>
      <button onClick={() => socket.emit('gameover')}>leave</button>
      <div className=" w-[80%] relative aspect-square] my-0 mx-auto mt-8 flex flex-row flex-wrap ">
        <Image className=" absolute z-[-1] w-[80%] top-[10%] left-[10%]" src={'/map.jpg'} width={780} height={780} alt=""></Image>
        {s.map((item, index1) => {
          return item.map((item, index2) => {
            return <div id={index1 + '' + index2} key={index1 + '' + index2} className="w-[20%] aspect-square flex justify-center items-center">1</div>
          })
        })}
      </div>
    </>

  );
}