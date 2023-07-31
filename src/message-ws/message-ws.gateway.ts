import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { MessageWsService } from './message-ws.service';
import { NewMessageDto } from './dto/new-message.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class MessageWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly JwtService: JwtService,
  ) {}

  @WebSocketServer() wss: Server;

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    try {
      payload = this.JwtService.verify(token);
      await this.messageWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    console.log(payload);

    this.wss.emit(
      'clients-updated',
      this.messageWsService.getConnectedClients(),
    );
  }
  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client.id);

    this.wss.emit(
      'clients-updated',
      this.messageWsService.getConnectedClients(),
    );
  }

  // message-from-client
  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    //message from server
    //! Emitir a todos menos al cliente inicial
    this.wss.emit('message-from-server', {
      fullName: this.messageWsService.getUserFullName(client.id),
      message: payload.message || 'no message',
    });
  }
}
