/** class which contains all parameters operations, must be included after diffDates.js needed for calculate passed months and days
	I don't really know how to do it in other way */

class Parameters {
	constructor(date, value) {
		this.newDate = date;
		this.newValue = value;
	}

	//get average usage of m3 
	getAverageM3() {
	  var days = this.getDays();
	  var m3 = this.getM3();

	  var averageM3 = days > 0 ? m3/days : m3;

	  return Math.round(averageM3 * 100) / 100;
	}

	getAverageKwh() {
	  var days = this.getDays();
	  var kwh = this.getKWH();

	  var averageKwh = days > 0 ? kwh/days : kwh;

	  return Math.round(averageKwh * 100) / 100;
	}

	getFullPrice() {
	  //get full gas price
	  var gasPrice = this.getFullGasPrice();

	  //get subscription price
	  var subscription = this.getSubscriptionPrice();

	  //get price for time distribution
	  var timeDistributionPrice = this.getPriceForTimeDistribution();

	  //get price for time distribution
	  var volDistributionPrice = this.getPriceForVolDistribution();

	  var amount = gasPrice + subscription + timeDistributionPrice + volDistributionPrice;

	  var vatAmount = amount + amount * 0.23;

	  return Math.round(vatAmount * 100) / 100;
	}

	getPriceForVolDistribution() {
	  var distributionVariable = parseFloat(localStorage.getItem("distributionVariable"));
	  var kwh = this.getKWH();

	  return distributionVariable * kwh;
	}

	getPriceForTimeDistribution() {
	  var distributionConstant = parseFloat(localStorage.getItem("distributionConstant"));
	  var days = this.getDays();

	  return distributionConstant / 30 * days;
	}

	getSubscriptionPrice() {
	  var subscription = parseFloat(localStorage.getItem("subscribtionPrice"));
	  var months = this.getMonths();

	  return subscription * months;
	}

	getFullGasPrice() {
	  var gasPrice = parseFloat(localStorage.getItem("gasPrice"));
	  var kwh = this.getKWH();
	  return gasPrice * kwh;
	}

	//counts used kwh
	getKWH() {
	  var m3 = this.getM3();
	  var cr = this.getConversionRate();

	  var kwh = m3 * cr;

	  return kwh;
	}

	//counts used m3
	getM3() {
	  //value from new measurement
	  var newMeasurement = parseInt(this.newValue);
	  //value of the last measurement from local storage
	  var oldMeasurement = parseInt(localStorage.getItem("measureValue"));

	  return newMeasurement - oldMeasurement;
	}

	getConversionRate() {
		var cr = parseFloat(localStorage.getItem('conversionRate'));
		return cr;
	}

	getMonths() {
	  var dates = this.getDates();
	  var months = dateDiffInMonths(dates.old, dates.new);

	  return months;
	}

	getDays() {
	  var dates = this.getDates();
	  var days = dateDiffInDays(dates.old, dates.new);

	  return days;
	}

	// days between new measure date and previous measure date
	getDates() {
	  //date from new measurement
	  var newDate = new Date(this.newDate);
	  //date from local storage
	  var oldDate = this.getLastMeasureDate();

	  return {new: newDate, old:oldDate};
	}

	getFormattedDates() {
		//date from new measurement
		var presentDate = (new Date(this.newDate)).toISOString().substring(0, 10);

		var lastMeasureDate = this.getLastMeasureDate();
		//date from local storage
        var previousDate = ((lastMeasureDate).toISOString().substring(0, 10));

        return {new: presentDate, old:previousDate};
	}

	//get new and old measurements
	getMeasuremetns() {
		var newMeasurement = this.newValue;
		var oldMeasurement = localStorage.getItem('measureValue');

		return {new: newMeasurement, old: oldMeasurement};
	}

	getLastMeasureDate() {
		var firstMeasureDate = localStorage.getItem('firstMeasureDate');
		var lastMeasureDate = localStorage.getItem('lastMeasureDate');

		if (lastMeasureDate === null) {
			var oldDate = firstMeasureDate === null ? new Date(this.newDate) : new Date(firstMeasureDate);
		} else {
			var oldDate = new Date(lastMeasureDate);
		}

	    return oldDate;
	}

}