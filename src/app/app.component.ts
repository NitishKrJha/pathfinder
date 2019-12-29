import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppEnum} from '../providers/app.enum';
import { timer } from 'rxjs/observable/timer'
import { TextToSpeech } from '@ionic-native/text-to-speech';


@Component({
  templateUrl: 'app.html',
  providers: [AppEnum]
})
export class MyApp {
  showSplash=true;
  rootPage:string = "HomePage";

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,public eNumValue: AppEnum,
    private tts: TextToSpeech) {
    platform.ready().then(() => {
      // statusBar.styleDefault();
      statusBar.overlaysWebView(false);
      splashScreen.hide();
           this.tts.speak({
          text: 'Welcome to the family planning app. A digital tool for capacity building.',
          locale: 'en-IN',
          }).then(() =>
           console.log('Success'))
          .catch((reason: any) =>
             console.log(reason));

      timer(6000).subscribe(()=> this.showSplash=false);
    });
  }
}

