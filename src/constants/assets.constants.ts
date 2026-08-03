import { buildCloudinaryUrl } from '../utils/cloudinary';

const optimize = (url: string) => buildCloudinaryUrl(url, { format: 'auto', quality: 'auto' });

export const ASSET_URLS = {
  hero: {
    pcSetupEnhanced: optimize(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785596515/Hero_PC_Setup_Enhanced_1_qnsylt.png'
    ),
  },
  devices: {
    phone: optimize(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785753909/phone_b5z38b.png'
    ),
    tablet: optimize(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785753909/tablet_prpegh.png'
    ),
    laptop: optimize(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785753909/laptop_or3uvc.png'
    ),
  },
  background: {
    bgImage1: optimize(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785597839/background_Image_1_tcvvnf.jpg'
    ),
    bgImage2: optimize(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785597839/background_Image_2_q4kbia.jpg'
    ),
    bgImage3: optimize(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785597840/background_Image_3_dqhztv.jpg'
    ),
    bgImage4: optimize(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785597842/background_Image_4_qtq29w.jpg'
    ),
    bgImage5: optimize(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785597843/background_Image_5_wrd1vv.jpg'
    ),
    bgImage6: optimize(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785597844/background_Image_6_tao5zj.jpg'
    ),
    bgImage7: optimize(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785597845/background_Image_7_nmnrad.jpg'
    ),
  },
  clouds: {
    cloud1: optimize(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785597847/clouds_png_1_r5u8co.png'
    ),
    cloud2: optimize(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785597848/clouds_png_2_tjhhqb.png'
    ),
    cloud3: optimize(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785597849/clouds_png_3_zb6l7z.png'
    ),
    cloud4: optimize(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785597851/clouds_png_4_zgowtk.png'
    ),
    cloud5: optimize(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785597852/clouds_png_5_sra2we.png'
    ),
    cloud6: optimize(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785597853/clouds_png_6_erfcl5.png'
    ),
    cloud7: optimize(
      'https://res.cloudinary.com/do9ro9yvf/image/upload/v1785597855/clouds_png_7_thr9bl.png'
    ),
  },
} as const;
