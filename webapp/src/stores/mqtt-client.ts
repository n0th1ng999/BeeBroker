import { defineStore } from 'pinia'
import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:8080')

export const useCounterStore = defineStore('counter', {
    state: () => ({ count: 0, name: 'Eduardo' }),
getters: {
        doubleCount: (state) => state.count * 2,
    },
    actions: {
      requestPackage() {
        ws.send('recievePackage')
        },
    },
})

ws.onmessage = (event) => {
    console.log(event.data);
  };
  