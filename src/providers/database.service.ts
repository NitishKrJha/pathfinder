import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DatabaseProvider {
     database: SQLiteObject;
    private databaseReady: BehaviorSubject<boolean>;

    constructor(public sqlitePorter: SQLitePorter, private storage: Storage, private sqlite: SQLite, private platform: Platform, private http: Http) {
      this.databaseReady = new BehaviorSubject(false);
      this.platform.ready().then(() => {
        this.sqlite.create({
          name: 'developers.db',
          location: 'default'
        })
          .then((db: SQLiteObject) => {
            this.database = db;
            this.storage.get('database_filled').then(val => {
              if (val) {
                this.databaseReady.next(true);
              } else {
                this.fillDatabase();
              }
            });
          });
      });
    }

    fillDatabase() {
      this.http.get('assets/table.sql')
        .map(res => res.text())
        .subscribe(sql => {
          this.sqlitePorter.importSqlToDb(this.database, sql)
            .then(data => {
              this.databaseReady.next(true);
              this.storage.set('database_filled', true);
            })
            .catch(e => alert(JSON.stringify(e)));
        });
    }

    fillTableDatabase() {
      this.http.get('assets/table.sql')
        .map(res => res.text())
        .subscribe(sql => {
          this.sqlitePorter.importSqlToDb(this.database, sql)
            .then(data => {
              this.databaseReady.next(true);
              this.storage.set('database_filled', true);
            })
            .catch(e => console.error(e));
        });
    }

    formatNumber(number) {
      const formattedNumber = ('0' + number).slice(-2);
      return formattedNumber;
  }

    addMethodsList(result) {
      var query = "INSERT INTO Methodsdata(MethodId,MethodLabel,MethodName,MethodSequenceNo,MobileIcon,MobileIconURL,TabletIcon,TabletIconURL,LanguageId,StackHolderId,MethodCategory,MethodCategoryName) VALUES";
      var data = [];
      var rowArgs = [];
      result.forEach(function (methods) {
              rowArgs.push("(?, ?, ?,?, ?, ?, ?,?,?,?,?,?)");
              data.push(methods.MethodId);
              data.push(methods.MethodLabel);
               data.push(methods.MethodName);
               data.push(methods.MethodSequenceNo);
               data.push(methods.MobileIcon);
               data.push(methods.MobileIconURL);
               data.push(methods.TabletIcon);
              data.push(methods.TabletIconURL);
              data.push(methods.LanguageId);
              data.push(methods.StackHolderId);
              data.push(methods.MethodCategory);
              data.push(methods.MethodCategoryName);
          });
      query += rowArgs.join(", ");
      return this.database.executeSql(query,data).then(data => {
        return data;
      }, err => {
        alert('Error addMethodsData: '+ JSON.stringify(err));
        return err;
      });
    }

    getMethodsList(MethodCategory,LanguageId) {
      return this.database.executeSql("select * from Methodsdata WHERE    MethodCategory ='"+MethodCategory+"'  AND LanguageId='"+ LanguageId + "'", []).then((data) => {
        let methodList = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            methodList.push({MethodId: data.rows.item(i).MethodId,MethodLabel: data.rows.item(i).MethodLabel,MethodName: data.rows.item(i).MethodName,MethodSequenceNo: data.rows.item(i).MethodSequenceNo,MobileIcon: data.rows.item(i).MobileIcon,MobileIconURL: data.rows.item(i).MobileIconURL,TabletIcon: data.rows.item(i).TabletIcon,TabletIconURL: data.rows.item(i).TabletIconURL,LanguageId: data.rows.item(i).LanguageId,StackHolderId: data.rows.item(i).StackHolderId,MethodCategory: data.rows.item(i).MethodCategory,MethodCategoryName: data.rows.item(i).MethodCategoryName});
          }
        }

        return methodList;
      }, err => {
        alert('getAllDashboardData Error: '+ err);
        return [];
      });
    }

    addTopicsContent(result) {
      var query = "INSERT INTO TopicsContent(ContentId,LanguageId,MethodId,MethodLabel,MethodName,TopicId,TopicNo,TopicName,Content,ImgName,ImgUrl) VALUES";
      var data = [];
      var rowArgs = [];
      result.forEach(function (topicContent) {
              rowArgs.push("(?, ?, ?,?, ?, ?, ?, ?,? ,? ,? )");
              data.push(topicContent.ContentId);
              data.push(topicContent.languageId);
              data.push(topicContent.MethodId);
              data.push(topicContent.MethodLabel);
              data.push(topicContent.MethodName);
              data.push(topicContent.TopicId);
              data.push(topicContent.TopicNo);
              data.push(topicContent.TopicName);
              data.push(topicContent.Content);
              data.push(topicContent.ImgName);
              data.push(topicContent.ImgUrl);

          });
      query += rowArgs.join(", ");
      return this.database.executeSql(query,data).then(data => {
        return data;
      }, err => {
        alert('Error addTopicsContent: '+ JSON.stringify(err));
        return err;
      });
    }

    getTopics(MethodId,LanguageId) {
      return this.database.executeSql("select * from TopicsContent WHERE MethodId = '"+MethodId+"'  AND LanguageId='"+ LanguageId + "'  ", []).then((data) => {
        let topicList = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            topicList.push({ContentId: data.rows.item(i).ContentId,LanguageId: data.rows.item(i).LanguageId,MethodId: data.rows.item(i).MethodId,MethodLabel: data.rows.item(i).MethodLabel,MethodName: data.rows.item(i).MethodName,TopicId: data.rows.item(i).TopicId,TopicNo: data.rows.item(i).TopicNo+"ASC",TopicName: data.rows.item(i).TopicName,Content: data.rows.item(i).Content,ImgName: data.rows.item(i).ImgName,ImgUrl: data.rows.item(i).ImgUrl});
          }
        }
        //alert("line 143"+JSON.stringify(topicList));
        return topicList;
      }, err => {
        alert('getTopics Error: '+ err);
        return [];
      });
    }
     getContent(ContentId,LanguageId) {
      return this.database.executeSql("select * from TopicsContent WHERE ContentId = '"+ContentId+"'  AND LanguageId='"+ LanguageId + "'", []).then((data) => {
        let contentList = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            contentList.push({ContentId: data.rows.item(i).ContentId,LanguageId: data.rows.item(i).LanguageId,MethodId: data.rows.item(i).MethodId,MethodLabel: data.rows.item(i).MethodLabel,MethodName: data.rows.item(i).MethodName,TopicId: data.rows.item(i).TopicId,SubTopicId: data.rows.item(i).SubTopicId,TopicNo: data.rows.item(i).TopicNo,TopicName: data.rows.item(i).TopicName,Content: data.rows.item(i).Content,ImgName: data.rows.item(i).ImgName,ImgUrl: data.rows.item(i).ImgUrl});
          }
        }
        return contentList;
      }, err => {
        alert('getContent Error: '+ err);
        return [];
      });
    }

    getDatabaseState() {
      return this.databaseReady.asObservable();
    }

    addFAQDetail(result){
      var query = "INSERT INTO FAQDetail(FaqId,FaqSeqNo,MethodId,MethodName,LanguageId,Question,Answer) VALUES";
      var data = [];
      var rowArgs = [];
      result.forEach(function (faqDetail) {
              rowArgs.push("(?, ?, ?, ?, ?, ?, ?)");
              data.push(faqDetail.FaqId);
              data.push(faqDetail.FaqSeqNo);
              data.push(faqDetail.MethodId);
              data.push(faqDetail.MethodName);
              data.push(faqDetail.LanguageId);
              data.push(faqDetail.Question);
              data.push(faqDetail.Answer);

     });
      query += rowArgs.join(", ");
      return this.database.executeSql(query,data).then(data => {
        return data;
      }, err => {
        alert('Error addFAQDetail: '+ JSON.stringify(err));
        return err;
      });
  }
  getFAQDetail(MethodId,LanguageId){
    return this.database.executeSql("select * from FAQDetail WHERE MethodId='"+ MethodId + "' AND LanguageId='"+ LanguageId + "'", []).then((data) => {
      let faqList = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          faqList.push({FaqId: data.rows.item(i).FaqId,FaqSeqNo: data.rows.item(i).FaqSeqNo+"ASC",MethodId: data.rows.item(i).MethodId,MethodName: data.rows.item(i).MethodName,LanguageId: data.rows.item(i).LanguageId,Question: data.rows.item(i).Question,Answer: data.rows.item(i).Answer});
        }
      }
      return faqList;
    }, err => {
      alert('getFAQDetail Error: '+ err);
      return [];
    });
  }
  addKeyMessageDetail(result){
    var query = "INSERT INTO KeyMessageDetail(KeyMessageId,LanguageId,KeyMessageImage,KeyMessageHeading,Content,ContentImage) VALUES";
    var data = [];
    var rowArgs = [];
    result.forEach(function (keyMessage) {
            rowArgs.push("(?, ?, ?, ?, ?, ?)");
            data.push(keyMessage.KeyMessageId);
            data.push(keyMessage.LanguageId);
            data.push(keyMessage.KeyMessageImage);
            data.push(keyMessage.KeyMessageHeading);
            data.push(keyMessage.Content);
            data.push(keyMessage.ContentImage);
   });
    query += rowArgs.join(", ");
    return this.database.executeSql(query,data).then(data => {
      return data;
    }, err => {
      alert('Error addKeyMessageDetail: '+ JSON.stringify(err));
      return err;
    });
}
getKeyMessageDetail(LanguageId){
  return this.database.executeSql("select * from KeyMessageDetail WHERE LanguageId='"+ LanguageId + "'", []).then((data) => {
    let keyMessageDetailList = [];
    if (data.rows.length > 0) {
      for (var i = 0; i < data.rows.length; i++) {
        keyMessageDetailList.push({KeyMessageId: data.rows.item(i).KeyMessageId,LanguageId: data.rows.item(i).LanguageId,KeyMessageImage: data.rows.item(i).KeyMessageImage,KeyMessageHeading: data.rows.item(i).KeyMessageHeading,Content: data.rows.item(i).Content,ContentImage: data.rows.item(i).ContentImage});
      }
    }
    return keyMessageDetailList;
  }, err => {
    alert('getKeyMessageDetail Error: '+ err);
    return [];
  });
}

