import {isDevMode} from '@angular/core';

export class BindProvider {
  Track(index: number, obj: any): any {
    return index;
  }

  App() {
    if (!isDevMode()) {
      const logger = function nLog() {
        let oldConsoleLog = null;
        const pub: any = {};

        pub.enableLogger = function enableLogger() {
          if (oldConsoleLog == null) {
            return;
          }

          window.console.log = oldConsoleLog;
        };

        pub.disableLogger = function disableLogger() {
          oldConsoleLog = console.log;
          window.console.log = function () {
          };
        };

        return pub;
      }();
      logger.disableLogger();
    }
  }
}
