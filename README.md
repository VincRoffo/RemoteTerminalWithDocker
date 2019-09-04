# RemoteTerminalWithDocker

RemoteTerminalWithDocker is a web application built as the pratice-part of two exams which took place at Federico II university in Napoli (IT). 

The idea behind this application was to develop two sub-systems:
- an Angular client, which offers a "linux terminal"-style interface used by the user to run some specific hacking commands
- a server, developed with the framework web Express, which throws docker containers in "--rm" mode to execute the commands when trasmitted by the client
  
Through the Socket-technology, the output returned by the execution of each single command is showed in real-time to the client who can decide at anytime to abort it (and submit a new one without waiting the previous one to end). 

In order to be user-friendly, and to let the user know which are the tools supported by the application, some utility commands are available. Insert "help" to discover them.


## Prerequisites

The only necessary prerequisites to run the application:
- the docker engine: used server-side to throw the containers
- a web browser web (any): used client-side to access the functionalities of the application

## Getting Started

To test the project:
1) clone the git repository: git clone https:
```
//github.com/VincRoffo/RemoteTerminalWithDocker.git
```
2) install the back-end dependencies and run it:
```
cd server
npm install
node server.js
```
3) install the front-end dependencies and run it:
```
cd client/live-terminal
npm install
ng -o serve
```
The default browser will automatically open at "localhost:4200/".


