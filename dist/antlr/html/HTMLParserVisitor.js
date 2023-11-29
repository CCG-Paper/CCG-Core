// Generated from antlr/html/HTMLParser.g4 by ANTLR 4.13.1
import { ParseTreeVisitor } from 'antlr4';
/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `HTMLParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export default class HTMLParserVisitor extends ParseTreeVisitor {
    /**
     * Visit a parse tree produced by `HTMLParser.htmlDocument`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitHtmlDocument;
    /**
     * Visit a parse tree produced by `HTMLParser.scriptletOrSeaWs`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitScriptletOrSeaWs;
    /**
     * Visit a parse tree produced by `HTMLParser.htmlElements`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitHtmlElements;
    /**
     * Visit a parse tree produced by `HTMLParser.htmlElement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitHtmlElement;
    /**
     * Visit a parse tree produced by `HTMLParser.htmlContent`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitHtmlContent;
    /**
     * Visit a parse tree produced by `HTMLParser.htmlAttribute`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitHtmlAttribute;
    /**
     * Visit a parse tree produced by `HTMLParser.htmlChardata`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitHtmlChardata;
    /**
     * Visit a parse tree produced by `HTMLParser.htmlMisc`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitHtmlMisc;
    /**
     * Visit a parse tree produced by `HTMLParser.htmlComment`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitHtmlComment;
    /**
     * Visit a parse tree produced by `HTMLParser.script`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitScript;
    /**
     * Visit a parse tree produced by `HTMLParser.style`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitStyle;
}
//# sourceMappingURL=HTMLParserVisitor.js.map