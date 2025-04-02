# CLR(1) Parser Web Application

A web-based tool for parsing context-free grammars using the CLR(1) technique, featuring step-by-step visualization.

## Features

- Parses context-free grammars using the CLR(1) algorithm
- Computes and displays First & Follow sets
- Generates the parsing table
- Visualizes step-by-step parsing
- Detects parsing conflicts
- Responsive user interface

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd CLR-Parser
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the application:
   ```bash
   python server.py
   ```
4. Open your browser at:
   ```
   http://localhost:8081
   ```

## Sample Grammar

Use the following sample grammar to test the parser:

```
S->E
E->E+E
E->E*E
E->(E)
E->a
```

## Usage

1. Enter grammar rules (one per line).
2. Input a test string.
3. Click "Parse" to analyze.
4. View results:
   - **Symbols**: Terminals & Non-terminals
   - **First/Follow**: Computed sets
   - **Parse Table**: CLR(1) table
   - **Steps**: Parsing breakdown

## Technologies Used

- **Backend**: Python, FastAPI
- **Frontend**: HTML, CSS, JavaScript
- **UI Framework**: Bootstrap 5
- **Parsing Algorithm**: Custom CLR(1) implementation

## Key Components

### Backend (FastAPI)

- **API Endpoints**:
  - `GET /` - Serves the frontend
  - `GET /api` - API info
  - `POST /parse` - Parses an input string

- **Core Classes**:
  - `Terminal` & `NonTerminal` - Grammar symbols
  - `Item` - LR(1) item representation
  - `State` - CLR(1) automaton state
  - `standalone_parser.py` - Main parsing logic

### Parsing Algorithm

1. **Grammar Analysis**:
   - Parse grammar rules
   - Compute First & Follow sets
   - Augment grammar
2. **State Generation**:
   - Build LR(1) closures
   - Construct parsing table
3. **Parsing Execution**:
   - Process input with a parsing stack
   - Display parsing steps

### Frontend

- **UI Components**:
  - Input fields for grammar & test strings
  - Parsing results with tabbed navigation
  - Conflict detection panel
  - Responsive design

- **Visualization Features**:
  - **Parsing Table** - Displays shift/reduce actions
  - **Parsing Steps** - Tracks stack & input changes
  - **Symbol Display** - Color-coded for clarity

## Conflict Detection & Error Handling

- Detects **Shift/Reduce & Reduce/Reduce** conflicts
- Displays error messages for invalid inputs
- Handles exceptions at API & UI levels

## Conclusion

This CLR(1) Parser tool simplifies context-free grammar analysis with an interactive web interface. It’s useful for both educational purposes and real-world parsing tasks.

