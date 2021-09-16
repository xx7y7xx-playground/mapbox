const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [103.824, 1.2649],
  zoom: 19,
});

map.on("load", () => {
  map.addSource("data", {
    type: "geojson",
    data: window.geojsonData, // JSON data load from iframe, generated by geojson.io
  });

  let popup = null;

  const renderPopup = (event, features) => {
    if (popup) {
      popup.remove();
    }

    if (features.length === 0) return;

    let title = "";

    // node is above all layer, so when there is a node feature, show it
    const nodeFeature = features.find(({ properties: p }) =>
      p.name.startsWith("node/")
    );
    if (nodeFeature) {
      title = nodeFeature.properties.name;
    } else {
      title = features[0].properties.name;
    }

    popup = new mapboxgl.Popup({
      closeButton: false,
    })
      .setLngLat(event.lngLat.toArray())
      .setHTML(`<div>${title}</div>`)
      .addTo(map);
  };

  map.addLayer({
    id: "way-layer",
    type: "line",
    source: "data",
    filter: ["==", "$type", "LineString"],
    paint: {
      "line-color": "blue",
      "line-opacity": 0.5,
      "line-width": 50,
    },
  });

  map.addLayer({
    id: "node-layer",
    type: "circle",
    source: "data",
    filter: ["==", "$type", "Point"],
    paint: {
      "circle-color": "red",
      "circle-opacity": 0.5,
      "circle-radius": 50,
    },
  });

  map.on("mousemove", (event) => {
    // query all features in these 2 layers and under mouse cursor
    const features = map.queryRenderedFeatures(event.point, {
      layers: ["way-layer", "node-layer"],
    });
    console.log(
      "mousemove",
      features.map(({ properties }) => properties.name)
    );
    renderPopup(event, features);
  });
});