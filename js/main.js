
// 1. Drachenbrunnen 52.5028217,13.4164882
// 2. Lidl 52.5017831,13.4148336
// 3. U Kottbusser Tor 52.4998934,13.4172549

let locations = [
    {
        name: 'Drachenbrunnen',
        lat: 52.5028217,
        lng: 13.4164882
    },
    {
        name: 'Lidl',
        lat: 52.5017831,
        lng: 13.4148336
    },
    {
        name: 'U Kottbusser Tor',
        lat: 52.4998934,
        lng: 13.4172549
    }
];

let point = locations[0]; // default Lidl
let pointDegree;

const COMPASS_CIRCLE = document.querySelector(".compass-circle");
const MY_POINT = document.querySelector(".my-point");
const START_BTN = document.querySelector(".start-btn");
const SELECT = document.querySelector(".locations");
const isIOS = 
    navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
    navigator.userAgent.match(/AppleWebKit/);

let init = () => {
    START_BTN.addEventListener('click', (event) => {
        init();
        locationPoint(SELECT.value);
        startCompass(); 
    })
    navigator.geolocation.getCurrentPosition(locationHandler);

    if (!isIOS) {
        window.addEventListener("deviceorientationabsolute", handler, true);
    }
}

let locationPoint = (value) => {
    locations.forEach(location => {
        if (location.name === value) {
            point = location;
        }
    });
}

let startCompass = () => {
    if (isIOS) {
        DeviceOrientationEvent.requestPermission()
        .then((response) => {
            if (response === 'granted') {
                window.addEventListener("deviceorientation", handler, true);
            } else {
                alert("has to be allowed!");
            }
        })
        .catch(() => alert('not supported'));
    }
}

let handler = (e) => {
    compass = e.webkitCompassHeading || Math.abs(e.alpha - 360);
    COMPASS_CIRCLE.style.transform = `translate(-50%, -50%) rotate(${-compass}deg)`;

    if (
        (pointDegree < Math.abs(compass) &&
        pointDegree + 15 > Math.abs(compass)) ||
        pointDegree > Math.abs(compass + 15) ||
        pointDegree < Math.abs(compass)
    ) {
        MY_POINT.style.opacity = 0;
    } else if (pointDegree) {
        MY_POINT.style.opacity = 1;
    }
}

let locationHandler = (position) => {
    let { latitude, longitude } = position.coords;
    pointDegree = calcDegreeToPoint(latitude, longitude);

    if (pointDegree < 0) {
        pointDegree = pointDegree + 360;
    }
}

let calcDegreeToPoint = (latitude, longitude) => {
    const phiK = (point.lat * Math.PI) / 180.0;
    const lambdaK = (point.lng * Math.PI) / 180.0;
    const phi = (latitude * Math.PI) / 180.0;
    const lambda = (longitude * Math.PI) / 180.0;
    const psi =
        (180.0 / Math.PI) *
        Math.atan2(
            Math.sin(lambdaK - lambda),
            Math.cos(phi) * Math.tan(phiK) -
            Math.sin(phi) * Math.cos(lambdaK - lambda)
        );
    return Math.round(psi);
}

init();