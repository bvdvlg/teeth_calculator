const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
let scale = 0
let width = 0
let diag = 0


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
        if (!landmarks)
            landmarks = [];
        for (let el in Array(477).keys())
            landmarks.push(new Landmark(0, 0));
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
    let face_type = 'мезоморфный';
    if (width/(diag_sum) < 0.53)
        face_type = "долихоморфный";
    if (width/(diag_sum) > 0.59)
        face_type = "брахиоморфный";
    let seventh_dist = width/2.3;
    let first_to_seven = diag/2.33;
    let sum_fourteen_vch = diag_sum/2.25;
    let sum_fourteen_nch = sum_fourteen_vch/1.06;
    let sum_sixth_front = sum_fourteen_vch/2.45;
    let klyk_size = sum_sixth_front/6;
    let rezets_size = klyk_size*1.1;
    let later_rezets = rezets_size*0.9;
    result.innerHTML = `Ширина лица ${width}`+
        `<br>Диагональ лица ${diag}` +
        `<br>Сумма диагоналей ${diag_sum}` +
        `<br>Индекс лица ${width/(diag_sum)} (Тип лица ${face_type})`+
        `<br>Расстояние между 7-ми зубами ${seventh_dist}`+
        `<br>Расстояние от 1 до 7 зуба ${first_to_seven}`+
        `<br>Сумма 14-ти зубов верхней челюсти ${sum_fourteen_vch}`+
        `<br>Сумма 14-ти зубов нижней челюсти ${sum_fourteen_nch}`+
        `<br>Сумма 6-ти передних зубов ${sum_sixth_front}`+
        `<br>Размеры клыка ${klyk_size}`+
        `<br>Размеры резца ${rezets_size}`+
        `<br>Латеральный резец ${later_rezets}`;
    width = 0;
    diag = 0;
}

function mainRecognizer(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
            for (let landmark in landmarks){
                landmarks[landmark].x = landmarks[landmark].x*canvasElement.width;
                landmarks[landmark].y = landmarks[landmark].y*canvasElement.height
            }
            let face = new Face(landmarks, scale);
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

function fixScaling(results) {
    let landmarks = results.multiFaceLandmarks[0];
    for (let landmark in landmarks){
        landmarks[landmark].x = landmarks[landmark].x*canvasElement.width;
        landmarks[landmark].y = landmarks[landmark].y*canvasElement.height
    }
    let new_face = new Face(landmarks)
    scale = new_face.scale;
    width = new_face.get_width();
}