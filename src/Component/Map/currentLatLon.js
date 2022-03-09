

const currentLatLon = () => {
    if (navigator.geolocation) {
        return new Promise((resolve, reject) => {
            const location = {};
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    location.latitude = position.coords.latitude;
                    location.longitude = position.coords.longitude;
                    if (Object.keys(location).length !== 0 ) {
                        resolve(location);
                    }
                    else {
                        reject()
                    }
                },
                function (e) {
                    console.error(e);
                },
                { 
                    maximumAge: 15000,
                    timeout: 30000,
                    enableHighAccuracy: false
                }
            );

        })
    }
    else {
        alert('위치 정보가 지원되지 않습니다.')
    }
}

export default currentLatLon;
