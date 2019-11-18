//sets default present date to the date input
Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

function checkIfDatesAreSet() {
	    if (localStorage.getItem('lastMeasureDate') === null || 
	    localStorage.getItem('firstMeasureDate') === null) {
	    return false;
	} else {
	    return true;
	}
}

//replaves . to , in number
// returns string
function changeNumberDot(number) {
	number = String(number).replace(".", ",");

	return number;
}

function getDateAndTime() {
	var local = new Date();
    var date = local.toJSON().split(".");
    date = date[0].replace("T", "_");
    date = date.slice(0, 16);
    return date.replace(":", "-");
};