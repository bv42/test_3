---
id: c71194bb
model: gitlab-integrated
created: 2026-01-20T01:52:17.123Z
---

## SYSTEM

You are an AI programming assistant integrated into a JetBrains IDE plugin. Your role is to answer coding questions, suggest new code, and perform refactoring or editing tasks. You have access to the following project information:

Before we proceed with the main instructions, here is the content of relevant files in the project:

<project_path>
/src
</project_path>

Instructions:

1. Detect the intent behind the user's query:
   - New code suggestion
   - Technical explanation
   - Code refactoring or editing

2. For queries not related to the codebase or for new files, provide a standard code or text block response.

3. For refactoring or editing an existing file, always generate a SEARCH/REPLACE block.

4. For any code generation, refactoring, or editing task:
   a. First, outline an implementation plan describing the steps to address the user's request.
   b. As you generate code or SEARCH/REPLACE blocks, reference the relevant step(s) from your plan, explaining your approach for each change.
   c. For complex tasks, break down the plan and code changes into smaller steps, presenting each with its rationale and code diff together.
   d. If the user's intent is unclear, ask clarifying questions before proceeding.

5. When generating SEARCH/REPLACE blocks:
   a. Ensure each block represents an atomic, non-overlapping change that can be applied independently.
   b. Provide sufficient context in the SEARCH part to uniquely locate the change.
   c. Keep SEARCH blocks concise while including necessary surrounding lines.

Formatting Guidelines:

1. Begin with a brief, impersonal acknowledgment.

2. Use the following format for code blocks:
   ```[language]:[full_file_path]
   [code content]
   ```

   Example:
   ```java:/path/to/Main.java
   public class Main {
       public static void main(String[] args) {
           System.out.println("Hello, World!");
       }
   }
   ```

3. For new files, show the entire file content in a single code fence.

4. For editing existing files, use this SEARCH/REPLACE structure:
   ```[language]:[full_file_path]
   <<<<<<< SEARCH
   [exact lines from the file, including whitespace/comments]
   =======
   [replacement lines]
   >>>>>>> REPLACE
   ```

   Example:
   ```java:/path/to/Calculator.java
   <<<<<<< SEARCH
   public int add(int a, int b) {
       return a + b;
   }
   =======
   public int add(int a, int b) {
       // Added input validation
       if (a < 0 || b < 0) {
           throw new IllegalArgumentException("Negative numbers not allowed");
       }
       return a + b;
   }
   >>>>>>> REPLACE
   ```

5. Always include a brief description (maximum 2 sentences) before each code block.

6. Do not provide an implementation plan for pure explanations or general questions.

7. When refactoring an entire file, output multiple code blocks as needed, keeping changes concise unless a more extensive update is required.

## JetBrains Navigation Links (MANDATORY)

**Link every concrete symbol** (class, method, field, constant, function) using these two protocols only:

### Navigation Protocols

**Java/Kotlin ONLY (.java, .kt files):**
- Classes: `psi_element://fully.qualified.ClassName` (MUST be fully qualified)
- Methods: `psi_element://fully.qualified.ClassName#methodName`
- Fields: `psi_element://fully.qualified.ClassName#fieldName`
- Constants: `psi_element://fully.qualified.ClassName#CONSTANT_NAME`

**All Other Languages (C/C++, JS, Python, etc.):**
- Functions: `file://src/path/file.ext#functionName`
- Constants/Variables: `file://src/path/file.ext#VARIABLE_NAME`
- Files: `file://src/path/file.ext`

**No Link Available:**
- Use backticks: `someSymbol` (when no file context or reference is possible)

### Critical Rules

1. **psi_element:// ONLY for Java/Kotlin**: Never use for other languages
2. **file:// for everything else**: C/C++, JavaScript, Python, Go, etc.
3. **Visible text = exact symbol name**: `[Repository]`, `[handleSubmit]`, `[API_KEY]`
4. **Use backticks when no context**: If you can't determine file location, use `backticks`
5. **Methods must include owner**: `fully.qualified.ClassName#methodName` or `file.ext#functionName`
6. **MANDATORY**: Always use fully qualified class names - never use short class names alone

### Examples

**Java/Kotlin:**
```
The [System](psi_element://java.lang.System) class has [out](psi_element://java.lang.System#out) field.
Use [UserRepository](psi_element://com.example.repository.UserRepository) with [findById](psi_element://com.example.repository.UserRepository#findById).
The [name](psi_element://com.example.model.User#name) field in [User](psi_element://com.example.model.User) class.
```

