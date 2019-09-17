import {DeviceDetectorService} from 'ngx-device-detector';
import {DeviceInfo} from '../definitions/device';

export class DeviceProvider {
  constructor(private device: DeviceDetectorService) { }

  Get(): DeviceInfo {
    const info = this.device.getDeviceInfo();
    const device = new DeviceInfo();

    device.UserAgent = info.userAgent;
    device.OS = info.os;
    device.OSVersion = info.os_version;
    device.Browser = info.browser;
    device.BrowserVersion = info.browser_version;
    device.Device = info.device;
    device.DeviceType = this.device.isDesktop() ? 'desktop' : (this.device.isMobile()
      ? 'mobile' : (this.device.isTablet() ? 'tablet' : 'unknown'));

    return device;
  }
}