addAskQuestionsDetailsLive(result){
  var query = "INSERT INTO AskQuestions(FeedbackId,ClientUserId,DeviceId,LanguageId,Feedback,SubmittedDateTime,Response,ResponseDateTime,Statuss) VALUES";
  var data = [];
  var rowArgs = [];
  result.forEach(function (askQuestion) {
          rowArgs.push("(?, ?, ?, ?, ?, ?, ?, ?, ?)");
          data.push(askQuestion.FeedbackId);
          data.push(askQuestion.ClientUserId);
          data.push(askQuestion.DeviceId);
          data.push(askQuestion.LanguageId);
          data.push(askQuestion.Feedback);
          data.push(askQuestion.SubmittedDateTime);
          data.push(askQuestion.Response);
          data.push(askQuestion.ResponseDateTime);
          data.push(askQuestion.Status);

  });
  query += rowArgs.join(", ");
  return this.database.executeSql(query,data).then(data => {
    return data;
  }, err => {
    alert('Error addAskQuestionsDetailsLive: '+ JSON.stringify(err));
    return err;
  });
 }
 addAskQuestionsDetails(result){
  var query = "INSERT INTO AskQuestions(FeedbackId,ClientUserId,DeviceId,LanguageId,Feedback,SubmittedDateTime) VALUES";
  var data = [];
  var rowArgs = [];
  result.forEach(function (askQuestion) {
          rowArgs.push("(?, ?, ?, ?, ? , ?)");
          data.push("0");
          data.push(askQuestion.ClientUserId);
          data.push(askQuestion.DeviceId);
          data.push(askQuestion.LanguageId);
          data.push(askQuestion.Feedback);
          data.push(askQuestion.SubmittedDateTime);
  });
  query += rowArgs.join(", ");
  return this.database.executeSql(query,data).then(data => {
    return data;
  }, err => {
    alert('Error addAskQuestionsDetails: '+ JSON.stringify(err));
    return err;
  });
 }
 getAskQuestionsDetails() {
  return this.database.executeSql("select * from AskQuestions ORDER BY ID DESC", []).then((data) => {
    let questionList = [];
    if (data.rows.length > 0) {
      for (var i = 0; i < data.rows.length; i++) {
        questionList.push({ID: data.rows.item(i).ID,FeedbackId: data.rows.item(i).FeedbackId,ClientUserId: data.rows.item(i).ClientUserId,DeviceId: data.rows.item(i).DeviceId,LanguageId: data.rows.item(i).LanguageId,Feedback: data.rows.item(i).Feedback,SubmittedDateTime: data.rows.item(i).SubmittedDateTime,Response: data.rows.item(i).Response,ResponseDateTime: data.rows.item(i).ResponseDateTime,Statuss: data.rows.item(i).Statuss});
      }
    }
    return questionList;
  }, err => {
    alert('GetquestionList Error: '+ err);
    return [];
  });
}

