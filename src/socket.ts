"use client";

import { io } from "socket.io-client";

export const socket = io({
    'auth':{
        token:'123'
    },
    query: {
        'token': '123'
    }
});