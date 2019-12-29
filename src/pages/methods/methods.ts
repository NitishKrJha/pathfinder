import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform ,LoadingController} from 'ionic-angular';
import { AppEnum } from '../../providers/app.enum';
import { AppServices } from '../../providers/app.service';
import { DatabaseProvider } from '../../providers/database.service';
import { TextToSpeech } from '@ionic-native/text-to-speech';

@IonicPage()
@Component({
  selector: 'page-methods',
  templateUrl: 'methods.html',
  providers: [AppServices,AppEnum]
})
export class MethodsPage {
  public loadingPopup;
  public setLanguage={Methods: ""}
  public chooseLanguage;
  public allMethods;
  public languageIcon;
  public languageId;
  public overview;
  public iucd;
  public coc;
  public dmpa;
  public centchroman;
  public male_stre;
  public female_stre;
  public ecp;
  public condom;
  public spacingMethod;
  public limitingMethod;
  public mascotImg= localStorage.getItem('mascotImg');
  public userDetail=JSON.parse(localStorage.getItem("userDetail"));
  public userKey=JSON.parse(localStorage.getItem("userKey"));
  public langOption = ["English","हिंदी","मराठी"];

  constructor(public navCtrl: NavController, public navParams: NavParams,platform: Platform,public loadingCtrl: LoadingController,
    private _appService: AppServices,public eNumValue: AppEnum,private databaseprovider: DatabaseProvider,private tts: TextToSpeech) {
      this.loadingPopup = this.loadingCtrl.create({
        spinner: 'hide',
        content: `
        <div class="preloader">
          <div class="loader"></div>
        </div>`
        });

      platform.registerBackButtonAction(() => {
      this.gotoDashboard();
     });
  }

