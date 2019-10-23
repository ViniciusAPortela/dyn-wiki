/**
 * @class - UserConfig - Manipulate all user configurations
 */
class UserConfig {

  /**
   * Get the user Operation System by the navigator.platform && userAgent
   * @returns - The user OS
   */
  getOS() {
    var userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K', 'darwin'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
        os = null;
  
    if (macosPlatforms.indexOf(platform) !== -1) {
      os = 'mac';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = 'ios';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = 'windows';
    } else if (/Android/.test(userAgent)) {
      os = 'android';
    } else if (!os && /Linux/.test(platform)) {
      os = 'linux';
    }
  
    return os;
  }

  /**
   * Get the user Processor Architecture by the navigator.platform
   * @returns - The user Arch
   */
  getArch(){
    let platform = window.navigator.platform;
    let arch64 = ['Linux x86_64','x86_64', 'x86-64', 'Win64', 'x64;', 'amd64', 'AMD64', 'WOW64', 'x64_64'];
    if(arch64.indexOf(platform) !== -1) return 'x64'; else return 'x86';
  }

  /**
   * Get the user language by the navigator
   * @returns user language
   */
  getLang(){
    return navigator.language || navigator.userLanguage
  }

  /**
   * Get all the user configurations and returns a Object
   * @returns - (Object) all the user config
   */
  getConf(){
    let data = {};
    data.arch = this.getArch();
    data.os = this.getOS();

    //Cant get yet
    data.os_version = undefined;
    data.dist = undefined;
    data.dist_version = undefined;
    data.swap = undefined;
    data.swap_type = undefined;

    return data;
  }

}

module.exports = new UserConfig();