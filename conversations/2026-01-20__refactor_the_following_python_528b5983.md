---
id: 528b5983
model: gitlab-integrated
created: 2026-01-20T03:13:34.438Z
---

## USER


Refactor the following Python code to use list comprehension. Output the result in a markdown code block.
def get_squares(n):
    squares = []
    for i in range(n):
        squares.append(i * i)
    return squares


---

## ASSISTANT

Here's the refactored code using list comprehension:

```python
def get_squares(n):
    return [i * i for i in range(n)]
```

This refactoring:
- Eliminates the need for an empty list initialization
- Removes the explicit loop and append operation
- Reduces the function to a single return statement
- Maintains the same functionality while being more Pythonic and concise

Would you like more details about list comprehensions or other refactoring patterns?

---

