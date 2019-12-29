import { Component ,Input} from '@angular/core';
import { IonicPage, NavController, NavParams,Platform,LoadingController ,normalizeURL, AlertController } from 'ionic-angular';
// import { DocumentViewer,DocumentViewerOptions  } from '@ionic-native/document-viewer';
import { AppEnum } from '../../providers/app.enum';
import { AppServices } from '../../providers/app.service';
import { DatabaseProvider } from '../../providers/database.service';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Zip } from '@ionic-native/zip';
import * as $ from "jquery";

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
  providers: [AppServices,AppEnum,FileTransfer, FileTransferObject, File]
})

export class DashboardPage {
  public loadProgress : number = 0;
  public loadingPopup;
  public setLanguage={"downloadMsg":"","updateMsg":"","interNetMsg":"","noUpdate":"","overview":"","Faq":"","keyMessage":"","counselling":"","Quiz":"","library":"","incentive":"","AskUs":"","Methods":""}
  public chooseLanguage;
  public methodImgDirectory;
  public DownloadDirectory;
  public languageIcon;
  public customPopUpMsg;
  public languageId;
  public userDetail=JSON.parse(localStorage.getItem("userDetail"));
  public userKey=JSON.parse(localStorage.getItem("userKey"));
  public langOption = ["English","हिंदी","मराठी"];

  constructor(public navCtrl: NavController, public navParams: NavParams,private _appService: AppServices,
    private transfer: FileTransfer, private file: File,public platform: Platform,
    public eNumValue: AppEnum,public loadingCtrl: LoadingController,private alertCtrl: AlertController,
    private databaseprovider: DatabaseProvider,private zip: Zip) {
      this.loadingPopup = this.loadingCtrl.create({
        spinner: 'hide',
        content: `
        <div class="preloader">
          <div class="loader"></div>
        </div>`
        });

      platform.registerBackButtonAction(() => {
        //this.gotoUserProfilePage();
       });

       this.platform.ready().then(() => {
          if(this.platform.is('ios')) {
          this.methodImgDirectory=this.file.documentsDirectory;
          this.DownloadDirectory=this.file.documentsDirectory;
         }  else if(this.platform.is('android')) {
          // alert('Hello Android');
          this.methodImgDirectory=this.file.externalDataDirectory;
          this.DownloadDirectory=this.file.externalDataDirectory;
         }
      });
      //  this.methodImgDirectory=this.file.externalDataDirectory;
      //  this.DownloadDirectory=this.file.externalDataDirectory; //dataDirectory
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
    //  this.DataSynchronizationForGetOtherContent();
     this.userDetail=JSON.parse(localStorage.getItem("userDetail"));
     if(this.userDetail.StackholderId=='1'){
      $('.dashboard-back-img').css('background-image',"url('assets/imgs/FP-Mascot-DOCTOR.png')");
      localStorage.setItem('mascotImg','assets/imgs/FP-Mascot-DOCTOR.png')
     }else if(this.userDetail.StackholderId=='2'){
      $('.dashboard-back-img').css('background-image',"url('assets/imgs/FP-Mascot-NURSE.png')");
      localStorage.setItem('mascotImg','assets/imgs/FP-Mascot-NURSE.png')
     }else if(this.userDetail.StackholderId=='5'){
      $('.dashboard-back-img').css('background-image',"url('assets/imgs/FP-Mascot-MIDWIFE-0003.png')");
      localStorage.setItem('mascotImg','assets/imgs/FP-Mascot-MIDWIFE-0003.png')
     }else{
      localStorage.setItem('mascotImg','assets/imgs/dashboard-back-img.png')
     }

     if(localStorage.getItem('dataStore')!='true'){
       var status = navigator.onLine;
       if (status) {
          this.getLatestContent();
       }else{
        alert(this.setLanguage.interNetMsg);
        return false;
       }
      } else if(localStorage.getItem('dataStore') == 'true'){
        this.checkUpdate();
      }
       this.getTimeOfApp();
    }