getAskQuestionsDetailsLive() {
  return this.database.executeSql("select * from AskQuestions WHERE FeedbackId='0' ORDER BY ID ASC", []).then((data) => {
    let questionList = [];
    if (data.rows.length > 0) {
      for (var i = 0; i < data.rows.length; i++) {
        questionList.push({ ClientUserId: data.rows.item(i).ClientUserId,DeviceId: data.rows.item(i).DeviceId,LanguageId: data.rows.item(i).LanguageId,Feedback: data.rows.item(i).Feedback,SubmittedDateTime: data.rows.item(i).SubmittedDateTime});
      }
    }
    return questionList;
  }, err => {
    alert('getAskQuestionsDetailsLive Error: '+ err);
    return [];
  });
}

deletAskQuestionDetails(){
  var query="delete from AskQuestions";
  return this.database.executeSql(query,[]).then(data => {
    return true;
  }, err => {
    alert('Error AskQuestions: '+ JSON.stringify(err));
    return false;
  });
}

// addQuizCategory(result) {
//   var query = "INSERT INTO QuizCategoryDetail(QuizCategoryId,LanguageId,QuizCategoryName) VALUES";
//   var data = [];
//   var rowArgs = [];
//   result.forEach(function (quizCategory) {
//           rowArgs.push("(?, ?, ?)");
//           data.push(quizCategory.QuizCategoryId);
//           data.push(quizCategory.LanguageId);
//           data.push(quizCategory.QuizCategoryName);          
//     });
//   query += rowArgs.join(", ");
//   return this.database.executeSql(query,data).then(data => {
//     return data;
//   }, err => {
//     alert('Error addQuizCategory: '+ JSON.stringify(err));
//     return err;
//   });
// }

