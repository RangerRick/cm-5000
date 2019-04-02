import { HTTP } from '@ionic-native/http/ngx';
import { IBeacon, BeaconRegion, IBeaconDelegate } from '../../3rdparty/ibeacon/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BeaconService {
  public currentRegion: BeaconRegion;
  public events: Observable<BeaconRegion>;

  private eventSubject = new Subject<BeaconRegion>();
  private delegate: IBeaconDelegate;
  private regions: BeaconRegion[];

  constructor(
    private http: HTTP,
    private ibeacon: IBeacon,
    private localNotifications: LocalNotifications,
    private platform: Platform,
  ) {
    this.events = this.eventSubject.asObservable();
    this.initialize();
  }

  initialize() {
    this.platform.ready().then(async () => {
      // check for iOS auth, and configure logging/notifications
      this.ibeacon.requestAlwaysAuthorization();
      // this.ibeacon.enableDebugLogs();
      this.ibeacon.disableDebugLogs();
      this.ibeacon.disableDebugNotifications();

      this.regions = [
        this.ibeacon.BeaconRegion('Lido', 'DEDC76CE-0C1A-45B5-80A4-75F96C839FC5'),
        this.ibeacon.BeaconRegion('Main Theater', '0A339C06-A224-4BEC-BA1B-81B1146CEAA5'),
        this.ibeacon.BeaconRegion('Deck4MidShip', '2B56A867-B5A8-41F0-8692-0CE6142FEBF2'),
      ];

      // disable any existing monitoring
      this.regions.forEach(async r => {
        await this.ibeacon.stopMonitoringForRegion(r).then(() => {
          console.log('Beacons.stopMonitoringForRegion ' + r.identifier + ' succeeded.');
        }).catch((err) => {
          console.warn('Beacons.stopMonitoringForRegion ' + r.identifier + ' failed.', err);
        });
      });

      // set up a new delegate
      this.delegate = this.ibeacon.Delegate();
      this.ibeacon.setDelegate(this.delegate);

      const wrap = (funcName) => {
        return [
          (data) => {
            this[funcName](data);
            console.log('Beacons.' + funcName + ' succeeded: ' + JSON.stringify(data));
          },
          (err) => {
            console.error('Beacons.' + funcName + ' failed: ' + JSON.stringify(err));
          }
        ];
      };

      await this.delegate.didRangeBeaconsInRegion().subscribe(...wrap('didRangeBeaconsInRegion'));
      await this.delegate.didStartMonitoringForRegion().subscribe(...wrap('didStartMonitoringForRegion'));
      await this.delegate.didEnterRegion().subscribe(...wrap('didEnterRegion'));
      await this.delegate.didExitRegion().subscribe(...wrap('didExitRegion'));

      this.regions.forEach(r => this.ibeacon.startMonitoringForRegion(r));
    });
  }

  didRangeBeaconsInRegion(data) {
  }

  didStartMonitoringForRegion(data) {
  }

  didEnterRegion(data) {
    this.currentRegion = data.region;
    this.localNotifications.schedule({
      title: 'Entered ' + this.currentRegion.identifier,
      text: 'You entered: ' + this.currentRegion.identifier,
    });
    this.eventSubject.next(this.currentRegion);
  }

  didExitRegion(data) {
    this.localNotifications.schedule({
      title: 'Left ' + data.region.identifier,
      text: 'You left: ' + data.region.identifier,
    });
    if (data.region.uuid === this.currentRegion.uuid) {
      this.currentRegion = null;
    }
    this.eventSubject.next(this.currentRegion as BeaconRegion);
  }
}
