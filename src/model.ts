import { ParserRuleContext } from "antlr4";

export class CCGNode {
    selection: SelectionState | undefined;
    children: CCGNode[] = [];
    fullId: string = "";
    id: string = "";
    parent: CCGNode | undefined;
    bottomUpId: string = "";
    parserRuleContext: ParserRuleContext | undefined;
    ruleName: string = "";
    content: string = "";
    parameter: CCGGeneratorParameter | undefined;
    customName: string = "";

    toString(): string {
        return JSON.stringify(this.minify());
    }

    minify(): {ruleName: string, id: string, bottomUpId: string, content: string, selection: string, children: unknown[]} {
        return {
            ruleName: this.ruleName,
            id: this.id,
            content: this.content,
            bottomUpId: this.bottomUpId,
            selection: this.selection?.toString() ?? '',
            children: this.children.map(child => child.minify())
        };
    }

    generate(): void {
        if(this.selection === SelectionState.deletion) {
            return;
        }
        if(this.selection === SelectionState.substitution) {
            this.parameter = SelectionState.substitution;
            return;
        }
        
        // Post-order traversal
        for(const child of this.children) {
            child.generate();
        }

        this.parameter = this.selection;
    }
}

export enum SelectionState {
    condition = "condition",
    deletion = "deletion",
    repetition = "repetition",
    substitution = "substitution"
}

export type CCGGeneratorParameter = SelectionState | CCGGeneratorParameter[];
