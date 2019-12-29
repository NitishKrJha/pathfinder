import { Component } from '@angular/core';
import { NavController, NavParams,IonicPage } from 'ionic-angular';
import { AppEnum } from '../../providers/app.enum';
import { AppServices } from '../../providers/app.service';

@IonicPage()

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [AppServices,AppEnum]
})
export class HomePage {
  public setLanguage={Create_Your_Profile: "", Tap_to_here_to_create_your_profile: ""}
  public chooseLanguage;
  public langOption = ["English","हिंदी","मराठी"];
  constructor(public navCtrl: NavController, public navParams: NavParams,public eNumValue: AppEnum,
    private _appService: AppServices) {
      localStorage.setItem("selectLanguage",this.eNumValue.Entitylanguage.language_english)
  }

  ionViewDidLoad(){
    if(localStorage.getItem('userLocked')){
      if(localStorage.getItem('userLocked')=="1"){
        this.navCtrl.setRoot("DashboardPage");
      }
    }
    if(localStorage.getItem("selectLanguage")==this.eNumValue.Entitylanguage.language_english){
      this.setLanguage=this.eNumValue.Entity_language_english
      this.chooseLanguage=this.eNumValue.Entitylanguage.language_hindi
    }else if(localStorage.getItem("selectLanguage")==this.eNumValue.Entitylanguage.language_hindi){
      this.setLanguage=this.eNumValue.Entity_language_hindi
      this.chooseLanguage=this.eNumValue.Entitylanguage.language_english
    }else if(localStorage.getItem("selectLanguage")==this.eNumValue.Entitylanguage.language_marathi){
      this.setLanguage=this.eNumValue.Entity_language_marathi
      this.chooseLanguage=this.eNumValue.Entitylanguage.language_marathi
    }
  }

  changeLanguage(chooseLanguage){
    var result= this._appService.changeLanguage(chooseLanguage);
    if(result){
      this.ionViewDidLoad();
    }else{
      alert("Somthing Went wrong.");
    }
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

  gotoUserProfile(){
    this.navCtrl.setRoot("UserProfilePage")
  }

}
