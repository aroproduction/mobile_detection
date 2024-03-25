const URL = "https://teachablemachine.withgoogle.com/models/VabV1TVNY/";

let model, webcam, labelContainer, maxPredictions;

async function init() {
    document.getElementById("loader").style.display = "block";
    document.getElementById("stop-button").style.display = "block"; // show the stop button
    document.getElementById("start-button").disabled = true; // disable the start button
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true;
    webcam = new tmImage.Webcam(300, 300, flip);
    if (webcam && webcam.playing) {
        return;
    }
    await webcam.setup();
    await webcam.play();
    document.getElementById("loader").style.display = "none";
    window.requestAnimationFrame(loop);

    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

function stop() {
    webcam.stop();
    document.getElementById("webcam-container").innerHTML = '';
    labelContainer.innerHTML = '';
    document.getElementById("stop-button").style.display = "none"; // hide the stop button
    document.getElementById("start-button").disabled = false; // enable the start button
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ": " + String(prediction[i].probability.toFixed(2)*100) + '%';
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}
