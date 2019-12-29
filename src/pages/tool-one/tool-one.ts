import { Component,ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform,LoadingController,Slides  } from 'ionic-angular';
import { AppEnum } from '../../providers/app.enum';
import { AppServices } from '../../providers/app.service';
import { DatabaseProvider } from '../../providers/database.service';
import * as $ from "jquery";
import { summaryFileName } from '@angular/compiler/src/aot/util';

@IonicPage()
@Component({
  selector: 'page-tool-one',
  templateUrl: 'tool-one.html',
   providers: [AppServices,AppEnum],

})
export class ToolOnePage {
  @ViewChild(Slides) slides: Slides;
  public loadingPopup;
  public chooseLanguage;
  public languageIcon;
  public languageId;
  public setLanguage={library:""}
  public questions=["Did your last monthly bleeding start within the past 7 days?","Have you abstained from sexual intercourse since your last monthly bleeding,delivery,abortion or miscarriage?","Have you been using a reliable contraceptive method consistently and correcty since your last monthly bleeding,delivery,abortion or miscarriage?","Have you had a baby in the last 4 weeks?","Did you have a baby less than six months ago,are you fully or nearly-fully breastfeeding, and have you had no monthly bleeding since then?","Have you had a miscarriage or abortion in the past 7 days?"];
  public arr=[];
  public result;
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
          this.gotoLibraryPage();
         });
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ToolOnePage');
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

  openModel(){
    $('#myModal').css("display","block");
  }
  closeModel(){
    $('#myModal').css("display","none");
     this.gotoLibraryPage();
    }
  slideChanged(){
    // $('.hideresult').css("display","none");
  }
  slideNext(){
    this.slides.slideNext(500, true);
  }

  slidePrev(){
    this.slides.slidePrev(500, true);
  }

  getValue(value,index){
      if(value=="1"){
        this.openModel();
        return false;
    } if (this.arr.length>=index){
      this.arr[index]=value;
      this.slideNext();
    }
    // else{
    //    this.arr.push(value);
    //    this.slideNext();
    // }

    if(this.arr.length==this.questions.length){
        // alert(this.include(this.arr,1))
        // alert(this.arr.indexOf('1') == -1)
        this.result=this.arr.indexOf('1')
        this.openModel();
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
  gotoLibraryPage(){
    this.navCtrl.setRoot("LibraryPage" ,{segment:"tools"});

  }
  gotoDashboard(){
    this.updateGetTIme();
    this.navCtrl.setRoot("DashboardPage")
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
