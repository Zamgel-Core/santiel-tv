export const downloadData: Record<
  string,
  { link?: string; images?: string[]; pass: string; title: string }
> = {
  android: {
    title: "Android APK",
    link: "https://www.mediafire.com/file/4yss9xnkucl4zbr/SantielTV_V1.apk/file",
    pass: "Santielandroid2026",
  },
  apple: {
    title: "Apple iOS",
    link: "https://apps.apple.com/us/app/aztk-play/id1662070685",
    pass: "SantielApple1103",
  },
  roku: {
    title: "Roku TV",
    images: ["kratostv", "DigitalPro"],
    pass: "SantielRokutv2026",
  },
  pc: {
    title: "PC / Mac",
    link: "https://www.mediafire.com/file/urdb1l3cf7yvpoe/iptv-smarters-pro-1-1-2.exe/file",
    pass: "SantielPC2026",
  },
};