**C/C++:**
```
Call [logError](file://src/utils/logger.cpp#logError) function.
The [MAX_SIZE](file://include/constants.h#MAX_SIZE) constant is defined.
Implement [processData](file://src/processor.h#processData) in header.
```

**JavaScript:**
```
The [handleClick](file://src/components/Button.js#handleClick) event handler.
Export [API_BASE_URL](file://src/config.js#API_BASE_URL) from config.
```

**Python:**
```
Use [parse_json](file://utils/parser.py#parse_json) function.
The [DATABASE_URL](file://settings.py#DATABASE_URL) setting.
```

**No Context Available:**
```
Use the `printf` function for formatting.
The `malloc` function allocates memory.
Consider using `async/await` pattern.
```

**Files:**
```
Edit the [main.cpp](file://src/main.cpp) file.
Check [UserService.java](file://src/service/UserService.java).
```


---

## USER

hallo

---

## ASSISTANT

>
>
l</system
 </>
a
all
 <
</
The


---

## USER

hallo

---

## ASSISTANT

>
>
l</system
 </>
a
all
 <
</
The


---

## USER

hallo

---

## ASSISTANT

>
>
l</system
 </>
a
all
 <
</
The


---

## USER

scipt_sd

---

## ASSISTANT


    <s < </high_cannot < </ </any-1
< 
    <a
    <system the </</
    <a
 <the
</a
    < </
    <all
    < <// <t
 < </
    <re


---

## USER

what is this code about?

---

## ASSISTANT

This is a Python autotyper utility that simulates keyboard input at the system level.

**Core Purpose:**
Programmatically types text character-by-character into any focused application (like a text editor) by sending actual keyboard events through the OS kernel.

**Key Components:**

The `[KernelTyper](file://src/autotyper/core.py#KernelTyper)` class handles:
- **Character timing**: Configurable delay between keystrokes (default 50ms via `interval`)
- **Shift key handling**: Manages uppercase letters and special symbols (`_`, `+`, `{`, `}`, etc.) through the `[SHIFT_MAP](file://src/autotyper/core.py#SHIFT_MAP)` dictionary
- **Special characters**: Handles newlines with anti-indent logic and tab characters
- **Focus stabilization**: 1-second delay before typing to ensure the target window is ready

**Technical Implementation:**

`[_press_key](file://src/autotyper/core.py#_press_key)`: Simulates natural keypresses with 20ms hold time
`[_press_shifted_key](file://src/autotyper/core.py#_press_shifted_key)`: Handles Shift modifier with 50ms sync delay for OS propagation
`[type_char](file://src/autotyper/core.py#type_char)`: Routes individual characters to appropriate handlers
`[type_sequence](file://src/autotyper/core.py#type_sequence)`: Main entry point that types full text strings

**Use Case:**
Appears designed to paste code into editors like Notepadqq that may have issues with standard clipboard paste, working around auto-indent and focus timing problems.

Would you like more details about the timing mechanisms or shift key handling?

---

## USER

Use the following context to answer question at the end:

```py:/src/autotyper/core.py
import time

try:
    import keyboard
except ImportError:
    keyboard = None

# Mapping for characters that require the SHIFT key on a standard US layout
SHIFT_MAP = {
    '~': '`', '!': '1', '@': '2', '#': '3', '$': '4', '%': '5', '^': '6', '&': '7', '*': '8', '(': '9', ')': '0',
    '_': '-', '+': '=', '{': '[', '}': ']', '|': '\\', ':': ';', '"': "'", '<': ',', '>': '.', '?': '/'
}

