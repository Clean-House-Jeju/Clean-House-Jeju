function currentLatLon() {
    const location = {};
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                location.latitude = position.coords.latitude;
                location.longitude = position.coords.longitude;
            },
            function (e) {
                console.error(e)
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    }
    else {
        alert('위치 정보가 지원되지 않습니다.')
    }
    return location;
}

export default currentLatLon;