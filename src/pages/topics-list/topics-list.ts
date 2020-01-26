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

  public menuList = [
    { title: "At a Glance",img:'assets/imgs/5_DMPA-At_a_glance.png', description: "Type 1 diabetes is an autoimmune disease in which the body’s immune system attacks and destroys the beta cells in the pancreas that make insulin." },
    { title: "Technicle Update",img:'assets/imgs/4_DMPA_Technical_update.png', description: "Multiple sclerosis (MS) is an autoimmune disease in which the body's immune system mistakenly attacks myelin, the fatty substance that surrounds and protects the nerve fibers in the central nervous system." },
    { title: "Effectiveness",img:'assets/imgs/8_DMPA_Effectiveness.png', description: "Crohn's disease and ulcerative colitis (UC), both also known as inflammatory bowel diseases (IBD), are autoimmune diseases in which the body's immune system attacks the intestines." },
    { title: "Benefits",img:'assets/imgs/9_DMPA_benifits.png', description: "Systemic lupus erythematosus (lupus) is a chronic, systemic autoimmune disease which can damage any part of the body, including the heart, joints, skin, lungs, blood vessels, liver, kidneys and nervous system." },
    { title: "Limitations",img:'assets/imgs/6_DMPA-Limitation.png', description: "Rheumatoid arthritis (RA) is an autoimmune disease in which the body's immune system mistakenly begins to attack its own tissues, primarily the synovium, the membrane that lines the joints." },
    { title: "Screening Parameters",img:'assets/imgs/7_DMPA-Screening_Parameters.png', description: "Rheumatoid arthritis (RA) is an autoimmune disease in which the body's immune system mistakenly begins to attack its own tissues, primarily the synovium, the membrane that lines the joints." },
    { title: "Rulling Out Pregnacy",img:'assets/imgs/10_DMPA_Ruling_out_Pregnancy.png', description: "Rheumatoid arthritis (RA) is an autoimmune disease in which the body's immune system mistakenly begins to attack its own tissues, primarily the synovium, the membrane that lines the joints." },
    { title: "Went To Start DMPA",img:'assets/imgs/11_DMPA_WhentoStart_DMPA-01.png', description: "Rheumatoid arthritis (RA) is an autoimmune disease in which the body's immune system mistakenly begins to attack its own tissues, primarily the synovium, the membrane that lines the joints." },
    { title: "Counseling",img:'assets/imgs/12_DMPA_Counseling.png', description: "Rheumatoid arthritis (RA) is an autoimmune disease in which the body's immune system mistakenly begins to attack its own tissues, primarily the synovium, the membrane that lines the joints." },
    { title: "Storage Of DMPA Vials",img:'assets/imgs/13_DMPA_Storage_of_DMPA_Vials.png', description: "Rheumatoid arthritis (RA) is an autoimmune disease in which the body's immune system mistakenly begins to attack its own tissues, primarily the synovium, the membrane that lines the joints." },
    { title: "How to Administer DMPA",img:'assets/imgs/14_DMPA_How_to_Administer_DMPA-IM.png', description: "Rheumatoid arthritis (RA) is an autoimmune disease in which the body's immune system mistakenly begins to attack its own tissues, primarily the synovium, the membrane that lines the joints." },
    { title: "Follow-up Care",img:'assets/imgs/15_Follow-up_Care.png', description: "Rheumatoid arthritis (RA) is an autoimmune disease in which the body's immune system mistakenly begins to attack its own tissues, primarily the synovium, the membrane that lines the joints." },
    { title: "Management Of Side Effects",img:'assets/imgs/16_DMPA_Management_of_Side Effects.png', description: "Rheumatoid arthritis (RA) is an autoimmune disease in which the body's immune system mistakenly begins to attack its own tissues, primarily the synovium, the membrane that lines the joints." },
    { title: "Other Issue",img:'assets/imgs/17_DMPA_Other_Issues.png', description: "Rheumatoid arthritis (RA) is an autoimmune disease in which the body's immune system mistakenly begins to attack its own tissues, primarily the synovium, the membrane that lines the joints." }
  ];

  shownGroup = null;

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

  toggleGroup(group) {
      if (this.isGroupShown(group)) {
          this.shownGroup = null;
      } else {
          this.shownGroup = group;
      }
  };
  isGroupShown(group) {
      return this.shownGroup === group;
  };

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
    this.navCtrl.setRoot("MethodsPage");
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

  gotoFAQMethods(){
    this.navCtrl.setRoot("FaqMethodsPage");
  }

  gotoAskUsPage(){
    this.navCtrl.setRoot("AskUsPage")
  }

  goHome(){
    this.navCtrl.setRoot("dashboard")
  }
}
