import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import { MainComponent } from './components/main/main.component';
import { AddComponent } from './components/add/add.component';
import { ReceivedComponent } from './components/received/received.component';
import { SendedComponent } from './components/sended/sended.component';
import { ConversationComponent } from './components/conversation/conversation.component';
import { UsersComponent } from './components/users/users.component';

import {UserGuard} from '../services/user.guard';

const messagesRoutes: Routes = [
    {
        path: 'messenger',
        component: MainComponent,
        children: [
            {path: '', redirectTo: 'send', pathMatch: 'full'},
            {path: 'send', component: AddComponent, canActivate:[UserGuard]},
            {path: 'receive', component: ReceivedComponent, canActivate:[UserGuard]},
            {path: 'receive/:page', component: ReceivedComponent, canActivate:[UserGuard]},
            {path: 'sent', component: SendedComponent, canActivate:[UserGuard]},
            {path: 'sent/:page', component: SendedComponent, canActivate:[UserGuard]},
            {path: 'conversation/:userId', component: ConversationComponent, canActivate:[UserGuard]},
            {path: 'conversation/:userId/:page', component: ConversationComponent, canActivate:[UserGuard]},
            {path: 'people', component: UsersComponent, canActivate:[UserGuard]},
            {path: 'people/:page', component: UsersComponent, canActivate:[UserGuard]},
        ]
    },
];

@NgModule({
  imports: [
    RouterModule.forChild(messagesRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: []
})
export class MessagesRoutingModule { }
