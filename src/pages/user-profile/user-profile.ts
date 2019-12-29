import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform,LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { AppEnum } from '../../providers/app.enum';
import {AppServices } from '../../providers/app.service';
import * as $ from "jquery";
import { Device } from '@ionic-native/device';
// import swal from 'sweetalert2;

@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
  providers: [AppEnum,AppServices]
})
export class UserProfilePage {
  public loadingPopup;
  public masterData={"Languages": "", "StackHolders": "", "Gender": "", "Organization": "", "Country": "","States": []};
  public setLanguage={"interNetMsg":"","User_Profile":"","User_Name":"","User_Type":"","Gender":"","Date_of_Birth":"","Orgnization_Type":"","Preferd_Language":"","Country":"","State":"","District":"","Mobile_No":"","Save":"","Cancel":""}
  public chooseLanguage;
  public getStatesByCountry;
  public GetDistrictsByStateId;
  public userProfile:FormGroup;
  public currentDate;
  public langOption = ["English","हिंदी","मराठी"];

  constructor(public navCtrl: NavController, public navParams: NavParams,public fb: FormBuilder,private device: Device,
    platform: Platform,public eNumValue: AppEnum,public _appService:AppServices,private loadingCtrl: LoadingController) {

      platform.registerBackButtonAction(() => {
        this.gotoHomePage();
       });

       this.loadingPopup = this.loadingCtrl.create({
        spinner: 'hide',
        content: `<div class="preloader">
        <div class="loader"></div>
      </div>`
        });

    this.userProfile = fb.group({
      name: ['', Validators.compose([Validators.required])],
      userType: ['', Validators.compose([Validators.required])],
      gender:['', Validators.compose([Validators.required])],
      dateOfBirth: [''],
      oragType: ['', Validators.compose([Validators.required])],
      preferdLanguage:['', Validators.compose([Validators.required])],
      country: ['', Validators.compose([Validators.required])],
      state:['', Validators.compose([Validators.required])],
      district:['', Validators.compose([Validators.required])],
      mobile:['']
    })

  }

  ionViewDidLoad(){
    this.currentDate = new Date().toISOString().slice(0, 10);
    this.loadingPopup.present();
    if(localStorage.getItem("selectLanguage")==this.eNumValue.Entitylanguage.language_english){
      this.setLanguage=this.eNumValue.Entity_language_english
      this.chooseLanguage=this.eNumValue.Entitylanguage.language_hindi
    }else if(localStorage.getItem("selectLanguage")==this.eNumValue.Entitylanguage.language_hindi){
      this.setLanguage=this.eNumValue.Entity_language_hindi
      this.chooseLanguage=this.eNumValue.Entitylanguage.language_english
    }else if(localStorage.getItem("selectLanguage")==this.eNumValue.Entitylanguage.language_marathi){
      this.setLanguage=this.eNumValue.Entity_language_marathi
      this.chooseLanguage=this.eNumValue.Entitylanguage.language_marathi
    }

    var status = navigator.onLine;
    if (!status) {
      alert(this.setLanguage.interNetMsg);
      return false;
    }

    $(document).ready(function () {
      var maxDate = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];
      $("[type='date']").prop('max',maxDate);

      $(".dob_Calender_icon").click(function () {
        $(".dob_Calender").click();
      });
    });

    var ServerTimeMethod='GetMasterDataForSync'
    this._appService.getData_new(ServerTimeMethod).subscribe( data =>{
      this.loadingPopup.dismiss();
      this.masterData=data;
     },err => {
      this.loadingPopup.dismiss();
     });

  }

  getState(value){
    this.loadingPopup = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<div class="preloader">
      <div class="loader"></div>
    </div>`
      });
    this.loadingPopup.present();
    var GetStatesByCountry='GetStatesByCountryId/'+value
    this._appService.getData_new(GetStatesByCountry).subscribe( data =>{
      this.loadingPopup.dismiss();
      this.getStatesByCountry=data.StatesByCountry;
     },err => {
      this.loadingPopup.dismiss();
     });
  }


  getDistict(value){
    if(value==""){
      return false;
    }
    this.loadingPopup = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
      <div class="preloader">
        <div class="loader"></div>
      </div>`
      });
    this.loadingPopup.present();
    var URLDistrictsByStateId='GetDistrictsByStateId/'+value
    this._appService.getData_new(URLDistrictsByStateId).subscribe( data =>{
      this.loadingPopup.dismiss();
      this.GetDistrictsByStateId=data.DistrictsByState;
     },err => {
      this.loadingPopup.dismiss();
     });
  }

  SubmitUserProfile(value){
    if(!this.userProfile.valid) {
      Object.keys(this.userProfile.controls).forEach(field => {
        const control = this.userProfile.get(field);
        control.markAsTouched({ onlySelf: true });
      });
     return;
     }


    this.loadingPopup = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<div class="preloader">
      <div class="loader"></div>
    </div>`
      });
    var deviceId;
    if(this.device.uuid!=null){
      deviceId=this.device.uuid
    }
    // else{
    //   deviceId=Math.random();
    // }
    this.loadingPopup.present();
    var postJson=  {
               "ClientUserId" : "0",
               "Deviceid" : deviceId,
               "ClientName" : value.name,
               "StackholderId" : value.userType,
               "PreferredLanguage" : value.preferdLanguage,
               "Gender" : value.gender,
               "DOB" : value.dateOfBirth,
               "Organization" : value.oragType,
               "Country" : value.country,
               "State" : value.state,
               "District" : value.district,
               "MobileNo" : value.mobile
             }
      var stringifyPostJson= JSON.stringify(postJson);
      var DailyPatientAssignmentURL='InsertUpdateClientUser'
      var status = navigator.onLine;
      if (status) {
      this._appService.postData_new(DailyPatientAssignmentURL, stringifyPostJson).subscribe(data => {
        this.loadingPopup.dismiss();
        if(data.Status=="1" || data.Status=="0"){
          localStorage.setItem('userLocked',"1");
          localStorage.setItem("selectLanguage",value.preferdLanguage=="1"? this.eNumValue.Entitylanguage.language_english : this.eNumValue.Entitylanguage.language_hindi)
          localStorage.setItem("userDetail",stringifyPostJson);
          localStorage.setItem("userKey",JSON.stringify(data));
           this.gotoDashboard()
         }else{
           alert(data.Message)
         }
      },err => {
       this.loadingPopup.dismiss();
      });
      }else{
       this.loadingPopup.dismiss();
       alert(this.setLanguage.interNetMsg)
      }
  }

  chkCountry(value){
    this.userProfile.get('state').setValue("");
    this.userProfile.get('district').setValue("");
    if(value=="2"){
      $('.countrychk').addClass("display_none");
      this.userProfile.get('state').clearValidators();
      this.userProfile.get('district').clearValidators();
      this.userProfile.get('state').updateValueAndValidity();
      this.userProfile.get('district').updateValueAndValidity();
    }else{
      $('.countrychk').removeClass("display_none");
      this.userProfile.get('state').setValidators([Validators.required]);
      this.userProfile.get('district').setValidators([Validators.required]);
      this.userProfile.get('state').updateValueAndValidity();
      this.userProfile.get('district').updateValueAndValidity();
    }
  }
  gotoDashboard(){
    this.navCtrl.setRoot('DashboardPage');
  }
  gotoHomePage(){
    this.navCtrl.setRoot("HomePage");
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
