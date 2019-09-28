const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); 
const ObjectId = mongoose.Types.ObjectId;  
const utils = require('../config/utils'); 
const serverURL = "http://sususerver.ddns.net:3000";  
const axios = require("axios");  
const moment = require('moment'); 

///////////함수들 및 전역 변수 시작/////////// 

const AddDays = function(StartDay,Days){
  const EndDay = moment(StartDay).add(Days,"days").format("YYYY-MM-DD")
  return EndDay
} 

const GetISODate = function(Data){
  const date = new Date(Data+"T00:00:00.000Z")
  return date
}

const type = ["Official"] //type 항목들 

///////////함수들  및 전역 변수 끝///////////

// paramStartDay ~ paramStartDay+paramDays-1 에 있는 이벤트들을 보여 줌. 
const ShowEventsList = function(req, res) {
    
  console.log('EventCalendar 모듈 안에 있는 ShowEventsList 호출됨.');
  const database = req.app.get('database');    
  let context = {isadmin: false,
      EventEntries: [{Date: ' ', Events: [{ eventID: '',title : ' ', type: [], contents: ' ', 
                                            adminwrote: false, ismine: false}]}]}   
    
  const paramUserId = req.body.userid;
  const paramStartDay = req.body.startday||'0000-0-0'; 
  const paramDays = req.body.days.toString()||'1'
  const paramType = req.body.type||[];
  const paramFilter = req.body.filter||" "
  const paramEndDay = AddDays(paramStartDay,paramDays)
  const paramISOStartDay = GetISODate(paramStartDay)  
  const paramISOEndDay = GetISODate(paramEndDay) 
  
  console.log('paramUserId: ',paramUserId)
  console.log('paramStartDay: ',paramStartDay)
  console.log('paramDays: ',paramDays) 
  console.log('paramType: ',paramType) 
  console.log('paramFilter: ',paramFilter)
  console.log('paramEndDay: ',paramEndDay) 
  console.log('paramISOStartDay: ',paramISOStartDay)
  console.log('paramISOEndDay: ',paramISOEndDay)
  
  if (database.db){       
    let query_type = {} 
    let query_filter = {}

    if(paramType.length !=0){
      query_type = {type: {$all: paramType}} 
    }   

    if(paramFilter !=" "){
      query_filter = {$or: 
        [{contents: new RegExp(".*"+paramFilter+".*","gi")}, 
          {title: new RegExp(".*"+paramFilter+".*","gi")}, 
          {nickNm: new RegExp(".*"+paramFilter+".*","gi")}
        ], 
      }; 
    }  
    database.UserModel.findOne({_id: new ObjectId(paramUserId)},function(err,user){ 
      if(err){
        utils.log("EventCalendar 모듈 안에 있는 ShowEventsLis에서 사용자 조회 중 에러 발생: "+ err.message) 
        res.end() 
        return;
      }  
      
      context.isadmin = user.isadmin 

      //밑에서 forEach 돌릴 때, 현재의 Date 값을 가리킴.
      let currentISOdate = GetISODate('0000-01-01') 
      let EventEntriesIndex = 0;
      
      database.EventCalendarModel.find({$and: [{date: {$gte: paramISOStartDay, $lt: paramISOEndDay}}, query_type,query_filter]},
      function(err,results){ 
        if(err){
          utils.log("EventCalendar 모듈 안에 있는 ShowEventsList에서 collection 조회 중 에러 발생: "+ err.message)
        }
        results.forEach(function(items){ 

          let localismine = user._id.toString() == items.userid
          //날짜가 바뀔 때 EventEntries, Events에서 push
          if(!(items.date.toString() == currentISOdate.toString())){  
              currentISOdate = items.date 
              let inputdate = moment(currentISOdate).format("YYYY-MM-DD") 
              context.EventEntries.push({Date: inputdate, Events: [{ eventID: items._id,title : items.title, 
                                  type: items.type, contents: items.contents, adminwrote: items.adminwrote, ismine: localismine}]}) 
              EventEntriesIndex++;
          } 
          //날짜가 안 바뀔 때 Events에서 push
          else{ 
          context.EventEntries[EventEntriesIndex].Events.push({eventID: items._id, title : items.title, 
                                                                type: items.type, contents: items.contents,
                                                                adminwrote: items.adminwrote, ismine: localismine})  
          }
        })//forEach 닫기   
      context.EventEntries.splice(0,1); 
      console.dir(context)
      //Event 별로 잘 들어왔나 테스트 
      context.EventEntries.forEach((items)=> 
        console.dir(items.Events)
      )
      res.json(context);
      res.end();
      return;
      }).sort({date: 1}); 
  })//UserModel.findOne 닫기
  }//if(database.db) 닫기  
  else {  
    utils.log("EventCalendar 모듈 안에 있는 ShowEventsList 수행 중 데이터베이스 연결 실패")
    res.end(); 
    return;
  }      
  };//ShowEventsList 닫기   

