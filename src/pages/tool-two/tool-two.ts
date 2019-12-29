import { Component,ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform,LoadingController,Slides  } from 'ionic-angular';
import { AppEnum } from '../../providers/app.enum';
import { AppServices } from '../../providers/app.service';
import { DatabaseProvider } from '../../providers/database.service';
import * as $ from "jquery";

@IonicPage()
@Component({
  selector: 'page-tool-two',
  templateUrl: 'tool-two.html',
  providers: [AppServices,AppEnum],

})
export class ToolTwoPage {
  public loadingPopup;
  public chooseLanguage;
  public languageIcon;
  public languageId;
  public langOption = ["English","हिंदी","मराठी"];
  public setLanguage={library:""}
  public questionArrayOne=["Last injection dose within 10 weeks to 16 weeks","New complaints after starting the DMPA","Blurring of vision","Severe pain in calf","Jaundice","Unexplained vaginal bleeding","Discomfort or pain at the injection site","Headaches/migraine with aura","DM,TB,HIV,breast cancer diagnosed after DMPA initiation"];
  public questionArrayTwo=["Weight gain since starting the DMPA","High BP(>160/100)","Pallor"];
  public ansArray:any=[2,2,2,2,2,2,2,2,2,2,2,2]  //[2,0,0,0,0,0,0,0,0,0,0,0]
  public firstAns;
  public finalResult;
  public submitFlag=true;
  public modelType;
  public countAnsNegative;
  public chkSubmitForLightGrey;
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
  getValue(value,index){
    if(value==0 &&  index==0){
      this.modelType="darkGrey";
      this.openModel();
    }
    if(index==0){
      this.firstAns=value;
      // this.ansArray[index]=value;
    }
    if(index!=0 && this.ansArray.length ==12 && this.ansArray.length>=index){
      this.ansArray[index]=value;
    }
    var count={0:"" , 1:"",2:""};
    count= this.ansArray.reduce((a, c)=>{a[c]++?0:a[c]=1;return a},{});

    this.countAnsNegative=count[1]
    if(count[0]== "11" && this.firstAns=='1'){
      this.modelType="Green";
      this.submitFlag=false;
    } else if(count[1]>="1" && value==1){
       this.modelType="lightGrey";
      this.submitFlag=false;
      this.openModel();
    }
    else if( count[1]==undefined){
      this.submitFlag=true;
    }

  }

  submit(){
    if(this.countAnsNegative>=1){
      this.chkSubmitForLightGrey=true;
    }else{
      this.chkSubmitForLightGrey=false;
    }
    this.openModel();
  }


  openModel(){
    $('#myModal').css("display","block");
  }

  closeModel(){
    // console.log(this.firstAns)
    if(this.countAnsNegative>=1 && this.firstAns!=0){
      if(this.chkSubmitForLightGrey==true){
        $('#myModal').css("display","none");
        this.gotoLibraryPage();
      }else{
        $('#myModal').css("display","none");
      }
    }else{
      $('#myModal').css("display","none");
      this.gotoLibraryPage();
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