// getQuizCategory(LanguageId) {
//   return this.database.executeSql("select * from QuizCategoryDetail WHERE LanguageId='"+ LanguageId + "'", []).then((data) => {
//     let quizCategory = [];
//     if (data.rows.length > 0) {
//       for (var i = 0; i < data.rows.length; i++) {
//         quizCategory.push({ QuizCategoryId: data.rows.item(i).QuizCategoryId,LanguageId: data.rows.item(i).LanguageId, QuizCategoryName: data.rows.item(i).QuizCategoryName});
//       }
//     }
//     return quizCategory;
//   }, err => {
//     alert('getQuizCategory Error: '+ err);
//     return [];
//   });
// }

addQuizQuestions(result){
  var query = "INSERT INTO QuizQuestions(QuestionNo,QuestionText,LanguageId,QuestionLevel) VALUES";
  var data = [];
  var rowArgs = [];
  result.forEach(function (quizQuestion) {
          rowArgs.push("(? ,?, ?, ?)");
          data.push(quizQuestion.QuestionNo);
          data.push(quizQuestion.QuestionText);
          data.push(quizQuestion.LanguageId);
          data.push(parseInt(quizQuestion.QuestionLevel));
    });
  query += rowArgs.join(", ");
  return this.database.executeSql(query,data).then(data => {
    return data;
  }, err => {
    alert('Error addQuizQuestions: '+ JSON.stringify(err));
    return err;
  });
 }

 updateQuizQuestions(correctAnswer, questionLevel, languageId) {
  // tslint:disable-next-line:max-line-length
  return this.database.executeSql('update QuizQuestions set CorrectAnswer ="' + correctAnswer + '" WHERE QuestionLevel="' + questionLevel + '" AND LanguageId="' + languageId + '"' , []).then(data => {
    return data;
  }, err => {
    alert('updateQuizQuestions Error: ' + err);
    return err;
  });
}

