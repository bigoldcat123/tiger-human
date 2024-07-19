"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { addRoom, getRooms } from "@/lib/mockDataBase";
import Image from "next/image";
import { createRoot } from "react-dom/client";
import { useRouter } from "next/navigation";
import { Tag_human, Tag_tiger } from "@/lib/constant";

const Chess = ({ OnClick, key, type, img }: {
  OnClick: (parent: HTMLDivElement, self: HTMLDivElement, type: RoomType | 'prompt') => void,
  key: string,
  type: RoomType | 'prompt',
  img: string
}) => {
  const div = document.createElement('div')
  div.className = type + ' cursor-pointer ' + (type == 'tiger' || type == 'prompt' ? ' text-5xl ' : "")

  div.innerText = img
  div.onclick = (e) => {
    OnClick((e.target as HTMLDivElement).parentElement as HTMLDivElement, (e.target as HTMLDivElement), type)
  }
  return div
}

export default function Home({ params, searchParams }:
  Readonly<{ params: Readonly<{ type: RoomType }>, searchParams: Readonly<{ roomid: string }> }>) {

  const router = useRouter()
  // const [current, setCurrent] = useState<string>('')
  let current: null | HTMLDivElement = null
  let currentMovingUser = Tag_tiger
  const profile = searchParams.roomid ? (params.type == 'human' ? Tag_tiger : Tag_human) : params.type
  const changeCurrentMovingUser = () => {
    currentMovingUser = currentMovingUser == Tag_tiger ? Tag_human : Tag_tiger
  }

  const s = Array.from({ length: 5 }, (_, i) => Array.from({ length: 5 }, (_, j) => ({ x: i, y: j })))

  function move(from: string, to: string, needToInfor: boolean = true) {
    if (needToInfor)
      socket.emit('move', peerId, from, to)
    function getXYfromId(id: string) {
      const x = Number(id[0]);
      const y = Number(id[1]);
      return { x, y }
    }
    const toPointer = getXYfromId(to);
    const fromPointer = getXYfromId(from)
    const x = (toPointer.x + fromPointer.x) / 2
    const y = (toPointer.y + fromPointer.y) / 2
    console.log(x, y);

    if (!(x.toFixed(0) == x.toString() && y.toFixed(0) == y.toString())) {
      console.log('move from ' + from + ' to ' + to);
      document.getElementById(to)!.appendChild(document.getElementById(from)!.firstElementChild as HTMLDivElement)
    } else {
      console.log('someone was ate and the one is ', x, y);
      document.getElementById(to)!.appendChild(document.getElementById(from)!.firstElementChild as HTMLDivElement)
      document.getElementById(x + '' + y)?.firstElementChild?.remove()
    }
    changeCurrentMovingUser()
  }

  function detectAvailiable(point: HTMLDivElement, type: RoomType | 'prompt') {
    const id = point.id;
    const x = Number(id[0]);
    const y = Number(id[1]);
    const setPrompt = (p: HTMLDivElement) => {
      p.appendChild(Chess({ OnClick: ON_CLICK, key: p.id, type: 'prompt', img: '🚩' }))
    }
    const contain_child_milld = (x: number, y: number) => {
      const p = document.getElementById(x + '' + y)
      if (p) {
        if (!p.firstElementChild) {
          return false
        }
        // p.firstElementChild.class
        if (p.firstElementChild.classList.contains('human')) {
          return true
        }
        return false
      }
      return false
    }
    if (type == 'tiger') {
      const up = document.getElementById((x - 2) + '' + y) as HTMLDivElement
      if (up && up.childElementCount == 0 && contain_child_milld(x - 1, y)) {
        console.log(up);
        setPrompt(up)
      }
      const down = document.getElementById((x + 2) + '' + y) as HTMLDivElement
      if (down && down.childElementCount == 0 && contain_child_milld(x + 1, y)) {
        console.log(down);
        setPrompt(down)
      }
      const left = document.getElementById(x + '' + (y - 2)) as HTMLDivElement
      if (left && left.childElementCount == 0 && contain_child_milld(x, y - 1)) {
        console.log(left);
        setPrompt(left)
      }
      const right = document.getElementById(x + '' + (y + 2)) as HTMLDivElement
      if (right && right.childElementCount == 0 && contain_child_milld(x, y + 1)) {
        console.log(right);
        setPrompt(right)
      }
    }
    const up = document.getElementById((x - 1) + '' + y) as HTMLDivElement

    if (up && up.childElementCount === 0) {
      console.log(up);
      setPrompt(up)
    }
    const down = document.getElementById((x + 1) + '' + y) as HTMLDivElement
    if (down && down.childElementCount === 0) {
      console.log(down);
      setPrompt(down)
    }
    const left = document.getElementById(x + '' + (y - 1)) as HTMLDivElement
    if (left && left.childElementCount === 0) {
      console.log(left);
      setPrompt(left)
    }
    const right = document.getElementById(x + '' + (y + 1)) as HTMLDivElement
    if (right && right.childElementCount === 0) {
      console.log(right);
      setPrompt(right)
    }
  }
  function clearPrompt() {
    document.querySelectorAll('.prompt').forEach(e => e.remove())
  }
  function ON_CLICK(parent: HTMLDivElement, self: HTMLDivElement, type: RoomType | 'prompt') {
    if(!isStart){
      alert('游戏还没有开始')
      return
    }
    if (type != 'prompt') {
      if (!(currentMovingUser == profile)) {
        alert('it is not your turn')
        return
      }
      if (type != profile) {
        return
      }
    }

    clearPrompt()
    if (type == 'prompt') {
      move(current!.id, parent.id)
    } else {
      current = parent
      detectAvailiable(parent, type)
    }
  }
  function init() {
    const ss = Array.from({ length: 5 }, (_, i) => Array.from({ length: 3 }, (_, j) => Chess({ OnClick: ON_CLICK, key: i + '' + j, type: Tag_human, img: '🙂' })))

    for (let i = 0; i < 5; i++) {
      const e = document.getElementById('4' + i) as HTMLDivElement
      e.append(...ss[i])
    }
    const tiger1 = document.getElementById('3' + '1') as HTMLDivElement
    const tiger2 = document.getElementById('3' + '3') as HTMLDivElement
    tiger1.appendChild(Chess({ OnClick: ON_CLICK, key: tiger1.id, type: 'tiger', img: '🐯' }))
    tiger2.appendChild(Chess({ OnClick: ON_CLICK, key: tiger2.id, type: 'tiger', img: '🐯' }))
  }
  const isCreater = () => {
    return !searchParams.roomid
  }
  let [isStart_s,setIsStart] = useState(false)
  let isStart = false
  const socket = io()
  let peerId = searchParams.roomid
  useEffect(() => {
    socket.on('connect', () => {
      setURL(window.location.origin + '/gameroom/' + params.type + '?roomid=' + socket.id)
      if (isCreater()) {
        socket.on('gameStart', (p) => {
          console.log('gameStart', p)
          alert('游戏开始')
          peerId = p
          isStart = true
          setIsStart(true)
        })
        socket.emit('createRoom', socket.id, params.type !== 'human' ? Tag_human : Tag_tiger)
      } else {
        socket.emit('joinRoom', searchParams.roomid, () => {
          console.log('gamestart');
          alert('游戏开始')
          isStart = true
          setIsStart(true)
        })
      }
      socket.on('peergameover' ,() => {
        alert('对方认输')
        router.back()
      })
      socket.on('peermove', (from, to) => {
        move(from, to, false)
      })
    })
    init()
    return () => {
      console.log('disconnect');
      socket.emit('gameover',peerId,() => {
        
      socket.close()
      })
    }
  }, [])

function cp () {

  // navigator.clipboard.writeText(window.location.origin + '/gameroom/' + params.type)
  window.navigator.clipboard.writeText(window.location.origin + '/gameroom/' + params.type + '?roomid=' + socket.id) 
}
const [url, setURL] = useState('')
  return (
    <>
    <div className=" md:absolute">
    <button onClick={() => { router.push('/') }}>leave</button>
      <button onClick={() => {cp()}}>复制邀请链接</button>
      {!isStart_s && <span>{url}</span>}
      {isStart_s  && <span className=" text-5xl text-red-400 ">{profile == currentMovingUser ? 'your turn' : 'other turn'}</span>}
      
    </div>
<div className=" w-[80%] relative aspect-square] my-0 mx-auto mt-8 md:mt-0 flex flex-row flex-wrap lg:w-[50%] md:w-[65%]">
        <Image priority className=" absolute z-[-1] w-[80%] top-[10%] left-[10%]" src={'/map.jpg'} width={780} height={780} alt=""></Image>
        {s.map((item, index1) => {
          return item.map((item, index2) => {
            return <div id={index1 + '' + index2} key={index1 + '' + index2} className="w-[20%] aspect-square flex justify-center items-center"></div>
          })
        })}
      </div>
    </>

  );
}