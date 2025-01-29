import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateMailDto } from '../controller/dto/create-mail';

@Injectable()
export class NotificationsService {
    

  constructor(private configService: ConfigService) {
}

    async sendMailToUser(mailDto: CreateMailDto) {
        console.log(mailDto)
        const { object, body } = mailDto;
        console.log("NEW MAIL RECEIVED")
        console.log(`Object: ${object}`);
        console.log(`${body}`);
    }
}
