import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,Platform ,LoadingController} from 'ionic-angular';
import { AppEnum } from '../../providers/app.enum';
import { AppServices } from '../../providers/app.service';
import { DatabaseProvider } from '../../providers/database.service';
import * as $ from "jquery";

@IonicPage()
@Component({
  selector: 'page-faq',
  templateUrl: 'faq.html',
  providers: [AppServices,AppEnum],

})
export class FaqPage {
  public loadingPopup;
  public chooseLanguage;
  public languageIcon;
  public languageId;
  public faqData;
  public Answer;
  public MethodName;
  public setLanguage={Faq: "",noDataFound:""}
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
      this.gotoFAQMethods();
     });
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad FaqPage');
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
   var methodID= this.navParams.get('methodID');
   this.databaseprovider.getDatabaseState().subscribe(rdy => {
    if (rdy) {
      this.loadingPopup.present();
      this.databaseprovider.getFAQDetail(methodID,this.languageId).then(data => {
          this.loadingPopup.dismiss();
          this.MethodName=data[0].MethodName;
          this.faqData=data;
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
  gotoFAQAnswer(getFAQ,index){
      this.Answer=getFAQ.Answer
      $(".faqContent").addClass("display-none")
      $(".ansContent_"+index).removeClass("display-none")
      $(".downSign").removeClass("display-none")
     $(".downSign_"+index).addClass("display-none")
     $(".faqAnswer").html(getFAQ.Answer)
  }
  gotoFAQMethods(){
    this.navCtrl.setRoot("FaqMethodsPage");
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
