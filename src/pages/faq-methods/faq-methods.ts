import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform ,LoadingController} from 'ionic-angular';
import { AppEnum } from '../../providers/app.enum';
import { AppServices } from '../../providers/app.service';
import { DatabaseProvider } from '../../providers/database.service';
import { TextToSpeech } from '@ionic-native/text-to-speech';

@IonicPage()
@Component({
  selector: 'page-faq-methods',
  templateUrl: 'faq-methods.html',
  providers: [AppServices,AppEnum]

})
export class FaqMethodsPage {
  public loadingPopup;
  public setLanguage={Faq: "",noDataFound:""}
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
  public langOption = ["English","हिंदी","मराठी"];
   public mascotImg= localStorage.getItem('mascotImg');
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
    console.log('ionViewDidLoad FaqMethodsPage');
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
  gotoFAQPage(method){
    // this.tts.speak({
    //   text: method.MethodName,
    //   locale: 'en-IN',
    //   })
    // .then(() =>
    //    console.log('Success'))
    // .catch((reason: any) =>
    //    console.log(reason));
    //alert(method)
    this.navCtrl.setRoot("FaqPage", {methodID: method});
  }
  gotoDashboard(){
    this.updateGetTIme();
    this.navCtrl.setRoot("DashboardPage");
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
}
