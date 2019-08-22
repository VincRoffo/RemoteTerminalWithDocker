import { OnInit, EventEmitter, Output } from '@angular/core';
import * as io from 'socket.io-client';

export class WebsocketService implements OnInit{
    messageText: string;
    messages: Array<any>;
    socket: SocketIOClient.Socket;
    command: JSON;
    @Output() printCmd= new EventEmitter<string>();

  constructor() {
   this.socket = io.connect('http://localhost:3000');
  }

  ngOnInit() {
    this.messages = new Array();
    this.socket.emit('helloServer', {
          msg: 'Client to server: HEAR ME?'
    });
    this.socket.on('helloClient', (data: any) => {
        console.log(data.msg);
    });
    this.socket.on('output', (msg: any) => {
        this.messages.push(msg);
        console.log(msg);
        this.printCmd.emit(msg);
    });
    this.socket.on('killed',(info: any) => {
        this.messages.push(info);
        console.log(info);
        this.printCmd.emit(info);
    });
   }

  abortAction(){
    this.socket.emit('abort');
  }

   scanCommand(message) {
    this.socket.emit('scan-command',{
        msg: message
    });
   }

}