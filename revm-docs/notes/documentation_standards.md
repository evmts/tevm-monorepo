# REVM Documentation Standards

This note establishes consistent standards for the REVM documentation. These standards will ensure uniformity in style, formatting, code examples, and overall presentation across all documentation sections.

## General Writing Style

To maintain the high quality documentation inspired by Stripe and Vue.js:

1. **Clear and Concise**
   - Use direct, simple language
   - Avoid unnecessary jargon or complexity
   - Focus on clarity and precision
   - Keep sentences and paragraphs reasonably short

2. **Active Voice**
   - Prefer active voice over passive
   - Example: "REVM executes the transaction" instead of "The transaction is executed by REVM"
   - Use direct address ("you") when guiding the reader

3. **Consistency**
   - Maintain consistent terminology throughout
   - Use the same terms for the same concepts
   - Define terms clearly when first introduced
   - Create and refer to a glossary for key terms

4. **Progressive Disclosure**
   - Start with basic concepts before advanced ones
   - Layer information from simple to complex
   - Provide context before details
   - Link to more advanced topics for interested readers

## Document Structure

Each document should follow a consistent structure:

1. **Title and Introduction**
   - Clear, descriptive title
   - Brief introduction (1-2 paragraphs)
   - What the document covers
   - Who it's for and why it matters

2. **Table of Contents**
   - For longer documents (when appropriate)
   - Clickable links to sections
   - Hierarchical organization

3. **Main Content**
   - Logical progression of topics
   - Clear section headings (H2, H3, H4)
   - Each section focused on a specific concept
   - Transitions between sections

4. **Code Examples**
   - Relevant, practical examples
   - Properly introduced and explained
   - Complete enough to be useful
   - Simple enough to be understood

5. **Summary**
   - Brief recap of key points
   - Next steps or related topics
   - Links to related documentation

## Markdown Formatting

Consistent markdown formatting should be used:

1. **Headings**
   - `#` for document title
   - `##` for major sections
   - `###` for subsections
   - `####` for minor sections
   - Capitalize first word and proper nouns

2. **Emphasis**
   - *Italics* (`*text*`) for emphasis or introducing new terms
   - **Bold** (`**text**`) for strong emphasis or UI elements
   - `Code formatting` for code references, function names, etc.

3. **Lists**
   - Unordered lists for collections of related items
   - Ordered lists for sequential steps or ranked items
   - Nested lists with proper indentation
   - Consistent capitalization and punctuation in list items

4. **Links**
   - Descriptive link text (not "click here")
   - Internal links to related documentation
   - External links to reference materials
   - API references linked to relevant documentation

5. **Blockquotes**
   - Use for important notes or callouts
   - Different types of callouts for info, warnings, etc.

## Code Examples

Code examples should follow these standards:

1. **Formatting**
   - Use fenced code blocks with language specification
   - Consistent indentation (4 spaces)
   - Follow Rust style guidelines for Rust code
   - Maximum line length of 80-100 characters

2. **Content**
   - Include imports and dependencies
   - Use realistic, meaningful variable names
   - Include error handling where appropriate
   - Use comments to explain complex parts

3. **Context**
   - Explain the purpose of the example
   - Highlight key parts of the code
   - Explain expected output or behavior
   - Note any prerequisites or assumptions

4. **Completeness**
   - Examples should be complete and runnable
   - Avoid ellipses (`...`) unless absolutely necessary
   - When using partial examples, explain what's omitted
   - Follow examples with expected output where relevant

## Special Elements

These special elements should be used consistently:

1. **Callout Boxes**
   - Info: Additional helpful information
   - Tip: Recommendations and best practices
   - Note: Important considerations
   - Warning: Potential pitfalls or dangers
   - Example: "This is a note callout that provides important information the reader should consider."

2. **Diagrams**
   - Include a descriptive caption
   - Reference the diagram in the text
   - Explain key elements of the diagram
   - Keep diagrams focused and simple

3. **Tables**
   - Use for structured data comparison
   - Include clear headers
   - Align content appropriately
   - Keep tables focused on specific comparisons

4. **Terminal Output**
   - Show command and output in code blocks
   - Distinguish between command and output
   - Format for readability
   - Omit unnecessary output

## API Documentation

For reference documentation sections:

1. **Function/Method Documentation**
   - Purpose: Brief description of what it does
   - Parameters: Each parameter with type and description
   - Return value: Type and description
   - Errors: Possible errors and when they occur
   - Examples: At least one usage example

2. **Type Documentation**
   - Purpose: What the type represents
   - Fields: Each field with type and description
   - Methods: Each method with brief description
   - Implementation details: Important notes on behavior
   - Examples: Usage examples where appropriate

3. **Interface Documentation**
   - Purpose: What the interface provides
   - Required methods: Each method with description
   - Implementation notes: Guidance for implementers
   - Example implementations: Where helpful

## Diagram Standards

When describing diagrams to be created later:

1. **Diagram Description**
   - Title: What the diagram shows
   - Purpose: Why this diagram is helpful
   - Elements: What components should be included
   - Relationships: How elements connect or interact
   - Key points: What the diagram should emphasize

2. **Diagram Types**
   - Architecture diagrams: System components and relationships
   - Flow diagrams: Processes and decisions
   - State diagrams: State transitions
   - Sequence diagrams: Interaction between components over time
   - Class/component diagrams: Software structure

## Code Example Focus Areas

For the areas requiring special emphasis:

1. **Intercepting Calls**
   - How to detect calls to specific addresses
   - How to implement custom precompiles
   - How to modify call behavior
   - How to integrate with existing execution

2. **Custom StateManager**
   - Interface requirements
   - Implementation patterns
   - Integration with REVM
   - Performance considerations

3. **Custom Blockchain Data Structure**
   - Interface requirements
   - Implementation examples
   - Data organization
   - Integration points

4. **EIP and Hardfork Configuration**
   - Available configuration options
   - How to specify hardforks
   - How to enable/disable specific EIPs
   - Testing different configurations

## Cross-References

Maintain consistent cross-referencing:

1. **Internal References**
   - Link to related concepts
   - Link to prerequisite knowledge
   - Link to advanced topics
   - Link to API reference from narrative docs

2. **External References**
   - Link to Ethereum specifications
   - Link to relevant EIPs
   - Link to related tools or libraries
   - Link to source code when appropriate

## Document Metadata

Each document should include consistent metadata:

1. **Header Section**
   - Title
   - Brief description
   - Last updated date
   - Related topics

2. **Footer Section**
   - Navigation links (previous/next)
   - Feedback mechanism reference
   - Contributing guidelines reference