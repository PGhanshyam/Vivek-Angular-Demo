export interface Testimonial {
    testimonialId: number;
    content: string;
    author: string;
    displayOrder: number;
    isActive: boolean;
    isDeleted: boolean;
    createdBy: number;
    createdDate: string;
    modifiedBy?: number;
    modifiedDate?: string;
}

export interface TestimonialRequest {
    content: string;
    author: string;
    displayOrder: number;
}