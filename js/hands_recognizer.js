class Landmark {
    x
    y

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static dist(land1, land2) {
        return ((land1.x-land2.x)**2+(land1.y-land2.y)**2)**(1/2)
    }
}

class FaceLandmarks {
    landmarks

    constructor(landmarks) {
        if (!landmarks) {
            landmarks = [];
            for (let el in Array(477).keys())
                landmarks.push(new Landmark(0, 0));
        }
        this.landmarks = {};
        for (let key in landmarks) {
            this.landmarks[key] = new Landmark(landmarks[key].x, landmarks[key].y);
        }
    }

    get_el(key) {
        return this.landmarks[key]
    }
}

class Face {
    face_landmarks
    scale
    static defined_dots = {
        "left_ear": 227,
        "right_ear": 447,
        "up": 10,
        "down": 164,
        "left_irish_ls": 471,
        "left_irish_rs": 469,
        "right_irish_ls": 476,
        "right_irish_rs": 474
    }

    constructor(landmarks, scale=NaN) {
        this.face_landmarks = new FaceLandmarks(landmarks);
        if (isNaN(scale))
            this.scale = this.get_scale();
        else
            this.scale = scale;
    }

    get_el(num) {
        return this.face_landmarks.get_el(Face.defined_dots[num]);
    }

    get_scale() {
        const irish_pxs = (this.dist_px("left_irish_ls", "left_irish_rs")+this.dist_px("right_irish_ls", "right_irish_rs"))/2
        return 0.0117/irish_pxs
    }

    dist_px(item1, item2) {
        return Landmark.dist(this.get_el(item1), this.get_el(item2))
    }

    get_width() {
        return Landmark.dist(this.get_el("left_ear"), this.get_el("right_ear"))*this.scale*1000;
    }

    get_diag() {
        let first = Landmark.dist(this.get_el("left_ear"), this.get_el("down"));
        let second = Landmark.dist(this.get_el("right_ear"), this.get_el("down"));
        return Math.max(first, second)*this.scale*1000
    }
}

function get_result() {
    console.log(width, diag);
    let result = document.getElementById("res");
    let diag_sum = diag*2;
    let face_type = '??????????????????????';
    if (width/(diag_sum) < 0.53)
        face_type = "??????????????????????????";
    if (width/(diag_sum) > 0.59)
        face_type = "??????????????????????????";
    let seventh_dist = width/2.3;
    let first_to_seven = diag/2.33;
    let sum_fourteen_vch = diag_sum/2.25;
    let sum_fourteen_nch = sum_fourteen_vch/1.06;
    let sum_sixth_front = sum_fourteen_vch/2.45;
    let klyk_size = sum_sixth_front/6;
    let rezets_size = klyk_size*1.1;
    let later_rezets = rezets_size*0.9;
    result.innerHTML = `???????????? ???????? ${width}`+
        `<br>?????????????????? ???????? ${diag}` +
        `<br>?????????? ???????????????????? ${diag_sum}` +
        `<br>???????????? ???????? ${width/(diag_sum)} (?????? ???????? ${face_type})`+
        `<br>???????????????????? ?????????? 7-???? ???????????? ${seventh_dist}`+
        `<br>???????????????????? ???? 1 ???? 7 ???????? ${first_to_seven}`+
        `<br>?????????? 14-???? ?????????? ?????????????? ?????????????? ${sum_fourteen_vch}`+
        `<br>?????????? 14-???? ?????????? ???????????? ?????????????? ${sum_fourteen_nch}`+
        `<br>?????????? 6-???? ???????????????? ?????????? ${sum_sixth_front}`+
        `<br>?????????????? ?????????? ${klyk_size}`+
        `<br>?????????????? ?????????? ${rezets_size}`+
        `<br>?????????????????????? ?????????? ${later_rezets}`;
    width = 0;
    diag = 0;
}

function mainRecognizer(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiFaceLandmarks.length) {
        for (const landmarks of results.multiFaceLandmarks) {
            for (let landmark in landmarks){
                landmarks[landmark].x = landmarks[landmark].x*canvasElement.width;
                landmarks[landmark].y = landmarks[landmark].y*canvasElement.height
            }
            let face = new Face(landmarks, scale);
            if (diag)
                diag = Math.max(face.get_diag(), diag);
            for (let num in Face.defined_dots) {
                let land = face.get_el(num);
                canvasCtx.beginPath();
                canvasCtx.arc(land.x, land.y, 3, 2 * Math.PI, false);
                canvasCtx.fill();
            }
        }
    }
    canvasCtx.fill();
    canvasCtx.restore();

}

