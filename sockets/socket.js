const { io } = require('../index');
const {usuarioConectado, usuarioDesconectado, grabarMensaje} = require('../controllers/socket');   

// Mensajes de Sockets
io.on('connection', async (client) => {
    console.log('Cliente conectado');

    // client.join(client.handshake.headers['x-token'])

    client.on('entrar-sala',async(data)=>{
        client.join(data.idPublicacion);
    });

    client.on('mensaje-sala',async(data)=>{
        console.log(data);
        io.to(data.idPublicacion).emit('mensaje-personal',data.mensaje);
    });
    
    // client.on('mensaje-sala', async (data) => {
    //     console.log(data);
    //     client.broadcast.to(data.idPublicacion).emit('mensaje-personal', data.mensaje);
    // });

    client.on('updateNotificacion', async (data) => {
        console.log(data);
        io.emit('update-list', data);
    });

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
        // usuarioDesconectado(uid);
    });

});
