import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BeaconService } from './core/beacon.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  private idCount: number;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private beaconService: BeaconService,
  ) {
    this.idCount = 0;
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log('Initializing...');
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
