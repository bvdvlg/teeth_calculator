class Camera {
    constraints
    onFrame
    oncameraload

    constructor(constraints, onFrame, oncameraload) {
        this.constraints = constraints;
        this.onFrame = onFrame;
        this.oncameraload = oncameraload;
        try {
            this.get_media_device(constraints).then((stream) => {this.startProcessing(stream)});
        }
        catch (e) {
            console.log(e);
        }
    }

    restart(constraints, onFrame) {
        const video = document.querySelector('video');
        this.clear();
        this.constraints = constraints;
        this.onFrame = onFrame;
        try {
            this.get_media_device(constraints).then((stream) => {this.startProcessing(stream)});
        }
        catch (e) {
            console.log(e);
        }
    }

    startProcessing(stream) {
        const video = document.querySelector('video');
        window.stream = stream; // make variable available to browser console
        console.log(stream)
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            video.play();
            this.oncameraload()
            this.requestFrame(video);
        }
    }

    requestFrame(video) {
        window.requestAnimationFrame(() => {
            this.threatFrame(video)
        })
    }

    threatFrame(video) {
        if (!video.paused)
            this.onFrame().then(() => {this.requestFrame(video)});
    }

    async get_media_device(constraints) {
        navigator.mediaDevices && navigator.mediaDevices.getUserMedia || alert("No navigator.mediaDevices.getUserMedia exists.");
        return navigator.mediaDevices.getUserMedia(constraints);
    }

    clear () {
        if (window.stream) {
            window.stream.getTracks().forEach(function (track) {
                track.stop();
                console.log("Abort stream")
            });
        }
    }
}

function empty(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.restore();
}