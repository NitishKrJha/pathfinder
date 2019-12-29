import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform,LoadingController } from 'ionic-angular';
import { AppEnum } from '../../providers/app.enum';
import { AppServices } from '../../providers/app.service';
import { DatabaseProvider } from '../../providers/database.service';
import * as $ from "jquery";

@IonicPage()
@Component({
  selector: 'page-library',
  templateUrl: 'library.html',
  providers: [AppServices,AppEnum],

})
export class LibraryPage {
  public loadingPopup;
  public chooseLanguage;
  public languageIcon;
  public languageId;
  public setLanguage={library:""};
  public langOption = ["English","हिंदी","मराठी"];
  methods:string="libraryMethod";
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
        this.methods=  this.navParams.get('segment');
          // alert(this.methods);
    }

    ngOnInit(){
      var ths=this;
      $(document).ready(function(){
        $(".content_html").click(function(e){
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
    this.getScrollData();

  }
  getScrollData(){
    this.loadingPopup = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
      <div class="preloader">
        <div class="loader"></div>
      </div>`
      });
    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.loadingPopup.present();
        this.databaseprovider.getGetOtherContent("Library",this.languageId).then(data => {
            this.loadingPopup.dismiss();
            // alert(data[0].Content);
           $('.content_html').html(data[0].Content);
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
  gotoToolPage(){
    this.navCtrl.setRoot("ToolOnePage");

  }
  gotoToolTwo(){
    this.navCtrl.setRoot("ToolTwoPage");
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
