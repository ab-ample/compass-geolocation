
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
]
const select = document.querySelector('#location');
const compassCircle = document.querySelector(".compass-circle");
const myPoint = document.querySelector(".my-point");
const startBtn = document.querySelector(".start-btn");
const isIOS =
    navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
    navigator.userAgent.match(/AppleWebKit/);

let init = () => {
    select.addEventListener("change", (e) => {
        locations.forEach(element => {
            if (element.name === select.value) {
                point = {
                    name: element.name,
                    lat: element.lat,
                    lng: element.lng
                }
            }
        });
        startCompass;
    });

    startBtn.addEventListener("click", startCompass);
    navigator.geolocation.getCurrentPosition(locationHandler);

    if (!isIOS) {
        window.addEventListener("deviceorientationabsolute", handler, true);
    }
}

let startCompass = () => {
    if (isIOS) {
        DeviceOrientationEvent.requestPermission()
            .then((response) => {
                if (response === "granted") {
                    window.addEventListener("deviceorientation", handler, true);
                } else {
                    alert("has to be allowed!");
                }
            })
            .catch(() => alert("not supported"));
    }
}

let handler = (e) => {
    compass = e.webkitCompassHeading || Math.abs(e.alpha - 360);
    compassCircle.style.transform = `translate(-50%, -50%) rotate(${-compass}deg)`;

    // ±15 degree
    if (
        (pointDegree < Math.abs(compass) &&
        pointDegree + 15 > Math.abs(compass)) ||
        pointDegree > Math.abs(compass + 15) ||
        pointDegree < Math.abs(compass)
    ) {
        myPoint.style.opacity = 0;
    } else if (pointDegree) {
        myPoint.style.opacity = 1;
    }
}

let pointDegree;

let locationHandler = (position) => {
    const { latitude, longitude } = position.coords;
    pointDegree = calcDegreeToPoint(latitude, longitude);

    if (pointDegree < 0) {
        pointDegree = pointDegree + 360;
    }
}

let calcDegreeToPoint = (latitude, longitude) => {
    // Qibla geolocation
    // const point = {
    //     lat: 21.422487,
    //     lng: 39.826206
    // };

    alert('going to ' + point.name);

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