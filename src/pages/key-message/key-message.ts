import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,Platform ,LoadingController} from 'ionic-angular';
import { AppEnum } from '../../providers/app.enum';
import { AppServices } from '../../providers/app.service';
import { DatabaseProvider } from '../../providers/database.service';
import * as $ from "jquery";

@IonicPage()
@Component({
  selector: 'page-key-message',
  templateUrl: 'key-message.html',
  providers: [AppServices,AppEnum]
})
export class KeyMessagePage {
  public loadingPopup;
  public chooseLanguage;
  public languageIcon;
  public languageId;
  public keyMessageData;
  public setLanguage={keyMessage: "",noDataFound:""};
  public langOption = ["English","हिंदी","मराठी"];

  constructor(public navCtrl: NavController, public navParams: NavParams,platform: Platform,public loadingCtrl: LoadingController,
    private _appService: AppServices,public eNumValue: AppEnum,private databaseprovider: DatabaseProvider) {
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
      this.databaseprovider.getKeyMessageDetail(this.languageId).then(data => {
          this.loadingPopup.dismiss();
          this.keyMessageData=data;

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
  gotoKeyMessageContent(getkeyMessageData){
    this.navCtrl.setRoot("KeyContentPage",{"keyData":getkeyMessageData});
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
}
