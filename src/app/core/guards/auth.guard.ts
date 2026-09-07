// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { AuthService } from '../services/auth.service';

// export const authGuard:
//     CanActivateFn =
//     (
//         route,
//         state
//     ) => {

//         // const authService =
//         //     inject(AuthService);

//         // const router =
//         //     inject(Router);

//         // if (
//         //     authService.isLoggedIn()
//         // ) {
//         //     return true;
//         // }

//         // return router
//         //     .createUrlTree(
//         //         ['/login'],
//         //         {
//         //             queryParams: {
//         //                 returnUrl:
//         //                     state.url
//         //             }
//         //         }
//         //     );

//         const router = inject(Router);

//         const token =
//             localStorage.getItem('token');

//         console.log(
//             'Token checked by authGuard:',
//             token
//         );

//         if (token && token.trim() !== '') {
//             return true;
//         }

//         return router.createUrlTree(
//             ['/login'],
//             {
//                 queryParams: {
//                     returnUrl: '/dashboard'
//                 }
//             }
//         );
//     };

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        return true;
    }

    return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url }
    });
};
