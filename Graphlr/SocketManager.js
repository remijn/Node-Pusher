var SocketManager = function(io, connManager){
    this.io = io;
    this.initServer();
    this.connManager = connManager;
};

SocketManager.prototype.initServer = function(){
    var self = this;
    console.log('Init Socket.io Listener');
    this.io.on('connection', function(socket){
        console.log('new connection');
        var connection = {
            SessionCookie: null,
            SubscribedTo: [
            ],
            Metadata: {},
            Channel: {
                type: "websocket",
                socket: socket,
                state: 'connected'
            }
        };
        self.connManager.addConnection(connection);
        socket.on('init', function(data){
            if(typeof data.session !== "undefined") connection.SessionCookie = data.session;
            if(typeof data.subscribe !== "undefined") connection.SubscribedTo = data.subscribe;
            if(typeof data.metadata !== "undefined") connection.Metadata = data.metadata;
        });
        socket.on('disconnected', function(){
            //cleanup
            self.connManager.removeConnection(connection);
        });
    });
};

SocketManager.prototype.push = function(connection, data){
    if(connection.Channel.type !== "websocket") return;

    console.log('sent ' + data + " to ", connection.SessionCookie);
    connection.Channel.socket.emit('data', data);
};

module.exports = SocketManager;