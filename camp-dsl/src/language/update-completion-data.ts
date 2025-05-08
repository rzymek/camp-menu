import {NotificationType} from "vscode-languageserver-protocol"

export interface CompletionDataParams {
    items: string[];
}
export const UpdateCompletionDataNotification = new NotificationType<CompletionDataParams>('$/updateCompletionData')
