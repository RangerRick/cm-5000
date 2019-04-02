import { ChangeDetectorRef } from '@angular/core';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { BeaconRegion } from 'src/3rdparty/ibeacon';

import { BeaconService } from '../core/beacon.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  public region: BeaconRegion;

  constructor(private changeDetector: ChangeDetectorRef, protected beaconService: BeaconService) {
    this.resetRegion();

    beaconService.events.subscribe(region => {
      try {
        console.log('tab3 got region: ' + JSON.stringify(region));
        if (region === null) {
          this.resetRegion();
        } else {
          this.region = region;
        }
        this.changeDetector.detectChanges();
      } catch (err) {
        console.error('failed to get region update: ' + JSON.stringify(err));
      }
    });
  }

  resetRegion() {
    this.region = null;
  }
}
