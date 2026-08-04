import { ASSET_URLS } from '../../constants/assets.constants';
import styles from './CinematicBackground.module.css';

type Cloud = {
  src: string;
  positionClass: string;
};

type CloudLayerDefinition = {
  id: string;
  className: string;
  clouds: readonly Cloud[];
};

const CLOUD_LAYERS: readonly CloudLayerDefinition[] = [
  {
    id: 'medium',
    className: styles.mediumClouds,
    clouds: [
      { src: ASSET_URLS.clouds.cloud3, positionClass: styles.cloud3 },
      { src: ASSET_URLS.clouds.cloud5, positionClass: styles.cloud5 },
    ],
  },
  {
    id: 'cloud4-layer',
    className: styles.cloud4Layer,
    clouds: [
      { src: ASSET_URLS.clouds.cloud4, positionClass: styles.cloud4 },
    ],
  },
  {
    id: 'foreground',
    className: styles.foregroundClouds,
    clouds: [
      { src: ASSET_URLS.clouds.cloud7, positionClass: styles.cloud7 },
    ],
  },
];

function CloudLayer({ layer }: { layer: CloudLayerDefinition }) {
  return (
    <div className={styles.cloudLayer + ' ' + layer.className}>
      <div className={styles.cloudTrack}>
        {[0, 1].map((copy) => (
          <div className={styles.cloudSet} key={layer.id + '-' + copy}>
            {layer.clouds.map((cloud) => (
              <img
                alt=""
                aria-hidden="true"
                className={styles.cloud + ' ' + cloud.positionClass}
                decoding="async"
                draggable={false}
                key={copy + '-' + cloud.src}
                src={cloud.src}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * A self-contained, composited atmospheric scene.
 *
 * The background is rendered uncropped at its native 3712:4608 ratio. Each
 * cloud track repeats the exact same cloud set twice, allowing a translate3d
 * loop to reset invisibly without JavaScript or layout work per frame.
 */
export default function CinematicBackground() {
  return (
    <div className={styles.scene} aria-hidden="true">
      <div className={styles.imageStage}>
        <img
          alt=""
          className={styles.backgroundImage}
          decoding="async"
          fetchPriority="high"
          src={ASSET_URLS.background.bgImage1}
        />
      </div>

      {CLOUD_LAYERS.map((layer) => (
        <CloudLayer key={layer.id} layer={layer} />
      ))}
    </div>
  );
}
