import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { HTTP } from '@ionic-native/http/ngx';
import { IBeacon } from '@ionic-native/ibeacon/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  private idCount: number;
  private http: HTTP;
  private ibeacon: IBeacon;
  private localNotifications: LocalNotifications;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private h: HTTP,
    private ib: IBeacon,
    private ln: LocalNotifications
  ) {
    this.idCount = 0;
    this.http = h;
    this.ibeacon = ib;
    this.localNotifications = ln;
    this.initializeApp();
  }

  rangeBeaconsInRegion(data) {
    console.log('Range beacons in region: ' + JSON.stringify(data, undefined, 2));
  }

  startMonitoringForRegion(data) {
    console.log('Start monitoring for region: ' + JSON.stringify(data, undefined, 2));
  }

  enterRegion(data) {
    console.log('Enter region: ' + JSON.stringify(data, undefined, 2));
  }

  exitRegion(data) {
    console.log('Exit region: ' + JSON.stringify(data, undefined, 2));
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log('Initializing...');
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.http.useBasicAuth('demo', 'demo');

      console.log('plugins: ' + Object.keys(window.cordova.plugins));

      this.ibeacon.requestAlwaysAuthorization();
      const delegate = this.ibeacon.Delegate();

      /*
      delegate.didRangeBeaconsInRegion().subscribe(this.rangeBeaconsInRegion, console.error);
      delegate.didStartMonitoringForRegion().subscribe(this.startMonitoringForRegion, console.error);
      delegate.didEnterRegion().subscribe(this.enterRegion, console.error);
      delegate.didExitRegion().subscribe(this.exitRegion, console.error);
      */

      /*
      window['evothings'].eddystone.startScan(beacon => {
        console.log('Found beacon: ' + JSON.stringify(beacon, undefined, 2));
        this.http.get('https://demo.opennms.org/opennms/rest/info', {}, {}).then(response => {
          console.log('got response: ' + JSON.stringify(response.data, undefined, 2));
          this.localNotifications.schedule({
            title: 'Scan complete!',
            text: 'Beacon "' + beacon.name + '" triggered an HTTP update!',
          });
        });
      }, err => {
        console.log('Error: ' + err);
      });
      */
    });
  }
}
