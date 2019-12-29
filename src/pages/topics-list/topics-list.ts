import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform,LoadingController} from 'ionic-angular';
import { AppEnum } from '../../providers/app.enum';
import { AppServices } from '../../providers/app.service';
import { DatabaseProvider } from '../../providers/database.service';
import { ModalController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-topics-list',
  templateUrl: 'topics-list.html',
  providers: [AppServices,AppEnum]
})
export class TopicsListPage {
  public loadingPopup;
  public setLanguage={noDataFound: ""}
  public chooseLanguage;
  public TopicList;
  public MethodName;
  public languageIcon;
  public languageId;
  public subTopic;
  public langOption = ["English","हिंदी","मराठी"];

  constructor(public navCtrl: NavController,public modalCtrl : ModalController, public navParams: NavParams,platform: Platform,public eNumValue: AppEnum,public loadingCtrl: LoadingController,
    private _appService: AppServices,private databaseprovider: DatabaseProvider,) {
      this.loadingPopup = this.loadingCtrl.create({
        spinner: 'hide',
        content: `
        <div class="preloader">
          <div class="loader"></div>
        </div>`
        });


      platform.registerBackButtonAction(() => {
        this.gotoMethodsPage();
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
    var methodID= this.navParams.get('methodID');
    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.loadingPopup.present();
           this.databaseprovider.getTopics(methodID,this.languageId).then(data => {
            this.loadingPopup.dismiss();
            this.TopicList=data;
            this.MethodName=data[0].MethodName;
            //alert(JSON.stringify(data))
          },err => {
            this.loadingPopup.dismiss();
           });

      }
    })


  }
  public openModal(){
    var data = { message : 'hello world' };
    var modalPage = this.modalCtrl.create('ModalPage',data);
    modalPage.present();
  }

  changeLanguage(chooseLanguage){
    var result= this._appService.changeLanguage(chooseLanguage);
    if(result){
      this.ionViewDidLoad();
    }else{
      alert("Somthing Went wrong.");
    }
  }

  gotoTopicsContentPage(getTopic,index){
    this.navCtrl.setRoot("TopicsContentPage",{getTopicDetails:getTopic,topicIndex: index});
  }

  gotoTopicsContentPageTest(getTopic,index){
    this.navCtrl.setRoot("TopicsContentPage",{topicIndex: index});
  }

  gotoMethodsPage(){
    this.navCtrl.setRoot("MethodsPage")
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
}
