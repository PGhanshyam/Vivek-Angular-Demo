import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component/login.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password.component/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/reset-password.component/reset-password.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { MainLayoutComponent } from './layout/main-layout.component/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component/dashboard.component';
import { UserListComponent } from './features/user-management/user-list.component/user-list.component';
import { UserAddComponent } from './features/user-management/user-add.component/user-add.component';
import { UserEditComponent } from './features/user-management/user-edit.component/user-edit.component';
import { UserViewComponent } from './features/user-management/user-view.component/user-view.component';
import { CouponListComponent } from './features/coupon-management/coupon-list.component/coupon-list.component';
import { CouponAddComponent } from './features/coupon-management/coupon-add.component/coupon-add.component';
import { CouponEditComponent } from './features/coupon-management/coupon-edit.component/coupon-edit.component';
import { CouponViewComponent } from './features/coupon-management/coupon-view.component/coupon-view.component';
import { ChangePasswordComponent } from './features/auth/change-password.component/change-password.component';
import { PrivacyPolicyComponent } from './features/settings-module/privacy-policy.component/privacy-policy.component';
import { TermsConditionsComponent } from './features/settings-module/terms-conditions.component/terms-conditions.component';
import { TestimonialListComponent } from './features/settings-module/testimonial/testimonial-list.component/testimonial-list.component';
import { TestimonialAddComponent } from './features/settings-module/testimonial/testimonial-add.component/testimonial-add.component';
import { TestimonialEditComponent } from './features/settings-module/testimonial/testimonial-edit.component/testimonial-edit.component';
import { GeneralSettingsComponent } from './features/settings-module/general-settings.component/general-settings.component';

export const routes: Routes = [

    // Authentication routes (Public)

    {
        path: 'login',
        component: LoginComponent
    },

    {
        path: 'forgot-password',
        component: ForgotPasswordComponent
    },

    {
        path: 'reset-password',
        component: ResetPasswordComponent
    },

    {
        path: 'change-password',
        component: ChangePasswordComponent
    },

    // Protected layout routes (Requires Authentication)

    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        canActivateChild: [authGuard],

        children: [

            {
                path: 'dashboard',
                component: DashboardComponent
            },

            {
                path: 'user-management',
                component: UserListComponent,
                canActivate: [roleGuard],
                data: { roles: ['Admin', 'Yoga Instructor'] }
            },

            {
                path: 'user-management/add',
                component: UserAddComponent,
                canActivate: [roleGuard],
                data: { roles: ['Admin'] }
            },

            {
                path: 'user-management/edit/:id',
                component: UserEditComponent,
                canActivate: [roleGuard],
                data: { roles: ['Admin'] }
            },

            {
                path: 'user-management/view/:id',
                component: UserViewComponent,
                canActivate: [roleGuard],
                data: { roles: ['Admin', 'Yoga Instructor'] }
            },

            {
                path: 'coupon-code',
                component: CouponListComponent,
                canActivate: [roleGuard],
                data: { roles: ['Admin', 'Yoga Instructor'] }
            },

            {
                path: 'coupon-code/add',
                component: CouponAddComponent,
                canActivate: [roleGuard],
                data: { roles: ['Admin', 'Yoga Instructor'] }
            },

            {
                path: 'coupon-code/edit/:id',
                component: CouponEditComponent,
                canActivate: [roleGuard],
                data: { roles: ['Admin', 'Yoga Instructor'] }
            },

            {
                path: 'coupon-code/view/:id',
                component: CouponViewComponent,
                canActivate: [roleGuard],
                data: { roles: ['Admin', 'Yoga Instructor'] }
            },

            {
                path: 'coupon-management',
                redirectTo: 'coupon-code'
            },

            {
                path: 'coupon-management/add',
                redirectTo: 'coupon-code/add'
            },

            {
                path: 'coupon-management/edit/:id',
                redirectTo: 'coupon-code/edit/:id'
            },

            {
                path: 'coupon-management/view/:id',
                redirectTo: 'coupon-code/view/:id'
            },

            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },

            {
                path: 'settings',
                children: [
                    {
                        path: '',
                        redirectTo: 'privacy-policy',
                        pathMatch: 'full'
                    },

                    {
                        path: 'privacy-policy',
                        component: PrivacyPolicyComponent,
                        canActivate: [roleGuard],
                        data: {
                            roles: ['Admin']
                        }
                    },

                    {
                        path: 'terms-conditions',
                        component: TermsConditionsComponent,
                        canActivate: [roleGuard],
                        data: {
                            roles: ['Admin']
                        }
                    },

                    {
                        path: 'testimonial',
                        redirectTo: 'testimonials',
                        pathMatch: 'full'
                    },

                    {
                        path: 'about',
                        redirectTo: 'privacy-policy',
                        pathMatch: 'full'
                    },

                    {
                        path: 'testimonials',
                        component: TestimonialListComponent,
                        canActivate: [roleGuard],
                        data: { roles: ['Admin'] }
                    },

                    {
                        path: 'testimonials/add',
                        component: TestimonialAddComponent,
                        canActivate: [roleGuard],
                        data: { roles: ['Admin'] }
                    },

                    {
                        path: 'testimonials/edit/:id',
                        component: TestimonialEditComponent,
                        canActivate: [roleGuard],
                        data: { roles: ['Admin'] }
                    },

                      {
                        path: 'general',
                        component: GeneralSettingsComponent,
                        canActivate: [roleGuard],
                        data: {
                            roles: ['Admin']
                        }
                    },

                ]
            }

        ]
    },

    // Unknown URL fallback

    {
        path: '**',
        redirectTo: 'login'
    }
];
