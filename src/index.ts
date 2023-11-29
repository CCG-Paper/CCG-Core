import { ccgTestJs } from "./tmp-test.js";
import { CCGNode } from "./model.js";
import { CCGNodeGenerator } from "./templates/generator.js";
import { CCGTreeBuilder } from "./tree-builder.js";

export function ccgParseString(stringToParse: string, sourceType: string) {
    return CCGTreeBuilder.buildCcgTree(stringToParse, sourceType);
}

export function generateCCGTemplate(sourceType: string, ccgTree: CCGNode) {
    const ccgTemplate = CCGNodeGenerator.createCCGNodeTemplate(sourceType, ccgTree);
    return ccgTemplate?.generate();
}

console.log(ccgTestJs());