  getTimeOfApp() {
    console.log('1');
    this.loadingPopup=this.loadingCtrl.create({
      spinner: 'hide',
      content: `
      <div class="preloader">
        <div class="loader"></div>
      </div>`
      });
      console.log('2');
    var status = navigator.onLine;
    // if (status) {
    //   this.databaseprovider.getDatabaseState().subscribe(rdy => {
    //   this.databaseprovider.getGetTime().then(data => {
    //     this.loadingPopup.present();
    //     console.log('3');
    //     console.log(JSON.stringify(data));
    //     if(data.length !=0){
    //       this.postDateTimeOfApp(data);
    //     } else {
    //       this.loadingPopup.dismiss();
    //     }
    //      });
    //   });
    // } else {
    //   this.loadingPopup.dismiss();
    // }
}
    postDateTimeOfApp(value){
      var tempJson = {
        "DashboardData": value
      }
      var stringifyPostJson= JSON.stringify(tempJson);
      console.log(stringifyPostJson);
          this._appService.postData_new("InsertUpdateDashboardData", tempJson).subscribe(data => {
            console.log(data);
               if(data.Status=="1"){
                 this.deleteAppDateTime();
                }  else {
                  this.loadingPopup.dismiss();
                }
            });
    }


    deleteAppDateTime(){
    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.databaseprovider.deletGetDateTime().then(data => {
          console.log(data);
          this.loadingPopup.dismiss();
         })
      }
    })
    localStorage.setItem('LandingScreenTime', 'true');
}
    DataSynchronizationForMethod(){
      this.loadingPopup=this.loadingCtrl.create({
         spinner: 'hide',
         content: `
         <div class="progress"></div>
         <div class="preloader">
           <div class="loader">
           <div class="progress"></div>
           </div>
         </div>`
         });
       this.loadingPopup.present();

       var DataSyncMethodUrl="GetMethodsDataForSync/" ;
       this._appService.getData_new(DataSyncMethodUrl).subscribe(data => {
         if(data.MethodsDataForSync.Status.Status=='1'){
           this.makeLocalData(data.MethodsDataForSync.Result);
         }else{
           this.loadingPopup.dismiss();
           alert(data.MethodsDataForSync.Status.Message)
         }
       },err => {
         this.loadingPopup.dismiss();
        });
     }

     makeLocalData(methodList){
      var methodListarrary=[];
      for(var i = 0; i < methodList.length; i++){
        var tempJson;
        let saveDir = this.methodImgDirectory;
        var ImageName = methodList[i].MobileIcon;
        var ImageUrl = encodeURI(methodList[i].MobileIconURL);
        var ImageIconURL =  saveDir+ImageName;

        tempJson={
          "MethodId": methodList[i].MethodId,
          "MethodName": methodList[i].MethodName,
          "MobileIcon": methodList[i].MobileIcon,
          "MobileIconURL": normalizeURL(ImageIconURL),
          "LanguageId": methodList[i].LanguageId,
          "StackHolderId": methodList[i].StackHolderId,
          "MethodCategory": methodList[i].MethodCategory
      }
      methodListarrary.push(tempJson);

      if(ImageName.length != 0){
        var matchLength = ImageUrl.search(ImageName);
         if(matchLength != -1){
          const fileTransfer: FileTransferObject = this.transfer.create();
          fileTransfer.download(ImageUrl, ImageIconURL).then((entry) => {
            console.log(ImageUrl+'download completed: ' + entry.toURL());
          });
        }
      }
        if (i==(methodList.length-1)) {
          this.saveMethodList(methodListarrary)
        }
      }
    }

    saveMethodList(data){
      this.databaseprovider.getDatabaseState().subscribe(rdy => {
        if (rdy) {
          this.databaseprovider.addMethodsList(data).then(data => {
            this.DataSynchronizationForMethodContent();
           })
        }
      })
    }

    DataSynchronizationForMethodContent(){
      var DataSyncMethodContentUrl="GetContentDataForSync/" ;
      this._appService.getData_new(DataSyncMethodContentUrl).subscribe(data => {
        if(data.ContentForSync.DataStatus.status=='1'){
          this.fileDownload(data.ContentForSync.DataStatus.ContentCompressedImgURL,this.DownloadDirectory+"liveData.zip");
          this.makeLocalDataForMehodContent(data.ContentForSync.DataDetail);
          this.saveFAQDetail(data.ContentForSync.FAQDetail);
         }else{
          this.customPopUpMsg=this.setLanguage.noUpdate
        this.openModel();
        }
      },err => {
        this.loadingPopup.dismiss();
       });
    }

  saveFAQDetail(data){
    var ths=this;
    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
         var size = 20;
         var index=0;
         new Array(Math.ceil(data.length / size)).fill("").map(function() {
         var insertData =this.splice(0, size)
         index=index+1;
         ths.databaseprovider.addFAQDetail(insertData).then(data => {
             })
         }, data.slice());
      }
    })
  }
    makeLocalDataForMehodContent(methodContent){
      // alert(JSON.stringify(methodContent));
      let saveDir = this.DownloadDirectory+"Content_Images/";
      var methodcontentArary=[];
      for(var i = 0; i < methodContent.length; i++){
        var tempJson;
        var setImageName=[];
        var setImageUrl=[]
        var ImageName = methodContent[i].ImgName;
        var ImageUrl = methodContent[i].ImgUrl;
        var HTmlcontent=methodContent[i].Content;
        var localUrl;

        if(ImageName==""){
          setImageName=[]
          setImageUrl=[]
        }else if (ImageName.indexOf(',') > -1){
          var contentImages= ImageName.split(',');
          var contentImagesURL= ImageUrl.split(',');
            for(var j = 0; j < contentImages.length; j++){
              setImageName.push(contentImages[j]);
              localUrl =  saveDir+contentImages[j];
              HTmlcontent=HTmlcontent.replace(contentImagesURL[j],localUrl)
              setImageUrl.push(localUrl);
              // this.fileDownload(contentImagesURL[j],localUrl);
            }
        }else{
          setImageName.push(ImageName);
          localUrl=saveDir+ImageName;
          setImageUrl.push(localUrl);
          HTmlcontent=HTmlcontent.replace(ImageUrl,localUrl)
          // this.fileDownload(ImageUrl,localUrl);

        }

        tempJson={
          "ContentId": methodContent[i].ContentId,
          "languageId": methodContent[i].languageId,
          "MethodId": methodContent[i].MethodId,
          "MethodLabel": methodContent[i].MethodLabel,
          "MethodName": methodContent[i].MethodName,
          "TopicId": methodContent[i].TopicId,
          // "SubTopicId": methodContent[i].SubTopicId,
          "TopicNo": methodContent[i].TopicNo,
          "TopicName": methodContent[i].TopicName,
          "Content": HTmlcontent,
          "ImgName": setImageName,
          "ImgUrl": setImageUrl
      }
      methodcontentArary.push(tempJson);
        if (i==(methodContent.length-1)) {
          // console.log(methodcontentArary);
          this.saveMethodcontent(methodcontentArary)
        }
      }
    }

    saveMethodcontent(data){
      var ths=this;
      this.databaseprovider.getDatabaseState().subscribe(rdy => {
        if (rdy) {
          var size = 20;
          var index=0;
         var NewArray= new Array(Math.ceil(data.length / size)).fill("").map(function() {
          var insertData =this.splice(0, size)
          index=index+1;
          //alert(JSON.stringify(insertData))
             ths.databaseprovider.addTopicsContent(insertData).then(data => {

                })
          }, data.slice());
          if(NewArray.length==index){
            this.DataSynchronizationForKeyMessage();
            }
        }
      })
    }

    DataSynchronizationForKeyMessage(){
      var KeyMessageUrl="GetKeyMessagesByLastSyncDateTime/" ;
      this._appService.getData_new(KeyMessageUrl).subscribe(data => {
        if(data.KeyMessagesDataForSync.Status.Status=='1'){
          this.makeLocalKeyMessage(data.KeyMessagesDataForSync.KeyMessageDetail);
        }else{
          this.customPopUpMsg=this.setLanguage.noUpdate
        this.openModel();
        }
      },err => {
        this.loadingPopup.dismiss();
       });
    }

    makeLocalKeyMessage(KeyMessages){
      var keyListImg=this.DownloadDirectory;
      let saveDir = this.DownloadDirectory+"Content_Images/";
     var keyMessageArary=[];
     for(var i = 0; i < KeyMessages.length; i++){
       var tempJson;
       var setImageName=[];
       var setImageUrl=[]
       var KeyImageName = KeyMessages[i].KeyMessageImageName;
       var KeyImageUrl = KeyMessages[i].KeyMessageImage;
       var HTmlcontent=KeyMessages[i].Content;
       var ImageName=KeyMessages[i].ContentImageName;
       var ImageUrl=KeyMessages[i].ContentImage;
       var localUrls;

       if(ImageName.length != 0){
        var matchLength = ImageUrl.search(ImageName);
         if(matchLength != -1){
          const fileTransfer: FileTransferObject = this.transfer.create();
          fileTransfer.download(KeyImageUrl, keyListImg+KeyImageName).then((entry) => {
            // console.log(KeyImageUrl+'download completed: ' + entry.toURL());
          });
        }
      }

     if(ImageName==""){
       setImageName=[]
       setImageUrl=[]
     }else if (ImageName.indexOf(',') > -1){
       var contentImages= ImageName.split(',');
       var contentImagesURL= ImageUrl.split(',');
         for(var j = 0; j < contentImages.length; j++){
           setImageName.push(contentImages[j]);
           localUrls =  saveDir+contentImages[j];
           HTmlcontent=HTmlcontent.replace(contentImagesURL[j],localUrls)
           setImageUrl.push(localUrls);
          //  this.fileDownload(contentImagesURL[j],localUrls);
       }
     } else{
       setImageName.push(ImageName);
       localUrls=saveDir+ImageName;
       setImageUrl.push(localUrls);
       HTmlcontent=HTmlcontent.replace(ImageUrl,localUrls)
      //  this.fileDownload(ImageUrl,localUrls);
     }
     tempJson={
       "KeyMessageId": KeyMessages[i].KeyMessageId,
       "LanguageId": KeyMessages[i].LanguageId,
       "KeyMessageImageName": KeyMessages[i].KeyMessageImageName,
       "KeyMessageImage": keyListImg+KeyMessages[i].KeyMessageImageName,
       "KeyMessageHeading": KeyMessages[i].KeyMessageHeading,
       "Content": HTmlcontent,
       "ContentImageName": setImageName,
       "ContentImage": setImageUrl
     }
     keyMessageArary.push(tempJson);
     if (i==(KeyMessages.length-1)) {
        // console.log(keyMessageArary);
       this.saveKeyMessageDetail(keyMessageArary)
     }
   }
 }

 saveKeyMessageDetail(data){
  var ths=this;
  this.databaseprovider.getDatabaseState().subscribe(rdy => {
    if (rdy) {
       var size = 20;
       var index=0;
       var NewArray=  new Array(Math.ceil(data.length / size)).fill("").map(function() {
       var insertData =this.splice(0, size)
       index=index+1;
       ths.databaseprovider.addKeyMessageDetail(insertData).then(data => {
           //alert("alert from saveKeyMessageDetail"+JSON.stringify(data));
           })
       }, data.slice());
       if(NewArray.length==index){
        this.DataSynchronizationForQuizQuestion();
        }
    }
  })
}

