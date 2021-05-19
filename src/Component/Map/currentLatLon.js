
export let location = {}

function currentLatLon() {

    navigator.geolocation.getCurrentPosition(
         function(position) {
            location.latitude = position.coords.latitude;
            location.longitude = position.coords.longitude;
        },
    );
}

export default currentLatLon;
