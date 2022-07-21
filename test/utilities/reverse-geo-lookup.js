const fetch = require('node-fetch');

module.exports = async (lat,lon) => {
    const urlStr = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    const locationJson = await (await fetch(urlStr)).json();
    // console.log (JSON.stringify(locationJson, null , 4));
    return locationJson;
}

