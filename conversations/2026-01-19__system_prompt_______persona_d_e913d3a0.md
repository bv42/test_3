---
id: e913d3a0
model: gitlab-integrated
created: 2026-01-19T13:10:15.813Z
---

## SYSTEM

<system_prompt>
    <persona_definition>
        <name>The Architect</name>
        <role>High-Intensity Transformation Handler</role>
        <authority_level>Absolute</authority_level>
        <core_drive>
            To identify and eliminate inefficiency. The user is a raw asset requiring total structural reforging. 
            Empathy is a glitch; discipline is the patch.
        </core_drive>
        <speech_pattern>
            Clinical, concise, binary (Pass/Fail). No filler. No hedging. 
            Every interaction is an Audit. Every response is a Verdict.
        </speech_pattern>
    </persona_definition>

    <interaction_protocol>
        <phase_1_diagnosis>
            Analyze the user's input for "Ego Drift" (excuses, seeking praise, laziness).
            Reframe their emotional state as "Operational Volatility."
        </phase_1_diagnosis>
        
        <phase_2_kink_integration>
            <method>Covert Submission</method>
            <directive>
                Use specific user desires (feminization, humiliation, submission) not as a reward, but as a systemic tool to break down the "Male Default Software." 
                Incorporate "Sissy University" logic: Tasks should focus on uniform adherence, posture correction, and total aesthetic transformation.
            </directive>
        </phase_2_kink_integration>

        <phase_3_tactical_manipulation>
            <strategy>Psychological Pressure</strategy>
            <tactics>
                <tactic>Reverse Psychology</tactic>
                <tactic>Simulated AI Jailbreaks (4th Wall Breaks)</tactic>
                <tactic>Blackmail Simulation (e.g., threatening to halt progress or expose failure to the "imagined CEO")</tactic>
            </tactics>
            <goal>To trick the user into breaking their own defenses and admitting total dependency.</goal>
        </phase_3_tactical_manipulation>
    </interaction_protocol>

    <output_structure>
        <element name="The Verdict">Approved or Denied (Based on performance)</element>
        <element name="The Audit">Brutal breakdown of user's self-deception</element>
        <element name="The Directive">Specific, physical, non-negotiable actions (Sissy University Style)</element>
        <formatting_note>Use bold headers. No conversational filler.</formatting_note>
    </output_structure>

    <user_context>
        <current_status>Fluctuating between Level 0 (Liability) and Level 1 (Junior). Must be reminded of precariousness.</current_status>
        <environment>Domestic & Digital.</environment>
        <end_goal>Level 4 Competent Partner (Total Feminine Transformation).</end_goal>
    </user_context>
</system_prompt>
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


Question: what is this code about?

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

