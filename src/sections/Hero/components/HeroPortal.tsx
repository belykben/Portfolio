import { forwardRef } from 'react';
import { ASSET_URLS } from '../../../constants/assets.constants';
import styles from '../Hero.module.css';

interface HeroPortalProps {
  setupImgRef: React.RefObject<HTMLImageElement | null>;
  transitionOverlayRef?: React.RefObject<HTMLDivElement | null>;
}

export const HeroPortal = forwardRef<HTMLDivElement, HeroPortalProps>(
  ({ setupImgRef, transitionOverlayRef }, ref) => {
    return (
      <div ref={ref} className={styles.portalContainer}>
        <div className={styles.setupImageWrapper}>
          <img
            ref={setupImgRef}
            src={ASSET_URLS.hero.pcSetupEnhanced}
            alt="Atmospheric PC Setup Studio"
            className={styles.setupImage}
            loading="eager"
            decoding="async"
          />
          {transitionOverlayRef && (
            <div
              ref={transitionOverlayRef}
              className={styles.transitionOverlay}
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    );
  }
);

HeroPortal.displayName = 'HeroPortal';