  ionViewDidLoad() {
    // var DataSyncMethodUrl="GetMethodsDataForSync/6"
    // this._appService.getData_new(DataSyncMethodUrl).subscribe(data => {
    //   console.log(this.allMethods)
    //   if(data.MethodsDataForSync.Status.Status=='1'){
    //     //  this.overview=data.MethodsDataForSync.Result[0].MobileIconURL;
    //      this.iucd= data.MethodsDataForSync.Result[1].MobileIconURL;
    //      this.coc= data.MethodsDataForSync.Result[2].MobileIconURL;
    //      this.dmpa= data.MethodsDataForSync.Result[3].MobileIconURL;
    //      this.centchroman= data.MethodsDataForSync.Result[4].MobileIconURL;
    //      this.male_stre= data.MethodsDataForSync.Result[5].MobileIconURL;
    //      this.ecp= data.MethodsDataForSync.Result[6].MobileIconURL;
    //      this.female_stre= data.MethodsDataForSync.Result[7].MobileIconURL;
    //      this.condom= data.MethodsDataForSync.Result[8].MobileIconURL;

    //      this.allMethods=data.MethodsDataForSync.Result;
    //   }else{
    //     this.loadingPopup.dismiss();
    //     alert(data.MethodsDataForSync.Status.Message)
    //   }
    // },err => {
    //   this.loadingPopup.dismiss();
    //  });
    // // alert(localStorage.getItem("selectLanguage"))
    if(localStorage.getItem("selectLanguage")==this.eNumValue.Entitylanguage.language_english){
      this.setLanguage=this.eNumValue.Entity_language_english
      this.chooseLanguage=this.eNumValue.Entitylanguage.language_hindi
      this.languageIcon="assets/imgs/language-icon.png"
      this.languageId="1"
    }else if(localStorage.getItem("selectLanguage")==this.eNumValue.Entitylanguage.language_hindi){
      this.setLanguage=this.eNumValue.Entity_language_hindi
      this.chooseLanguage=this.eNumValue.Entitylanguage.language_english
      this.languageIcon="assets/imgs/language-new.png"
      this.languageId="2"
    }else if(localStorage.getItem("selectLanguage")==this.eNumValue.Entitylanguage.language_marathi){
      this.setLanguage=this.eNumValue.Entity_language_marathi
      this.chooseLanguage=this.eNumValue.Entitylanguage.language_marathi
      this.languageIcon="assets/imgs/language-new.png"
      this.languageId="3"
    }

    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.loadingPopup.present();
        this.databaseprovider.getMethodsList("1",this.languageId).then(data => {
            this.loadingPopup.dismiss();
            this.spacingMethod=data;
            //alert(JSON.stringify(data));
          },err => {
            this.loadingPopup.dismiss();
           });

        this.loadingPopup.present();
        this.databaseprovider.getMethodsList("2",this.languageId).then(data => {
            this.loadingPopup.dismiss();
            this.limitingMethod=data;
            //alert(JSON.stringify(data));
          },err => {
            this.loadingPopup.dismiss();
           });
      }
    })

  }

  changeLanguage(chooseLanguage){
    var result= this._appService.changeLanguage(chooseLanguage);
    if(result){
      this.ionViewDidLoad();
    }else{
      alert("Somthing Went wrong.");
    }
  }
  gotoDashboard(){
    this.updateGetTIme();
    this.navCtrl.setRoot("DashboardPage");
  }
  updateGetTIme(){
    const startTime = localStorage.getItem('startTime');
    console.log(startTime);
    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.databaseprovider.updateGetTime(startTime).then(data => {
         })
      }
    });
  }
  formatNumber(number) {
    const formattedNumber = ('0' + number).slice(-2);
    return formattedNumber;
  }
  gotoTopicsListPage(method){
    const d = new Date();
    const contentType = 'ContraceptiveMethods'
    const date =  d.getFullYear().toString() + '-' + this.formatNumber((d.getMonth() + 1).toString()) + '-' + this.formatNumber(d.getDate().toString()) ;
    const time = this.formatNumber(d.getHours().toString()) + ':' + this.formatNumber(d.getMinutes().toString()) + ':' + this.formatNumber(d.getSeconds().toString());
    const startTime = date + ' ' + time;
    console.log(date + " " + " " + contentType + " " + startTime);
    const result = {
      UserId: this.userKey.ClientUserId,
      RoleId: this.userDetail.StackholderId,
      AddedDate: date,
      LanguageId: this.languageId,
      ContentType: contentType,
      MethodId: method,
      StartDateTime: startTime,
      EndDateTime: ''
    };
    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        localStorage.setItem('startTimeMethod',startTime);
        this.databaseprovider.addGetDateTime(result).then(data => {
        })
        // this.databaseprovider.addMethodGetTime(this.userKey.ClientUserId,this.userDetail.StackholderId,date,this.languageId,contentType,method, startTime).then(data => {
        //   })
      }
    })
    this.navCtrl.setRoot("TopicsListPage", {methodID: method});
  }
  onSelectChange(selectedValue: any) {
    console.log('Selected', selectedValue);
    var result= this._appService.changeLanguage(selectedValue);
    if(result){
      this.ionViewDidLoad();
    }else{
      alert("Somthing Went wrong.");
    }
  }
  gotoTopicsListPageTest(method){
    const d = new Date();
    const contentType = 'ContraceptiveMethods'
    const date =  d.getFullYear().toString() + '-' + this.formatNumber((d.getMonth() + 1).toString()) + '-' + this.formatNumber(d.getDate().toString()) ;
    const time = this.formatNumber(d.getHours().toString()) + ':' + this.formatNumber(d.getMinutes().toString()) + ':' + this.formatNumber(d.getSeconds().toString());
    const startTime = date + ' ' + time;
    console.log(date + " " + " " + contentType + " " + startTime);
    const result = {
      UserId: this.userKey.ClientUserId,
      RoleId: this.userDetail.StackholderId,
      AddedDate: date,
      LanguageId: this.languageId,
      ContentType: contentType,
      MethodId: method,
      StartDateTime: startTime,
      EndDateTime: ''
    };
    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        localStorage.setItem('startTimeMethod',startTime);
        this.databaseprovider.addGetDateTime(result).then(data => {
        })
        // this.databaseprovider.addMethodGetTime(this.userKey.ClientUserId,this.userDetail.StackholderId,date,this.languageId,contentType,method, startTime).then(data => {
        //   })
      }
    })
    this.navCtrl.setRoot("TopicsListPage", {methodID: method});
  }

}
