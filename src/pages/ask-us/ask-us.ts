import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform,LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { Device } from '@ionic-native/device';
import { AppEnum } from '../../providers/app.enum';
import { AppServices } from '../../providers/app.service';
import { DatabaseProvider } from '../../providers/database.service';
import * as $ from "jquery";

@IonicPage()
@Component({
  selector: 'page-ask-us',
  templateUrl: 'ask-us.html',
  providers: [AppServices,AppEnum]
})
export class AskUsPage {
  public loadingPopup;
  public setLanguage={AskUs:"",submit:"",question_PlaceHolder:"",questionError:""};
  public chooseLanguage;
  public languageIcon;
  public userDetail=JSON.parse(localStorage.getItem("userDetail"));
  public userKey=JSON.parse(localStorage.getItem("userKey"));
  public getQuestionList;
  public askUs:FormGroup;
  public questionText;
  public ansText;
  public respondTime;
  public langOption = ["English","हिंदी","मराठी"];
  constructor(public navCtrl: NavController, public navParams: NavParams,private _appService: AppServices,public fb: FormBuilder,private device: Device,
    platform: Platform,public eNumValue: AppEnum,public loadingCtrl: LoadingController,private databaseprovider: DatabaseProvider) {
      this.loadingPopup = this.loadingCtrl.create({
        spinner: 'hide',
        content: `
        <div class="preloader">
          <div class="loader"></div>
        </div>`
        });
        this.askUs = fb.group({
          question: ['', Validators.compose([Validators.required])],
        })
        platform.registerBackButtonAction(() => {
          this.gotoDashboard();
         });
  }

  ionViewDidLoad(){
    if(localStorage.getItem("selectLanguage")==this.eNumValue.Entitylanguage.language_english){
      this.setLanguage=this.eNumValue.Entity_language_english
      this.chooseLanguage=this.eNumValue.Entitylanguage.language_hindi
      this.languageIcon="assets/imgs/language-icon.png"
    }else if(localStorage.getItem("selectLanguage")==this.eNumValue.Entitylanguage.language_hindi){
      this.setLanguage=this.eNumValue.Entity_language_hindi
      this.chooseLanguage=this.eNumValue.Entitylanguage.language_english
      this.languageIcon="assets/imgs/language-new.png"
    }else if(localStorage.getItem("selectLanguage")==this.eNumValue.Entitylanguage.language_marathi){
      this.setLanguage=this.eNumValue.Entity_language_marathi
      this.chooseLanguage=this.eNumValue.Entitylanguage.language_marathi
      this.languageIcon="assets/imgs/language-new.png"
    }
    var status = navigator.onLine;
    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.loadingPopup.present();
        this.databaseprovider.getAskQuestionsDetails().then(data => {
            this.loadingPopup.dismiss();
            this.getQuestionList=data;
          },err => {
            this.loadingPopup.dismiss();
           });
      }
    })
  }

// getpostQuestions(){
//   this.databaseprovider.getAskQuestionsDetailsLive().then(data => {
//     if(data.length !=0){
//       this.postAllQuestion(data);
//     }
//     });
// }



  submitQuestion(value){
    if(!this.askUs.valid) {
      Object.keys(this.askUs.controls).forEach(field => {
        const control = this.askUs.get(field);
        control.markAsTouched({ onlySelf: true });
      });
     return;
     }

     this.loadingPopup = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
      <div class="preloader">
        <div class="loader"></div>
      </div>`
      });
    // console.log(value)
    this.loadingPopup.present();
    var tempArray=[];
    var d= new Date();
    var date= d.getDate().toString()+"-"+(d.getMonth()+ 1).toString()+"-"+d.getFullYear().toString()+" "+d.getHours().toString()+":"+d.getMinutes().toString();
    // console.log(date)
    var postJson=  {
            "ClientUserId" : this.userKey.ClientUserId,
            "DeviceId" : this.userDetail.Deviceid,
            "LanguageId" : (this.setLanguage==this.eNumValue.Entity_language_english ? '1' : '2'),
            "Feedback" : value.question,
            "SubmittedDateTime" : date
          }
          tempArray.push(postJson);
          var tempjson={
            "FeedbackList": tempArray
          }
      var stringifyPostJson= JSON.stringify(tempjson);
      // console.log(stringifyPostJson);
      this.saveQuestionlocaly(postJson);
      // var status = navigator.onLine;
      // // console.log(status);
      // if (status) {
      // this._appService.postData_new("InsertUpdateClientFeedback", stringifyPostJson).subscribe(data => {
      //   // console.log(data)
      //   if(data.Status=="1"){
      //        this.askUs.controls['question'].setValue("");
      //        this.deleteLocalData();
      //      }else{
      //        alert(data.Message);
      //        this.loadingPopup.dismiss();
      //      }
      //   },err => {
      //    this.loadingPopup.dismiss();
      //   });
      // }else{
      //   // console.log("offline");
      // this.saveQuestionlocaly(postJson);
      // }

  }

  saveQuestionlocaly(question){
    // console.log("saveQuestionlocaly")
    var questions=[];
    questions.push(question);
    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.databaseprovider.addAskQuestionsDetails(questions).then(data => {
          this.loadingPopup.dismiss();
          this.askUs.controls['question'].setValue("");
          alert("Your feedback/query submitted successfully");
          localStorage.setItem('askusSync','false');
          this.ionViewDidLoad();
         })
      }
    })
  }

  deleteLocalData(){
    this.databaseprovider.getDatabaseState().subscribe(rdy => {
    if (rdy) {
      this.databaseprovider.deletAskQuestionDetails().then(data => {
         if(data==true){
          this.loadliveData();
         }
       })
    }
  })
}

  loadliveData(){
    var DataAskQuestionUrl="GetClientFeedbackResponse/"+this.userKey.ClientUserId ;
        this._appService.getData_new(DataAskQuestionUrl).subscribe(data => {
          this.saveAskQuestionLive(data.FeedbackList);
    },err => {
      this.loadingPopup.dismiss();
     });
  }

  saveAskQuestionLive(question){
    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.databaseprovider.addAskQuestionsDetailsLive(question).then(data => {
          this.loadingPopup.dismiss();
          alert("Your feedback/query submitted successfully");
          localStorage.setItem('askusSync','true');
          this.ionViewDidLoad();
         })
      }
    })
  }

  changeLanguage(chooseLanguage){
    var result= this._appService.changeLanguage(chooseLanguage);
    if(result){
      this.ionViewDidLoad();
    }else{
      alert("Something Went wrong.");
    }
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
