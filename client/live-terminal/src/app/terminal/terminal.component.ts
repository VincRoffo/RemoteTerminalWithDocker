import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgTerminalComponent } from 'ng-terminal';
import { Subject } from 'rxjs';
import { NgTerminal } from 'ng-terminal/lib/ng-terminal';
import { FormControl } from '@angular/forms';
import { DisplayOption } from 'ng-terminal/lib/display-option';
import { Terminal } from 'xterm';

import { WebsocketService } from '../service/websocket.service';

import myconfig from "../../../../myconfig.json";

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css']
})
export class TerminalComponent implements OnInit {

  private socket = new WebsocketService();
  public resizable: boolean;
  public fixed = true;
  disabled = false;
  rowsControl = new FormControl();
  colsControl = new FormControl();
  inputControl = new FormControl();
  command = new String();
  displayOption: DisplayOption = {};
  displayOptionBounded: DisplayOption = {};//now it's not used
  underlying: Terminal;
  myConfig=myconfig;
  
  @ViewChild(NgTerminalComponent,{static: false}) child: NgTerminal;
  
  constructor(){ }

  ngOnInit(){
    this.rowsControl.setValue(30);
    this.colsControl.setValue(130);
    this.socket.ngOnInit();
    this.socket.printCmd.subscribe((event: string) =>  
          this.writeSubject.next(event.replace(/(?:\r\n|\r|\n)/g,'\r\n')));
  }

  ngAfterViewInit(){
    this.underlying = this.child.underlying;
    this.invalidate();
    this.child.keyInput.subscribe((input) => {
      this.child.write(input);
    })
    this.rowsControl.valueChanges.subscribe(()=> {this.invalidate()});
    this.colsControl.valueChanges.subscribe(()=> {this.invalidate()});
    this.writeSubject.next("Type \"help\" to start using the terminal...\r\n")
  }

  invalidate(){
    if(this.resizable)
      this.displayOption.activateDraggableOnEdge = {minWidth: 100, minHeight: 100};
    else
      this.displayOption.activateDraggableOnEdge = undefined;
    if(this.fixed)
      this.displayOption.fixedGrid = {rows: this.rowsControl.value, cols: this.colsControl.value};
    else
      this.displayOption.fixedGrid = undefined;
    this.child.setDisplayOption(this.displayOption);
}
  writeSubject = new Subject<string>();
  write(){
    this.writeSubject.next(this.inputControl.value);
  }

  writeHelp(){
    this.writeSubject.next("\r\nHello! This is RemoteHackingWithDocker!\r\n");
    this.writeSubject.next("Type: \r\n  1-\"ls\" to see the available tools\r\n");
    this.writeSubject.next("  2-\"examples\" to see usage examples\r\n");
    this.writeSubject.next("  3-\"abort\" to abort a session whenever you need\r\n");
    this.writeSubject.next("There's a server waiting for your instructions.\r\n");
    this.writeSubject.next("You'll see the output live!\r\n");
    this.writeSubject.next("FORBIDDEN COMMANDS WON'T BE SEND TO SERVER!\r\n");
  }

  getfirstword(command: String){
    let i=0,j;
    while(command.charCodeAt(i)==32) i++; 
    j=i;
    while(command.charCodeAt(j)!=32&&j<command.length) j++;
    return command.substring(i,j);
  }

  verifyCommand(command: String){
    let result=null;
    switch(command){
      case "help": {result="help"; break;}
      case "ls": {result="ls"; break;}
      case "examples": {result="examples"; break;}
      case "abort": {result="abort"; break;}
      default: {
        this.myConfig.images.forEach(image => {
          if(command==image.name) result="scanCommand";});
      }
    }
    return result;
  }

  displayTools(){
    this.myConfig.images.forEach(image => {
      this.writeSubject.next("\r\n---TOOL in preset: "+image.name+"\r\n");});
  }

  displayExamples(){
    this.myConfig.images.forEach(image => {
      this.writeSubject.next("\r\n---Usage example of "+image.name+"-tool: "+image.example+"\r\n");});
    this.writeSubject.next("\r\nUse the \"--help\" option on the specific tool for more informations.");  
  }

  keyInput: string;
  onKeyInput(event: string){
   switch(event.charCodeAt(0)){
      case 13: {  //tasto invio
        switch(this.verifyCommand(this.getfirstword(this.command))){
          case "scanCommand": {
            this.socket.scanCommand(this.createJSONmessage(this.command));
            break;
          }
          case "help": {
            this.writeHelp();
            break;
          }
          case "ls": {
            this.displayTools();
            break;
          }
          case "examples": {
            this.displayExamples();
            break;
          }
          case "abort": {
            this.socket.abortAction();
            break;
          }
          default: {
            this.writeSubject.next("\r\nComando non valido. Eseguire il comando \"help\" per informazioni.");
            break;
          }
        }
        this.command="";
        this.writeSubject.next(String.fromCharCode(10));
        break;
      }
      case 127: { //tasto back-space
        this.command="";
        this.underlying.reset();
        break;
      }
      default: {
        this.keyInput = event;
        this.command = this.command+this.keyInput;
        break;
      }
    }
  }

  get displayOptionForLiveUpdate(){
    return JSON.parse(JSON.stringify(this.displayOption));
  }

  createJSONmessage(message: String) {
    let i=0,j=0,k=2;
    var cmd= {'arg0': "run", 'arg1':"--rm"};
    while(i<message.length){
     if(message.charCodeAt(i)==32){
       if(k==2){
        this.myConfig.images.forEach(image => {
          if(message.substring(j,i)==image.name) cmd["arg"+k]=image.image;});
       }
       else cmd["arg"+k] = message.substring(j,i);
       k++;
       while(message.charCodeAt(i)==32) i++;
       j=i;
     }
     if(i==message.length-1){
       if(k==2){
        this.myConfig.images.forEach(image => {
          if(message.substring(j,i+1)==image.name) cmd["arg"+k]=image.image;});
       }
       else cmd["arg"+k] = message.substring(j,i+1);
     }
     i++;
    }
    console.log(cmd);
    return cmd; 
   }

}
