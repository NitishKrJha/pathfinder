import { Component,ViewChild } from '@angular/core';
import { IonicPage, Content , NavController, NavParams,Platform,LoadingController} from 'ionic-angular';
import { AppEnum } from '../../providers/app.enum';
import { AppServices } from '../../providers/app.service';
import { DatabaseProvider } from '../../providers/database.service';
import * as $ from "jquery";

@IonicPage()
@Component({
  selector: 'page-topics-content',
  templateUrl: 'topics-content.html',
  providers: [AppServices,AppEnum]
})
export class TopicsContentPage {
  @ViewChild('pageTop') pageTop: Content;
  public loadingPopup;
  // _imageViewerCtrl: ImageViewerController;
  public setLanguage={Create_Your_Profile: "", Tap_to_here_to_create_your_profile: ""}
  public chooseLanguage;
  public TopicName;
  public topicContent;
  public topicIndex;
  public languageIcon;
  public languageId;
  public MethodName;
  public slideIndex = 1;
  public langOption = ["English","हिंदी","मराठी"];
  constructor(public navCtrl: NavController, public navParams: NavParams,public eNumValue: AppEnum,platform: Platform,
    private _appService: AppServices,public loadingCtrl: LoadingController,private databaseprovider: DatabaseProvider) {
      this.loadingPopup = this.loadingCtrl.create({
        spinner: 'hide',
        content: `
        <div class="preloader">
          <div class="loader"></div>
        </div>`
        });

        platform.registerBackButtonAction(() => {
          this.gotoTopicListPage();
         });
  }

  ngOnInit(){
    var ths=this;
    $(document).ready(function(){
      $(".Topic-Details").click(function(e){
          var event = e;
          ths._appService.onimgclick(e);
      });
    });
  }

  ionViewDidLoad(){
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
    //var selectTopicDetail= this.navParams.get('getTopicDetails');
    var topicIndex= this.navParams.get('topicIndex');
    //var TopicName = selectTopicDetail;
    this.topicIndex = topicIndex;
    if(topicIndex === 1){
      this.TopicName = 'At a Glance';
    }
    if(topicIndex === 2){
      this.TopicName = 'Technicle Updates';
    }
    if(topicIndex === 3){
      this.TopicName = 'Effectiveness';
    }
    if(topicIndex === 4){
      this.TopicName = 'Benefits';
    }
    if(topicIndex === 5){
      this.TopicName = 'Limitations';
    }

    //this.TopicName=selectTopicDetail.TopicName;
    //this.TopicName=selectTopicDetail;
    // this.databaseprovider.getDatabaseState().subscribe(rdy => {
    //   if (rdy) {
    //     this.loadingPopup.present();
    //     this.loadTopicsDetail(selectTopicDetail.MethodId,topicIndex)
    //     this.topicContent=selectTopicDetail;

    //   }
    // })
  }

  loadTopicsDetail(MethodId,topicIndex){
        var myHtml=""  ;
        this.loadingPopup.present();
        this.databaseprovider.getTopics(MethodId,this.languageId).then(data => {
          this.MethodName=data[0].MethodName;
            this.loadingPopup.dismiss();
            for (var i = 0; i < data.length; i++) {
              myHtml += "<div class='mySlides fade'>";
              myHtml +=  " <h5 class='purple text-center'>"+data[i].TopicName+"</h5>";
              myHtml += "<br/>";
              myHtml +=  data[i].Content;
              myHtml += "</div>";
          }
          $('.Topic-Details').html(myHtml)
          this.slideIndex = parseInt(topicIndex)+1;
          this.showSlides(this.slideIndex);

          },err => {
            this.loadingPopup.dismiss();
           });
  }


  swipe(event){
    // if( event.direction == 2 || event.direction == 2) {
    //   this.plusSlides("1")
    // }
    // else if(event.direction == 4){
    //   this.previousSlides("-1")
    // }
  }
  makePagenation(  content)  {
 // var content= "<ul> <li>Synthetic form of progesterone resembling the natural female hormones containing an aqueous suspension of microcrystal of pregnane 17 alfa - hydroxyprogesterone</li> <li>There is a slow release of hormone into the blood stream over 3 months</li> </ul> <p><img alt='' src='http://64.94.164.16/Pathfinder-Digitaltool/assets/admin/ckeditor/plugins/imageuploader/uploads/2b9fd03.jpg' style='height:110px; width:100%' /></p> <p><img alt='' src='http://64.94.164.16/Pathfinder-Digitaltool/assets/admin/ckeditor/plugins/imageuploader/uploads/3f67c2d.jpg' style='height:120px; width:100%' /></p>"
    if(content.split("<hr />").length>1){
        var data=content.split("<hr />");
          var myHtml=""  ;
          var dotsHtml = "";
          for (var i = 0; i < data.length-1; i++) {
              myHtml += "<div class='mySlides fade'>";
              myHtml +=  data[i];
              myHtml += "</div>";
          }
          $('.Topic-Details').html(myHtml)
          var slideIndex = 1;
          this.showSlides(slideIndex);
      }else{
        $('.Topic-Details').html(content);
        $(".forward").css("display","none")
        $(".previous").css("display","none")
      }
  }
  plusSlides(n) {
    var slides = $(".mySlides");
    if(this.slideIndex==slides.length || slides.length=="1"){
      return false;
    }
    else{
    this.showSlides(this.slideIndex += parseInt(n));
    }
  }
  previousSlides(n) {
    if(this.slideIndex==1){
      return false;
    }else{
    this.showSlides(this.slideIndex += parseInt(n));
    }
  }
  currentSlide(n) {
     this.showSlides(this.slideIndex = parseInt(n));
  }
   showSlides(n) {
      var i;
      var slides = $(".mySlides");
      var dots = $(".dot");
      if(slides.length==1){
        return false;
      }
      $(".forward").css("display","inline-block")
      $(".previous").css("display","inline-block")
      if(n==1){
        $(".previous").css("display","none")
      }
      else if(n==slides.length){
        $(".forward").css("display","none")
      }
      if (n > slides.length) {
          this.slideIndex = 1
      }
      if (n < 1) {
        this.slideIndex = slides.length
      }
      for (i = 0; i < slides.length; i++) {
          slides[i].style.display = "none";
      }
      for (i = 0; i < dots.length; i++) {
          dots[i].className = dots[i].className.replace(" active", "");
      }
      slides[this.slideIndex - 1].style.display = "block";
    //  dots[this.slideIndex - 1].className += " active";
    $( ".scroll-content" ).scrollTop( 0 );
  }
  changeLanguage(chooseLanguage){
    var result= this._appService.changeLanguage(chooseLanguage);
    if(result){
      this.ionViewDidLoad();
    }else{
      alert("Somthing Went wrong.");
    }
  }
  gotoTopicListPage(){
    // this.navCtrl.setRoot('TopicsListPage',{methodID: this.topicContent.MethodId})
    this.navCtrl.setRoot('TopicsListPage',{methodID: 1001})
  }
  gotoDashboard(){
    this.updateGetTIme();
    this.navCtrl.setRoot("DashboardPage")
  }

  updateGetTIme(){
    const startTime = localStorage.getItem('startTimeMethod');
    const startContraTime = localStorage.getItem('startTime');
    console.log(startTime);
    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.databaseprovider.updateGetTime(startTime).then(data => {
         })

      }

      if (rdy) {
        this.databaseprovider.updateGetTime(startContraTime).then(data => {
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
