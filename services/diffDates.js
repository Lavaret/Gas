var _MS_PER_DAY = 1000 * 60 * 60 * 24;
var _MS_PER_MONTH = 1000 * 60 * 60 * 24 * 30;

// calculate difference between dates in utc
function dateDiffUtc(a, b) {
  // Discard the time and time-zone information.
  var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return utc2 - utc1;
}

// calculate difference between dates in days
function dateDiffInDays(a, b) {
  var utcDiff = dateDiffUtc(a, b);

  return Math.floor(utcDiff / _MS_PER_DAY);
}

// calculate difference between dates in days
function dateDiffInMonths(a, b) {
	var utcDiff = dateDiffUtc(a, b);

	return Math.floor(utcDiff / _MS_PER_MONTH);
}

function getCompleteTimeDifference(start, end) {
    var diff = Math.floor(end.getTime() - start.getTime());
    var secs = Math.floor(diff/1000);
    var mins = Math.floor(secs/60);
    var hours = Math.floor(mins/60);
    var days = Math.floor(hours/24);
    var months = Math.floor(days/31);
    var years = Math.floor(months/12);
    months=Math.floor(months%12);
    days = Math.floor(days%31);
    hours = Math.floor(hours%24);
    mins = Math.floor(mins%60);
    secs = Math.floor(secs%60); 
    var message = ""; 
    if(days<=0){
    message += "0 dni";
    }else{
        if(years>0){
        	if (years ==1 ) {
        		message += "1 rok ";
        	} else if ((years > 1 && years < 5) || (years > 20 && years % 10 > 1 || years % 10 < 5)) {
        		message += years + " lata ";
        	} else {
        		message += years + " lat ";
        	}   
        }        
        if(months>0 || years>0){
        	if (months == 1) {
        		message += "1 miesiąc ";
        	} else if (months > 1 && months < 5) {
        		message += months + " miesiące ";
        	} else if (months != 0) {
        		message += months + " miesięcy ";
        	}
        }

        if (days == 1) {
        	message += "1 dzień";
        } else {
        	message += days + " dni"
        }
    }
    return message
}