export interface IStoreFeedbackPayloadProps {
    comment: string;
    user_id?: string;
    email?: string;
    category: string;
    type: string;
    image?: File;
}

export interface IUpdateFeedbackPayloadProps {
    id: number;
    category?: string;
    type?: string;
    status?: string;
    priority?: string;
}

export interface IFilterFeedbackPayloadProps {
    user_id?: string;
    category?: string;
    type?: string;
    start_date?: string;
    end_date?: string;
    pagination?: number;
}