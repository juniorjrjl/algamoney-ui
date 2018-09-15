import { MessageComponent } from './message/message.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
