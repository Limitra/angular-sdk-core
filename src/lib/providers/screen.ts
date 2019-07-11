import {ScreenSize} from '../definitions/screen-size';

export class ScreenProvider {
  GetSize(): number {
    let result: number;
    const size = screen.width < 576 ? 'xs' : (screen.width >= 576 && screen.width < 768 ? 'sm'
      : (screen.width >= 768 && screen.width < 992 ? 'md'
        : (screen.width >= 992 && screen.width < 1200 ? 'lg' : 'xl')));
    switch (size) {
      case 'xs': result = ScreenSize.XS; break;
      case 'sm': result = ScreenSize.SM; break;
      case 'md': result = ScreenSize.MD; break;
      case 'lg': result = ScreenSize.LG; break;
      case 'xl': result = ScreenSize.XL; break;
    }
    return result;
  }
}
