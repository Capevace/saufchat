import * as redis from '@/redis';
export default function setupCallBoard(io, socket, roomId, peerId) {
    socket.on('join-call', async () => {
        await redis.addPeerToCall(roomId, peerId);
        resyncPeersInCall();
    });
    socket.on('leave-call', async (data, callback) => {
        await redis.removePeerFromCall(roomId, peerId);
        resyncPeersInCall();
    });
    socket.on('disconnect', async (data, callback) => {
        await redis.removePeerFromCall(roomId, peerId);
        resyncPeersInCall();
    });
    async function resyncPeersInCall() {
        const peers = await redis.getPeersInCall(roomId);
        io.to(roomId).emit('peers-in-call-update', { peers });
    }
    async function sendFirstPeersInCall() {
        const peers = await redis.getPeersInCall(roomId);
        socket.emit('peers-in-call-update', { peers });
    }
    sendFirstPeersInCall();
}
//# sourceMappingURL=call.js.map