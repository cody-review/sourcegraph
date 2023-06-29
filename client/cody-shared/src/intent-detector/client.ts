import { SourcegraphGraphQLAPIClient } from '../sourcegraph-api/graphql'

import { IntentDetector } from '.'

const editorRegexps = [/editor/, /(open|current|this)\s+file/, /current(ly)?\s+open/, /have\s+open/]

const ownershipRegexps = [/(owner|review|expert|person|author|contact|who|whom|team|member|commit)/]

export class SourcegraphIntentDetectorClient implements IntentDetector {
    constructor(private client: SourcegraphGraphQLAPIClient) {}

    public isCodebaseContextRequired(input: string): Promise<boolean | Error> {
        return this.client.isContextRequiredForQuery(input)
    }

    public isEditorContextRequired(input: string): boolean | Error {
        const inputLowerCase = input.toLowerCase()
        // If the input matches any of the `editorRegexps` we assume that we have to include
        // the editor context (e.g., currently open file) to the overall message context.
        for (const regexp of editorRegexps) {
            if (inputLowerCase.match(regexp)) {
                return true
            }
        }
        return false
    }

    public isOwnershipContextRequired(input: string): boolean {
        const inputLowerCase = input.toLowerCase()
        // If the input matches any of the `ownershipRegexps` we assume that we have to include
        // the ownership context to the overall message context.
        for (const regexp of ownershipRegexps) {
            if (inputLowerCase.match(regexp)) {
                return true
            }
        }
        return false
    }
}
