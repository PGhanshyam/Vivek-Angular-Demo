export interface SettingContent {
    settingContentId: number;
    settingType: string;
    content: string;
    isActive: boolean;
    createdBy: number;
    createdDate: string;
    modifiedBy?: number;
    modifiedDate?: string;
}

export interface SettingContentRequest {
    content: string;
}