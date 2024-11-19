import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { MarketService } from './services/market.service';
import { SubscriptionRequestDto } from 'src/dto/subscription-request.dto';

@WebSocketGateway({ namespace: '/market', cors: true })
@Injectable()
export class MarketDataGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(MarketDataGateway.name);

  constructor(private readonly marketService: MarketService) {}

  afterInit() {
    this.logger.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    client.emit('connection', { message: 'Welcome to Market Data WebSocket' });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe')
  async handleSubscribe(client: Socket, payload: SubscriptionRequestDto) {
    const { instrument, preferences } = payload;
    this.logger.log(`Client subscribed to ${instrument} with preferences: ${JSON.stringify(preferences)}`);

    await this.marketService.subscribeToInstrument(client, instrument, preferences);

    client.emit('subscribed', { instrument, status: 'success' });
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(client: Socket, payload: { instrument: string }) {
    const { instrument } = payload;
    this.logger.log(`Client unsubscribed from ${instrument}`);
    this.marketService.unsubscribeFromInstrument(client, instrument);
    client.emit('unsubscribed', { instrument, status: 'success' });
  }

  @SubscribeMessage('ping')
  handlePing(client: Socket) {
    console.log('here 01')
    client.emit('pong', { message: 'pong' });
  }
}
