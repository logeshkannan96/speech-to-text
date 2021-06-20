import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpeechRecogn } from './speechrecogn.service';
import { InferAudioService } from './infer-audio.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [SpeechRecogn, InferAudioService],
  bootstrap: [AppComponent]
})
export class AppModule { }
