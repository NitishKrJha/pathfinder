CREATE TABLE IF NOT EXISTS Methodsdata(MethodId text,MethodLabel text,MethodName text,MethodSequenceNo text,MobileIcon text,MobileIconURL text,TabletIcon text,TabletIconURL text,LanguageId text,StackHolderId text,MethodCategory text,MethodCategoryName text);
CREATE TABLE IF NOT EXISTS TopicsContent(ContentId text,LanguageId text,MethodId text,MethodLabel text,MethodName text,TopicId text,TopicNo text,TopicName text,Content text,ImgName text,ImgUrl text);
CREATE TABLE IF NOT EXISTS FAQDetail(FaqId text,FaqSeqNo text,MethodId text,MethodName text,LanguageId text,Question text,Answer text);
CREATE TABLE IF NOT EXISTS KeyMessageDetail(KeyMessageId text,LanguageId text,KeyMessageImage text,KeyMessageHeading text,Content text,ContentImage text);
CREATE TABLE IF NOT EXISTS AskQuestions( ID INTEGER  PRIMARY KEY AUTOINCREMENT,FeedbackId text,ClientUserId text,DeviceId text,LanguageId text,Feedback text,SubmittedDateTime text,Response text,ResponseDateTime text,Statuss text);
CREATE TABLE IF NOT EXISTS QuizQuestions(QuestionNo text,QuestionText text,LanguageId text,QuestionLevel text,CorrectAnswer text,StartDateTime text);
CREATE TABLE IF NOT EXISTS QuizQuestionOptions(QuestionNo text,QuestionOptions text,LanguageId text,CorrectAnswer text,QuestionLevel text);
CREATE TABLE IF NOT EXISTS GetOtherContent(ContentType text,ContentId text,LanguageId text,Content text,ImgName text,ImgUrl text);
CREATE TABLE IF NOT EXISTS GetTime(UserId text,RoleId text,AddedDate text, LanguageId text, ContentType text, MethodId text, StartDateTime text, EndDateTime Text);

