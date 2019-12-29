import { Injectable } from '@angular/core';
import { Http , Headers, RequestOptions} from '@angular/http';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { NavController} from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import * as $ from "jquery";

@Injectable()
export class AppServices {
    private options : any;
    public headers;
    public serviceURl= "http://64.94.164.16/Pathfinder-Digitaltool/api/"
    //  public serviceURl= "http://64.94.164.16/Pathfinder-Digitaltool-DEV/api/"
    constructor (private http: Http,public nav: NavController,private photoViewer: PhotoViewer) {
                //  this.AuthToken =  localStorage.getItem('AuthToken');
                //  // console.log(this.AuthToken);
         this.headers = new Headers();
        this.headers.append('Content-Type',  'application/json');
        this.headers.append('Accept', 'application/json' );
        // this.headers.append('Access-Control-Allow-Headers', '*');
      //  this.headers.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
       // this.headers.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        // this.headers.append('Authorization', 'Bearer ' + this.AuthToken);
      //  this.headers.append("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng");
        this.options = new RequestOptions({headers: this.headers});
    }

    deleteData(url){
        return this.http.delete(url,this.options)
            .map(data => {
                return 'success';
            })
            .retryWhen(e => e.scan<number>((errorCount, err) => {
                    if (errorCount >= 2) {
                        throw err;
                    }
                    return errorCount + 1;
              }, 0).delay(10000))
             .catch((error: any) => {

                if (error.status === 401 || error.status === 403 ||  error.status === 404  ||  error.status === 408
                ||  error.status ===0  ||  error.status ===500) {
                }
                 return Observable.throw(new Error(error.status));
             });
  }

    getData_new(url){
         url=this.serviceURl+url+'?'+Math.random();
        return this.http.get(url,this.options)
            .map(data => {
                data.json();
                return data.json();
             } )
             .retryWhen(e => e.scan<number>((errorCount, err) => {
                    if (errorCount >= 2) {
                      alert("somthing went wrong Please check your connection");
                        throw err;
                    }
                    return errorCount + 1;
                }, 0).delay(10000))
             .catch((error: any) => {
               if (error.status === 400 || error.status === 401 ||  error.status === 402  ||  error.status === 403
                ||  error.status === 404 || error.status ===  0   ||  error.status === 405 ||  error.status === 406 ||  error.status === 407
                ||  error.status === 408 ||  error.status === 409 ||  error.status === 410 ||  error.status === 411
                ||  error.status === 412 ||  error.status === 413 ||  error.status === 414 ||  error.status === 415
                ||  error.status === 416 ||  error.status === 417 ||  error.status === 418 ||  error.status === 420
                ||  error.status === 422 ||  error.status === 423 ||  error.status === 424 ||  error.status === 425
                ||  error.status === 426 ||  error.status === 428 ||  error.status === 429 ||  error.status === 431
                ||  error.status === 444 ||  error.status === 449 ||  error.status === 450 ||  error.status === 451
                ||  error.status === 499 || error.status === 501 ||  error.status === 502  ||  error.status === 503
                ||  error.status === 504  ||  error.status === 505 ||  error.status === 506 ||  error.status === 507
                ||  error.status === 508 ||  error.status === 509 ||  error.status === 510 ||  error.status === 511
                ||  error.status === 598 ||  error.status === 599 ) {
                  this.loginredirect(error);
                }

                if (error.status === 500) {
                     this.loginredirect(error);
                }
                 return Observable.throw(new Error(error.status));
              });
  }

      postData(url, data): Observable<any> {
        url=this.serviceURl+url
        console.log(JSON.stringify(data));
        return this.http.post(url, data)
        .map(results => {
          console.log(results);
          return results;
        }
        );
      }

