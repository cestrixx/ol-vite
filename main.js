import "./style.css";
import { Map, View } from "ol";
import GeoJSON from "ol/format/GeoJSON.js";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { click } from "ol/events/condition.js";
import { Fill, Stroke, Style } from "ol/style.js";
import Select from "ol/interaction/Select.js";

const style = new Style({
  fill: new Fill({
    color: "#eeeeee",
  }),
});

const vector = new VectorLayer({
  source: new VectorSource({
    url: "sigef.geojson",
    format: new GeoJSON(),
  }),
});

const map = new Map({
  target: "map",
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    vector,
  ],
  view: new View({
    projection: "EPSG:4326",
    center: [-48.446889, -21.626667],
    zoom: 12,
  }),
});

const selected = new Style({
  fill: new Fill({
    color: "#eeeeee",
  }),
  stroke: new Stroke({
    color: "rgba(255, 255, 255, 0.7)",
    width: 2,
  }),
});

function selectStyle(feature) {
  const color = feature.get("COLOR") || "#eeeeee";
  selected.getFill().setColor(color);
  return selected;
}

const select = new Select({
  condition: click,
  style: selectStyle,
});

map.addInteraction(select);
select.on("select", function (e) {
  const infoDiv = document.getElementById("feature-info");
  if (e.selected.length > 0) {
    const properties = e.selected[0].getProperties();
    delete properties.geometry;
    let info = "<h3>Detalhes do Feature</h3><ul>";
    for (const key in properties) {
      info += `<li><strong>${key}:</strong> ${properties[key]}</li>`;
    }
    info += "</ul>";
    infoDiv.innerHTML = info;
  } else {
    infoDiv.innerHTML = "";
  }
});
