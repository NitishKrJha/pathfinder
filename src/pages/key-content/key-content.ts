import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,Platform ,LoadingController} from 'ionic-angular';
import { AppEnum } from '../../providers/app.enum';
import { AppServices } from '../../providers/app.service';
import * as $ from "jquery";

@IonicPage()
@Component({
  selector: 'page-key-content',
  templateUrl: 'key-content.html',
  providers: [AppServices,AppEnum]
})
export class KeyContentPage {
  public loadingPopup;
  public chooseLanguage;
  public languageIcon;
  public languageId;
  public langOption = ["English","हिंदी","मराठी"];
  public setLanguage={keyMessage: ""}

  constructor(public navCtrl: NavController, public navParams: NavParams,platform: Platform,public loadingCtrl: LoadingController,
    private _appService: AppServices,public eNumValue: AppEnum  ) {
      this.loadingPopup = this.loadingCtrl.create({
        spinner: 'hide',
        content: `
        <div class="preloader">
          <div class="loader"></div>
        </div>`
        });

      platform.registerBackButtonAction(() => {
       this.gotoKeyMessage();
     });
  }

  ngOnInit(){
    var ths=this;
    $(document).ready(function(){
      $(".Key-Details").click(function(e){
          var event = e;
          ths._appService.onimgclick(e);
      });
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
    var keyData= this.navParams.get('keyData');
    $('.purple').html(keyData.KeyMessageHeading)
    $('.Key-Details').html(keyData.Content)
  }
  changeLanguage(chooseLanguage){
    var result= this._appService.changeLanguage(chooseLanguage);
    if(result){
      this.ionViewDidLoad();
    }else{
      alert("Somthing Went wrong.");
    }
  }
  gotoKeyMessage(){
    this.navCtrl.setRoot("KeyMessagePage");
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
