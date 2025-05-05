import {NotificationType} from "vscode-languageserver-protocol"

export interface CompletionDataParams {
    items: string[]; // Example: an array of strings
    // Add other properties as needed
}
export const UpdateCompletionDataNotification = new NotificationType<CompletionDataParams>('$/updateCompletionData')
