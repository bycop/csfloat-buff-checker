import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('/buff')
  async getBuffPrice(@Body('itemName') itemName: string, @Body('itemDetails') itemDetails: string): Promise<{ price: string | number }> {
    return { price: await this.appService.getBuffPrice(itemName, itemDetails) };
  }

}
