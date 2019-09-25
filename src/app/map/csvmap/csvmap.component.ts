import { Component,OnInit } from '@angular/core';
import { loadModules } from 'esri-loader';
import { loadCss } from 'esri-loader';

const options = { version: '3.28' };
loadCss('3.28');
var map;
var lastState = null;
var drawTool;
var t;



@Component({
  selector: 'app-csvmap',
  templateUrl: './csvmap.component.html',
  styleUrls: ['./csvmap.component.scss']
})
export class CsvmapComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  initPolygonDraw() {

    loadModules(['esri', 'esri/map', "esri/graphic", "esri/toolbars/draw", "esri/InfoTemplate", "esri/geometry/Point", "esri/layers/GraphicsLayer", "esri/dijit/HomeButton", "dojo/domReady!"], options)
      .then(([esri, Map, Graphic, Draw, InfoTemplate, Point, GraphicsLayer, HomeButton]) => {
        drawTool.activate(Draw.POLYLINE);
      });
  }

  t = loadModules(['esri', 'esri/map', "esri/graphic", "esri/toolbars/draw", "esri/InfoTemplate", "esri/geometry/Point", "esri/layers/GraphicsLayer", "esri/dijit/HomeButton", "dojo/domReady!"], options)
    .then(([esri, Map, Graphic, Draw, InfoTemplate, Point, GraphicsLayer, HomeButton]) => {

      var mapOptions = { basemap: "gray", center: [-32, 50], zoom: 2, minZoom: 2, showLabels: true };

      map = new Map("map", mapOptions);
      var $ctrl = this;
      var clusterGraphicLayer = new GraphicsLayer();

      clusterGraphicLayer.on("mouse-out", function (evt) {
        map.infoWindow.hide();
      });

      clusterGraphicLayer.on("mouse-move", function (evt) {
        if (evt.graphic.attributes["well_id"] === lastState) {
          return;
        }
        setTimeout(function () {
          map.infoWindow.setContent("<span> Well Id: </span>" + evt.graphic.attributes["well_id"]);
          map.infoWindow.show(evt.screenPoint, map.getInfoWindowAnchor(evt.screenPoint));
          lastState = evt.graphic.attributes["well_id"];
        }, 500);
      });

      var home = new HomeButton({
        map: map
      }, "HomeButton");
      home.startup();

      map.on('update-start', function () {
        map.infoWindow.hide();
      });

      map.on('update-end', function () {
        map.infoWindow.hide();
      });

      map.on('load', function () {
        map.infoWindow.resize(140, 100);
        drawTool = new Draw(map, { showTooltips: false });
        drawTool.on("draw-complete", lineDrawComplete);
        addTempWells();
      });

      function newTest() {
        alert("newTest");
      }

      function lineDrawComplete(evt) {
        var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
          new esri.Color([230, 0, 0]), 2);

        var graphic = new Graphic(evt.geometry, lineSymbol);
        //graphic.setAttributes({ "Id": "SearchPolygon" });
        map.graphics.add(graphic);
        drawTool.deactivate();
      }

      function addTempWells() {
        var coords = "-97.1889877319336,41.404991149902344|-96.16008758544922,41.242210388183594|-96.3565902709961,41.32706832885742|-96.16243743896484,41.23767852783203|-96.92559814453125,41.2364387512207|-96.56385040283203,41.39698028564453|-96.21444702148438,41.19139862060547|-96.53263092041016,41.22065353393555|-96.48572540283203,41.31929016113281|-95.93869018554688,41.256919860839844|-96.96942901611328,41.26399230957031|-96.90753936767578,41.30618667602539|-96.12430572509766,41.51446533203125|-96.52416226697778,41.2215419192841|-97.3665771484375,41.58295822143555|-96.1287612915039,41.514625549316406|-96.73880004882812,41.367183685302734|-96.1142349243164,41.51516342163086|-96.88011169433594,41.33152770996094|-96.12430572509766,41.51446533203125|-96.5434341430664,41.388031005859375|-97.1886215209961,41.4046516418457|-97.13431549072266,41.46533966064453|-96.48090362548828,41.32283020019531|-96.99754333496094,41.240013122558594|-97.22606658935547,41.33150100708008|-96.48931121826172,41.31841278076172|-96.9460220336914,41.30796813964844|-97.19664764404297,41.806358337402344|-96.84882354736328,41.12033462524414|-96.9694595336914,41.26401901245117|-96.22657775878906,41.414737701416016|-96.59678649902344,41.286766052246094|-96.11808013916016,41.466705322265625|-96.4715347290039,41.2647819519043|-96.80814361572266,41.25300598144531|-96.5241928100586,41.22145080566406|-96.4857406616211,41.315650939941406|-95.92562103271484,41.22509002685547|-96.40669250488281,41.60562515258789|-95.93153381347656,41.254150390625|-97.23212432861328,41.32514190673828|-96.93746948242188,41.31425857543945|-96.596435546875,41.28669357299805|-96.34772491455078,41.12400817871094|-97.35600280761719,41.639827728271484|-97.19655431360074,41.7557769271308|-96.51534271240234,41.573726654052734|-96.70658874511719,41.700679779052734|-96.62182548649012,41.0589891754272|-96.28575134277344,41.42395782470703|-96.88373565673828,41.3370361328125|-96.02981567382812,41.21152877807617|-96.04740142822266,41.485435485839844|-97.0129623413086,41.185001373291016|-96.88438415527344,41.72641372680664|-97.09552764892578,41.1310043325612|-96.62240273918655,41.0591206036714";
        var coordArray = coords.split("|");
        for (var x = 0; x < coordArray.length; x++) {
          var wellX = coordArray[x].split(",")[0];
          var wellY = coordArray[x].split(",")[1];
          addWellGraphic(wellX, wellY, x);
        }

        map.addLayer(clusterGraphicLayer);

        var extGraphics = esri.graphicsExtent(clusterGraphicLayer.graphics);
        map.setExtent(extGraphics)
      }

      function addWellGraphic(x, y, wellId) {
        var wellSymbol = new esri.symbol.SimpleMarkerSymbol(
          esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
          15,
          new esri.symbol.SimpleLineSymbol(
            esri.symbol.SimpleLineSymbol.STYLE_NULL,
            new esri.Color([0, 0, 0, 1]),
            1
          ), new esri.Color([255, 69, 0, 1]));

        var wellPnt = new Point();
        wellPnt.setLatitude(y);
        wellPnt.setLongitude(x);

        var attr = { "well_id": "693428" + wellId };
        var wellGraphic = new Graphic(wellPnt, wellSymbol, attr);
        // wellGraphic.setSymbol(wellSymbol);
        clusterGraphicLayer.add(wellGraphic);

      }

    })
    .catch(err => {
      // handle any script or module loading errors
      console.error(err);
    });



}
