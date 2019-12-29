import { Component,ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams ,Platform ,LoadingController,Slides } from 'ionic-angular';
import { AppEnum } from '../../providers/app.enum';
import { AppServices } from '../../providers/app.service';
import { DatabaseProvider } from '../../providers/database.service';
import * as $ from "jquery";

@IonicPage()
@Component({
  selector: 'page-quiz',
  templateUrl: 'quiz.html',
  providers: [AppServices,AppEnum]
})
export class QuizPage {
  @ViewChild(Slides) slides: Slides;
  public loadingPopup;
  public chooseLanguage;
  public languageIcon;
  public languageId;
  public QuizQuestion;
  public QuizAnswer;
  public correctAnswer;
  public correctCount = 0;
  public setLanguage={Quiz: "",correct:"",incorrect:"",response:""}
  public questionModal = [];
  public QuestionLevel= this.navParams.get('QuestionLevel');
  public shuffleArray = [];
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
      this.gotoQuizCategoryPage();
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

        //  var quizQuestionUrl="GetQuizQuestions/";
        //  this._appService.getData_new(quizQuestionUrl).subscribe(data => {
        //    this.makequestionModal(data.QuizQuestions)
        //  this.QuizQuestion=data.QuizQuestions;
        //  this.QuizAnswer=data.QuizQuestionOptions;
        //   },err => {
        //     this.loadingPopup.dismiss();
        //   });
        console.log(this.QuestionLevel);
         this.databaseprovider.getDatabaseState().subscribe(rdy => {
          if (rdy) {
            this.loadingPopup.present();
            this.databaseprovider.getQuizQuestions(this.QuestionLevel,this.languageId).then(data => {
            this.makequestionModal(data)
                this.QuizQuestion= this.shuffleData(data);
              },err => {
                this.loadingPopup.dismiss();
            });

            this.databaseprovider.getQuizQuestionOptions(this.QuestionLevel,this.languageId).then(data => {
              this.loadingPopup.dismiss();
              this.QuizAnswer=data;
            },err => {
              this.loadingPopup.dismiss();
          });
          }
        })
  }

  //For generating every time randomly array for display Questions
  //For Shuffle Data upto array Length

//   shuffleData(questionArray) {
//     for (let i = questionArray.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [questionArray[i], questionArray[j]] = [questionArray[j], questionArray[i]];
//     }
//     return questionArray;
// }

// For Shuffle Data upto required length
shuffleData(questionArray) {
  var shuffleArr = [];
  for (var i = 0; i < 10; i++) {
  var rand = Math.floor(Math.random() * (questionArray.length));
  shuffleArr.push(questionArray[rand]);
  questionArray.splice(rand,1);
  }
  return shuffleArr;
}
openModel(){
  $('#myModal').css("display","block");
}
closeModel(){
  $('#myModal').css("display","none");
  this.gotoQuizCategoryPage();
 }
  makequestionModal(Question){
    for (var index in Question) {
     this.questionModal.push({value: ''});
    }
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
  onSelectChange(selectedValue: any) {
    console.log('Selected', selectedValue);
    var result= this._appService.changeLanguage(selectedValue);
    if(result){
      this.ionViewDidLoad();
    }else{
      alert("Somthing Went wrong.");
    }
  }
  validateAnswer(QuestionNo,answer,index){
    this.loadingPopup = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
      <div class="preloader">
        <div class="loader"></div>
      </div>`
      });
    $('.rightAns_'+QuestionNo).css("display","none");
    $('.wrongAns_'+QuestionNo).css("display","none");
    if(answer=="1"){
      $('.rightAns_'+QuestionNo).css("display","block");
      this.correctCount++ ;
      // $('.rightAns_'+QuestionNo).fadeOut(3000);  // for hide with animation
    }else if(answer=="0"){
      this.databaseprovider.getDatabaseState().subscribe(rdy => {
          if (rdy) {
            this.loadingPopup.present();
            this.databaseprovider.getAnswerByQuestion(this.QuestionLevel,QuestionNo,this.languageId).then(data => {
              this.loadingPopup.dismiss();
              // $(".radioButton_"+index).css('background-color', 'red');
              $('.wrongAns_'+QuestionNo).css("display","block");
              $('.correctAns_'+QuestionNo).text(data[0].QuestionOptions)
              },err => {
                this.loadingPopup.dismiss();
            });
          }
        })
    }

        // //  $("#myRadio_"+index).addClass('disabled');
        //  setTimeout(function() {
        //    console.log('inside set timeout');
        //   // $("#radioButton_"+index).addClass('disabled');
        //   $("#radioButton_"+index).prop("disabled",true);
        //   console.log('after jquery');
        //   }, 1000);

          // $(".radio").click(function(){
          //   console.log('hi');
          //   var radioName = $(this).attr("name"); //Get radio name
          //   console.log(radioName);
          //   $(".radio[name='"+radioName+"']:not(:checked)").attr("disabled", true); //Disable all unchecked radios with the same name
          //  });

    if(++index == this.QuizQuestion.length){
      this.openModel();
    }
    console.log(this.QuizQuestion.length);
    console.log(index);
  }

  changeLanguage(chooseLanguage){
    var result= this._appService.changeLanguage(chooseLanguage);
    if(result){
      this.ionViewDidLoad();
    }else{
      alert("Somthing Went wrong.");
    }
  }

  gotoQuizCategoryPage(){
    // this.updateGetTIme();
    this.updateQuizQuestion();
    this.navCtrl.setRoot("QuizCategoryPage");
  }

  updateQuizQuestion(){
    this.databaseprovider.getDatabaseState().subscribe(rdy => {
          if (rdy) {
            this.databaseprovider.updateQuizQuestions(this.correctCount,this.QuestionLevel,this.languageId).then(data => {
              console.log('Update Quiz-------'+JSON.stringify(data));
             })
          }
        });
  }
  // updateGetTIme(){
  //   const startTime = localStorage.getItem('startTime');
  //   console.log(startTime);
  //   this.databaseprovider.getDatabaseState().subscribe(rdy => {
  //     if (rdy) {
  //       this.databaseprovider.updateGetTime(startTime).then(data => {
  //        })
  //     }
  //   });
  // }
}