function rulletRecognizer(results) {
        canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
    Xpos_up = canvasElement.width*8/12
    Ypos_up = canvasElement.height*3/12
    Xpos_down = canvasElement.width*9/12
    Ypos_down = canvasElement.height*7/12
    canvasCtx.rect(Xpos_up, Ypos_up, Xpos_down-Xpos_up, 2);
    canvasCtx.rect(Xpos_up, Ypos_down, Xpos_down-Xpos_up, 2);
    canvasCtx.fillStyle = "yellow";
    canvasCtx.fill();
    canvasCtx.restore();
}

function threatProfilePhoto(results) {
    if (results.multiFaceLandmarks.length) {
        console.log(photoProfileContext);
        width = canvasElement.width/4
        height = canvasElement.height/4
        photoProfileContext.clearRect(0, 0, width, height);
        photoProfileContext.drawImage(
        results.image, 0, 0, width, height);
        photoProfileContext.restore();
        profile_inserted = true;
        for (const landmarks of results.multiFaceLandmarks) {
            for (let landmark in landmarks){
                landmarks[landmark].x = landmarks[landmark].x*canvasElement.width;
                landmarks[landmark].y = landmarks[landmark].y*canvasElement.height
            }
            profile_inserted = new Face(landmarks, scale);
        }
    }
}

function threatAnfasPhoto(results) {
    if (results.multiFaceLandmarks.length) {
        width = canvasElement.width/4
        height = canvasElement.height/4
        photoAnfasContext.clearRect(0, 0, width, height);
        photoAnfasContext.drawImage(
        results.image, 0, 0, width, height);
        photoAnfasContext.restore();
        for (const landmarks of results.multiFaceLandmarks) {
            for (let landmark in landmarks){
                landmarks[landmark].x = landmarks[landmark].x*canvasElement.width;
                landmarks[landmark].y = landmarks[landmark].y*canvasElement.height
            }
            anfas_inserted = new Face(landmarks, scale);
        }
    }
}

function fixScaling(results) {
    if (results.multiFaceLandmarks.length) {
        let landmarks = results.multiFaceLandmarks[0];
        for (let landmark in landmarks) {
            landmarks[landmark].x = landmarks[landmark].x * canvasElement.width;
            landmarks[landmark].y = landmarks[landmark].y * canvasElement.height
        }
        let new_face = new Face(landmarks)
        scale = new_face.scale;
        width = new_face.get_width();
        diag = new_face.get_diag();
    }
}

function researchRecognizer(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiFaceLandmarks.length) {
        for (const landmarks of results.multiFaceLandmarks) {
            for (let landmark in landmarks){
                landmarks[landmark].x = landmarks[landmark].x*canvasElement.width;
                landmarks[landmark].y = landmarks[landmark].y*canvasElement.height
            }
            let face = new Face(landmarks, scale);
            faceMeasures.push(face);
            if (diag)
                diag = Math.max(face.get_diag(), diag);
            for (let num in Face.defined_dots) {
                let land = face.get_el(num);
                canvasCtx.beginPath();
                canvasCtx.arc(land.x, land.y, 3, 2 * Math.PI, false);
                canvasCtx.fill();
            }
        }
    }
    canvasCtx.restore();
}

function scalingRecognizer(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiFaceLandmarks.length) {
        for (const landmarks of results.multiFaceLandmarks) {
            for (let landmark in landmarks){
                landmarks[landmark].x = landmarks[landmark].x*canvasElement.width;
                landmarks[landmark].y = landmarks[landmark].y*canvasElement.height
            }
            let new_face = new Face(landmarks)
            scalingMeasures.push(new_face);
            for (let num in Face.defined_dots) {
                let land = new_face.get_el(num);
                canvasCtx.beginPath();
                canvasCtx.arc(land.x, land.y, 3, 2 * Math.PI, false);
                canvasCtx.fill();
            }
        }
    }
    canvasCtx.restore();
}