//EventCalendar에 이벤트 추가 
const AddEvent = function(req, res) {
  
  console.log('EventCalendar 모듈 안에 있는 AddEvent 호출됨.');  
  const database = req.app.get('database');
  let context = {msg: " "}

  let paramUserId = req.body.userid
  let paramTitle = req.body.title||" " 
  let paramContents = req.body.contents||" " 
  
  console.log('paramUserId: ', paramUserId)
  console.log('paramTitle: ', paramTitle) 
  console.log('paramContents: ', paramContents)

  if(database.db){

    database.EventCalendarModel.findOneAndUpdate({_id: new ObjectId(paramEventId)},{$set: {title: paramTitle, contents: paramContents}}, 
    function(err,result){
      if (err) {
              utils.log("EventCalendar 모듈 안에 있는 EditEvent 안에서 수정할 게시물 조회 중 에러 발생: "+ err.message)
              res.end(); 
              return;
      }    
      if(result == null){
        utils.log("EventCalendar 모듈 안에 있는 EditEvent 안에서 게시물을 조회 할 수 없음") 
        context.msg = "empty" 
        console.log(context.msg) 
        res.json(context) 
        res.end() 
        return 
      }  
      context.msg = "success";  
      console.log(context.msg)
      res.json(context)           
      res.end() 
      return;
    }) 
  } else {  
      utils.log('EventCalendar 모듈 안에 있는 AddEvent 수행 중 데이터베이스 연결 실패');
      res.end(); 
      return;
    } 
}; //AddEvent 닫기

//요청 받은 게시글의 title, contents 수정 
const EditEvent = function(req, res) {
  
  console.log('EventCalendar 모듈 안에 있는 EditEvent 호출됨.');  
  const database = req.app.get('database');
  let context = {msg: " "}

  let paramEventId = req.body.eventid
  let paramTitle = req.body.title||" " 
  let paramContents = req.body.contents||" " 
  
  console.log('paramEventId: ', paramEventId)
  console.log('paramTitle: ', paramTitle) 
  console.log('paramContents: ', paramContents)

  if(database.db){

    database.EventCalendarModel.findOneAndUpdate({_id: new ObjectId(paramEventId)},{$set: {title: paramTitle, contents: paramContents}}, 
    function(err,result){
      if (err) {
              utils.log("EventCalendar 모듈 안에 있는 EditEvent 안에서 수정할 게시물 조회 중 에러 발생: "+ err.message)
              res.end(); 
              return;
      }    
      if(result == null){
        utils.log("EventCalendar 모듈 안에 있는 EditEvent 안에서 게시물을 조회 할 수 없음") 
        context.msg = "empty" 
        console.log(context.msg) 
        res.json(context) 
        res.end() 
        return 
      }  
      context.msg = "success";  
      console.log(context.msg)
      res.json(context)           
      res.end() 
      return;
    }) 
  } else {  
      utils.log('EventCalendar 모듈 안에 있는 EditEvent 수행 중 데이터베이스 연결 실패');
      res.end(); 
      return;
    } 
}; //EditEvent 닫기

//자신이 작성한 일정 혹은 관리자일 경우 선택한 일정 삭제 
const DeleteEvent = function(req, res) {
  
  console.log('EventCalendar 모듈 안에 있는 DeleteEvent 호출됨.');  
  const database = req.app.get('database');
  let context = {msg: " "}

  let paramEventId = req.body.eventid

  console.log('paramEventId: ', paramEventId)

if(database.db){
             
    database.db.collection("eventcalendars").findOneAndDelete({_id: new ObjectId(paramEventId)}, 
    function(err,result){
      if (err) {
              utils.log("EventCalendar 모듈 안에 있는 DeleteEvent 안에서 삭제할 게시물 조회 중 에러 발생: "+ err.message)
              res.end(); 
              return;
      }     
      if(result.value == null){
        utils.log("EventCalendar 모듈 안에 있는 DeleteEvent 안에서 삭제할 게시물을 조회 할 수 없음") 
        context.msg = "empty" 
        res.json(context) 
        res.end() 
        return 
      }
      context.msg = "success";  
      res.json(context)           
      res.end() 
      return;
    })
  } else {  
      utils.log('EventCalendar 모듈 안에 있는 DeleteEvent 수행 중 데이터베이스 연결 실패');
      res.end(); 
      return;
    } 
}; //DeleteEvent 닫기

module.exports.ShowEventsList = ShowEventsList; 
module.exports.AddEvent = AddEvent;
module.exports.EditEvent = EditEvent;
module.exports.DeleteEvent = DeleteEvent;