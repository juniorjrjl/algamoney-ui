import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from './message/message.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    MessageComponent
  ],
  declarations: [
    MessageComponent
  ]
})
export class SharedModule { }
