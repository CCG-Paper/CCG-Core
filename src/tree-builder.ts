import { CharStream, CommonTokenStream, Lexer, ParseTreeVisitor, Parser, ParserRuleContext } from "antlr4";
import { CCGNode } from "./model.js";
import { Md5 } from "ts-md5";
import HTMLLexer from "../antlr/html/HTMLLexer.js";
import HTMLParser from "../antlr/html/HTMLParser.js";
import JavaScriptLexer from "../antlr/javascript/JavaScriptLexer.js";
import JavaScriptParser from "../antlr/javascript/JavaScriptParser.js";

export class CCGTreeBuilder {
    static buildCcgTree(input: string, fileType: string): CCGNode | undefined {
        const chars = new CharStream(input);
        let lexer: Lexer | undefined = undefined;
        if(fileType === "html") {
            lexer = new HTMLLexer(chars);
        } else if(fileType === "js") {
            lexer = new JavaScriptLexer(chars);
        } else {
            console.error("No matching parser found for: " + fileType);
            return;
        }
        const tokens = new CommonTokenStream(lexer as Lexer);
        let parser: Parser | undefined = undefined;
        if(fileType === "html") {
            parser = new HTMLParser(tokens);
        } else if(fileType === "js") {
            parser = new JavaScriptParser(tokens);
        } else {
            console.error("No matching lexer found for: " + fileType);
            return;
        }
        if(fileType === "html") {
            const tree = (parser! as HTMLParser).htmlDocument();
            return tree!.accept(new CCGVisitor());
        } else if(fileType === "js") {
            const tree = (parser as JavaScriptParser).program();
            return tree!.accept(new CCGVisitor());
        } else {
            console.error("No root rule found for: " + fileType);
            return;
        }
    }
}

class CCGVisitor extends ParseTreeVisitor<CCGNode> {
    parser: SpecializedParser | undefined;
    lexer: SpecializedLexer | undefined;
    idLevel = 0;

    visitChildren(ctx: ParserRuleContext, parent?: CCGNode): CCGNode {
        // if (!ctx) {
        //     return;
        // }
        if(!this.parser && ctx.parser && hasRuleNames(ctx.parser)) {
            this.parser = ctx.parser;
        }
        const ccgNode = new CCGNode();
        ccgNode.parent = parent;
        ccgNode.parserRuleContext = ctx;

        if(hasRuleIndex(ctx)) {
            ccgNode.ruleName = this.parser?.ruleNames[ctx.ruleIndex] ?? ""
        }

        ccgNode.fullId = `${parent?.id ? parent.id + this.idLevel++ : 'root'}${ccgNode.ruleName}`;
        ccgNode.id = Md5.hashAsciiStr(ccgNode.fullId);

        if (ctx.children) {
            ccgNode.children = ctx.children.map(child => {
                if (child instanceof ParserRuleContext && child.children && child.children.length != 0) {
                    return this.visitChildren(child, ccgNode)
                } else if (isToken(child)) {
                    if(!this.lexer && child.symbol.source[0]) {
                        this.lexer = child.symbol.source[0] as SpecializedLexer;
                    }
                    const childNode = new CCGNode();
                    childNode.parent = ccgNode;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if((this.parser as any).symbolicNames !== undefined) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        childNode.ruleName = (this.parser as any)?.symbolicNames[child.symbol.type] ?? "";
                    }
                    childNode.content = child.getText();
                    childNode.fullId = `${ccgNode?.id ? ccgNode.id + this.idLevel++ : 'root'}${childNode.ruleName}`;
                    childNode.id = Md5.hashAsciiStr(childNode.fullId);
                    return childNode;
                }
            }).filter(element => element !== undefined) as CCGNode[];
        }
        return ccgNode;
    }
}

declare class SpecializedParser extends Parser {
    ruleNames: string[];
}

function hasRuleNames(obj: Parser): obj is SpecializedParser {
    return (obj as SpecializedParser).ruleNames !== undefined;
}

declare class SpecializedLexer extends Lexer {
    symbolicNames: (string | null)[];
}

// function hasSymbolicNames(obj: Lexer): obj is SpecializedLexer {
//     return (obj as SpecializedLexer).symbolicNames !== undefined;
// }

declare class SpecializedParserRuleContext extends ParserRuleContext {
    ruleIndex: number;
}

function hasRuleIndex(obj: ParserRuleContext): obj is SpecializedParserRuleContext {
    return (obj as SpecializedParserRuleContext).ruleIndex !== undefined;
}

declare class SpecializedToken {
    symbol: {
        type: number;
        source: unknown[];
    }
}

function isToken(obj: unknown): obj is SpecializedToken {
    return (obj as SpecializedToken).symbol !== undefined &&
        (obj as SpecializedToken).symbol.type !== undefined &&
        (obj as SpecializedToken).symbol.source !== undefined &&
        (obj as SpecializedToken).symbol.source[0] instanceof Lexer;
}