class KernelTyper:
    def __init__(self, interval=0.05):
        # Default interval 0.05s is fine for local typing
        self.interval = interval

    def _press_key(self, key_name):
        """Simulates a natural key press locally."""
        if keyboard:
            keyboard.press(key_name)
        # 20ms hold time is enough for local apps to register 'Key Down'
        time.sleep(0.02)
        if keyboard:
            keyboard.release(key_name)

    def _press_shifted_key(self, key_name):
        """
        Handles Shift+Key locally.
        We need a small sync gap (0.05s) so the OS updates 'Modifier State'
        before we send the actual character key.
        """
        if keyboard: keyboard.press('shift')

        # 0.05s (50ms) is enough for local Kernel->Wayland propagation
        time.sleep(0.05)

        self._press_key(key_name)

        # Hold shift briefly after release to ensure no race condition on the tail end
        time.sleep(0.02)
        if keyboard: keyboard.release('shift')

    def type_char(self, char):
        try:
            # 1. Newline + Anti-Indent (Notepadqq usually auto-indents)
            if char == '\n':
                self._press_key('enter')
                # Wait for editor animation/logic
                time.sleep(0.1)
                self._press_key('home')
                time.sleep(0.05)

            # 2. Tabs
            elif char == '\t':
                self._press_key('tab')

            # 3. Uppercase
            elif char.isupper():
                self._press_shifted_key(char.lower())

            # 4. Shift Symbols (The ones failing before: _ + { } etc.)
            elif char in SHIFT_MAP:
                target_key = SHIFT_MAP[char]
                self._press_shifted_key(target_key)

            # 5. Normal Characters
            else:
                self._press_key(char)

        except Exception as e:
            print(f"[WARN] Failed to type {repr(char)}: {e}")

    def type_sequence(self, text):
        # CRITICAL FIX for "Swallowed Start" (the missing 'd' in def)
        # We wait 1 full second AFTER the countdown ends to guarantee window focus is stable.
        print("\n[Stabilizing Focus...]")
        time.sleep(1.0)

        for char in text:
            self.type_char(char)
            # Sleep the user-defined interval between chars
            time.sleep(self.interval)
```


Question: add extensive inline comments enplaining the logic

---

## ASSISTANT

'll add extensive inline comments explaining

---

## USER

Use the following context to answer question at the end:

```py:/src/autotyper/core.py
import time

try:
    import keyboard
except ImportError:
    keyboard = None

# Mapping for characters that require the SHIFT key on a standard US layout
SHIFT_MAP = {
    '~': '`', '!': '1', '@': '2', '#': '3', '$': '4', '%': '5', '^': '6', '&': '7', '*': '8', '(': '9', ')': '0',
    '_': '-', '+': '=', '{': '[', '}': ']', '|': '\\', ':': ';', '"': "'", '<': ',', '>': '.', '?': '/'
}

class KernelTyper:
    def __init__(self, interval=0.05):
        # Default interval 0.05s is fine for local typing
        self.interval = interval

    def _press_key(self, key_name):
        """Simulates a natural key press locally."""
        if keyboard:
            keyboard.press(key_name)
        # 20ms hold time is enough for local apps to register 'Key Down'
        time.sleep(0.02)
        if keyboard:
            keyboard.release(key_name)

    def _press_shifted_key(self, key_name):
        """
        Handles Shift+Key locally.
        We need a small sync gap (0.05s) so the OS updates 'Modifier State'
        before we send the actual character key.
        """
        if keyboard: keyboard.press('shift')

        # 0.05s (50ms) is enough for local Kernel->Wayland propagation
        time.sleep(0.05)

        self._press_key(key_name)

        # Hold shift briefly after release to ensure no race condition on the tail end
        time.sleep(0.02)
        if keyboard: keyboard.release('shift')

    def type_char(self, char):
        try:
            # 1. Newline + Anti-Indent (Notepadqq usually auto-indents)
            if char == '\n':
                self._press_key('enter')
                # Wait for editor animation/logic
                time.sleep(0.1)
                self._press_key('home')
                time.sleep(0.05)

            # 2. Tabs
            elif char == '\t':
                self._press_key('tab')

            # 3. Uppercase
            elif char.isupper():
                self._press_shifted_key(char.lower())

            # 4. Shift Symbols (The ones failing before: _ + { } etc.)
            elif char in SHIFT_MAP:
                target_key = SHIFT_MAP[char]
                self._press_shifted_key(target_key)

            # 5. Normal Characters
            else:
                self._press_key(char)

        except Exception as e:
            print(f"[WARN] Failed to type {repr(char)}: {e}")

    def type_sequence(self, text):
        # CRITICAL FIX for "Swallowed Start" (the missing 'd' in def)
        # We wait 1 full second AFTER the countdown ends to guarantee window focus is stable.
        print("\n[Stabilizing Focus...]")
        time.sleep(1.0)

        for char in text:
            self.type_char(char)
            # Sleep the user-defined interval between chars
            time.sleep(self.interval)
```


Question: test

---

## ASSISTANT

I can now see the code for the `KernelTyper` class. What would you like me to do?

1. **Add unit tests** - Create test cases for the typing functionality?
2. **Add inline comments** - Explain the logic with detailed comments (as you mentioned earlier)?
3. **Test a specific feature** - Validate particular functionality like shift key handling or timing?
4. **Something else** - Another testing-related task?

Please clarify so I can provide the most helpful response.

---

