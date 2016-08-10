module.exports = {
	user:{
		username: {type: String, required: true},
		password: {type: String, required: true},
		admin: {type: Boolean, default: false}
	},

	answer:{
		questionId: String,
		questionTitle: String,
		user: String, 
		date: {type: Date, default: Date.now},
		body: String,
		meta: {
			votes: {type: Number, default: 0},
			vetos: {type: Number, default: 0}
		}
	},

	question:{
		title: String,
		detail: String,
		user: String,
		date: {type: Date, default: Date.now}
	},

	user_QandA:{
		username: String,
		questions: [{questionId: Number}],
		answers: [{answerId: Number}]
	}
};