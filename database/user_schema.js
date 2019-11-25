var Schema = {};
var crypto = require('crypto');  


Schema.createSchema = function(mongoose) {
	 //mongoose.set('useCreateIndex', true);
	// 스키마 정의. '로그인사용자 신분목록' 참고.
	// password를 hashed_password로 변경, 각 칼럼에 default 속성 모두 추가, salt 속성 추가
	UserSchema = mongoose.Schema({
      loginId: {type: String, 'default': '', required: true}, // 한양인 ID. 로그인 사용자 정보 조회에서 가져옴.  
      nickNm: {type: String, 'default': 'no name', /*unique: true*/},// 앱 내에서 표시될 이름 
      salt: {type: String}, //임시 비밀 번호 암호화를 위해 필요
      hashed_password: {type: String, 'default':''},// 임시 비밀 번호   
	  isadmin: {type: Boolean, default: false}, //관리지 여부
	  isverified: {type: Boolean, default: false}, //가입 후 이메일 인증을 통하여 계정 활성화 하는 버튼
	  DM: [{
		sendername: {type: String, 'default': 'no name'},
		senderid: {type: mongoose.Schema.ObjectId, ref: 'users'},
		title: {type: String, trim:true, 'default': ' '},
		contents: {type: String, trim:true, 'default': ' '}, 
		created_at: {type: Date, 'default': Date.now},
	  }], 
    });
    
	// password를 virtual 메소드로 정의 : MongoDB에 저장되지 않는 가상 속성임. 
    // 특정 속성을 지정하고 set, get 메소드를 정의함. 한양대에서는 비밀번호를 제공하지 않으므로, 한양대 API 연결 시 삭제 요망
	UserSchema
	  .virtual('password')
	  .set(function(password) {
	    this._password = password;
	    this.salt = this.makeSalt();
	    this.hashed_password = this.encryptPassword(password);
	    console.log('virtual password의 set 호출됨 : ' + this.hashed_password);
	  })
	  .get(function() {
           console.log('virtual password의 get 호출됨.');
           return this._password;
      });
	
	// 스키마에 모델 인스턴스에서 사용할 수 있는 메소드 추가
	// 비밀번호 암호화 메소드
	UserSchema.method('encryptPassword', function(plainText, inSalt) {
		if (inSalt) {
			return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
		} else {
			return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
		}
	});
	
	// salt 값 만들기 메소드
	UserSchema.method('makeSalt', function() {
		return Math.round((new Date().valueOf() * Math.random())) + '';
	});
	
	// 인증 메소드 - 입력된 비밀번호와 비교 (true/false 리턴)
	UserSchema.method('authenticate', function(plainText, inSalt, hashed_password) {
		if (inSalt) {
			console.log('authenticate 호출됨 : %s -> %s : %s', plainText, this.encryptPassword(plainText, inSalt), hashed_password);
			return this.encryptPassword(plainText, inSalt) === hashed_password;
		} else {
			console.log('authenticate 호출됨 : %s -> %s : %s', plainText, this.encryptPassword(plainText), this.hashed_password);
			return this.encryptPassword(plainText) === this.hashed_password;
		} 
    });
    
	// 값이 유효한지 확인하는 함수 정의
	var validatePresenceOf = function(value) {
		return value && value.length;
	};
		
	// 저장 시의 트리거 함수 정의 (password 필드가 유효하지 않으면 에러 발생)
	UserSchema.pre('save', function(next) {
		if (!this.isNew) return next();

		if (!validatePresenceOf(this.password)) {
			next(new Error('유효하지 않은 password 필드입니다.'));
		} else {
			next();
		}
	});
	
	/* 입력된 칼럼의 값이 있는지 확인
	UserSchema.path('email').validate(function (email) {
		if (!this.checkValidation()) return true;
		return email.length;
	}, 'email 칼럼의 값이 없습니다.'); */
    
        UserSchema.path('hashed_password').validate(function(hashed_password){
        return hashed_password.length;
    }, 'hashed_password 칼럼의 값이 없습니다.'); 
    
	//모델 객체에세 사용 가능한 메소드 정의  
	UserSchema.statics = {
		// ID로 글 찾기
		load: function(id, callback) {
			this.findOne({_id: id})
				.exec(callback);
		}, 
        findOneBynickNm: function(paramnickNm,callback){
			this.findOne({nickNm: paramnickNm})
			.exec(callback);
		}     
    }

	/*
    UserSchema.static('findByloginId', function(loginId, callback){ //로그인 아이디 기반 검색.
        return this.find({loginId: loginId}, callback);
    });
    
    UserSchema.static('findBynickNm', function(nickNm, callback){ //닉네임 기반 find
        return this.find({nickNm: nickNm}, callback);
    });  
    
    UserSchema.static('findOneBynickNm', function(paramnickNm, callback){ //닉네임 기반 findOne
        return this.findOne({nickNm: paramnickNm}, callback).exec(callback);;
    }); 
    
    // 스키마에 static으로 findAll 메소드 추가
	UserSchema.static('findAll', function(callback) {
		return this.find({}, callback);
	});

    UserSchema.static('load', function(options, callback) {
		options.select = options.select || 'name';
	    this.findOne(options.criteria)
	      .select(options.select)
	      .exec(callback);
	});
*/
	// 모델을 위한 스키마 등록
	mongoose.model('User', UserSchema);
    
	console.log('UserSchema 정의함.');
	
	return UserSchema;  
};
// module.exports에 UserSchema 객체 직접 할당
module.exports = Schema;

