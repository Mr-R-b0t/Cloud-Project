import { Injectable } from '@nestjs/common';
import { CreateMailDto } from '../controller/dto/create-mail';

@Injectable()
export class NotificationsService {
    async sendMailToUser(mailDto: CreateMailDto) {
        const { object, body } = mailDto;
        console.log("--------------")
        console.log("NEW MAIL RECEIVED")
        console.log(`Object: ${object}`);
        console.log(`${body}`);
        console.log("--------------")
    }
}
