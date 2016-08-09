module.exports = {
	user:{
		username: {type: String, required: true},
		password: {type: String, required: true},
		admin: {type: Boolean, default: false}
	},

	answer:{
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
		title: String,
		detail: String,
		user: String,
		date: {type: Date, default: Date.now},
		answers: [{answerId: Number}]
	},

	user_QandA:{
		username: String,
		questions: [{questionId: Number}],
		answers: [{answerId: Number}]
	}
};