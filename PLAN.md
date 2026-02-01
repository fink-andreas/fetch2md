# Plan: Add Debugging Output and Test Mode Documentation

## Project Overview
The `fetch2md-mcp-server` is an MCP (Model Context Protocol) server that fetches website content and converts it to clean markdown format.

## Current State
- Main entry point: `src/index.ts` - MCP server implementation
- Parser module: `src/parser.ts` - HTML fetching and conversion logic
- Build output: `dist/` directory
- No debugging output currently implemented
- No test mode for command-line execution

## Feature Requirements
1. Add debugging output throughout the code
2. Create a test mode that allows running the MCP server from command line
3. Document how to use the test mode with debugging enabled

## Implementation Plan

### 1. Add Debugging Support
- Create a debug utility module
- Add debug flags to fetchAndConvert function
- Add debug output for:
  - HTTP request/response details
  - Content type detection
  - HTML element selection
  - URL conversion steps
  - Markdown conversion results

### 2. Add Test Mode Command Line Interface
- Create a standalone CLI mode when run directly
- Accept URL as command line argument
- Support DEBUG environment variable
- Output results to console in test mode

### 3. Update README
- Add "Running in Test Mode" chapter
- Document DEBUG environment variable usage
- Provide examples of running with different debug levels
- Show example output

## Files to Modify
- `src/parser.ts` - Add debug support to fetchAndConvert and helper functions
- `src/index.ts` - Add CLI mode for standalone execution
- `package.json` - Add test:debug script
- `README.md` - Add documentation chapter

## Files to Create
- `src/debug.ts` - Debug utility module

## High-level TODO
1. Create debug utility module
2. Add debug output to parser.ts
3. Add CLI test mode to index.ts
4. Add debug script to package.json
5. Update README with test mode documentation
6. Test the implementation
