import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { BinanceWebSocket } from '../uils/binance-websocket';

@Injectable()
export class MarketService {
  private readonly logger = new Logger(MarketService.name);
  private readonly binanceWebSocket = new BinanceWebSocket();

  async subscribeToInstrument(client: Socket, instrument: string, preferences: any): Promise<void> {
    this.logger.log(`Subscribing client ${client.id} to ${instrument}`);
    this.binanceWebSocket.subscribe(client, instrument, preferences);
  }

  unsubscribeFromInstrument(client: Socket, instrument: string): void {
    this.logger.log(`Unsubscribing client ${client.id} from ${instrument}`);
    this.binanceWebSocket.unsubscribe(client.id, instrument);
  }
}