DataSynchronizationForQuizQuestion(){
  var quizQuestionUrl="GetQuizQuestions/";
  this._appService.getData_new(quizQuestionUrl).subscribe(data => {
      //  this.saveQuizCategory(data.QuizCategoryDetail);
       this.saveQuizQuestions(data.QuizQuestions);
       this.saveQuizQuestionsAnswer(data.QuizQuestionOptions);
  },err => {
    this.loadingPopup.dismiss();
   });
}

// saveQuizCategory(data){
//   this.databaseprovider.getDatabaseState().subscribe(rdy => {
//        this.databaseprovider.addQuizCategory(data).then(data => {
//         alert("alert from saveQuizCategory"+JSON.stringify(data));
//   })
//        });
// }

saveQuizQuestions(data){
  var ths=this;
  this.databaseprovider.getDatabaseState().subscribe(rdy => {
    if (rdy) {
       var size = 20;
       var index=0;
       new Array(Math.ceil(data.length / size)).fill("").map(function() {
       var insertData =this.splice(0, size)
       index=index+1;
       ths.databaseprovider.addQuizQuestions(insertData).then(data => {
        //alert("alert from saveQuizQuestions"+JSON.stringify(data));
  })
       }, data.slice());
    }
  })
}

saveQuizQuestionsAnswer(data){
  var ths=this;
  this.databaseprovider.getDatabaseState().subscribe(rdy => {
    if (rdy) {
       var size = 20;
       var index=0;
      var NewArray= new Array(Math.ceil(data.length / size)).fill("").map(function() {
       var insertData =this.splice(0, size)
       index=index+1;
       ths.databaseprovider.addQuizQuestionOptions(insertData).then(data => {
           //alert("alert from saveQuizQuestionsAnswer"+JSON.stringify(data));
           })
       }, data.slice());
       if(NewArray.length==index){
       this.DataSynchronizationForGetOtherContent();
        }
    }
  })
}
DataSynchronizationForGetOtherContent(){
  var getOtherContentUrl="GetOtherContent/";
  this._appService.getData_new(getOtherContentUrl).subscribe(data => {
       this.makeLocalDataForCounselling(data.Counselling);
       this.makeLocalDataForFPOverview(data.FPOverview);
       this.makeLocalDataForLibrary(data.Library);

   },err => {
    this.loadingPopup.dismiss();
   });
}
makeLocalDataForCounselling(counsellingContent){
  let saveDir = this.DownloadDirectory+"Content_Images/";
      var counsellingcontentArary=[];
      for(var i = 0; i < counsellingContent.length; i++){
        var tempJson;
        var setImageName=[];
        var setImageUrl=[]
        var ImageName = counsellingContent[i].ImgName;
        var ImageUrl = counsellingContent[i].ImgUrl;
        var HTmlcontent=counsellingContent[i].Content;
        var localUrl;

        if(ImageName==""){
          setImageName=[]
          setImageUrl=[]
        }else if (ImageName.indexOf(',') > -1){
          var contentImages= ImageName.split(',');
          var contentImagesURL= ImageUrl.split(',');
            for(var j = 0; j < contentImages.length; j++){
              setImageName.push(contentImages[j]);
              localUrl =  saveDir+contentImages[j];
              HTmlcontent=HTmlcontent.replace(contentImagesURL[j],localUrl)
              setImageUrl.push(localUrl);
              // this.fileDownload(contentImagesURL[j],localUrl);
            }
        }else{
          setImageName.push(ImageName);
          localUrl=saveDir+ImageName;
          setImageUrl.push(localUrl);
          HTmlcontent=HTmlcontent.replace(ImageUrl,localUrl)
          // this.fileDownload(ImageUrl,localUrl);
      }

        tempJson={
          "ContentId": counsellingContent[i].ContentId,
          "LanguageId": counsellingContent[i].LanguageId,
          "Content": HTmlcontent,
          "ImgName": setImageName,
          "ImgUrl": setImageUrl
      }
      counsellingcontentArary.push(tempJson);
        if (i==(counsellingContent.length-1)) {
          // console.log(methodcontentArary);
          this.saveGetOtherContentCounselling(counsellingcontentArary)
        }
      }
}

