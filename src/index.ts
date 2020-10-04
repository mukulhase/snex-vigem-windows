import { QMainWindow, QWidget, QLabel, FlexLayout, QPushButton, QIcon } from '@nodegui/nodegui';
import logo from '../assets/logox200.png';
const ViGEmClient = require('vigemclient');
let client = new ViGEmClient();

client.connect();


const win = new QMainWindow();
win.setWindowTitle("I don't know what to call this yet");
win.resize(400, 200);

const centralWidget = new QWidget();
centralWidget.setObjectName("myroot");
const rootLayout = new FlexLayout();
centralWidget.setLayout(rootLayout);

const label = new QLabel();
label.setObjectName("mylabel");
label.setText("Loading...");

const button = new QPushButton();
button.setIcon(new QIcon(logo));

const label2 = new QLabel();
label2.setText("Gaming = <3");
label2.setInlineStyle(`
  color: red;
  font-weight: bold;
`);

rootLayout.addWidget(label);
// rootLayout.addWidget(button);
rootLayout.addWidget(label2);
win.setCentralWidget(centralWidget);
win.setStyleSheet(
  `
    #myroot {
      background-color: #009688;
      height: '100%';
      align-items: 'center';
      justify-content: 'center';
    }
    #mylabel {
      font-size: 16px;
      font-weight: bold;
      padding: 1;
    }
  `
);
win.show();

(global as any).win = win;
declare global {
  interface Window {}
}
//@ts-ignore
global.window = global
const location = { protocol: 'http' };
global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const net = require('net');
const wrtc = require('wrtc');
const fetch = require('node-fetch');
global.Headers = fetch.Headers;
require('cross-fetch/polyfill');

global.RTCPeerConnection = wrtc.RTCPeerConnection;
global.RTCSessionDescription = wrtc.RTCSessionDescription;
global.RTCIceCandidate = wrtc.RTCIceCandidate;
global.Request = require('request')
const snex = require('snex');

global.WebSocket = require('ws');
snex.createSession()
.then((session: { on: (arg0: string, arg1: (conn: any) => void) => void; createURL: (arg0: string) => any; }) => {
    session.on('connection', (conn: { on: (arg0: string, arg1: (data: any) => void) => void; }) => {
        console.log('Player joined!');
        let controller = client.createX360Controller();
        controller.connect();
        conn.on('data', (data: { state: any; key: string; }) => {
            const buttons : { [id: string] : any; } = {
              "A": controller.button.A,
              "B": controller.button.B,
              "X": controller.button.X,
              "Y": controller.button.Y
            }

            const value = data.state ? 0.75 : 0
            const dir : { [id: string] : any; } = {
              "LEFT": ()=>controller.axis.leftX.setValue(-value),
              "RIGHT": ()=>controller.axis.leftX.setValue(value),
              "UP": ()=>controller.axis.leftY.setValue(value),
              "DOWN": ()=>controller.axis.leftY.setValue(-value)
            }
            if(data.key in buttons){
              buttons[data.key].setValue(data.state==1 ? true : false);
            } else if(data.key in dir) {
              dir[data.key]();
            }
        });
    });

    return session.createURL('snes');
})
.then((desc: any) => {
    label.setText(`Your connection URL is: ${desc.url}`)
});