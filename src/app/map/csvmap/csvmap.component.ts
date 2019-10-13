import { Component, OnInit, OnChanges } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MessageService } from "../../services/data-service.service";
import { loadModules } from 'esri-loader';
import { loadCss } from 'esri-loader';
const options = { version: '3.28' };
loadCss('3.28');
var map;
var lastState = null;
var drawTool;
var home;
var selectedWells;
var lastWell;
var selectedWellsGraphicLayer;
var wellLinesGraphicLayer;
var welllistarry;
var wellSelectionState = false;
@Component({
  selector: 'app-csvmap',
  templateUrl: './csvmap.component.html',
  styleUrls: ['./csvmap.component.scss']
  // host:{'window:beforeunload':'localStorage.clear()'}
})
export class CsvmapComponent implements OnInit, OnChanges {
  wellList = [];
  Wells = [];
  message: any;
  // Wells = [
  //   //17109238520000,17019218710000
  //   { SeqNo: 1, Name: 'Well - A', UWI: 17109238520000 },
  //   { SeqNo: 2, Name: 'Well - B', UWI: 17019218710000 }
  //   // { SeqNo: 3, Name: 'Well - C' },
  //   // { SeqNo: 4, Name: 'Well - D' },
  //   // { SeqNo: 5, Name: 'Well - E' },
  //   // { SeqNo: 6, Name: 'Well - F' },
  //   // { SeqNo: 7, Name: 'Well - G' },
  //   // { SeqNo: 8, Name: 'Well - H' },
  //   // { SeqNo: 9, Name: 'Well - I' }
  // ];
  constructor(
    private messageService: MessageService
  ) { }
  ngOnInit() {
    this.messageService.currentmessageService.subscribe(msg => this.message = msg);
    //this.messageService.sendMessage('Message from Home Component to App Component!');
    welllistarry = this.message;
    if (this.message != "") {
      this.Wells = this.message;
    }
    console.log(welllistarry);
  }
  ngOnChanges() {
    //   $('[data-toggle="tooltip"]').tooltip();
    if (this.message != "") {
      this.Wells = this.message;
      console.log(this.Wells)
    }
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.Wells, event.previousIndex, event.currentIndex);
    for (var i = 0; i < this.Wells.length; i++) {
      this.Wells[i].SeqNo = i + 1;
    }
    welllistarry = this.Wells;
    this.wellList = this.Wells;
    console.log(this.wellList);
    this.messageService.sendnewMessage(this.wellList)
    document.getElementById("btnUpdateWellOrder").click();
  }
  panelupdate() {
    if (this.message != "" || this.message.length == 0) {
      this.Wells = this.message;
      console.log(this.Wells)
      for (var i = 0; i < this.Wells.length; i++) {
        this.Wells[i].SeqNo = i + 1;
      }
    }
  }
  deletewell(item) {
    this.Wells.splice((item.SeqNo) - 1, 1);
    for (var i = 0; i < this.Wells.length; i++) {
      this.Wells[i].SeqNo = i + 1;
    }
    welllistarry = this.Wells;
    this.wellList = this.Wells;
    console.log(this.wellList);
    this.messageService.sendMessage(this.wellList);
    //localStorage.setItem('welllist', JSON.stringify(welllistarry));
    // if(localStorage.getItem('savedcs') !=='true'){
    //   localStorage.setItem('welllist', JSON.stringify(welllistarry));
    //   }
    //   else{
    //     selectedWellsGraphicLayer.clear();
    //     wellLinesGraphicLayer.clear();
    //   }
    document.getElementById("btnUpdateWellOrder").click();
  }
  initWellSelection() {
    document.getElementById("wellmappane").style.display = "block";
    //map.setMapCursor("crosshair");    
    map.setMapCursor("url(assets/images/cursors/pincursor.cur) 0 100,auto");

    wellSelectionState = true;
    selectedWells = 0;
  }
  removeAllWells() {
    selectedWellsGraphicLayer.clear();
    wellLinesGraphicLayer.clear();
  }
  t = loadModules(['esri', 'esri/map', "esri/geometry/geometryEngine", "esri/geometry/Polygon", "esri/geometry/webMercatorUtils", "esri/graphic", "esri/symbols/Font", "esri/symbols/TextSymbol", "esri/SpatialReference", "esri/geometry/Polyline", "esri/toolbars/draw", "esri/InfoTemplate", "esri/geometry/Point", "esri/layers/GraphicsLayer", "esri/dijit/HomeButton", "dojo/domReady!"], options)
    .then(([esri, Map, geometryEngine, Polygon, webMercatorUtils, Graphic, Font, TextSymbol, SpatialReference, Polyline, Draw, InfoTemplate, Point, GraphicsLayer, HomeButton]) => {
      var mapOptions = { basemap: "gray", center: [-32, 50], zoom: 2, minZoom: 2, showLabels: true, logo: false };
      map = new Map("map", mapOptions);
      var $ctrl = this;
      var clusterGraphicLayer = new GraphicsLayer();
      selectedWellsGraphicLayer = new GraphicsLayer();
      wellLinesGraphicLayer = new GraphicsLayer();
      var wellSymbol = new esri.symbol.SimpleMarkerSymbol(
        esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
        8,
        new esri.symbol.SimpleLineSymbol(
          esri.symbol.SimpleLineSymbol.STYLE_NULL,
          new esri.Color([0, 0, 0, 1]),
          1
        ), new esri.Color([0, 49, 240, 1]));
      var selectedWellSymbol = new esri.symbol.SimpleMarkerSymbol(
        esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
        15,
        new esri.symbol.SimpleLineSymbol(
          esri.symbol.SimpleLineSymbol.STYLE_NULL,
          new esri.Color([0, 0, 0, 1]),
          1
        ), new esri.Color([119, 147, 60, 1]));
      clusterGraphicLayer.on("mouse-out", function (evt) {
        // evt.graphic.symbol.setSize(10);
        // evt.graphic.draw();
        map.infoWindow.hide();
      });
      clusterGraphicLayer.on("mouse-over", function (evt) {
        if (evt.graphic.attributes["uwi"] === lastState) {
          return;
        }
        setTimeout(function () {
          // map.infoWindow.setFeatures([evt.graphic]);
          map.infoWindow.setContent("<span>UWI : </span>" + evt.graphic.attributes["uwi"]);
          map.infoWindow.show(evt.screenPoint, map.getInfoWindowAnchor(evt.screenPoint));
          // evt.graphic.symbol.setSize(20);
          // evt.graphic.draw();
          lastState = evt.graphic.attributes["uwi"];
        }, 500);
      })
      clusterGraphicLayer.on("mouse-down", function (evt) {
        // drawTool.deactivate();
      });
      clusterGraphicLayer.on("mouse-up", function (evt) {
        //  
        // drawTool.activate(Draw.POLYLINE);
        //  map.graphics.add(selectedWellGraphic);
        if (wellSelectionState == false)
          return;
        // drawTool.finishDrawing();
        var uwi = evt.graphic.attributes["uwi"];
        var WellGeomery = evt.graphic.geometry;
        addWellToSelection(uwi, WellGeomery);


        selectedWells = selectedWells + 1;
        // lastWell = evt.graphic;
        var mapwellobj = { SeqNo: selectedWells, Name: 'Well - ' + selectedWells, UWI: uwi }
        this.Wells.push(mapwellobj);
        welllistarry = this.Wells;
        this.wellList = this.Wells;
        //this.messageService.sendMessage(this.wellList);
        this.messageService.sendnewMessage(this.wellList)

        //{SeqNo: 1, Name: 'Well - A', UWI: 17109238520000 },
        // drawTool.activate(Draw.POLYLINE);
      }.bind(this));
      if (!home) {
        home = new HomeButton({
          map: map
        }, "HomeButton");
        home.startup();
      }
      map.on('update-start', function () {
        map.infoWindow.hide();
      });
      map.on('update-end', function () {
        map.infoWindow.hide();
      });
      // Map key down event, used to close pop up by escape button
      map.on('key-down', function (key) { if (key.keyCode == 27) { exitWellSelection(); } });
      map.on('load', function () {
        // angular.element("#map_container").addClass("pin-cursor-ie");        
        map.infoWindow.resize(170, 100);
        drawTool = new Draw(map, { showTooltips: false });
        var fillSymbol =
          new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH,
            new esri.Color([0, 0, 255]), 2);
        drawTool.setLineSymbol(fillSymbol);
        drawTool.on("draw-complete", lineDrawComplete);
        esri.bundle.toolbars.draw.addPolyline = "Add a new tree to the map";
        map.addLayer(clusterGraphicLayer);
        map.addLayer(selectedWellsGraphicLayer);
        map.addLayer(wellLinesGraphicLayer);
        addTempWells();
      });
      function newTest() {
        alert("newTest");
      }
      function exitWellSelection() {
        map.setMapCursor("default");
        wellSelectionState = false;
        selectedWells = 0;
      }
      function lineDrawComplete(evt) {
        console.log('finish');
        return;
        var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
          new esri.Color([230, 0, 0]), 2);
        var graphic = new Graphic(evt.geometry, lineSymbol);
        //graphic.setAttributes({ "Id": "SearchPolygon" });
        map.graphics.add(graphic);
        drawTool.deactivate();
        document.getElementById("map_container").style.cursor = "crosshair";
      }
      function addTempWells() {
        // var coords = "-97.1889877319336,41.404991149902344|-96.16008758544922,41.242210388183594|-96.3565902709961,41.32706832885742|-96.16243743896484,41.23767852783203|-96.92559814453125,41.2364387512207|-96.56385040283203,41.39698028564453|-96.21444702148438,41.19139862060547|-96.53263092041016,41.22065353393555|-96.48572540283203,41.31929016113281|-95.93869018554688,41.256919860839844|-96.96942901611328,41.26399230957031|-96.90753936767578,41.30618667602539|-96.12430572509766,41.51446533203125|-96.52416226697778,41.2215419192841|-97.3665771484375,41.58295822143555|-96.1287612915039,41.514625549316406|-96.73880004882812,41.367183685302734|-96.1142349243164,41.51516342163086|-96.88011169433594,41.33152770996094|-96.12430572509766,41.51446533203125|-96.5434341430664,41.388031005859375|-97.1886215209961,41.4046516418457|-97.13431549072266,41.46533966064453|-96.48090362548828,41.32283020019531|-96.99754333496094,41.240013122558594|-97.22606658935547,41.33150100708008|-96.48931121826172,41.31841278076172|-96.9460220336914,41.30796813964844|-97.19664764404297,41.806358337402344|-96.84882354736328,41.12033462524414|-96.9694595336914,41.26401901245117|-96.22657775878906,41.414737701416016|-96.59678649902344,41.286766052246094|-96.11808013916016,41.466705322265625|-96.4715347290039,41.2647819519043|-96.80814361572266,41.25300598144531|-96.5241928100586,41.22145080566406|-96.4857406616211,41.315650939941406|-95.92562103271484,41.22509002685547|-96.40669250488281,41.60562515258789|-95.93153381347656,41.254150390625|-97.23212432861328,41.32514190673828|-96.93746948242188,41.31425857543945|-96.596435546875,41.28669357299805|-96.34772491455078,41.12400817871094|-97.35600280761719,41.639827728271484|-97.19655431360074,41.7557769271308|-96.51534271240234,41.573726654052734|-96.70658874511719,41.700679779052734|-96.62182548649012,41.0589891754272|-96.28575134277344,41.42395782470703|-96.88373565673828,41.3370361328125|-96.02981567382812,41.21152877807617|-96.04740142822266,41.485435485839844|-97.0129623413086,41.185001373291016|-96.88438415527344,41.72641372680664|-97.09552764892578,41.1310043325612|-96.62240273918655,41.0591206036714";
        // var coords = "17019217390100;9096805;-93.22126007080078,30.10624885559082|17019218710000;2719763;-93.1078109741211,30.300495147705078|17051208550000;2018058;-90.06391143798828,29.584245681762695|17045210940100;9100354;-91.62109375,30.044252395629883|17109238520000;3778073;-90.49919128417969,29.08637237548828|17109234640000;356226;-90.4990005493164,29.084651947021484|17101200530000;2063087;-91.39640045166016,29.558433532714844|17101203790200;9096971;-91.67896270751953,29.72359848022461|17099208090000;686710;-91.88422393798828,30.145030975341797|17099214770000;598478;-91.95549774169922,30.201261520385742|60811402600200;7113657;-90.53577423095703,27.321502685546875|17019218610000;2718659;-93.65716552734375,30.07685089111328|17711408160000;122745;-91.30036163330078,28.60344886779785|42149324740000;935244;-96.859130859375,30.009201049804688";
        var coords = "17724406670000;wid;-93.22126007080078,30.80624885559082|60817401147000;wid;-93.1078109741211,30.300495147705078|17705001440000;wid;-90.06391143798828,29.584245681762695|17708000080000;wid;-91.62109375,30.044252395629883|17709407760100;wid;-90.49919128417969,29.08637237548828|60816402180000;wid;-90.4990005493164,29.084651947021484|17719405657100;wid;-91.39640045166016,29.558433532714844|17715408180000;wid;-91.67896270751953,29.72359848022461|60811400910000;wid;-95.88422393798828,30.145030975341797|17705001460000;wid;-91.95549774169922,30.201261520385742|17717000150000;wid;-90.53577423095703,27.321502685546875|17075007880000;wid;-94.65716552734375,30.07685089111328|17709000950000;wid;-91.30036163330078,28.60344886779785|17709005880000;wid;-96.859130859375,30.009201049804688|60811401440100;wid;-93.32126007080078,31.20624885559082|17709000960000;wid;-94.16391143798828,29.634245681762695|17709004350000;wid;-90.69919128417969,30.15637237548828|17709004380000;wid;-93.46640045166016,29.988433532714844|42165328710000;wid;-91.87896270751953,30.92359848022461|60817400970100;wid;-92.93109375,30.444252395629883";
        var coordArray = coords.split("|");
        for (var x = 0; x < coordArray.length; x++) {
          var uwi = coordArray[x].split(";")[0];
          var wellId = coordArray[x].split(";")[1];
          var wellX = coordArray[x].split(";")[2].split(",")[0];
          var wellY = coordArray[x].split(";")[2].split(",")[1];
          addWellGraphic(wellX, wellY, uwi);
        }
        var extGraphics = esri.graphicsExtent(clusterGraphicLayer.graphics);
        var extent1 = webMercatorUtils.geographicToWebMercator(extGraphics);
        // $ctrl.map.setExtent(extent1.offset(-10, 0), true);
        var polygonGeometry = Polygon.fromExtent(extent1);
        polygonGeometry = geometryEngine.offset(polygonGeometry, -20, 'kilometers', 'square');
        var polygonSymbol = new esri.symbol.SimpleLineSymbol(
          esri.symbol.SimpleLineSymbol.STYLE_SOLID,
          new esri.Color([249, 0, 0, 2]),
          1
        );
        var graphic = new Graphic(polygonGeometry, polygonSymbol);
        graphic.setAttributes({ "Id": "SearchPolygon" });
        if (map.graphics) {
          map.graphics.clear();
          map.graphics.add(graphic);
        }
        var extGeometry = geometryEngine.offset(polygonGeometry, -100, 'kilometers', 'square');
        map.setExtent(extGeometry.getExtent());
      }
      function GetLastWell() {
        // var mapwellobj = { SeqNo: selectedWells, Name: 'Well - ' + selectedWells, UWI: uwi }
        var lastWellGraphic = null;
        var graphicCnt = selectedWellsGraphicLayer.graphics.length;
        var lastWellIndex = 0;
        for (var j = 0; j < graphicCnt; j++) {
          var graphic = selectedWellsGraphicLayer.graphics[j];
          if (graphic.attributes != undefined && graphic.attributes["seq"] != undefined) {
            if (Number(graphic.attributes["seq"] > lastWellIndex)) {
              lastWellIndex = Number(graphic.attributes["seq"]);
              lastWellGraphic = graphic;
            }
          }
        }
        return lastWellGraphic;
      }
      function addWellToSelection(uwi, WellGeomery) {
        if (selectedWellsGraphicLayer.graphics.length > 0) {
          var lastWellGraphic = GetLastWell();
          if (lastWellGraphic != null) {
            lastWell = lastWellGraphic;
            selectedWells = Number(lastWellGraphic.attributes["seq"]);
          }
        }
        // evt.graphic.geometry
        var attr = { "uwi": uwi, "seq": selectedWells + 1 };
        var selectedWellGraphic = new Graphic(WellGeomery, selectedWellSymbol, attr);
        selectedWellsGraphicLayer.add(selectedWellGraphic);
        // well order label
        var font = new Font("16px", Font.STYLE_NORMAL, Font.VARIANT_NORMAL);
        var textSymbol = new TextSymbol("Well " + (Number(selectedWells) + 1),
          font, new esri.Color([255, 255, 255]));
        textSymbol.setAlign(TextSymbol.ALIGN_START);
        textSymbol.setOffset(4, 4);
        textSymbol.setHaloColor(new esri.Color([89, 89, 89]));
        textSymbol.setHaloSize(4);
        // textSymbol.setAngle(45);
        var labelPointGraphic = new Graphic(WellGeomery, textSymbol);
        selectedWellsGraphicLayer.add(labelPointGraphic);
        if (selectedWells > 0) {
          var cLine = new Polyline(new SpatialReference({ wkid: 4326 }));
          cLine.addPath([new Point(lastWell.geometry.x, lastWell.geometry.y), new Point(WellGeomery.x, WellGeomery.y)]);
          var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
            new esri.Color([119, 147, 60]), 2);
          var attrLine = { "start_well_id": lastWell.attributes["uwi"], "end_well_id": uwi };
          // var graphic = new Graphic(cLine, lineSymbol);
          var wellLineGraphic = new Graphic(cLine, lineSymbol, attrLine);
          wellLinesGraphicLayer.add(wellLineGraphic);
          //graphic.setAttributes({ "Id": "SearchPolygon" });
          // map.graphics.add(graphic);
        }
      }
      document.getElementById("btnSelectAllWells").onclick = function () {
        selectAllWells();
        document.getElementById("wellmappane").style.display = "none";
        document.getElementById("map_container").style.cursor = "crosshair";
        console.log(welllistarry)
        //updateWellsOrder(JSON.parse(localStorage.getItem('welllist')));
        updateWellsOrder(welllistarry);
        //console.log(JSON.parse(localStorage.getItem('welllist')))
        // updateWellsOrder(JSON.parse(localStorage.getItem('welllist')));
      }
      document.getElementById("wellpanelupdate").onclick = function () {
        this.panelupdate();
      }.bind(this)
      document.getElementById("btnUpdateWellOrder").onclick = function () {
        //console.log(JSON.parse(localStorage.getItem('welllist')))
        console.log(welllistarry)
        this.messageService.currentmessageService.subscribe(msg => this.message = msg);
        console.log(this.message);
        updateWellsOrder(this.message);
        //updateWellsOrder(JSON.parse(localStorage.getItem('welllist')));
      }.bind(this)
      function updateWellsOrder(WellList) {
        console.log(WellList);
        //  WellList = this.Wells
        selectedWellsGraphicLayer.clear();
        wellLinesGraphicLayer.clear();
        for (var x = 0; x < WellList.length; x++) {
          var uwi = WellList[x].UWI;
          var graphic = getWellgraphic(uwi);
          selectedWells = x;
          addWellToSelection(uwi, graphic.geometry);
          // lastWell = graphic;
        }
      }
      function selectAllWells() {
        selectedWellsGraphicLayer.clear();
        wellLinesGraphicLayer.clear();
        // var mapwellobj = { SeqNo: selectedWells, Name: 'Well - ' + selectedWells, UWI: uwi }
        var mapwelldat = [];
        var graphicCnt = clusterGraphicLayer.graphics.length
        for (var j = 0; j < graphicCnt; j++) {
          var graphic = clusterGraphicLayer.graphics[j];
          selectedWells = j;
          //sending to listview
          var mapwellobj = { SeqNo: selectedWells + 1, Name: 'Well - ' + selectedWells + 1, UWI: graphic.attributes["uwi"] }
          mapwelldat.push(mapwellobj);
          // this.Wells.push(mapwellobj);
          // console.log(this.Wells)
          var welllistarry: any = mapwellobj;
          //localStorage.setItem('welllist', JSON.stringify(welllistarry));
          if (graphic.attributes["uwi"] != undefined) {
            addWellToSelection(graphic.attributes["uwi"], graphic.geometry);
          }
          // lastWell = graphic;
        }
        //Wells = mapwelldat;
        welllistarry = mapwelldat;
        this.wellList = welllistarry;
        console.log(this.wellList)
        //localStorage.setItem('welllist', JSON.stringify(mapwelldat));
      }
      function getWellgraphic(uwi) {
        var graphicCnt = clusterGraphicLayer.graphics.length
        for (var j = 0; j < graphicCnt; j++) {
          var graphic = clusterGraphicLayer.graphics[j];
          if (graphic.attributes["uwi"] != undefined) {
            if (graphic.attributes["uwi"] == uwi) {
              return graphic;
            }
          }
        }
      }
      function addWellGraphic(x, y, uwi) {
        var wellPnt = new Point();
        wellPnt.setLatitude(y);
        wellPnt.setLongitude(x);
        var attr = { "uwi": uwi };
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
