var config = {
    apiKey: "AIzaSyBCyaprKftVYPXZLUF3EAyZX9GY0F-R1Ds",
    authDomain: "train-schedule-31857.firebaseapp.com",
    databaseURL: "https://train-schedule-31857.firebaseio.com",
    projectId: "train-schedule-31857",
    storageBucket: "train-schedule-31857.appspot.com",
    messagingSenderId: "961156530342"
};
firebase.initializeApp(config);


var database = firebase.database();
var timeFormat = "HH:mm";

function pullFromDataBase() {
    database.ref().on("child_added", function (snapshot) {
        // storing the snapshot.val() in a variable for convenience
        var snapshotVal = snapshot.val();
        var dbFirstTime = snapshotVal.firstTrainTime
        var dbConvertedTime = moment(dbFirstTime, timeFormat);
        dbConvertedTime = dbConvertedTime.diff(moment(), "minutes")
        var dbFrequency = snapshotVal.frequency
        var dbMinutesAway = dbFrequency - Math.abs(dbConvertedTime % dbFrequency)
        var dbArrivalTime = moment().add(dbMinutesAway, "minutes");
        $("#trainName").append("<br>" + snapshotVal.name);
        $("#trainDestination").append("<br>" + snapshotVal.destination);
        $("#trainFrequency").append("<br>" + dbFrequency);
        $("#nextArrival").append("<br>" + dbArrivalTime.format('HH:mm'));
        if (dbMinutesAway === 1) {
            $("#minutesAway").append("<br>" + "arriving now")
        } else {
            $("#minutesAway").append("<br>" + dbMinutesAway)
        }
    });
}

pullFromDataBase()

$(document).on("click", "#submitBTN", function () {
    event.preventDefault();
    var newName = $("#enterName").val();
    var newDestination = $("#enterDestination").val();
    var newFirstTime = $("#enterFirstTime").val();
    var newFrequency = $("#enterFrequency").val();
    var convertedTime = moment(newFirstTime, timeFormat);
    convertedTime = convertedTime.diff(moment(), "minutes")
    var minutesAway = newFrequency - Math.abs(convertedTime % newFrequency)
    var arrivalTime = moment().add(minutesAway, "minutes");
    console.log(convertedTime)
    console.log(minutesAway)
    console.log(newName);
    console.log(arrivalTime);
    database.ref().push({
        name: newName,
        destination: newDestination,
        firstTrainTime: newFirstTime,
        frequency: newFrequency,
    });
})