updateQuizQuestionsForDay(questionLevel, languageId) {
   const d = new Date();
  const startTime =  d.getFullYear().toString() + '-' + this.formatNumber((d.getMonth() + 1).toString()) + '-' + this.formatNumber(d.getDate().toString()) + ' ' + this.formatNumber(d.getHours().toString()) + ':' + this.formatNumber(d.getMinutes().toString()) + ':' + this.formatNumber(d.getSeconds().toString());
  console.log(startTime);
  console.log('update QuizQuestions set StartDateTime ="' + startTime + '" WHERE (QuestionLevel="' + questionLevel + '" AND LanguageId="' + languageId + '" AND   StartDateTime = "null" ');
  // tslint:disable-next-line:max-line-length
  return this.database.executeSql('update QuizQuestions set StartDateTime ="' + startTime + '" WHERE (QuestionLevel="' + questionLevel + '" AND LanguageId="' + languageId + '" AND  StartDateTime = "null")' , []).then(data => {
    return data;
  }, err => {
    alert('updateQuizQuestionsForDay Error: ' + err);
    return err;
  });
}

updateQuizQuestionsAfterTwoDays(questionLevel, languageId) {
  const d = new Date();
 const startTime =  d.getFullYear().toString() + '-' + this.formatNumber((d.getMonth() + 1).toString()) + '-' + this.formatNumber(d.getDate().toString()) + ' ' + this.formatNumber(d.getHours().toString()) + ':' + this.formatNumber(d.getMinutes().toString()) + ':' + this.formatNumber(d.getSeconds().toString());
 console.log(startTime);
 console.log('update QuizQuestions set StartDateTime ="' + startTime + '" WHERE (QuestionLevel="' + questionLevel + '" AND LanguageId="' + languageId + '"');
 // tslint:disable-next-line:max-line-length
 return this.database.executeSql('update QuizQuestions set StartDateTime ="' + startTime + '" WHERE (QuestionLevel="' + questionLevel + '" AND LanguageId="' + languageId + '" )' , []).then(data => {
   return data;
 }, err => {
   alert('updateQuizQuestionsAfterTwoDays Error: ' + err);
   return err;
 });
}
 getQuizQuestions(questionLevel,LanguageId) {
  return this.database.executeSql("select * from QuizQuestions WHERE QuestionLevel ='"+ questionLevel + "' AND LanguageId='"+ LanguageId + "'", []).then((data) => {
    let quizQuestion = [];
    if (data.rows.length > 0) {
      for (var i = 0; i < data.rows.length; i++) {
        quizQuestion.push({QuestionNo: data.rows.item(i).QuestionNo,QuestionText: data.rows.item(i).QuestionText,LanguageId: data.rows.item(i).LanguageId,QuestionLevel: data.rows.item(i).QuestionLevel});
      }
    }
    return quizQuestion;
  }, err => {
    alert('GetquestionList Error: '+ err);
    return [];
  });
}
addQuizQuestionOptions(result){
  var query = "INSERT INTO QuizQuestionOptions(QuestionNo,QuestionOptions,LanguageId,CorrectAnswer,QuestionLevel) VALUES";
  var data = [];
  var rowArgs = [];
  result.forEach(function (quizQuestionOptions) {
          rowArgs.push("(?, ?, ?, ?, ?)");
          data.push(quizQuestionOptions.QuestionNo);
          data.push(quizQuestionOptions.QuestionOptions);
          data.push(quizQuestionOptions.LanguageId);
          data.push(quizQuestionOptions.CorrectAnswer);
          data.push(quizQuestionOptions.QuestionLevel);

   });
  query += rowArgs.join(", ");
  return this.database.executeSql(query,data).then(data => {
    return data;
  }, err => {
    alert('Error addQuizQuestionOptions: '+ JSON.stringify(err));
    return err;
  });
 }

 getQuizQuestionOptions(QuestionLevel,LanguageId) {
  return this.database.executeSql("select * from QuizQuestionOptions WHERE QuestionLevel='"+ QuestionLevel + "' AND LanguageId='"+ LanguageId + "'", []).then((data) => {
    let getQuestionOptions = [];
    if (data.rows.length > 0) {
      for (var i = 0; i < data.rows.length; i++) {
        getQuestionOptions.push({QuestionNo: data.rows.item(i).QuestionNo,QuestionOptions: data.rows.item(i).QuestionOptions,LanguageId: data.rows.item(i).LanguageId,CorrectAnswer: data.rows.item(i).CorrectAnswer,QuestionLevel: data.rows.item(i).QuestionLevel});
      }
    }
    return getQuestionOptions;
  }, err => {
    alert('getQuizQuestionOptions Error: '+ err);
    return [];
  });
}

