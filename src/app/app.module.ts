import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { FileTransfer} from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { SQLite } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../providers/database.service'
import { IonicStorageModule } from '@ionic/storage';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { MyApp } from './app.component';
import { Device } from '@ionic-native/device';
  import { IonicImageViewerModule } from 'ionic-img-viewer';
  import { PhotoViewer } from '@ionic-native/photo-viewer';
  import { Zip } from '@ionic-native/zip';

@NgModule({
  declarations: [
    MyApp,
   // CustomLoaderComponent
   ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp),
    IonicImageViewerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    Device,
    StatusBar,
    SplashScreen,
    SQLite,
    DatabaseProvider,
    SQLitePorter,
    File,
    FileTransfer,
    TextToSpeech,
    PhotoViewer ,
    Zip,
      {provide: ErrorHandler, useClass: IonicErrorHandler},

  ]
})
export class AppModule {}
