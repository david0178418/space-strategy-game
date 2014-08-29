module.exports = {
	ownedBy: 'neutral',
	ownable: true,
	
	initComponentOwnable: function(props) {
		this.ownedBy = props.ownedBy || this.ownedBy;
	},
	
	isOwnedBy: function(team) {
		return team === this.ownedBy;
	},
};