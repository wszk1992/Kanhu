module.exports = {
	user: {
		username: {type: String, required: true},
		password: {type: String, required: true},
		admin: {type: Boolean, default: false},
	},

	profile: {
		username: {type: String, required: true},
		info: {type: String, default: "Nothing left here"},
		pic: {type: Number, default: 1}
	},

	answer: {
		questionId: String,
		questionTitle: String,
		user: String, 
		date: {type: Date, default: Date.now},
		body: String,
		votes: {type: Number, default: 0},
		vetos: {type: Number, default: 0}
	},

	question: {
		title: String,
		detail: String,
		user: String,
		date: {type: Date, default: Date.now}
	},

	vote: {
		questionId: String,
		answerId: String,
		user: String,
		date: {type: Date, default: Date.now},
		vote: {type: Boolean, default: 0},
		veto: {type: Boolean, default: 0}
	}

	// user_QandA:{
	// 	username: String,
	// 	questions: [{questionId: Number}],
	// 	answers: [{answerId: Number}]
	// }
};