class Camera {
    constraints
    onFrame
    ondataload

    constructor(constraints, onFrame, ondataload) {
        this.constraints = constraints;
        this.onFrame = onFrame;
        this.ondataload = ondataload
        try {
            this.get_media_device(constraints).then((stream) => {this.startProcessing(stream)});
        }
        catch (e) {
            console.log(e);
        }
    }

    restart(constraints, onFrame) {
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
            this.ondataload()
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