function ShowFileSelector() {
    navigator.camera.getPicture(uploadPhoto,null,{sourceType:1,
        quality:60,
        destinationType: Camera.DestinationType.DATA_URL,
        correctOrientation: true
    });
}
function uploadPhoto(data)
{
   $('#UploadedImageSource').val(data);
}