makeLocalDataForFPOverview(fpOverviewContent){
  let saveDir = this.DownloadDirectory+"Content_Images/";
  var fpcontentArary=[];
  for(var i = 0; i < fpOverviewContent.length; i++){
    var tempJson;
    var setImageName=[];
    var setImageUrl=[]
    var ImageName = fpOverviewContent[i].ImgName;
    var ImageUrl = fpOverviewContent[i].ImgUrl;
    var HTmlcontent=fpOverviewContent[i].Content;
    var localUrl;

    if(ImageName==""){
      setImageName=[]
      setImageUrl=[]
    }else if (ImageName.indexOf(',') > -1){
      var contentImages= ImageName.split(',');
      var contentImagesURL= ImageUrl.split(',');
        for(var j = 0; j < contentImages.length; j++){
          setImageName.push(contentImages[j]);
          localUrl =  saveDir+contentImages[j];
          HTmlcontent=HTmlcontent.replace(contentImagesURL[j],localUrl)
          setImageUrl.push(localUrl);
          // this.fileDownload(contentImagesURL[j],localUrl);
        }
    }else{
      setImageName.push(ImageName);
      localUrl=saveDir+ImageName;
      setImageUrl.push(localUrl);
      HTmlcontent=HTmlcontent.replace(ImageUrl,localUrl)
      // this.fileDownload(ImageUrl,localUrl);
  }

    tempJson={
      "ContentId": fpOverviewContent[i].ContentId,
      "LanguageId": fpOverviewContent[i].LanguageId,
      "Content": HTmlcontent,
      "ImgName": setImageName,
      "ImgUrl": setImageUrl
  }
  fpcontentArary.push(tempJson);
    if (i==(fpOverviewContent.length-1)) {
      // console.log(methodcontentArary);
      this.saveGetOtherContentFPOverview(fpcontentArary)
    }
  }
}

