import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SettingContentRequest } from '../models/setting-content.model';
import { TestimonialRequest } from '../models/testimonial.model';
import { GeneralSettingsRequest } from '../models/general-settings.model';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    private readonly settingsApiUrl = `${environment.apiUrl}/settings`;
    private readonly testimonialsApiUrl = `${environment.apiUrl}/testimonials`;
    private readonly generalSettingsApiUrl = `${environment.apiUrl}/GeneralSettings`;

    constructor(
        private readonly http: HttpClient
    ) { }

    getPrivacyPolicy(): Observable<any> {
        return this.http.get(
            `${this.settingsApiUrl}/privacy-policy`
        );
    }

    updatePrivacyPolicy(request: SettingContentRequest): Observable<any> {
        return this.http.put(
            `${this.settingsApiUrl}/privacy-policy`, request
        );
    }

    getTermsConditions(): Observable<any> {
        return this.http.get(
            `${this.settingsApiUrl}/terms-conditions`
        );
    }

    updateTermsConditions(request: SettingContentRequest): Observable<any> {
        return this.http.put(
            `${this.settingsApiUrl}/terms-conditions`, request
        );
    }

    getTestimonials(): Observable<any> {
        return this.http.get(
            this.testimonialsApiUrl
        );
    }

    getTestimonialById(testimonialId: number): Observable<any> {
        return this.http.get(
            `${this.testimonialsApiUrl}/${testimonialId}`
        );
    }

    createTestimonial(request: TestimonialRequest): Observable<any> {
        return this.http.post(
            this.testimonialsApiUrl, request
        );
    }

    updateTestimonial(testimonialId: number, request: TestimonialRequest): Observable<any> {
        return this.http.put(
            `${this.testimonialsApiUrl}/${testimonialId}`, request
        );
    }

    deleteTestimonial(testimonialId: number): Observable<any> {
        return this.http.delete(
            `${this.testimonialsApiUrl}/${testimonialId}`
        );
    }

    getGeneralSettings(): Observable<any> {
        return this.http.get(
            this.generalSettingsApiUrl
        );
    }

    updateGeneralSettings(request: GeneralSettingsRequest): Observable<any> {
        return this.http.put(
            this.generalSettingsApiUrl, request
        );
    }
}