getAnswerByQuestion(QuestionLevel, QuestionNo,LanguageId){
  var CorrectAnswer="1";
  return this.database.executeSql("select * from QuizQuestionOptions WHERE  QuestionLevel='"+ QuestionLevel + "' AND QuestionNo = '"+QuestionNo+"'  AND CorrectAnswer='"+ CorrectAnswer + "' AND LanguageId='"+LanguageId+"'", []).then((data) => {
      let correctAnswer = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          correctAnswer.push({QuestionNo: data.rows.item(i).QuestionNo,QuestionOptions: data.rows.item(i).QuestionOptions,LanguageId: data.rows.item(i).LanguageId,CorrectAnswer: data.rows.item(i).CorrectAnswer,QuestionLevel: data.rows.item(i).QuestionLevel});
        }
      }
      return correctAnswer;
    }, err => {
      alert('getQuizQuestionOptions Error: '+ err);
      return [];
    });
  }

  getQuizLevel(languageId) {
    const query = 'SELECT distinct  QuestionLevel  as Levels , CorrectAnswer as count FROM QuizQuestions where LanguageId = "' + languageId + '" group by QuestionLevel ORDER BY QuestionLevel DESC'; 
   console.log(query);
   const ths = this;
   return ths.database.executeSql(query, []).then(data => {
      let levelContent = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
         levelContent.push({LevelId: data.rows.item(i).Levels, Count: data.rows.item(i).count});
        }
      }
     // console.log(data.rows.item(0).Levels);
     //  return data.rows.item(0).Levels;
     return levelContent;
 }, err => {
   alert('Error getQuizLevel: ' + JSON.stringify(err));
   return err;
 });
 }
