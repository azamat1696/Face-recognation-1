const video = document.getElementById('video');

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),

]).then(startCamera)

 function startCamera() {
    navigator.mediaDevices.getUserMedia({
       video: {}
   }).then((mediaStream) => {
       video.srcObject = mediaStream
   }).catch((err) => {
       console.error(err.name)
   })
}



video.addEventListener("play", () => {
    // for  following action with canvas
    const canvas = faceapi.createCanvasFromMedia(video);
    // append canvas to body
    document.body.append(canvas)
    canvas.getContext("2d").clearRect(0,0, canvas.width, canvas.height);
    const boxSize = {
        width: video.width,
        height: video.height
    }
    // face detection box with same dimensions
   faceapi.matchDimensions(canvas,boxSize);
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(
            video,
            new faceapi.TinyFaceDetectorOptions()
            ).withFaceLandmarks().withFaceExpressions();


        canvas.getContext("2d").clearRect(0,0, canvas.width, canvas.height);
        const  resizedDetection = faceapi.resizeResults(detections,boxSize)
        // draw canvas box
        faceapi.draw.drawDetections(canvas,resizedDetection)
        // drow land marks
        faceapi.draw.drawFaceLandmarks(canvas,resizedDetection)
        // drow Face expressions
        faceapi.draw.drawFaceExpressions(canvas,resizedDetection)
       // console.log(resizedDetection)
    },100)
})

