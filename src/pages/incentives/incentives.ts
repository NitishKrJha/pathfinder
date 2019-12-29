import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform,LoadingController } from 'ionic-angular';
import { AppEnum } from '../../providers/app.enum';
import { AppServices } from '../../providers/app.service';
import { DatabaseProvider } from '../../providers/database.service';
import { ImageViewerController } from 'ionic-img-viewer';

@IonicPage()

@Component({
  selector: 'page-incentives',
  templateUrl: 'incentives.html',
  providers: [AppServices,AppEnum]
})
export class IncentivesPage {
  public loadingPopup;
  public chooseLanguage;
  public languageIcon;
  public languageId;
  public langOption = ["English","हिंदी","मराठी"];
  public setLanguage={incentive: "",incentiveLabel: "",indeminityLabel: ""}
 _imageViewerCtrl: ImageViewerController;
  methods:string="incentive";


  constructor(public navCtrl: NavController, public navParams: NavParams,platform: Platform,public loadingCtrl: LoadingController,
    private _appService: AppServices,public eNumValue: AppEnum,private databaseprovider: DatabaseProvider,imageViewerCtrl: ImageViewerController) {
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
     this._imageViewerCtrl = imageViewerCtrl;

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad IncentivesPage');
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
  }
  presentImage(Image) {
    const imageViewer = this._imageViewerCtrl.create(Image,{fullResImage:"fullResImage"});
    imageViewer.present();
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
}
