module.exports = {
	user:{
		username: {type: String, required: true},
		password: {type: String, required: true}
	},

	answer:{
		answerId: Number,
		questionId: Number,
		user: String, 
		date: {type: Date, default: Date.now},
		body: String, 
		meta: {
			votes: Number,
			vetos: Number
		}
	},

	question:{
		questionId: Number,
		title: String,
		user: String,
		body: String,
		date: {type: Date, default: Date.now},
		answers: [{answerId: Number}]
	},

	user_QandA:{
		name: String,
		questions: [{questionId: Number}],
		answers: [{answerId: Number}]
	}
};