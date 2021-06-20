import { Component, Input, OnDestroy } from '@angular/core';
import { SpeechRecogn } from './speechrecogn.service';
import { InferAudioService } from './infer-audio.service';
import { OnInit } from '@angular/core';

declare let InstallTrigger: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  words: string[] = [];
  noOfWordsSpoken: number = 0;
  scores: any[] = [0,0];
  timestamps: any = 0;
  isChrome: boolean;
  isFirefox: boolean;
  isListening = false;


  constructor(public webSpeechService: SpeechRecogn, public inferAudioService: InferAudioService) {
  }

  ngOnInit() {
    this.isFirefox = typeof InstallTrigger !== 'undefined';
    this.isChrome = window['chrome'] || navigator.userAgent.indexOf('CriOS') > 0;  
  }

  public startAudioInfer() {
      // const osName = this.testService.testData.client_data.OS.name;
      if(this.isChrome) { 
          this.startWebSpeechRecogn();
      } else if(this.isFirefox) {
          this.startTensorRecogn();
      }
      this.isListening = true;
  }
  
  public stopAudioInfer() {
      if(this.isListening) {
          if(this.isChrome) {
              this.stopWebSpeechRecogn();
          } else if(this.isFirefox) {
              this.stopTensorRecogn();
          }
      }
      this.isListening = false;
  }

  private startWebSpeechRecogn() {
      this.webSpeechService.start();
      this.webSpeechService.getTransWords().subscribe((text) => {
          text ? console.log("found") : '';
      }), ((err:any) => {
          console.log("error", err);
      })
  }

  private stopWebSpeechRecogn() {
      this.webSpeechService.stop();
  }

  private startTensorRecogn() {
      this.inferAudioService.init();
      this.inferAudioService.getRecogResults().subscribe((scores: any[]) => {
          if(scores){
              this.scores = scores;
              if(this.scores[1] > 0.75) {
                  console.log("found");
              }
          }
      })
  }
  
  private stopTensorRecogn() {
      this.inferAudioService.stopListening();
  }

  ngOnDestroy() {
    this.stopAudioInfer();
  }
}
