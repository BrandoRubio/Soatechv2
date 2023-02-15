import { Component, OnInit } from '@angular/core';
import { DbService } from '../services/db.service';
import { HttpService } from '../services/http.service';
import { AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Chart, ChartType, registerables } from 'chart.js';
import { Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';
const { LocalNotifications } = Plugins;
const { SplashScreen } = Plugins;
//import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  @ViewChild('lineCanvasTemp') private lineCanvasTemp: ElementRef;
  @ViewChild('lineCanvasConductivity') private lineCanvasConductivity: ElementRef;
  @ViewChild('lineCanvasJSN') private lineCanvasJSN: ElementRef;
  @ViewChild('lineCanvasJSND') private lineCanvasJSND: ElementRef;
  @ViewChild('lineCanvasOxygen') private lineCanvasOxygen: ElementRef;
  @ViewChild('lineCanvasYL') private lineCanvasYL: ElementRef;
  @ViewChild('lineCanvasDS18') private lineCanvasDS18: ElementRef;
  @ViewChild('lineCanvasPh') private lineCanvasPh: ElementRef;
  @ViewChild('lineCanvasTurb') private lineCanvasTurb: ElementRef;
  @ViewChild('lineCanvasGrillosTemp') private lineCanvasGrillosTemp: ElementRef;
  @ViewChild('lineCanvasGrillosHum') private lineCanvasGrillosHum: ElementRef;
  @ViewChild('lineCanvasCO2') private lineCanvasCO2: ElementRef;
  @ViewChild('lineCanvasLUM') private lineCanvasLUM: ElementRef;
  
  devices: any[] = []
  deviceSelected = ""
  ipDeviceSelected = ""
  firstTime = true
  firstTimeDev = true
  intervalo
  typeChart: ChartType = 'line'
  lineChartTemp: any;
  lineChartGrillosTemp: any;
  lineChartGrillosHum: any;
  lineChartCO2: any;
  lineChartLUM: any;
  lineChartConductivity: any;
  lineChartJSN: any;
  lineChartJSND: any;
  lineChartYL: any;
  lineChartDS18: any;
  lineChartTurb: any;
  lineChartOxygen: any;
  lineChartPh: any;
  updating = false
  mode
  sensors = {
    temperatura: true,
    humedad: true,
    co2: true,
    lum: true,
    oxigenacion: true,
    Htemperatura: true,
    ph: true,
    JSN: true,
    conductividad: true,
    turvidez: true,
    YL: true,
    DS18: true,
  }
  colors = {
    humedad: "light",
    temperatura: "light",
    co2: "light",
    lum: "light",
    ph: "light",
    JSN: "light",
    conductividad: "light",
    Htemperatura: "light",
    oxigenacion: "light",
    turvidez: "light",
    YL: "light",
    DS18: "light",
  }
  RANGES = {
    TEMP: "",
    HUM: "",
    CO2: "",
    LUM: "",
    AMON: "",
    PH: "",
    CONDUC: "",
    OXY: "",
    JSN: "",
    JSNH: "",
    HTEMP: "",
    TURVIDEZ: "",
    YL: "",
    DS18: "",
  }
  VALUES = {
    CO2: 0,
    LUM: 0,
    AMON: 0,
    PH: 0,
    CONDUC: 0,
    OXY: 0,
    JSN: 0,
    HTEMP: 0,
    TURVIDEZ: 0,
    YL: 0,
    DS18: 0,
    TEMP: 0,
    HUM: 0,
  }
  mostrarComo = "registersl"
  components = {
    AskingDevice: false,
    NoDevice: true,
    WithoutDevices: true,
    GRAFICS: true,
    NUMBERS: true,
  }
  optionsDevice = {
    header: 'Dispositivos',
    subHeader: 'Selecciona un dispositivo',
  };
  constructor(
    //private localNotifications: LocalNotifications,
    private db: DbService,
    private http: HttpService,
    public platform: Platform) {
    Chart.register(...registerables);
    this.platform.pause.subscribe(async () => {
      clearInterval(this.intervalo)
    });
    this.platform.resume.subscribe(async () => {
      this.firstTime = true
      this.firstTimeDev = true
      this.reloadData()
    });
  }
  ngOnInit() {
  }
  ionViewWillEnter() {
    this.showNotification()
    this.reloadData()
  }
  getDevices() {
    this.db.getDevices().then(_ => {
      this.devices = _
      if (this.devices.length == 0) {
        this.components.NoDevice = true;
        this.components.AskingDevice = true;
        this.deshabilitarDivs()
        this.components.WithoutDevices = false;
      } else {
        if (this.firstTime) {
          //this.components.AskingDevice = false;
          this.deviceSelected = _[0].id
          this.firstTime = false
        } else {
          this.components.AskingDevice = true;
          this.getDeviceData(this.deviceSelected)
        }
      }
    })
  }
  changeDevice(dev) {

    this.deviceSelected = dev.target.value;
    this.getDeviceData(this.deviceSelected);
  }
  changeMood(value) {
    if (value == "registersl") {
      this.typeChart = 'line'
      //document.getElementById("canvas") ? console.log("Este existe") : console.log("no existe");
      this.destroyAllCharts()
    } else if (value == "registersb") {
      this.typeChart = 'bar'
      //document.getElementById("lineCanvasTemp") ? console.log("Este existe") : console.log("no existe");
      this.destroyAllCharts()
    } else if (value == "numbers") {
      this.updating = true
      this.lineChartJSND ? this.lineChartJSND.destroy() : null
    }
    this.getDeviceData(this.deviceSelected);
  }
  destroyAllCharts() {
    this.updating = true
    this.lineChartTemp ? this.lineChartTemp.destroy() : null
    this.lineChartGrillosTemp ? this.lineChartGrillosTemp.destroy() : null
    this.lineChartGrillosHum ? this.lineChartGrillosHum.destroy() : null
    this.lineChartCO2 ? this.lineChartCO2.destroy() : null
    this.lineChartLUM ? this.lineChartLUM.destroy() : null
    this.lineChartConductivity ? this.lineChartConductivity.destroy() : null
    this.lineChartYL ? this.lineChartYL.destroy() : null
    this.lineChartJSN ? this.lineChartJSN.destroy() : null
    this.lineChartDS18 ? this.lineChartDS18.destroy() : null
    this.lineChartTurb ? this.lineChartTurb.destroy() : null
    this.lineChartOxygen ? this.lineChartOxygen.destroy() : null
    this.lineChartPh ? this.lineChartPh.destroy() : null
  }
  getDeviceData(id) {
    this.db.getDevice(id).then(_ => {
      this.ipDeviceSelected = _.ip
      if (this.firstTimeDev) {
        this.http.checkDevice(this.ipDeviceSelected).subscribe(__ => {
          this.firstTimeDev = false
          this.db.updateTypeDevice(this.deviceSelected, __.name, __.type)
        }, error => {
          this.deshabilitarDivs();
          this.components.WithoutDevices = true;
          this.components.AskingDevice = true;
          this.components.NoDevice = false;
        });
      }
      this.components.WithoutDevices = true;
      if (this.mostrarComo == "numbers") {
        this.http.getLastValues(this.ipDeviceSelected).subscribe(data => {
          this.components.NoDevice = true;
          this.components.AskingDevice = true;
          this.components.GRAFICS = true;
          this.components.NUMBERS = false;
          if (data.HUM != undefined) {//HUMEDAD DHT11
            this.RANGES.HUM = data.HUMRANGES
            this.VALUES.HUM = Math.round(data.HUM + Number.EPSILON * 100)
            this.colors.humedad = data.HUMCOLOR
            this.sensors.humedad = false;
          } else {
            this.sensors.humedad = true;
          }
          if (data.TEMP != undefined) {//TEMPERATURA DHT11
            this.RANGES.TEMP = data.TEMPRANGES
            this.VALUES.TEMP = Math.round(data.TEMP + Number.EPSILON * 100)
            this.colors.temperatura = data.TEMPCOLOR
            this.sensors.temperatura = false;

          } else {
            this.sensors.temperatura = true;
          }
          if (data.PH != undefined) {//PH Acuaponia
            this.RANGES.PH = data.PHRANGES
            this.VALUES.PH = Math.round(data.PH + Number.EPSILON * 100)
            this.colors.ph = data.PHCOLOR
            this.sensors.ph = false;
          } else {
            this.sensors.ph = true;
          }
          if (data.LUM != undefined) {//Luminosidad
            this.RANGES.LUM = data.LUMRANGES
            this.VALUES.LUM = Math.round(data.LUM + Number.EPSILON * 100)
            this.colors.lum = data.LUMCOLOR
            this.sensors.lum = false;
          } else {
            this.sensors.co2 = true;
          }
          if (data.CO2 != undefined) {//gas CO2
            this.RANGES.CO2 = data.CO2RANGES
            this.VALUES.CO2 = Math.round(data.CO2 + Number.EPSILON * 100)
            this.colors.co2 = data.CO2COLOR
            this.sensors.co2 = false;
          } else {
            this.sensors.co2 = true;
          }
          if (data.COND != undefined) {//Conductividad Acuaponia
            this.RANGES.CONDUC = data.CONDRANGES
            this.VALUES.CONDUC = Math.round(data.COND + Number.EPSILON * 100)
            this.colors.conductividad = data.CONDCOLOR
            this.sensors.conductividad = false;
          } else {
            this.sensors.conductividad = true;
          }
          if (data.OXY != undefined) {//Oxigenación Acuaponia
            this.RANGES.OXY = data.OXYRANGES
            this.VALUES.OXY = Math.round(data.OXY + Number.EPSILON * 100)
            this.colors.oxigenacion = data.OXYCOLOR
            this.sensors.oxigenacion = false;
          } else {
            this.sensors.oxigenacion = true;
          }
          if (data.TURVIDEZ != undefined) {//TURVIDEZ Acuaponia
            this.RANGES.TURVIDEZ = data.TURVIDEZRANGES
            this.VALUES.TURVIDEZ = Math.round(data.TURVIDEZ + Number.EPSILON * 100)
            this.colors.turvidez = data.TURVIDEZCOLOR
            this.sensors.turvidez = false;
          } else {
            this.sensors.turvidez = true;
          }
          if (data.PSHUM != undefined) {//Humedad en sustrato (YL)
            this.RANGES.YL = data.SHUMRANGES
            this.VALUES.YL = Math.round(data.PSHUM + Number.EPSILON * 100)
            this.colors.YL = data.SHUMCOLOR
            this.sensors.YL = false;
          } else {
            this.sensors.YL = true;
          }
          if (data.JSN != undefined) {//Nivel de agua (JSN)
            this.RANGES.JSN = data.JSNRANGES
            this.VALUES.JSN = Math.round(data.JSN + Number.EPSILON * 100)
            this.colors.JSN = data.JSNCOLOR
            this.sensors.JSN = false;
            var c1 = data.JSNCOLOR == "success" ? "rgb(45, 211, 111)" : "rgb(235, 68, 90)"
            var c2 = data.JSNCOLOR == "success" ? "rgb(176, 245, 204)" : "rgb(250, 170, 180)"
            var n: String[] = ["Lleno", "Vacío"]
            var d: number[] = [this.VALUES.JSN, 100 - this.VALUES.JSN]
            this.showJSNDChart(n, d, c1, c2)
          } else {
            this.sensors.JSN = true;
          }
          if (data.PSTEMP != undefined) {//Temperatura en sustrato (DS18)
            this.RANGES.DS18 = data.STEMPRANGES
            this.VALUES.DS18 = Math.round(data.PSTEMP + Number.EPSILON * 100)
            this.colors.DS18 = data.STEMPCOLOR
            this.sensors.DS18 = false;
          } else {
            this.sensors.DS18 = true;
          }
          this.updating = false
        }, error => {
          this.deshabilitarDivs();
          this.components.WithoutDevices = true;
          this.components.AskingDevice = true;
          this.components.NoDevice = false;
        });

      } else if (this.mostrarComo == "registersl" || this.mostrarComo == "registersb") {
        this.http.getAllElementValues(this.ipDeviceSelected).subscribe(data => {
          this.components.NoDevice = true;
          this.components.AskingDevice = true;
          this.components.NUMBERS = true;
          this.components.GRAFICS = false;
          const dataDates: String[] = []
          data.dates.reverse().forEach(i => {
            const d = new Date(i)
            dataDates.push(d.toLocaleString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' }))
          });
          const LEN = Number(dataDates.length - 1);
          const REGISTERS: number = data.REGISTERS;
          try {//Temperatura DHT11
            var d: number[] = data.temperatura.reverse()
            var e: number[]
            if (data.tex != 0) {
              e = data.tex.reverse()
            } else {
              e = data.temperatura.reverse()
            }
            this.showTempChart(dataDates, d, e, dataDates[0], dataDates[LEN], REGISTERS)
            this.RANGES.TEMP = data.TEMPRANGES
            this.VALUES.TEMP = d[d.length - 1]
            this.colors.temperatura = data.TEMPCOLOR
            this.sensors.temperatura = false;
          } catch (error) {
            this.sensors.temperatura = true;
          }
          try {//HUMEDAD DHT11
            var d: number[] = data.humedad.reverse()
            var e: number[]
            if (data.hex != 0) {
              e = data.hex.reverse()
            } else {
              e = data.humedad.reverse()
            }
            this.showHumChart(dataDates, d, e, dataDates[0], dataDates[LEN], REGISTERS)
            this.RANGES.HUM = data.HUMRANGES
            this.VALUES.HUM = d[d.length - 1]
            this.colors.humedad = data.HUMCOLOR
            this.sensors.humedad = false;
          } catch (error) {
            this.sensors.humedad = true;
          }
          try {//co2
            var d: number[] = data.CO2.reverse()
            //var c: number[] = data.amon.reverse()
            this.showCO2Chart(dataDates, d, /*c,*/ dataDates[0], dataDates[LEN], REGISTERS)
            this.RANGES.CO2 = data.CO2RANGES
            //this.RANGES.AMON = data.AMONRANGES
            this.VALUES.CO2 = d[d.length - 1]
            //this.VALUES.AMON = c[c.length - 1]
            this.colors.co2 = data.CO2COLOR
            this.sensors.co2 = false;
          } catch (error) {
            this.sensors.co2 = true;
          }
          try {//luminosidad
            var d: number[] = data.luminosidad.reverse()
            //var c: number[] = data.amon.reverse()
            this.showLUMChart(dataDates, d, /*c,*/ dataDates[0], dataDates[LEN], REGISTERS)
            this.RANGES.LUM = data.LUMRANGES
            //this.RANGES.AMON = data.AMONRANGES
            this.VALUES.LUM = d[d.length - 1]
            //this.VALUES.AMON = c[c.length - 1]
            this.colors.lum = data.LUMCOLOR
            this.sensors.lum = false;
          } catch (error) {
            this.sensors.lum = true;
          }
          try {//Oxigenación Acuaponia
            var d: number[] = data.oxygen.reverse()
            this.showOxygenChart(dataDates, d, dataDates[0], dataDates[LEN], REGISTERS)
            this.RANGES.OXY = data.OXYRANGES
            this.VALUES.OXY = d[d.length - 1]
            this.colors.oxigenacion = data.OXYCOLOR
            this.sensors.oxigenacion = false;
          } catch (error) {
            this.sensors.oxigenacion = true;
          }
          try {//Conductividad Acuaponia
            var d: number[] = data.cond.reverse()
            this.showConductivityChart(dataDates, d, dataDates[0], dataDates[LEN], REGISTERS)
            this.RANGES.CONDUC = data.CONDRANGES
            this.VALUES.CONDUC = d[d.length - 1]
            this.colors.conductividad = data.CONDCOLOR
            this.sensors.conductividad = false;
          } catch (error) {
            this.sensors.conductividad = true;
          }
          try {//TURVIDEZ Acuaponia
            var d: number[] = data.turvidez.reverse()
            this.showTurbChart(dataDates, d, dataDates[0], dataDates[LEN], REGISTERS)
            this.RANGES.TURVIDEZ = data.TURVRANGES
            this.VALUES.TURVIDEZ = d[d.length - 1]
            this.colors.turvidez = data.TURVCOLOR
            this.sensors.turvidez = false;
          } catch (error) {
            this.sensors.turvidez = true;
          }
          try {//PH Acuaponia
            var d: number[] = data.ph.reverse()
            this.showPhChart(dataDates, d, dataDates[0], dataDates[LEN], REGISTERS)
            this.RANGES.PH = data.PHRANGES
            this.VALUES.PH = d[d.length - 1]
            this.colors.ph = data.PHCOLOR
            this.sensors.ph = false;
          } catch (error) {
            this.sensors.ph = true;
          }
          try {//JSN nivel de agua
            var d: number[] = data.JSN.reverse()
            this.showJSNChart(dataDates, d, dataDates[0], dataDates[LEN], REGISTERS)
            this.RANGES.JSN = data.JSNRANGES
            this.RANGES.JSNH = data.JSNHEIGHT
            this.VALUES.JSN = d[d.length - 1]
            this.colors.JSN = data.JSNCOLOR
            this.sensors.JSN = false;
          } catch (error) {
            this.sensors.JSN = true;
          }
          try {//Temperatura Acuaponia
            var d: number[] = data.Htemp.reverse()
            this.showHTempChart(dataDates, d, dataDates[0], dataDates[LEN], REGISTERS)
            this.RANGES.HTEMP = data.HTEMPRANGES
            this.VALUES.HTEMP = d[d.length - 1]
            this.colors.Htemperatura = data.HTEMPCOLOR
            this.sensors.Htemperatura = false;
          } catch (error) {
            this.sensors.Htemperatura = true;
          }
          try {//Humedad en sustrato
            var d1: number[] = data.s_h1.reverse()
            var d2: number[] = data.s_h2.reverse()
            var d3: number[] = data.s_h3.reverse()
            var d4: number[] = data.s_h4.reverse()
            var i = 0;
            var s = 0;
            if (d1[LEN] > 0) {
              i++;
              s += Number(d1[LEN]);
            }
            if (d2[LEN] > 0) {
              i++;
              s += Number(d2[LEN]);
            }
            if (d3[LEN] > 0) {
              i++;
              s += Number(d3[LEN]);
            }
            if (d4[LEN] > 0) {
              i++;
              s += Number(d4[LEN]);
            }
            this.showYLChart(d1, d2, d3, d4, dataDates, dataDates[0], dataDates[LEN], REGISTERS)
            this.RANGES.YL = data.SHUMRANGES
            this.colors.YL = data.SHUMCOLOR
            this.VALUES.YL = Number(s / i) ? Number(s / i) : 0;
            this.sensors.YL = false;
          } catch (error) {
            this.sensors.YL = true;
          }
          try {//Temperatura en sustrato
            var d1: number[] = data.s_t1.reverse()
            var d2: number[] = data.s_t2.reverse()
            var d3: number[] = data.s_t3.reverse()
            var d4: number[] = data.s_t4.reverse()
            var i = 0;
            var s = 0;
            if (d1[LEN] > 0) {
              i++;
              s = s + Number(d1[LEN]);
            }
            if (d2[LEN] > 0) {
              i++;
              s = s + Number(d2[LEN]);
            }
            if (d3[LEN] > 0) {
              i++;
              s = s + Number(d3[LEN]);
            }
            if (d4[LEN] > 0) {
              i++;
              s = s + Number(d4[LEN]);
            }
            this.showDS18Chart(d1, d2, d3, d4, dataDates, dataDates[0], dataDates[LEN], REGISTERS)
            this.RANGES.DS18 = data.STEMPRANGES
            this.VALUES.DS18 = Number(s / i);
            this.colors.DS18 = data.STEMPCOLOR
            this.sensors.DS18 = false;
          } catch (error) {
            this.sensors.DS18 = true;
          }

          this.updating = false
        }, error => {
          this.deshabilitarDivs();
          this.components.WithoutDevices = true;
          this.components.AskingDevice = true;
          this.components.NoDevice = false;
        });
      }
    }, error => {
      this.deshabilitarDivs();
      this.components.WithoutDevices = true;
      this.components.AskingDevice = true;
      this.components.NoDevice = false;
    });
  }
  showTempChart(dates, temp, tex, firstDate, lastDate, n) {
    if (this.lineChartGrillosTemp && !this.updating) {
      this.lineChartGrillosTemp.data.labels = dates;
      this.lineChartGrillosTemp.data.datasets[0].data = temp;
      this.lineChartGrillosTemp.data.datasets[1].data = tex;
      this.lineChartGrillosTemp.options.scales.x.title.text = n + ' registros desde: ' + firstDate + ' hasta las: ' + lastDate;
      this.lineChartGrillosTemp.update('none');
    } else {
      this.lineChartGrillosTemp = new Chart(this.lineCanvasGrillosTemp.nativeElement, {
        type: this.typeChart,
        data: {
          labels: dates,
          datasets: [
            {
              label: "Temperatura",
              backgroundColor: 'rgba(66, 111, 245,0.4)',
              borderColor: 'rgba(66, 111, 245,1)',
              data: temp,
            },
            {
              label: "Exterior",
              backgroundColor: 'rgba(55, 233, 106,0.4)',
              borderColor: 'rgba(55, 233, 106,1)',
              data: tex,
            },
          ]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              ticks: {
                display: false
              },
              display: true,
              title: {
                display: true,
                text: n + ' registros desde: ' + firstDate + ' hasta las: ' + lastDate,
                color: 'rgba(66, 111, 245,1)',
                font: {
                  family: 'Comic Sans MS',
                  size: 12,
                  lineHeight: 1.2,
                },
                //padding: { top: 20, left: 0, right: 0, bottom: 0 }
              }
            }
          }
        }
      });
    }
  }
  showPhChart(dates, ph, firstDate, lastDate, n) {
    if (this.lineChartPh && !this.updating) {
      this.lineChartPh.data.labels = dates;
      this.lineChartPh.data.datasets[0].data = ph;
      this.lineChartPh.options.scales.x.title.text = n + ' registros desde: ' + firstDate + ' hasta las: ' + lastDate;
      this.lineChartPh.update('none');
    } else {
      this.lineChartPh = new Chart(this.lineCanvasPh.nativeElement, {
        type: this.typeChart,
        data: {
          labels: dates,
          datasets: [
            {
              label: "PH",
              backgroundColor: 'rgba(66, 111, 245,0.4)',
              borderColor: 'rgba(66, 111, 245,1)',
              data: ph,
            },
          ]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              ticks: {
                display: false
              },
              display: true,
              title: {
                display: true,
                text: n + ' registros desde: ' + firstDate + ' hasta las: ' + lastDate,
                color: 'rgba(66, 111, 245,1)',
                font: {
                  family: 'Comic Sans MS',
                  size: 12,
                  lineHeight: 1.2,
                },
                //padding: { top: 20, left: 0, right: 0, bottom: 0 }
              }
            }
          }
        }
      });
    }
  }
  showHumChart(dates, hum, hex, firstDate, lastDate, n) {
    if (this.lineChartGrillosHum && !this.updating) {
      this.lineChartGrillosHum.data.labels = dates;
      this.lineChartGrillosHum.data.datasets[0].data = hum;
      this.lineChartGrillosHum.data.datasets[1].data = hex;
      this.lineChartGrillosHum.options.scales.x.title.text = n + ' registros desde: ' + firstDate + ' hasta las: ' + lastDate;
      this.lineChartGrillosHum.update('none');
    } else {
      this.lineChartGrillosHum = new Chart(this.lineCanvasGrillosHum.nativeElement, {
        type: this.typeChart,
        data: {
          labels: dates,
          datasets: [
            {
              label: "Humedad",
              //fill: false,
              //tension: 0,
              backgroundColor: 'rgba(66, 111, 245,0.4)',
              borderColor: 'rgba(66, 111, 245,1)',
              //borderCapStyle: 'butt',
              //borderDash: [],
              //borderDashOffset: 0.0,
              //borderJoinStyle: 'miter',
              //pointBorderColor: 'rgba(66, 111, 245,1)',
              //pointBackgroundColor: '#fff',
              //pointBorderWidth: 1,
              //pointHoverRadius: 5,
              //pointHoverBackgroundColor: 'rgba(66, 111, 245,1)',
              //pointHoverBorderColor: 'rgba(220,220,220,1)',
              //pointHoverBorderWidth: 2,
              //pointRadius: 2,
              //pointHitRadius: 10,
              data: hum,
              //spanGaps: false,
            },
            {
              label: "Exterior",
              //fill: false,
              //tension: 0,
              backgroundColor: 'rgba(55, 233, 106,0.4)',
              borderColor: 'rgba(55, 233, 106,1)',
              //borderCapStyle: 'butt',
              //borderDash: [],
              //borderDashOffset: 0.0,
              //borderJoinStyle: 'miter',
              //pointBorderColor: 'rgba(66, 111, 245,1)',
              //pointBackgroundColor: '#fff',
              //pointBorderWidth: 1,
              //pointHoverRadius: 5,
              //pointHoverBackgroundColor: 'rgba(66, 111, 245,1)',
              //pointHoverBorderColor: 'rgba(220,220,220,1)',
              //pointHoverBorderWidth: 2,
              //pointRadius: 2,
              //pointHitRadius: 10,
              data: hex,
              //spanGaps: false,
            },
          ]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              ticks: {
                display: false
              },
              display: true,
              title: {
                display: true,
                text: n + ' registros desde: ' + firstDate + ' hasta las: ' + lastDate,
                color: 'rgba(66, 111, 245,1)',
                font: {
                  family: 'Comic Sans MS',
                  size: 12,
                  lineHeight: 1.2,
                },
                //padding: { top: 20, left: 0, right: 0, bottom: 0 }
              }
            }
          }
        }
      });
    }
  }
  showCO2Chart(dates, CO2, firstDate, lastDate, n) {
    if (this.lineChartCO2 && !this.updating) {
      this.lineChartCO2.data.labels = dates;
      this.lineChartCO2.data.datasets[0].data = CO2;
      this.lineChartCO2.options.scales.x.title.text = n + ' registros desde: ' + firstDate + ' hasta las: ' + lastDate;
      this.lineChartCO2.update('none');
    } else {
      this.lineChartCO2 = new Chart(this.lineCanvasCO2.nativeElement, {
        type: this.typeChart,
        data: {
          labels: dates,
          datasets: [
            /*{
              label: "NH3",
              backgroundColor: 'rgba(209,0,157,0.4)',
              borderColor: 'rgba(209,0,157,1)',
              data: co2,
              //spanGaps: false,
            },*/
            {
              label: "CO2",
              backgroundColor: 'rgba(66, 111, 245,0.4)',
              borderColor: 'rgba(66, 111, 245,1)',
              data: CO2,
            },
          ]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              ticks: {
                display: false
              },
              display: true,
              title: {
                display: true,
                text: n + ' registros desde: ' + firstDate + ' hasta las: ' + lastDate,
                color: 'rgba(66, 111, 245,1)',
                font: {
                  family: 'Comic Sans MS',
                  size: 12,
                  lineHeight: 1.2,
                },
                //padding: { top: 20, left: 0, right: 0, bottom: 0 }
              }
            }
          }
        }
      });
    }
  }
  showLUMChart(dates, LUM, firstDate, lastDate, n) {
    if (this.lineChartLUM && !this.updating) {
      this.lineChartLUM.data.labels = dates;
      this.lineChartLUM.data.datasets[0].data = LUM;
      //this.lineChartGrillosGases.data.datasets[1].data = amon;
      this.lineChartLUM.options.scales.x.title.text = n + ' registros desde: ' + firstDate + ' hasta las: ' + lastDate;
      this.lineChartLUM.update('none');
    } else {
      this.lineChartLUM = new Chart(this.lineCanvasLUM.nativeElement, {
        type: this.typeChart,
        data: {
          labels: dates,
          datasets: [
            {
              label: "Luminosidad",
              backgroundColor: 'rgba(66, 111, 245,0.4)',
              borderColor: 'rgba(66, 111, 245,1)',
              data: LUM,
            },
          ]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              ticks: {
                display: false
              },
              display: true,
              title: {
                display: true,
                text: n + ' registros desde: ' + firstDate + ' hasta las: ' + lastDate,
                color: 'rgba(66, 111, 245,1)',
                font: {
                  family: 'Comic Sans MS',
                  size: 12,
                  lineHeight: 1.2,
                },
                //padding: { top: 20, left: 0, right: 0, bottom: 0 }
              }
            }
          }
        }
      });
    }
  }
  showOxygenChart(dates, data, firstDate, lastDate, n) {
    if (this.lineChartOxygen && !this.updating) {
      this.lineChartOxygen.data.labels = dates;
      this.lineChartOxygen.data.datasets[0].data = data;
      this.lineChartOxygen.options.scales.x.title.text = n + ' registros desde: ' + firstDate + ' hasta las: ' + lastDate;
      this.lineChartOxygen.update('none');
    } else {
      this.lineChartOxygen = new Chart(this.lineCanvasOxygen.nativeElement, {
        type: this.typeChart,
        data: {
          labels: dates,
          datasets: [
            {
              label: "Oxigenación",/*
              fill: false,
              tension: 0,*/
              backgroundColor: 'rgba(66, 111, 245,0.4)',
              borderColor: 'rgba(66, 111, 245,1)',/*
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(66, 111, 245,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(66, 111, 245,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 2,
              pointHitRadius: 10,*/
              data: data,
              //spanGaps: false,
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              ticks: {
                display: false
              },
              display: true,
              title: {
                display: true,
                text: n + ' registros desde: ' + firstDate + ' hasta las: ' + lastDate,
                color: 'rgba(66, 111, 245,1)',
                font: {
                  family: 'Comic Sans MS',
                  size: 12,
                  lineHeight: 1.2,
                },
                //padding: { top: 20, left: 0, right: 0, bottom: 0 }
              }
            }
          }
        }
      });
    }
  }
  showTurbChart(dates, data, firstDate, lastDate, n) {
    if (this.lineChartTurb && !this.updating) {
      this.lineChartTurb.data.labels = dates;
      this.lineChartTurb.data.datasets[0].data = data;
      this.lineChartTurb.options.scales.x.title.text = n + ' registros desde: ' + firstDate + ' hasta las: ' + lastDate;
      this.lineChartTurb.update('none');
    } else {
      this.lineChartTurb = new Chart(this.lineCanvasTurb.nativeElement, {
        type: this.typeChart,
        data: {
          labels: dates,
          datasets: [
            {
              label: "Turbidez",/*
              fill: false,
              tension: 0,*/
              backgroundColor: 'rgba(66, 111, 245,0.4)',
              borderColor: 'rgba(66, 111, 245,1)',/*
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(66, 111, 245,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(66, 111, 245,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 2,
              pointHitRadius: 10,*/
              data: data,
              //spanGaps: false,
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              ticks: {
                display: false
              },
              display: true,
              title: {
                display: true,
                text: n + ' registros desde: ' + firstDate + ' hasta las: ' + lastDate,
                color: 'rgba(66, 111, 245,1)',
                font: {
                  family: 'Comic Sans MS',
                  size: 12,
                  lineHeight: 1.2,
                },
                //padding: { top: 20, left: 0, right: 0, bottom: 0 }
              }
            }
          }
        }
      });
    }
  }
  showHTempChart(dates, data, firstDate, lastDate, n) {
    if (this.lineChartTemp && !this.updating) {
      this.lineChartTemp.data.labels = dates;
      this.lineChartTemp.data.datasets[0].data = data;
      this.lineChartTemp.options.scales.x.title.text = n + ' registros desde: ' + firstDate + ' hasta las: ' + lastDate;
      this.lineChartTemp.update('none');
    } else {
      this.lineChartTemp = new Chart(this.lineCanvasTemp.nativeElement, {
        type: this.typeChart,
        data: {
          labels: dates,
          datasets: [
            {
              label: "Temperatura",
              backgroundColor: 'rgba(66, 111, 245,0.4)',
              borderColor: 'rgba(66, 111, 245,1)',
              data: data,
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              ticks: {
                display: false
              },
              display: true,
              title: {
                display: true,
                text: n + ' registros desde: ' + firstDate + ' hasta las: ' + lastDate,
                color: 'rgba(66, 111, 245,1)',
                font: {
                  family: 'Comic Sans MS',
                  size: 12,
                  lineHeight: 1.2,
                },
                //padding: { top: 20, left: 0, right: 0, bottom: 0 }
              }
            }
          }
        }
      });
    }
  }
  showConductivityChart(dates, data, firstDate, lastDate, n) {
    if (this.lineChartConductivity && !this.updating) {
      this.lineChartConductivity.data.labels = dates;
      this.lineChartConductivity.data.datasets[0].data = data;
      this.lineChartConductivity.options.scales.x.title.text = n + ' registros desde: ' + firstDate + ' hasta las: ' + lastDate;
      this.lineChartConductivity.update('none');
    } else {
      this.lineChartConductivity = new Chart(this.lineCanvasConductivity.nativeElement, {
        type: this.typeChart,
        data: {
          labels: dates,
          datasets: [
            {
              label: "Conductividad",
              backgroundColor: 'rgba(66, 111, 245,0.4)',
              borderColor: 'rgba(66, 111, 245,1)',
              data: data,
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              ticks: {
                display: false
              },
              display: true,
              title: {
                display: true,
                text: n + ' registros desde: ' + firstDate + ' hasta las: ' + lastDate,
                color: 'rgba(66, 111, 245,1)',
                font: {
                  family: 'Comic Sans MS',
                  size: 12,
                  lineHeight: 1.2,
                },
                //padding: { top: 20, left: 0, right: 0, bottom: 0 }
              }
            }
          }
        }
      });
    }
  }
  showJSNDChart(text, data, color1, color2) {
    if (this.lineChartJSND && !this.updating) {
      this.lineChartJSND.data.labels = text;
      this.lineChartJSND.data.datasets[0].backgroundColor = [color1,color2];
      this.lineChartJSND.data.datasets[0].data = data;
      this.lineChartJSND.update();
    } else {
      this.lineChartJSND = new Chart(this.lineCanvasJSND.nativeElement, {
        type: "doughnut",
        data: {
          labels: text,
          datasets: [
            {
              label: "Nivel de agua",
              backgroundColor: [color1,color2],
              data: data,
            }
          ]
        }
      });
    }
  }
  showJSNChart(dates, data, firstDate, lastDate, n) {
    if (this.lineChartJSN && !this.updating) {
      this.lineChartJSN.data.labels = dates;
      this.lineChartJSN.data.datasets[0].data = data;
      this.lineChartJSN.options.scales.x.title.text = n + ' registros desde: ' + firstDate + ' hasta las: ' + lastDate;
      this.lineChartJSN.update('none');
    } else {
      this.lineChartJSN = new Chart(this.lineCanvasJSN.nativeElement, {
        type: this.typeChart,
        data: {
          labels: dates,
          datasets: [
            {
              label: "Nivel del agua",
              backgroundColor: 'rgba(66, 111, 245,0.4)',
              borderColor: 'rgba(66, 111, 245,1)',
              data: data,
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              ticks: {
                display: false
              },
              display: true,
              title: {
                display: true,
                text: n + ' registros desde: ' + firstDate + ' hasta las: ' + lastDate,
                color: 'rgba(66, 111, 245,1)',
                font: {
                  family: 'Comic Sans MS',
                  size: 12,
                  lineHeight: 1.2,
                },
                //padding: { top: 20, left: 0, right: 0, bottom: 0 }
              }
            }
          }
        }
      });
    }
  }
  showYLChart(data1, data2, data3, data4, dates, firstDate, lastDate, n) {
    if (this.lineChartYL && !this.updating) {
      this.lineChartYL.data.labels = dates;
      this.lineChartYL.data.datasets[0].data = data1;
      this.lineChartYL.data.datasets[1].data = data2;
      this.lineChartYL.data.datasets[2].data = data3;
      this.lineChartYL.data.datasets[3].data = data4;
      this.lineChartYL.options.scales.x.title.text = n + ' registros desde: ' + firstDate + ' hasta las: ' + lastDate;
      this.lineChartYL.update('none');
    } else {
      this.lineChartYL = new Chart(this.lineCanvasYL.nativeElement, {
        type: this.typeChart,
        data: {
          labels: dates,
          datasets: [
            {
              label: "H1",/*
              fill: false,
              tension: 0,*/
              backgroundColor: 'rgba(66, 111, 245,0.4)',
              borderColor: 'rgba(66, 111, 245,1)',/*
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(66, 111, 245,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(66, 111, 245,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 2,
              pointHitRadius: 10,*/
              data: data1,
              //spanGaps: false,
            },
            {
              label: "H2",
              /*fill: false,
              tension: 0,*/
              backgroundColor: 'rgba(21, 0, 250,0.4)',
              borderColor: 'rgba(21, 0, 250,1)',/*
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(66, 111, 245,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(66, 111, 245,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 2,
              pointHitRadius: 10,*/
              data: data2,
              //spanGaps: false,
            },
            {
              label: "H3",
              /*fill: false,
              tension: 0,*/
              backgroundColor: 'rgba(142, 0, 250,0.4)',
              borderColor: 'rgba(142, 0, 250,1)',/*
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(66, 111, 245,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(66, 111, 245,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 2,
              pointHitRadius: 10,*/
              data: data3,
              //spanGaps: false,
            },
            {
              label: "H4",/*
              fill: false,
              tension: 0,*/
              backgroundColor: 'rgba(0, 250, 121,0.4)',
              borderColor: 'rgba(0, 250, 121,1)',/*
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(66, 111, 245,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(66, 111, 245,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 2,
              pointHitRadius: 10,*/
              data: data4,
              //spanGaps: false,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              ticks: {
                display: false
              },
              display: true,
              title: {
                display: true,
                text: n + ' registros desde: ' + firstDate + ' hasta las: ' + lastDate,
                color: 'rgba(66, 111, 245,1)',
                font: {
                  family: 'Comic Sans MS',
                  size: 12,
                  lineHeight: 1.2,
                },
                //padding: { top: 20, left: 0, right: 0, bottom: 0 }
              }
            }
          }
        }
      });
    }
  }
  showDS18Chart(data1, data2, data3, data4, dates, firstDate, lastDate, n) {
    if (this.lineChartDS18 && !this.updating) {
      this.lineChartDS18.data.labels = dates;
      this.lineChartDS18.data.datasets[0].data = data1;
      this.lineChartDS18.data.datasets[1].data = data2;
      this.lineChartDS18.data.datasets[2].data = data3;
      this.lineChartDS18.data.datasets[3].data = data4;
      this.lineChartDS18.options.scales.x.title.text = n + ' registros desde: ' + firstDate + ' hasta las: ' + lastDate;
      this.lineChartDS18.update('none');
    } else {
      this.lineChartDS18 = new Chart(this.lineCanvasDS18.nativeElement, {
        type: this.typeChart,
        data: {
          labels: dates,
          datasets: [
            {
              label: "T1",/*
              fill: false,
              tension: 0,*/
              backgroundColor: 'rgba(66, 111, 245,0.4)',
              borderColor: 'rgba(66, 111, 245,1)',/*
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(66, 111, 245,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(66, 111, 245,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 2,
              pointHitRadius: 10,*/
              data: data1,
              //spanGaps: false,
            },
            {
              label: "T2",/*
              fill: false,
              tension: 0,*/
              backgroundColor: 'rgba(21, 0, 250,0.4)',
              borderColor: 'rgba(21, 0, 250,1)',/*
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(66, 111, 245,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(66, 111, 245,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 2,
              pointHitRadius: 10,*/
              data: data2,
              //spanGaps: false,
            },
            {
              label: "T3",/*
              fill: false,
              tension: 0,*/
              backgroundColor: 'rgba(142, 0, 250,0.4)',
              borderColor: 'rgba(142, 0, 250,1)',/*
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(66, 111, 245,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(66, 111, 245,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 2,
              pointHitRadius: 10,*/
              data: data3,
              //spanGaps: false,
            },
            {
              label: "T4",/*
              fill: false,
              tension: 0,*/
              backgroundColor: 'rgba(0, 250, 121,0.4)',
              borderColor: 'rgba(0, 250, 121,1)',/*
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(66, 111, 245,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(66, 111, 245,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 2,
              pointHitRadius: 10,*/
              data: data4,
              //spanGaps: false,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              ticks: {
                display: false
              },
              display: true,
              title: {
                display: true,
                text: n + ' registros desde: ' + firstDate + ' hasta las: ' + lastDate,
                color: 'rgba(66, 111, 245,1)',
                font: {
                  family: 'Comic Sans MS',
                  size: 12,
                  lineHeight: 1.2,
                },
                //padding: { top: 20, left: 0, right: 0, bottom: 0 }
              }
            }
          }
        }
      });
    }
  }
  reloadData() {
    if (this.firstTime) {
      this.getDevices()
    }
    clearInterval(this.intervalo)
    this.intervalo = setInterval(() => {
      this.getDevices();
    }, 10000);
  }
  showNotification() {
    /*LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title: 'Elemento fuera de rango',
          body: 'La temperatura se encuentra fuera de rango',
          icon: 'res://icon/icon.png',
          ionColor: 'eb445a',
          schedule: { at: new Date(Date.now() + 100) },
          sound: null,
          attachments: null,
          actionTypeId: '',
          extra: null,
        },
      ],
    });*/
  }
  deshabilitarDivs() {
    this.components.NUMBERS = true;
    this.components.GRAFICS = true;
  }
}