      postDataNew(url,postdata){
        url=this.serviceURl+url
          return this.http.post(url,postdata,this.options)
          .map(results => {
            console.log(results);
            return results;
          }
          ).retryWhen(e => e.scan<number>((errorCount, err) => {
                      if (errorCount) {
                          throw err;
                      }
                      return errorCount + 1;
                }, 0).delay(5000))
               .catch((error: any) => {
                if (error.status === 400 || error.status === 401 ||  error.status === 402  ||  error.status === 403
                  ||  error.status === 404 || error.status ===  0   ||  error.status === 405 ||  error.status === 406 ||  error.status === 407
                  ||  error.status === 408 ||  error.status === 409 ||  error.status === 410 ||  error.status === 411
                  ||  error.status === 412 ||  error.status === 413 ||  error.status === 414 ||  error.status === 415
                  ||  error.status === 416 ||  error.status === 417 ||  error.status === 418 ||  error.status === 420
                  ||  error.status === 422 ||  error.status === 423 ||  error.status === 424 ||  error.status === 425
                  ||  error.status === 426 ||  error.status === 428 ||  error.status === 429 ||  error.status === 431
                  ||  error.status === 444 ||  error.status === 449 ||  error.status === 450 ||  error.status === 451
                  ||  error.status === 499 || error.status === 501 ||  error.status === 502  ||  error.status === 503
                  ||  error.status === 504  ||  error.status === 505 ||  error.status === 506 ||  error.status === 507
                  ||  error.status === 508 ||  error.status === 509 ||  error.status === 510 ||  error.status === 511
                  ||  error.status === 598 ||  error.status === 599 || error.status === 500 ) {
                      this.loginredirect(error);
                  }
                  console.log(error);
                   return Observable.throw(new Error(error.status));
               });
      }

    postData_new(url,postdata){
      url=this.serviceURl+url
        return this.http.post(url,postdata,this.options)
            .map(data => {
                data.json();
                return data.json();
             })
             .retryWhen(e => e.scan<number>((errorCount, err) => {
                    if (errorCount) {
                        throw err;
                    }
                    return errorCount + 1;
              }, 0).delay(5000))
             .catch((error: any) => {
              if (error.status === 400 || error.status === 401 ||  error.status === 402  ||  error.status === 403
                ||  error.status === 404 || error.status ===  0   ||  error.status === 405 ||  error.status === 406 ||  error.status === 407
                ||  error.status === 408 ||  error.status === 409 ||  error.status === 410 ||  error.status === 411
                ||  error.status === 412 ||  error.status === 413 ||  error.status === 414 ||  error.status === 415
                ||  error.status === 416 ||  error.status === 417 ||  error.status === 418 ||  error.status === 420
                ||  error.status === 422 ||  error.status === 423 ||  error.status === 424 ||  error.status === 425
                ||  error.status === 426 ||  error.status === 428 ||  error.status === 429 ||  error.status === 431
                ||  error.status === 444 ||  error.status === 449 ||  error.status === 450 ||  error.status === 451
                ||  error.status === 499 || error.status === 501 ||  error.status === 502  ||  error.status === 503
                ||  error.status === 504  ||  error.status === 505 ||  error.status === 506 ||  error.status === 507
                ||  error.status === 508 ||  error.status === 509 ||  error.status === 510 ||  error.status === 511
                ||  error.status === 598 ||  error.status === 599 || error.status === 500 ) {
                    this.loginredirect(error);
                }
                console.log(error);
                 return Observable.throw(new Error(error.status));
             });
    }

    changeLanguage(chooseLanguage){
        if(chooseLanguage=="English"){
          localStorage.setItem("selectLanguage","English")
          return true;
        }else if(chooseLanguage=="हिंदी"){
          localStorage.setItem("selectLanguage","हिंदी")
           return true;
        }else if(chooseLanguage=="मराठी"){
          localStorage.setItem("selectLanguage","मराठी")
           return true;
        }else{
          alert("Somthing Went Wrong.");
           return false;
        }
    }

    onimgclick(e) {
      var Selected_url = $(e.target).attr('src');
       if(Selected_url != "" && Selected_url != undefined && Selected_url != null && Selected_url != "undefined"){
        this.photoViewer.show(Selected_url);
         }
    }

loginredirect(error){
  alert("Somthing Went Wrong");
}
}
