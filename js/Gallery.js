window.onload = initialize;
var file;
var storageRef;
var imagesFBRef;

function initialize() {
  //This will get all the events and ID to upload a image to firebase
  file = document.getElementById("file");
  file.addEventListener("change", uploadimagetofirebase, false);
  storageRef = firebase.storage().ref();
  imagesFBRef = firebase.database().ref().child("imagesFB");
  //This will call the method to show image to firebase
  showimagesfromfirebase();
}
function showimagesfromfirebase() {
  imagesFBRef.on("value", function (snapshot) {
    var data = snapshot.val();
    var result = "";
    for (var key in data) {
      result += '<img width="250" height="250"  class="img-thumbnail" src="' + data[key].url + '"/>';
    }
    document.getElementById("firebaseimages").innerHTML = result;
  })
}
function uploadimagetofirebase() {
  var imagetoupload = file.files[0];
  var uploadTask = storageRef.child('imagenes/' + imagetoupload.name).put(imagetoupload);
  document.getElementById("progress").className = "";

  // Register three observers:
  // 1. 'state_changed' observer, called any time the state changes
  // 2. Error observer, called on failure
  // 3. Completion observer, called on successful completion
  uploadTask.on('state_changed', function (snapshot) {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progressbarvar = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    document.getElementById("progress-bar-id").style.width = progressbarvar + "%"
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
    }
  }, function (error) {
    // Handle unsuccessful uploads
    alert("There was an error uploading the image");
  }, function () {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    var downloadURL = uploadTask.snapshot.downloadURL;

    createnodeinfirebase(imagetoupload.name, downloadURL);
    document.getElementById("progress").className = "hidden";
  });
}
function createnodeinfirebase(imagename, downloadURL) {
  imagesFBRef.push({ name: imagename, url: downloadURL });
}
