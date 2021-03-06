const e = require('express');
const { userInfo } = require('os');
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const session = require('express-session');
const FileStore = require('session-file-store')(session);
app.set('view engine', 'ejs'); // 렌더링 엔진 모드를 ejs로 설정
app.set('views',  __dirname + '/views');    // ejs이 있는 폴더를 지정
var fileStoreOptions = {
    path: "../selepathy_project-main-server/sessions"};
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new FileStore(fileStoreOptions)
}));

let i =0;
app.get('/chating', (req, res) => {
        console.log(req.session.user_name)
        if(req.session.logined){
            res.render('index',{
               name:req.session.user_name
            }); 
        }
    }
)

io.on('connection', (socket) => {   //연결이 들어오면 실행되는 이벤트
    // socket 변수에는 실행 시점에 연결한 상대와 연결된 소켓의 객체가 들어있다.
    socket.emit('usercount', io.engine.clientsCount);
    //socket.emit으로 현재 연결한 상대에게 신호를 보낼 수 있다.
    setInterval(()=>{socket.emit('usercount', io.engine.clientsCount);},1000)
    




    socket.on('username', (msg) => {
        //msg에는 클라이언트에서 전송한 매개변수가 들어온다. 이러한 매개변수의 수에는 제한이 없다.
        console.log('Message received: ' + msg);

        // io.emit으로 연결된 모든 소켓들에 신호를 보낼 수 있다.
        socket.broadcast.emit('username', msg);
    });
    // on 함수로 이벤트를 정의해 신호를 수신할 수 있다.


    socket.on('message', (msg) => {
        //msg에는 클라이언트에서 전송한 매개변수가 들어온다. 이러한 매개변수의 수에는 제한이 없다.
        console.log('Message received: ' + msg);

        // io.emit으로 연결된 모든 소켓들에 신호를 보낼 수 있다.
        socket.broadcast.emit('message', msg);
    });


});

server.listen(3001, function() {
  console.log('Listening on http://localhost:3001/');
});