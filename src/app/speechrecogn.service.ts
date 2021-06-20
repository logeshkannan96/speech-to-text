import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';

interface IWindow extends Window {
	webkitSpeechRecognition: any;
	SpeechRecognition: any;
	SpeechSynthesisUtterance: any;
}

@Injectable({
    providedIn: 'root',
})export class SpeechRecogn {
    private transcribedWords = new BehaviorSubject<boolean>(false);
    listening = false;
    window: IWindow = (window as unknown) as IWindow;
    speechRecognition: any = this.window.SpeechRecognition;
    wordList: string[] = [];
    autoEnd: boolean = true;

    constructor() {
        const recognition = this.window.SpeechRecognition || this.window.webkitSpeechRecognition;
        if (typeof recognition !== "undefined") {
            this.speechRecognition = new recognition();
        } else {
            return;
        }
        this.speechRecognition.continuous = true;
        this.speechRecognition.interimResults = false;
        this.speechRecognition.addEventListener("result", this.onResult);
        this.speechRecognition.onend = () => {
            if(this.autoEnd) {
                this.speechRecognition.start();
            }
        };
    }
    
    stop() {
        this.autoEnd = false;
        this.speechRecognition.stop();
    };

    start() {
        console.log("started");
        this.speechRecognition.start();
    };

    onResult = (event) => {
        console.log("inferred");
        this.setTransWords(true);
        if(event.results[0].isFinal) {
        }
    }

    setTransWords(transcript) {
        return this.transcribedWords.next(transcript);
    }
 
    getTransWords(): Observable<any> {
        return this.transcribedWords;
    }   

}