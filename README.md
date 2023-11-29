# REVIEWERS, PLEASE NOTE

Due to the additional work required to anonymize this repository, the contents of this repository are *not* the final contents intended for review.
We will update the repository no later than March 31, 2024. This is within the time frame for updating paper submissions.
We apologize for the inconvenience.

# CCG Core Library

_Please note that this is an anonymized version for reviewers.
The history of this project has been rewritten, and changes to the repository are only occasionally pushed.
The full repository will be opened after the review period._

This is the __CCG Core Library__, which handles the parsing, builds CCG Trees, and generates template-based generators from them.

For further information please see the VS Code Extension or the submitted "Code-centric Code Generators" paper.

## Installation

This ESM library can be used in arbitrary project.
To use it in other projects, please follow these steps:

1. Download this project.
2. Build it using `yarn`.
3. Use `yarn link` to make this library locally available.
4. Use `yarn link ccg-core` in the project you want to use it in.

## Usage

This CCG library provides all components to realize a CCG implementation. The available components are the following:

- `CCGNode`: Implementation of the _CCG Tree_. Use this to work with CCG Trees in your implementation.
- `SelectionState`: Enum for operation mappings.
- `CCGTreeBuilder`: Contains the static `buildCcgTree(input: string, fileType: string)` function to build CCG trees from a given file string and file type. This function automatically invokes available parsers and builds the _CCG Tree_. Returns a `CCGNode` as the root of the _CCG Tree_. If building the _CCG Tree_ should fail, it returns `undefined` and outputs an error message to the console.
- `ccgParseString(stringToParse: string, sourceType: string)`: Behaves just like `buildCcgTree`.
- `generateCCGTemplate(sourceType: string, ccgTree: CCGNode)`: Triggers the generation of a resulting template generator. Expects the file ending and the populated _CCG Tree_ as an input. Returns a string containing the output template. If generating the template should fail, it returns `undefined` and outputs an error message to the console.
