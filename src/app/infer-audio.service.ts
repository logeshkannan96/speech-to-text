import { Injectable, PLATFORM_INITIALIZER } from '@angular/core';
import * as speechCommands from '@tensorflow-models/speech-commands';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import * as metadataFile from '../models/metadata.json';
import * as modelFile from '../models/model.json';

interface RecognizerResult {
    embedding: any;
    scores: any;
    spectrogram: any;
}

@Injectable()
export class InferAudioService {

    URL = "https://images.examly.io/scripts/audio/ap-v1/";
    recognizer: any;
    private recogResult = new BehaviorSubject<object>(null);

    constructor() {
    }

    async createModel() {
        // const checkpointURL = (modelFile as any).default; // model topology
        // const metadataURL = (metadataFile as any).default; // model metadata
        
        const checkpointURL = this.URL + 'model.json'; // model topology
        const metadataURL = this.URL + 'metadata.json'; // model metadata 

        const recognizer = speechCommands.create(
            "BROWSER_FFT", // fourier transform type, not useful to change
            undefined, // speech commands vocabulary feature, not useful for your models
            checkpointURL,
            metadataURL);

        await recognizer.ensureModelLoaded();

        return recognizer;
    }
   
    async init() {
        this.recognizer = await this.createModel();

        this.recognizer.listen((result:RecognizerResult) => {
            const scores = result.scores; // probability of prediction for each class'
            this.setRecogResults(scores);
            return Promise.resolve();
        }, {
            includeSpectrogram: true, // in case listen should return result.spectrogram
            probabilityThreshold: 0.75,
            invokeCallbackOnNoiseAndUnknown: true,
            overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
        });
    }

    stopListening() {
        setTimeout(() => {
            this.recognizer.stopListening();
            this.setRecogResults([0,0])
        }, 2000);
    }

    getRecogResults():Observable<any>  {
        return this.recogResult;
    }

    setRecogResults(scores) {
        return this.recogResult.next(scores);
    }
}