import logger from '@/logger';
import * as redis from '@/redis';
import setupCallBoard from '@/call';
import setupSpotify from '@/spotify';
export default function setupSocketIO(io) {
    io.on('connection', async (socket) => {
        try {
            const query = socket.handshake.query;
            const roomId = query.roomId;
            const peerId = query.peerId;
            if (!roomId ||
                !peerId ||
                typeof roomId !== 'string' ||
                typeof peerId !== 'string') {
                logger.http(`Client connected with invalid IDs. RoomID: ${roomId}, PeerID: ${peerId}`);
                socket.disconnect(true);
                return;
            }
            logger.http(`Client joined room. RoomID: ${roomId}, PeerID: ${peerId}`);
            // Setup submodules
            setupCallBoard(io, socket, roomId, peerId);
            setupSpotify(io, socket, roomId, peerId);
            socket.on('disconnect', async (reason) => {
                logger.http(`Client disconnected. RoomID: ${roomId}, PeerID: ${peerId}`);
                await redis.removePeer(roomId, peerId);
                socket.nsp.to(roomId).emit('peers-update', { peers });
            });
            // Join Room
            socket.join(roomId);
            await redis.addPeer(roomId, peerId);
            // push changes to all sockets in room
            const peers = await redis.getPeers(roomId);
            socket.nsp.to(roomId).emit('peers-update', { peers });
        }
        catch (e) {
            logger.error(e);
        }
    });
}
//# sourceMappingURL=io.js.map