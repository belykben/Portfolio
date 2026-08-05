import { buildCloudinaryUrl } from '../utils/cloudinary';

const optimizeHero = (url: string) =>
  // buildCloudinaryUrl(url, { width: 1200, quality: 'auto:good', format: 'auto', crop: 'limit' });
  buildCloudinaryUrl(url, { format: 'auto', quality: 'auto' });

const optimizeDevice = (url: string, width: number) =>
  buildCloudinaryUrl(url, { width, quality: 'auto:good', format: 'auto', crop: 'limit' });
// buildCloudinaryUrl(url, { format: 'auto', quality: 'auto' });

const optimizeBg = (url: string) =>
  buildCloudinaryUrl(url, { width: 1400, quality: 'auto:eco', format: 'auto', crop: 'limit' });

const optimizeCloud = (url: string) =>
  buildCloudinaryUrl(url, { width: 800, quality: 'auto:eco', format: 'auto', crop: 'limit' });

export const ASSET_URLS = {
  hero: {
    pcSetupEnhanced: optimizeHero(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785861543/Hero_PC_Setup_Enhanced_small_tbu1iw.png'
      // 'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785596515/Hero_PC_Setup_Enhanced_1_qnsylt.png'
    ),
  },
  devices: {
    phone: optimizeDevice(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785753909/phone_b5z38b.png',
      1000
    ),
    tablet: optimizeDevice(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785753909/tablet_prpegh.png',
      1000
    ),
    laptop: optimizeDevice(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785753909/laptop_or3uvc.png',
      2000
    ),
  },
  background: {
    bgImage1: optimizeBg(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785597839/background_Image_1_tcvvnf.jpg'
    ),
    bgImage2: optimizeBg(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785597839/background_Image_2_q4kbia.jpg'
    ),
    bgImage3: optimizeBg(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785597840/background_Image_3_dqhztv.jpg'
    ),
    bgImage4: optimizeBg(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785597842/background_Image_4_qtq29w.jpg'
    ),
    bgImage5: optimizeBg(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785597843/background_Image_5_wrd1vv.jpg'
    ),
    bgImage6: optimizeBg(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785597844/background_Image_6_tao5zj.jpg'
    ),
    bgImage7: optimizeBg(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785597845/background_Image_7_nmnrad.jpg'
    ),
  },
  clouds: {
    cloud1: optimizeCloud(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785597847/clouds_png_1_r5u8co.png'
    ),
    cloud2: optimizeCloud(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785597848/clouds_png_2_tjhhqb.png'
    ),
    cloud3: optimizeCloud(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785597849/clouds_png_3_zb6l7z.png'
    ),
    cloud4: optimizeCloud(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785597851/clouds_png_4_zgowtk.png'
    ),
    cloud5: optimizeCloud(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785597852/clouds_png_5_sra2we.png'
    ),
    cloud6: optimizeCloud(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785597853/clouds_png_6_erfcl5.png'
    ),
    cloud7: optimizeCloud(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785597855/clouds_png_7_thr9bl.png'
    ),
  },
} as const;

