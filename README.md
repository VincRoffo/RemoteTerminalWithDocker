# RemoteTerminalWithDocker

RemoteTerminalWithDocker è una web application realizzata nell'ambito dei corsi di NetworkSecurity-ApllicazioniTelematiche 
a.a.2018-2019 svoltisi presso l'università Federico II di Napoli. 

L'idea alla base di questo progetto è stata quella di sviluppare due sotto-sistemi:
- un client Angular, che offre un'interfaccia "linux terminal style" che permette tramite comandi linux l'esecuzione di specifici
  tool di hacking;
- un server sviluppato tramite il noto framework web Express basato sul runtime di JavaScript Node.js, che lancia container docker
  in modalità "--rm" per l'esecuzione dei suddetti comandi.
  
Mediante l'utilizzo delle Socket, l'output restituito dall'esecuzione dei singoli comandi è mostrato in tempo reale
al client, il quale può anche decidere di abortire l'esecuzione di un comando in qualsiasi momento. 

Per semplicità di utlizzo, e per conoscere il preset di tool supportati dall'applicazione, sono stati implementati alcuni comandi
che è possibile scoprire digitando "help" sul terminale client.


## Prerequisites

Gli unici prerequisiti richiesti per il funzionamento dell’applicazione sono:
- il docker engine: necessario lato server per l'esecuzione delle docker-images relative ai tool di hacking;
- un browser web qualsiasi: necessario lato client per accedere alle funzionalità dell'applicazione.

## Getting Started

Per testare il progetto:
1) clonare la repo: git clone https:
```
//github.com/VincRoffo/RemoteTerminalWithDocker.git
```
2) installare le dipendenze del back-end ed avviarlo:
```
cd server
sudo npm install
sudo node server.js
```
3) installare le dipendenze del front-end ed avviarlo:
```
cd client/live-terminal
sudo npm install
ng -o serve
```
Verrà così aperto il browser di default all'indirizzo "localhost:4200/".


