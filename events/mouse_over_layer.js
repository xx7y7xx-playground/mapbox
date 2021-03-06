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

  map
    .addLayer({
      id: "way-layer",
      type: "line",
      source: "data",
      filter: ["==", "$type", "LineString"],
      paint: {
        "line-color": "blue",
        "line-opacity": 0.5,
        "line-width": 50,
      },
    })
    .on("mouseenter", "way-layer", (event) => {
      console.log(
        "mouseenter way-layer",
        event.features.map(({ properties }) => properties.name)
      );
    })
    .on("mouseleave", "way-layer", () => {
      console.log("mouseleave way-layer");
    });

  map
    .addLayer({
      id: "node-layer",
      type: "circle",
      source: "data",
      filter: ["==", "$type", "Point"],
      paint: {
        "circle-color": "red",
        "circle-opacity": 0.5,
        "circle-radius": 50,
      },
    })
    .on("mouseenter", "node-layer", (event) => {
      console.log(
        "mouseenter node-layer",
        event.features.map(({ properties }) => properties.name)
      );
    })
    .on("mouseleave", "node-layer", () => {
      console.log("mouseleave node-layer");
    });
});
