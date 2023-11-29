import Handlebars from "handlebars";
import { CCGNode, SelectionState } from "../model.js";
import { ignoreContent, postRuleContent, preRuleContent } from "../configuration.js";

export class CCGNodeTemplate {
    templateName: string;
    parameters: Map<string, ParameterTypes> = new Map<string, ParameterTypes>();
    content: string = "";
    // private isRepetitionAggregation: boolean;

    constructor(sourceType: string, ccgNode: CCGNode, children: CCGNodeTemplate[]) {
        const parameterName = CCGNodeTemplate.getParameterName(ccgNode);
        this.templateName = parameterName;

        // As only leaves contain content, aggregation can be done by simply aggregating children if present
        for(const child of children) {
            for(const parameter of (child.parameters?.entries() ?? [])) {
                this.parameters.set(parameter[0], parameter[1]);
            }
            this.content += child.content;
        }
        if(!ignoreContent[sourceType]?.includes(ccgNode.content)) {
            // Configured Pre Content
            const retrievedPreRuleContent = (preRuleContent[sourceType] ?? {})[ccgNode.ruleName] ?? undefined;
            if(retrievedPreRuleContent) {
                this.content = retrievedPreRuleContent + this.content;
            }
            
            // Add content
            this.content += ccgNode.content;
            
            // Configured Post Content
            const retrievedPostRuleContent = (postRuleContent[sourceType] ?? {})[ccgNode.ruleName] ?? undefined;
            if(retrievedPostRuleContent) {
                this.content += retrievedPostRuleContent;
            }
        }
        
        // Deletion shouldn't occur here
        switch(ccgNode.selection) {
            case SelectionState.substitution:
                this.parameters.set(parameterName, "string");
                this.content = `{{${parameterName}}}`
                break;
            case SelectionState.condition:
                this.parameters.set(parameterName, "boolean");
                this.content = `{{#if ${parameterName}}}${this.content}{{/if}}`;
                break;
            case SelectionState.repetition:
                if(this.parameters.size !== 0) {
                    // this.isRepetitionAggregation = true;
                    this.parameters = new Map<string, ParameterTypes>([[parameterName, this.parameters]]);
                    this.content = `{{#${parameterName}}}${this.content}{{/${parameterName}}}`;
                } else {
                    this.parameters.set(parameterName, "number");
                    this.content = `{{#times ${parameterName}}}${this.content}{{/times}}`;
                }
                break;
        }
    }

    static getParameterName(ccgNode: CCGNode) {
        return `_${ccgNode.id}`;
    }

    generate(): string {
        const output = `import Handlebars from "handlebars";
        export class ${this.templateName}Template {

            static generate(${Array.from(this.parameters.entries()).map(param => `${param[0]}`).join(', ')}) {
                const template = Handlebars.compile(\`${this.content}\`);
                return template({${Array.from(this.parameters.entries()).map(param => `${param[0]} : ${param[0]}`).join(', ')}})
            }
        }`;

        return output;
    }

}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
abstract class CCGGeneralGenerator {
    processTemplate(data: object, template: string): string {
        const handlebarsTemplate = Handlebars.compile(template);
        return handlebarsTemplate(data);
    }
}

type ParameterTypes = "string" | "number" | "boolean" | Map<string, ParameterTypes>;

export class CCGNodeGenerator {
    static createCCGNodeTemplate(sourceType: string, ccgNode: CCGNode) {
        if(ccgNode.selection === SelectionState.deletion) {
            return undefined;
        }

        const childTemplates = ccgNode.children.map(child => CCGNodeGenerator.createCCGNodeTemplate(sourceType, child)).filter((el): el is CCGNodeTemplate => !!el)

        const nodeTemplate: CCGNodeTemplate = new CCGNodeTemplate(sourceType, ccgNode, childTemplates);
        return nodeTemplate;
    }
}