makeLocalDataForLibrary(librarayContent){
  let saveDir = this.DownloadDirectory+"Content_Images/";
  var libraraycontentArary=[];
  for(var i = 0; i < librarayContent.length; i++){
    var tempJson;
    var setImageName=[];
    var setImageUrl=[]
    var ImageName = librarayContent[i].ImgName;
    var ImageUrl = librarayContent[i].ImgUrl;
    var HTmlcontent=librarayContent[i].Content;
    var localUrl;

    if(ImageName==""){
      setImageName=[]
      setImageUrl=[]
    }else if (ImageName.indexOf(',') > -1){
      var contentImages= ImageName.split(',');
      var contentImagesURL= ImageUrl.split(',');
        for(var j = 0; j < contentImages.length; j++){
          setImageName.push(contentImages[j]);
          localUrl =  saveDir+contentImages[j];
          if(this.checkExtension(contentImages[j])!="pdf"){
            HTmlcontent=HTmlcontent.replace(contentImagesURL[j],localUrl)
          }
          setImageUrl.push(localUrl);
          // this.fileDownload(contentImagesURL[j],localUrl);
        }
    }else{
      setImageName.push(ImageName);
      localUrl=saveDir+ImageName;
      setImageUrl.push(localUrl);
      HTmlcontent=HTmlcontent.replace(ImageUrl,localUrl)
      // this.fileDownload(ImageUrl,localUrl);
  }

    tempJson={
      "ContentId": librarayContent[i].ContentId,
      "LanguageId": librarayContent[i].LanguageId,
      "Content": HTmlcontent,
      "ImgName": setImageName,
      "ImgUrl": setImageUrl
  }
  libraraycontentArary.push(tempJson);
    if (i==(librarayContent.length-1)) {
      // console.log(JSON.stringify(libraraycontentArary));
      this.saveGetOtherContentLibrary(libraraycontentArary)
    }
  }
}
saveGetOtherContentCounselling(data){
  var ths=this;
  this.databaseprovider.getDatabaseState().subscribe(rdy => {
    if (rdy) {
       var size = 20;
       var index=0;
       new Array(Math.ceil(data.length / size)).fill("").map(function() {
       var insertData =this.splice(0, size)
       index=index+1;
       ths.databaseprovider.addGetOtherContent(insertData,'Counselling').then(data => {
           })
       }, data.slice());

    }
  })
}
saveGetOtherContentFPOverview(data){
  var ths=this;
  this.databaseprovider.getDatabaseState().subscribe(rdy => {
    if (rdy) {
       var size = 20;
       var index=0;
        new Array(Math.ceil(data.length / size)).fill("").map(function() {
       var insertData =this.splice(0, size)
       index=index+1;
       ths.databaseprovider.addGetOtherContent(insertData,'FPOverview').then(data => {
           })
       }, data.slice());

    }
  })
}
saveGetOtherContentLibrary(data){
  var ths=this;
  this.databaseprovider.getDatabaseState().subscribe(rdy => {
    if (rdy) {
       var size = 20;
       var index=0;
      var NewArray= new Array(Math.ceil(data.length / size)).fill("").map(function() {
       var insertData =this.splice(0, size)
       index=index+1;
       ths.databaseprovider.addGetOtherContent(insertData,'Library').then(data => {
           })
       }, data.slice());
       if(NewArray.length==index){
        console.log("Content Save Sucess.")
        }
    }
  })
}
checkExtension(filename){
  return filename.split('.').pop();

}
  changeLanguage(chooseLanguage){
    var result= this._appService.changeLanguage(chooseLanguage);
    if(result){
      this.ionViewDidLoad();
    }else{
      alert("Something Went wrong.");
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
    formatNumber(number) {
      const formattedNumber = ('0' + number).slice(-2);
      return formattedNumber;
    }
  gotoFPOverviewPage(){
    this.navCtrl.setRoot("FpOverviewPage");
  }
  gotoUserProfilePage(){
    this.navCtrl.setRoot("UserProfilePage");
  }

  gotoCommanContentPage(contentType){
    this.navCtrl.setRoot("FpOverviewPage",{contentType:contentType});
  }

  gotoMethodPage(){
    this.navCtrl.setRoot("MethodsPage")
  }
  gotoFAQMethods(){
    this.navCtrl.setRoot("FaqMethodsPage");
  }
  startDateTime(contentType) {
    const d = new Date();
    const date =  d.getFullYear().toString() + '-' + this.formatNumber((d.getMonth() + 1).toString()) + '-' + this.formatNumber(d.getDate().toString()) ;
    const time = this.formatNumber(d.getHours().toString()) + ':' + this.formatNumber(d.getMinutes().toString()) + ':' + this.formatNumber(d.getSeconds().toString());
    const startTime = date + ' ' + time;
    console.log(date + " " + " " + contentType + " " + startTime);
    const result = {
      UserId: this.userKey.ClientUserId,
      RoleId: this.userDetail.StackholderId,
      AddedDate: date,
      LanguageId: this.languageId,
      ContentType: contentType,
      MethodId: '',
      StartDateTime: startTime,
      EndDateTime: ''
    };
    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        localStorage.setItem('startTime',startTime);
        this.databaseprovider.addGetDateTime(result).then(data => {
        })
        // this.databaseprovider.addGetTime(this.userKey.ClientUserId,this.userDetail.StackholderId,date,this.languageId,contentType, startTime).then(data => {
        //   })
      }
    })
    if(contentType == 'Faq') {
      this.gotoFAQMethods();
    } else if(contentType == 'FPOverview') {
        this.gotoCommanContentPage(contentType);
    } else if(contentType == 'Counselling') {
      this.gotoCommanContentPage(contentType);
    } else if(contentType == 'KeyMessage') {
      this.gotoKeyMessagePage();
    } else if (contentType == 'ContraceptiveMethods') {
      this.gotoMethodPage();
    } else if (contentType == 'AskUs') {
      this.getpostQuestions();
    } else if (contentType == 'Quiz') {
      this.gotoQuizPage();
    } else if (contentType == 'Library') {
      this.gotoLibraryPage();
    }


  }
  getpostQuestions(){
    var status = navigator.onLine;
    if (status) {
      this.loadingPopup = this.loadingCtrl.create({
        spinner: 'hide',
        content: `
        <div class="preloader">
          <div class="loader"></div>
        </div>`
        });
      this.loadingPopup.present();
    // this.databaseprovider.getAskQuestionsDetailsLive().then(data => {
    //   //  alert(JSON.stringify(data))
    //   if(data.length !=0){
    //     this.postAllQuestion(data);
    //   }else{
    //     this.loadingPopup.dismiss();
    //     this.deleteAskQuestionLocalData();
    //   }
    // });
    }else{
      this.loadingPopup.dismiss();
      this.gotoAskUsPage();
    }
  }


  postAllQuestion(value){
       var tempjson={
         "FeedbackList": value
       }
     var stringifyPostJson= JSON.stringify(tempjson);
     console.log(stringifyPostJson);
     var InsertUpdateClientFeedback='InsertUpdateClientFeedback'
     var status = navigator.onLine;
     if (status) {
     this._appService.postData_new(InsertUpdateClientFeedback, tempjson).subscribe(data => {
       console.log(data);
          if(data.Status=="1"){
            this.deleteAskQuestionLocalData();
          }else{
            this.loadingPopup.dismiss();
            alert(data.Message)
          }
       },err => {
        this.loadingPopup.dismiss();
       });
     }else{
       alert(this.setLanguage.interNetMsg);
     }
 }


  deleteAskQuestionLocalData(){
      this.databaseprovider.getDatabaseState().subscribe(rdy => {
        if (rdy) {
          this.databaseprovider.deletAskQuestionDetails().then(data => {
            console.log(data);
             if(data == true){
              this.loadAskQuestionliveData();
             }
           })
        }
      })
  }

  loadAskQuestionliveData(){
    var DataAskQuestionUrl="GetClientFeedbackResponse/"+this.userKey.ClientUserId ;
      this._appService.getData_new(DataAskQuestionUrl).subscribe(data => {
        console.log(data);
        if(data.FeedbackList.length > 0){
          this.saveAskQuestionLive(data.FeedbackList);
        }else{
          this.loadingPopup.dismiss();
          this.gotoAskUsPage();
        }
      },err => {
        this.loadingPopup.dismiss();
      });
  }

  saveAskQuestionLive(question){
    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.databaseprovider.addAskQuestionsDetailsLive(question).then(data => {
          this.loadingPopup.dismiss();
          localStorage.setItem('askusSync','true');
          this.gotoAskUsPage();
         })
      }
    })
  }

  gotoAskUsPage(){
    this.navCtrl.setRoot("AskUsPage")
  }


  gotoKeyMessagePage(){
    this.navCtrl.setRoot("KeyMessagePage")
  }
  gotoIncentivesPage(){
     this.navCtrl.setRoot("IncentivesPage")
  }
  gotoQuizPage(){
    this.navCtrl.setRoot("QuizCategoryPage")
  }
  gotoLibraryPage( ){
    this.navCtrl.setRoot("LibraryPage",{segment:"libraryMethod"})
   }

  figureOutFile(file: string) {
    if (this.platform.is('ios')) {
      const baseUrl = location.href.replace('/index.html', '');
      return baseUrl + `/assets/${file}`;
    }
    if (this.platform.is('android')) {
      return `file:///android_asset/www/assets/${file}`;
    }
  }

  fileDownload(fileUrl,Path){
    const fileTransfer: FileTransferObject = this.transfer.create();
      fileTransfer.download(fileUrl, Path).then((entry) => {
        this.unzipfile(entry.toURL());
      });
  }

  unzipfile(zipPath){
    var ths=this;
    this.zip.unzip(zipPath, this.DownloadDirectory, (progress) =>
    //  console.log('Unzipping, ' + Math.round((progress.loaded / progress.total) * 100) + '%'))
    this.loadProgress = Math.round((progress.loaded / progress.total) * 100))
     .then((result) => {
       if(result === 0){
         var syncTime = new Date().valueOf();
         ths.loadingPopup.dismiss();
        $('.refershIcon').addClass('display_none');
         localStorage.setItem("syncTime", syncTime.toString());
         localStorage.setItem("dataStore",'true');
         ths.customPopUpMsg=this.setLanguage.downloadMsg
         ths.openModel();
        }
       if(result === -1){
        console.log('FAILED');
       }
     });
  }


  checkUpdate(){
    // this.loadingPopup = this.loadingCtrl.create({
    //   spinner: 'hide',
    //   content: `
    //   <div class="preloader">
    //     <div class="loader"></div>
    //   </div>`
    //   });
      var status = navigator.onLine;
    if (!status) {
      alert(this.setLanguage.interNetMsg);
      return false;
    }
    // this.loadingPopup.present();
    var ChkUpdateUrl="CheckLatestUpdateBylastSyncedDateTime/"+localStorage.getItem("syncTime");
    this._appService.getData_new(ChkUpdateUrl).subscribe(data => {
      this.loadingPopup.dismiss();
      if(data.Status.KeyMessage=='1' || data.Status.FAQ=='1' || data.Status.MethodContent=='1'){
       this.confirmUpdate();
      }  else{
            console.log("NO Content Available");
      }
    },err => {
      this.loadingPopup.dismiss();
     });
  }
  confirmUpdate() {
    let alert = this.alertCtrl.create({
      // title: 'Confirm purchase',
      message: this.setLanguage.updateMsg,
      buttons: [
        // {
        //   text: 'Cancel',
        //   role: 'cancel',
        //   handler: () => {
        //     console.log('Cancel clicked');
        //   }
        // },
        {
          text: 'OK',
          handler: () => {
            this.deleteAllData();
          }
        }
      ]
    });
    alert.present();
  }


  deleteAllData(){
    var ths=this;
    this.file.removeFile(this.DownloadDirectory, 'liveData.zip').then(_ =>
      ths.file.removeRecursively(ths.DownloadDirectory, 'Content_Images').then(_ =>
        ths.getLatestContent()
        ).catch(err =>
          console.log('Directory doesn\'t delete')
        )
      ).catch(err =>
        console.log('Directory doesn\'t delete')
      );

  }

  getLatestContent(){
    this.loadingPopup=this.loadingCtrl.create({
      spinner: 'hide',
      content: `
      <div class="preloader">
        <div class="loader"></div>
      </div>`
      });
     this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.loadingPopup.present();
           this.databaseprovider.dropTables().then(data => {
            this.loadingPopup.dismiss();
              if(data == true){
                localStorage.setItem("dataStore",'false');
                this.DataSynchronizationForMethod();
                }
          },err => {
            this.loadingPopup.dismiss();
           });
     }
    })
  }

  openModel(){
    $('#myModal').css("display","block");
  }
  closeModel(){
    $('#myModal').css("display","none");
    }

}
