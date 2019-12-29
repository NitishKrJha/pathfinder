import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, AlertController } from 'ionic-angular';
import { AppEnum } from '../../providers/app.enum';
import { AppServices } from '../../providers/app.service';
import { DatabaseProvider } from '../../providers/database.service';
import Swal from 'sweetalert2';
import swal from 'sweetalert';
import * as $ from "jquery";

/**
 * Generated class for the QuizCategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-quiz-category',
  templateUrl: 'quiz-category.html',
  providers: [AppServices,AppEnum]
})
export class QuizCategoryPage {
  public loadingPopup;
  public chooseLanguage;
  public languageIcon;
  public languageId;
  public levelId;
  public setLanguage={Quiz: "",noDataFound: "",levelText: "", playQuiz:"", quizAlert:"", quizMessage:""}
  public allDisable = true;
  public mascotImg= localStorage.getItem('mascotImg');
  public disableData = false;
  public startDateTime;
  public langOption = ["English","हिंदी","मराठी"];

  constructor(public navCtrl: NavController, public navParams: NavParams,platform: Platform,public loadingCtrl: LoadingController,
    private _appService: AppServices,public eNumValue: AppEnum,private databaseprovider: DatabaseProvider,private alertCtrl: AlertController) {
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
    // console.log('ionViewDidLoad QuizCategoryPage');
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
     this.allDisable = true;
     console.log('inside datebase');
    if (rdy) {
      this.loadingPopup.present();
          this.databaseprovider.getQuizLevel(this.languageId).then(data => {
          this.loadingPopup.dismiss();
          console.log('getQuizLevel');
          this.levelId=data;
          console.log(this.levelId);
          console.log(data);
           setTimeout(function(){
            $('#Id'+1).css({top: '78%', right: '10%', position:'absolute'});
            $('#Id'+2).css({top: '38%', left: '15%', position:'absolute'});
          },100)
          if(this.languageId == 1) {
            console.log(this.languageId);
              this.showData();
          } if(this.languageId == 2) {
            console.log(this.languageId);
                this.showData();
          }

         },err => {
          this.loadingPopup.dismiss();
         });
    }
  })

  }

  showData(){
    if(this.levelId[1].Count == null || this.levelId[1].Count >= 0) {
      setTimeout(function() {
       $('#Id'+1).removeClass('disabled');
     }, 1000);
    }

     for (var i = 0 ; i<this.levelId.length; i++){
       console.log(i);
       if(this.levelId[i].Count == 10) {
       const id2 = i+1;
       setTimeout(function() {
         $('#Id'+id2).removeClass('disabled');
        }, 1000);
      }
     }
     if(this.levelId[1].Count == 10){
       console.log('level 1');
       setTimeout(function() {
       $('#Id'+1).toggleClass('disabled');
      }, 1000);
    }
    if(this.levelId[0].Count == 10){
       console.log('level 2');
       setTimeout(function() {
       $('#Id'+2).toggleClass('disabled');
      }, 1000);
     }
   this.quizSuccess();
  }
  quizSuccess(){
    console.log('inside quizSuccess');
    if (this.levelId[0].Count == 10 && this.levelId[1].Count == 10){
        this.disableData = true;
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

  formatNumber(number) {
    const formattedNumber = ('0' + number).slice(-2);
    return formattedNumber;
}

  gotoDashboard(){
    this.updateGetTIme();
    this.navCtrl.setRoot("DashboardPage");
  }

  gotoQuizContentPage(questionLevel) {
    console.log(questionLevel);
    // this.getLastDateTimeOfQuiz(questionLevel);
     this.navCtrl.setRoot("QuizPage",{QuestionLevel:questionLevel});
  }

  getLastDateTimeOfQuiz(questionLevel){
    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.databaseprovider.getLastTimeOfQuiz(questionLevel,this.languageId).then(data => {
          console.log(data);
          this.startDateTime = data[0].StartTime;
          console.log(this.startDateTime);
          // console.log(this.startDateTime[0]);
          this.validDate(questionLevel);

          })
      }
    });

  }
validDate(questionLevel) {
  const d = new Date();
  const currentTime =  d.getFullYear().toString() + '-' + this.formatNumber((d.getMonth() + 1).toString()) + '-' + this.formatNumber(d.getDate().toString()) + ' ' + this.formatNumber(d.getHours().toString()) + ':' + this.formatNumber(d.getMinutes().toString()) + ':' + this.formatNumber(d.getSeconds().toString());
  console.log(currentTime);
  var d1: any = new Date(this.startDateTime);
  var d2: any = new Date(currentTime);
  console.log(d2+" ---- "+d1);
  var difference = Math.abs(d2 - d1);
  console.log('Difference between Two Dates>>>>>>' + difference) ;
  if(this.startDateTime == null || difference >= 172800000 ){
     this.navCtrl.setRoot("QuizPage",{QuestionLevel:questionLevel});
  }
  else if(difference < 172800000 ) {
    swal('', this.setLanguage.quizMessage, 'error');
    return false;
  }
  // this.navCtrl.setRoot("QuizPage",{QuestionLevel:questionLevel});

  this.updateQuizQuestion(questionLevel, difference);
}

  updateQuizQuestion(questionLevel, difference){
    console.log(difference);
    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.databaseprovider.updateQuizQuestionsForDay(questionLevel,this.languageId).then(data => {
          console.log('Update QuizForDay-------'+JSON.stringify(data));
         })

         if(difference >= 172800000 ) {
          this.databaseprovider.updateQuizQuestionsAfterTwoDays(questionLevel,this.languageId).then(data => {
            console.log('Update updateQuizQuestionsAfterTwoDays-------'+JSON.stringify(data));
           })
         }
      }
    });
  }

  playAgain(){
    let alert = this.alertCtrl.create({
      // title: 'Confirm purchase',
      message: this.setLanguage.playQuiz,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.playQuizAgain();
          }
        }
      ]
    });
    alert.present();
  }
  playQuizAgain(){
    if (this.levelId[0].Count == 10 && this.levelId[1].Count == 10){
      this.databaseprovider.getDatabaseState().subscribe(rdy => {
        if (rdy) {
          this.databaseprovider.updateCorrectAnswerCount().then(data => {
            console.log('playQuizAgain-------'+JSON.stringify(data));
            this.disableData = false;
           })
        }
      });
      this.ionViewDidLoad();
      } else if (this.levelId[0].Count !== 10 || this.levelId[1].Count !== 10){
        let alert = this.alertCtrl.create({
        message: this.setLanguage.quizAlert,
          buttons: [
            {
              text: 'OK',
              role: 'cancel',
              handler: () => {
                console.log('OK clicked');
              }
            }
          ]
        });
        alert.present();
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
