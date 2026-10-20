/*
 * CargoTrack: guard of the public landing page ("/"), kept apart from the component so the page itself loads lazily.
 */
import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

/** "/" shows the landing page only to visitors; signed-in users and the embedded app go to the overview. */
export const landingGuard: CanActivateFn = () => {
    const embedded = inject(DOCUMENT).documentElement.classList.contains('ct-embedded');
    return embedded || inject(AuthService).isAuthenticated()
        ? inject(Router).createUrlTree(['/ecmr-overview'])
        : true;
};
