import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getStatus(): string {
    return 'API is running';
  }

  @Get('crash-test')
  crashTest() {
    setTimeout(() => {
      throw new Error('Сервер сейчас упадёт');
    }, 0);
  }
}
