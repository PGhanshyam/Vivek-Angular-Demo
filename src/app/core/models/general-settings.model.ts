export interface GeneralSettings {
    generalSettingsId: number;
    adminEmail: string;
    taxPercentage: number;
    facebookUrl?: string;
    twitterUrl?: string;
    instagramUrl?: string;
    youtubeUrl?: string;
    isActive: boolean;
    createdBy: number;
    createdDate: string;
    modifiedBy?: number;
    modifiedDate?: string;
}

export interface GeneralSettingsRequest {
    adminEmail: string;
    taxPercentage: number;
    facebookUrl?: string;
    twitterUrl?: string;
    instagramUrl?: string;
    youtubeUrl?: string;
}