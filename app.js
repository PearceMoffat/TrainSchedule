var config = {
  apiKey: "AIzaSyBAD9iAQ89v6xwSdOW7HtBeHfd2olY8oYE",
  authDomain: "homework7-568d3.firebaseapp.com",
  databaseURL: "https://homework7-568d3.firebaseio.com",
  projectId: "homework7-568d3",
  storageBucket: "homework7-568d3.appspot.com",
  messagingSenderId: "544702545302"
};

firebase.initializeApp(config);

var database = firebase.database();

var trains = database.ref("/trains");

database.ref("/trains").on("value", function(snapshot) {

	$("#trainData").empty();
	snapshot.forEach(function(snapshotChild) {

		var firstTrainTime = snapshotChild.val().firstTrainTime;
		var frequency = snapshotChild.val().frequency;

		//Use moment for calculations
		var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
		var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
		var remainder = diffTime % frequency;
		var minutesAway = frequency - remainder;
		var arrival = moment().add(minutesAway, "minutes");
		var arrivalFormatted = moment(arrival).format("hh:mm A");
		
		var trainObj = { 
			name: snapshotChild.val().name,
			destination: snapshotChild.val().destination,
			frequency: snapshotChild.val().frequency,
			arrival: arrivalFormatted,
			minutesAway: minutesAway
		};
		updateTable(trainObj);
	});
});

function updateTable(val){
	$("#trainData").append("<tr><td>" + 
		val.name + "</td><td>" + val.destination + "</td><td>" + 
		val.frequency + "</td><td>" + val.arrival + "</td><td>" + 
		val.minutesAway + "</td>");
}

$("#btnSubmit").on("click", function(event) {

	event.preventDefault();
	
	var name = $("#name").val().trim();
	var destination = $("#destination").val().trim();
	var frequency = $("#frequency").val().trim();
	var firstTrainTime = $("#firstTrain").val().trim();

	database.ref("/trains").push({
		name: name,
		destination: destination,
		frequency: frequency,
		firstTrainTime: firstTrainTime
	});

	$("#name, #destination, #firstTrain, #frequency").val("");
});