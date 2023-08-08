import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

const active = false; // set to true to enable IP checking

@Injectable()
export class CheckIpMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!active)
      return next();

    const allowedIps = ['127.0.0.1', '192.168.0.1']; // replace with your allowed IPs
    const userIp = req.ip;

    if (!allowedIps.includes(userIp)) {
      return res.status(403).send('Forbidden');
    }

    next();
  }
}