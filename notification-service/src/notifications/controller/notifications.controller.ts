import { Controller, Post, Body } from '@nestjs/common';
import { CreateMailDto } from './../controller/dto/create-mail';
import { NotificationsService } from '../service/notifications.service';


@Controller('notifications')
export class NotificationsController {
 constructor(private readonly notificationService: NotificationsService){

 }
    @Post('sendMail')
        sendEmailToUser(@Body() dto: CreateMailDto) {
            return this.notificationService.sendMailToUser(dto)
    }

 
}

