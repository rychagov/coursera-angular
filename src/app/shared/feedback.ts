export class Feedback {
    firstname: string;
    lastname: string;
    telnum: number;
    email: string;
    agree: boolean;
    contacttype: string;
    message: string;
}

export const ContactType = ['None', 'Tel', 'Email'];

export const FORM_STATUS_INITIAL = 'initial';
export const FORM_STATUS_SUBMISSION = 'submission';
export const FORM_STATUS_SUBMITTED = 'submitted';
