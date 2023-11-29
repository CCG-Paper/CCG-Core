import { CCGNodeGenerator } from "./templates/generator.js";
import { CCGNode, SelectionState } from "./model.js";
import { CCGTreeBuilder } from "./tree-builder.js";

export function ccgTestHtml() {
    const rootNode = CCGTreeBuilder.buildCcgTree(`<!DOCTYPE html>
    <html>
        <body>
            <h1>My First Heading</h1>
            <p>My first paragraph.</p>
        </body>
    </html>`, "html");
    markSubstitutionHTML_TEXT(rootNode!);
    const ccgTemplate = CCGNodeGenerator.createCCGNodeTemplate("html", rootNode!);
    console.log('content', ccgTemplate?.content);
    console.log('parameters', ccgTemplate?.parameters);
    return ccgTemplate?.generate();
}

function markSubstitutionHTML_TEXT(ccgNode: CCGNode) {
    if(ccgNode.children.length > 0) {
        ccgNode.children.forEach(child => markSubstitutionHTML_TEXT(child));
    } else {
        if(ccgNode.ruleName === 'HTML_TEXT') {
            ccgNode.selection = SelectionState.condition;
        }
    }
}

export function ccgTestJs() {
    const rootNode = CCGTreeBuilder.buildCcgTree(`alert('Hello, world!');`, "js");
    // console.log(rootNode.toString());
    markSubstitutionArgument(rootNode!);
    const ccgTemplate = CCGNodeGenerator.createCCGNodeTemplate("js", rootNode!);
    console.log('content', ccgTemplate?.content);
    console.log('parameters', ccgTemplate?.parameters);
    return ccgTemplate?.generate();
}

function markSubstitutionArgument(ccgNode: CCGNode) {
    if(ccgNode.children.length > 0) {
        ccgNode.children.forEach(child => markSubstitutionArgument(child));
    } else {
        if(ccgNode.ruleName === 'argument') {
            ccgNode.selection = SelectionState.condition;
        }
    }
}
