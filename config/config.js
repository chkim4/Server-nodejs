
/*
 * 설정. 에러 처리 포함
 */

module.exports = {
	server_port: 3000,
	db_url: 'mongodb://localhost:27017/local',
	db_schemas: [
        {file:'./user_schema', collection:'users', schemaName:'UserSchema', modelName:'UserModel'}
        ,{file:'./post_schema', collection:'communities', schemaName:'PostSchema', modelName:'PostModel'}  
        ,{file:'./rateclass_schema', collection:'rateclasses', schemaName:'RateClassSchema', modelName:'RateClassModel'} 
        ,{file:'./timetable_schema', collection:'timetables', schemaName:'TimetableSchema', modelName:'TimetableModel'} 
        ,{file:'./Report_schema', collection:'reports', schemaName:'ReportSchema', modelName:'ReportModel'} 
        ,{file:'./BulletinBoardsList_schema', collection:'BulletinBoardsList', schemaName:'BulletinBoardsListSchema', modelName:'BulletinBoardsListModel'} 
        ,{file:'./Board1_schema', collection:'Board1', schemaName:'Board1Schema', modelName:'Board1Model'} 
        ,{file:'./Board2_schema', collection:'Board2', schemaName:'Board2Schema', modelName:'Board2Model'}  
        ,{file: './CourseEvaluation_schema', collection: 'CourseEvaluation', schemaName: 'CourseEvaluationSchema', modelName: 'CourseEvaluationModel'} 
        ,{file: './Professor_schema', collection: 'Professor', schemaName: 'ProfessorSchema', modelName: 'ProfessorModel'}
        ,{file: './Notification_schema', collection: 'Notification', schemaName: 'NotificationSchema', modelName: 'NotificationModel'}        
        
        ],
	route_info: [
        //user 혹은 인증과 관련된 패스들
         {file:'./user', path:'/process/checknickNm', method:'checknickNm', type:'post'} 
        ,{file:'./user', path:'/process/getuserid', method:'getuserid', type:'post'}
        ,{file:'./user', path:'/process/SendDM', method:'SendDM', type:'post'} 
        ,{file:'./user', path:'/process/ShowUserNameList', method:'ShowUserNameList', type:'post'} 
        ,{file:'./user', path:'/process/DeleteDM', method:'DeleteDM', type:'post'}
        
        //community(게시판)와 관련된 패스 들 
        ,{file:'./post', path:'/process/addpost', method:'addpost', type:'post'} 
        ,{file:'./post', path:'/process/showpost', method:'showpost', type:'post'} 
        ,{file:'./post', path:'/process/community', method:'listpost', type:'post'}
        ,{file:'./post', path:'/process/checkeditablepost', method:'checkeditablepost', type:'post'}
        ,{file:'./post', path:'/process/editpost', method:'editpost', type:'post'} 
        ,{file:'./post', path:'/process/deletepost', method:'deletepost', type:'post'} 
        
        
        //rateclass(강의평가)와 관련된 패스들 
        ,{file:'./rateclass', path:'/process/addpost_rateclass', method:'addpost_rateclass', type:'post'} 
        ,{file:'./rateclass', path:'/process/showpost_rateclass/:id', method:'showpost_rateclass', type:'get'}
        ,{file:'./rateclass', path:'/process/rateclass', method:'listpost_rateclass', type:'get'}  
        ,{file:'./rateclass', path:'/process/rateclass', method:'listpost_rateclass', type:'post'}
        ,{file:'./rateclass', path:'/process/editpost_rateclass/:id', method:'editpost_rateclass', type:'get'}
        ,{file:'./rateclass', path:'/process/saveeditedpost_rateclass/:id', method:'saveeditedpost_rateclass', type:'post'} 
        ,{file:'./rateclass', path:'/process/deletepost_rateclass/:id', method:'deletepost_rateclass', type:'get'} 
        ,{file:'./rateclass', path:'/process/addcomment_rateclass', method:'addcomment_rateclass', type:'post'} 
        ,{file:'./rateclass', path:'/process/deletecomment_rateclass', method:'deletecomment_rateclass', type:'post'}   
        
        //timetable(시간표)과 관련된 패스들  
        ,{file:'./timetable', path:'/process/checkdefaulttimetable', method:'checkdefaulttimetable', type:'post'}
        ,{file:'./timetable', path:'/process/addtimetable', method:'addtimetable', type:'post'}
        ,{file:'./timetable', path:'/process/showtimetable', method:'showtimetable', type:'post'} 
        ,{file:'./timetable', path:'/process/gettimetablelist', method:'gettimetablelist', type:'post'}
        ,{file:'./timetable', path:'/process/switchisdefaultview', method:'switchisdefaultview', type:'post'}
        ,{file:'./timetable', path:'/process/renametimetable', method:'renametimetable', type:'post'} 
        ,{file:'./timetable', path:'/process/deletetimetable', method:'deletetimetable', type:'post'} 
        ,{file:'./timetable', path:'/process/addcourse', method:'addcourse', type:'post'} 
        ,{file:'./timetable', path:'/process/editcourse', method:'editcourse', type:'post'} 
        ,{file:'./timetable', path:'/process/deletecourse', method:'deletecourse', type:'post'}  
        
        //BulluetinBoards와 관련된 패스들
        ,{file:'./BulletinBoards', path:'/process/ShowBulletinBoardsList', method:'ShowBulletinBoardsList', type:'post'}
        ,{file:'./BulletinBoards', path:'/process/AddReport', method:'AddReport', type:'post'}
        ,{file:'./BulletinBoards', path:'/process/ShowBulletinBoard', method:'ShowBulletinBoard', type:'post'} 
        ,{file:'./BulletinBoards', path:'/process/AddEditEntry', method:'AddEditEntry', type:'post'}
        ,{file:'./BulletinBoards', path:'/process/DeleteEntry', method:'DeleteEntry', type:'post'}
        ,{file:'./BulletinBoards', path:'/process/IncreLikeEntry', method:'IncreLikeEntry', type:'post'} 
        ,{file:'./BulletinBoards', path:'/process/DecreLikeEntry', method:'DecreLikeEntry', type:'post'}
        ,{file:'./BulletinBoards', path:'/process/ShowComments', method:'ShowComments', type:'post'}
        ,{file:'./BulletinBoards', path:'/process/AddComment', method:'AddComment', type:'post'}
        ,{file:'./BulletinBoards', path:'/process/EditComment', method:'EditComment', type:'post'}
        ,{file:'./BulletinBoards', path:'/process/DeleteComment', method:'DeleteComment', type:'post'} 
        ,{file:'./BulletinBoards', path:'/process/IncreLikeComment', method:'IncreLikeComment', type:'post'}
        ,{file:'./BulletinBoards', path:'/process/DecreLikeComment', method:'DecreLikeComment', type:'post'} 

        //CourseEvaluation과 관련된 패스들 
        ,{file:'./CourseEvaluation', path:'/process/ShowCoursesList', method:'ShowCoursesList', type:'post'}
        ,{file:'./CourseEvaluation', path:'/process/ShowCommentsList', method:'ShowCommentsList', type:'post'}
        ,{file:'./CourseEvaluation', path:'/process/AddCourseEvaluationComment', method:'AddCourseEvaluationComment', type:'post'}
        ,{file:'./CourseEvaluation', path:'/process/EditCourseEvaluationComment', method:'EditCourseEvaluationComment', type:'post'}
        ,{file:'./CourseEvaluation', path:'/process/DeleteCourseEvaluationComment', method:'DeleteCourseEvaluationComment', type:'post'}
        ,{file:'./CourseEvaluation', path:'/process/IncreLikeCourseEvaluationComment', method:'IncreLikeCourseEvaluationComment', type:'post'}
        ,{file:'./CourseEvaluation', path:'/process/DecreLikeCourseEvaluationComment', method:'DecreLikeCourseEvaluationComment', type: 'post'}
        ,{file:'./CourseEvaluation', path:'/process/ShowProfessorProfile', method:'ShowProfessorProfile', type:'post'} 
        
        //Notification과 관련된 패스들 
        ,{file:'./Notification', path:'/process/CrawlNotificationData', method:'CrawlNotificationData', type:'post'}
],      
};  