updateCorrectAnswerCount(){
  // tslint:disable-next-line:max-line-length
  return this.database.executeSql('update QuizQuestions set CorrectAnswer = null , StartDateTime = null' , []).then(data => {
    return data;
  }, err => {
    alert('updateCorrectAnswerCount Error: ' + err);
    return err;
  });
}

 getLastTimeOfQuiz(questionLevel,languageId) {
   const query = 'SELECT  StartDateTime  as startDateTime FROM QuizQuestions where LanguageId = "' + languageId + '" AND QuestionLevel = "' + questionLevel + '" group by QuestionLevel'; 
  console.log(query);
  const ths = this;
  return ths.database.executeSql(query, []).then(data => {
     let lastTime = [];
     if (data.rows.length > 0) {
       for (var i = 0; i < data.rows.length; i++) {
         lastTime.push({StartTime: data.rows.item(i).startDateTime});
       }
     }
    return lastTime;
}, err => {
  alert('Error getQuizLevel: ' + JSON.stringify(err));
  return err;
});
}
  addGetOtherContent(result,ContentType){
    var query = "INSERT INTO GetOtherContent(ContentType,ContentId,LanguageId,Content,ImgName,ImgUrl) VALUES";
    var data = [];
    var rowArgs = [];
    result.forEach(function (getOtherContent) {
            rowArgs.push("(?, ?, ?, ?,?,?)");
            data.push(ContentType);
            data.push(getOtherContent.ContentId);
            data.push(getOtherContent.LanguageId);
            data.push(getOtherContent.Content);
            data.push(getOtherContent.ImgName);
            data.push(getOtherContent.ImgUrl);

     });
    query += rowArgs.join(", ");
    return this.database.executeSql(query,data).then(data => {
      return data;
    }, err => {
      alert('Error addGetOtherContent: '+ JSON.stringify(err));
      return err;
    });
   }
   getGetOtherContent(ContentType,LanguageId){
     return this.database.executeSql("select * from GetOtherContent WHERE ContentType ='"+ContentType+"' AND LanguageId='"+ LanguageId + "'", []).then((data) => {
        let otherContent = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            otherContent.push({ContentType: data.rows.item(i).ContentType,ContentId: data.rows.item(i).ContentId,LanguageId: data.rows.item(i).LanguageId,Content: data.rows.item(i).Content,ImgName: data.rows.item(i).ImgName,ImgUrl: data.rows.item(i).ImgUrl});
          }
        }
        return otherContent;
      }, err => {
        alert('getGetOtherContent Error: '+ err);
        return [];
      });
    }
    dropTables(){
      var ths=this;
       var query="delete from Methodsdata";
       var query1="delete from TopicsContent";
       var query2="delete from FAQDetail";
       var query3="delete from KeyMessageDetail";
       var query4="delete from AskQuestions";
       var query5="delete from QuizQuestions";
       var query6="delete from QuizQuestionOptions";
       var query7="delete from GetOtherContent";
        return ths.database.executeSql(query,[]).then(data => {
          return ths.database.executeSql(query1,[]).then(data => {
            return ths.database.executeSql(query2,[]).then(data => {
              return ths.database.executeSql(query3,[]).then(data => {
                return ths.database.executeSql(query4,[]).then(data => {
                  return ths.database.executeSql(query5,[]).then(data => {
                    return ths.database.executeSql(query6,[]).then(data => {
                      return ths.database.executeSql(query7,[]).then(data => {
                        return true;
                      }, err => {
                        alert('Error dropTables8: '+ JSON.stringify(err));
                        return false;
                      });
                    }, err => {
                      alert('Error dropTables7: '+ JSON.stringify(err));
                      return false;
                    });
                  }, err => {
                    alert('Error dropTables6: '+ JSON.stringify(err));
                    return false;
                  });
                }, err => {
                  alert('Error dropTables5: '+ JSON.stringify(err));
                  return false;
                });
              }, err => {
                alert('Error dropTables4: '+ JSON.stringify(err));
                return false;
              });
            }, err => {
              alert('Error dropTables3: '+ JSON.stringify(err));
              return false;
            });
          }, err => {
            alert('Error dropTables2: '+ JSON.stringify(err));
            return false;
          });
      }, err => {
        alert('Error dropTables1: '+ JSON.stringify(err));
        return false;
      });
    }

    addGetTime(userId,roleId,addeddate, languageId ,contentType,startTime) {
      var data = [userId,roleId,addeddate, languageId,contentType,'', startTime, ''];
      const query = "INSERT INTO GetTime(UserId,RoleId,AddedDate,LanguageId,ContentType,MethodId,StartDateTime,EndDateTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      console.log(query);
       return this.database.executeSql(query, data).then(data => {
         console.log(data);
        return data;
      }, err => {
        alert('Error addGetTime: '+ JSON.stringify(err));    
        return err;
      });
    }
    addGetDateTime(result){
      var query = 'INSERT INTO GetTime(UserId,RoleId,AddedDate,LanguageId,ContentType,MethodId,StartDateTime,EndDateTime)   SELECT * FROM(Select "' + result.UserId + '", "'+result.RoleId+'", "'+result.AddedDate+'", "'+result.LanguageId+'", "'+result.ContentType+'", "'+result.MethodId+'", "'+result.StartDateTime+'", "'+result.EndDateTime+'")';
       console.log(query);
      return this.database.executeSql(query,[]).then(data => {
        return data;
      }, err => {
        alert('Error addGetDateTime: '+ JSON.stringify(err));
        return err;
      });
     }
    addMethodGetTime(userId,roleId,addeddate, languageId ,contentType,methodId,startTime) {
      var data = [userId,roleId,addeddate, languageId,contentType,methodId, startTime, ''];
      const query = "INSERT INTO GetTime(UserId,RoleId,AddedDate,LanguageId,ContentType,MethodId,StartDateTime,EndDateTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      console.log(query);
       return this.database.executeSql(query, data).then(data => {
         console.log(data);
        return data;
      }, err => {
        alert('Error addMethodGetTime: '+ JSON.stringify(err));    
        return err;
      });
    }

    getGetTime(){
      return this.database.executeSql("select * from GetTime ", []).then((data) => {
         let otherContent = [];
         if (data.rows.length > 0) {
           for (var i = 0; i < data.rows.length; i++) {
             var totalTimeDifference = this.timeDifference(data.rows.item(i).StartDateTime,data.rows.item(i).EndDateTime);
             otherContent.push({UserId: data.rows.item(i).UserId,RoleId: data.rows.item(i).RoleId,AddedDate: data.rows.item(i).AddedDate,LanguageId: data.rows.item(i).LanguageId,ContentType: data.rows.item(i).ContentType,MethodId: data.rows.item(i).MethodId,StartDateTime: data.rows.item(i).StartDateTime,EndDateTime: data.rows.item(i).EndDateTime,TimeInMilliSec:totalTimeDifference});
           }
         }
         return otherContent;
       }, err => {
         alert('getGetTime Error: '+ err);
         return [];
       });
     }

     timeDifference(startTime, endTime) { 
      var d1: any = new Date(startTime);
      var d2: any = new Date(endTime);
      var difference = Math.abs(d2 - d1);
      console.log('Difference between Two Dates>>>>>>' + difference) ;
      return difference;
    }


    millisToMinutesAndSeconds(millis) {
      var minutes = Math.floor(millis / 60000);
      var seconds = ((millis % 60000) / 1000).toFixed(0);
      return this.formatNumber(minutes) + ":" + this.formatNumber(seconds);
    }
     updateGetTime(startTime) {
      const d = new Date();
      const endTime =  d.getFullYear().toString() + '-' + this.formatNumber((d.getMonth() + 1).toString()) + '-' + this.formatNumber(d.getDate().toString()) + ' ' + this.formatNumber(d.getHours().toString()) + ':' + this.formatNumber(d.getMinutes().toString()) + ':' + this.formatNumber(d.getSeconds().toString());
      console.log(endTime);
      return this.database.executeSql('update GetTime set EndDateTime = "' + endTime + '" where StartDateTime = "' + startTime + '"' , []).then(data => {
        return data;
      }, err => {
        alert('updateGetTime Error: ' + err);
        return err;
      });
    }

    deletGetDateTime(){
      var query="delete from GetTime";
      return this.database.executeSql(query,[]).then(data => {
        return true;
      }, err => {
        alert('Error deletGetDateTime: '+ JSON.stringify(err));
        return false;
      });
    }

    
 }

