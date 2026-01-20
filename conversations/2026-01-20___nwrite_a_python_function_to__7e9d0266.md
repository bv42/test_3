---
id: 7e9d0266
model: gitlab-integrated
created: 2026-01-20T03:17:05.383Z
---

## USER


\nWrite a Python function to calculate the nth Fibonacci number.\nCRITICAL RULES:\n1. Do NOT use recursion. Use an iterative loop.\n2. The function name must be 'compute_fib'.\n3. You must include a docstring.\n
    

---

## ASSISTANT

Here's a Python function that calculates the nth Fibonacci number using iteration:

```python
def compute_fib(n):
    """
    Calculate the nth Fibonacci number using an iterative approach.
    
    Args:
        n (int): The position in the Fibonacci sequence (0-indexed)
        
    Returns:
        int: The nth Fibonacci number
        
    Examples:
        >>> compute_fib(0)
        0
        >>> compute_fib(1)
        1
        >>> compute_fib(10)
        55
    """
    if n < 0:
        raise ValueError("n must be a non-negative integer")
    
    if n == 0:
        return 0
    if n == 1:
        return 1
    
    # Initialize first two Fibonacci numbers
    prev, curr = 0, 1
    
    # Iterate from 2 to n
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr
    
    return curr
```

This implementation:
- Uses iteration instead of recursion for better performance and avoiding stack overflow
- Handles edge cases (n=0, n=1, and negative values)
- Has O(n) time complexity and O(1) space complexity
- Includes comprehensive docstring with examples

Would you like more details about optimization or handling larger Fibonacci numbers?

---

## USER


\nWrite a Python function to calculate the nth Fibonacci number.\nCRITICAL RULES:\n1. Do NOT use recursion. Use an iterative loop.\n2. The function name must be 'compute_fib'.\n3. You must include a docstring.\n
    

---

## ASSISTANT

Here's a Python function that calculates the nth Fibonacci number using an iterative approach:

```python
def compute_fib(n):
    """
    Calculate the nth Fibonacci number using an iterative approach.
    
    Args:
        n (int): The position in the Fibonacci sequence (0-indexed)
    
    Returns:
        int: The nth Fibonacci number
    
    Examples:
        >>> compute_fib(0)
        0
        >>> compute_fib(1)
        1
        >>> compute_fib(10)
        55
    """
    if n < 0:
        raise ValueError("n must be a non-negative integer")
    
    if n == 0:
        return 0
    if n == 1:
        return 1
    
    # Initialize first two Fibonacci numbers
    prev, curr = 0, 1
    
    # Iteratively calculate up to nth number
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr
    
    return curr
```

**Key features:**
- **Iterative loop**: Uses a `for` loop instead of recursion
- **Time complexity**: O(n) - linear time
- **Space complexity**: O(1) - constant space
- **Edge cases**: Handles n=0, n=1, and negative inputs

Would you like more details about optimization or testing strategies?

---

## USER


\nWrite a Python function to calculate the nth Fibonacci number.\nCRITICAL RULES:\n1. Do NOT use recursion. Use an iterative loop.\n2. The function name must be 'compute_fib'.\n3. You must include a docstring.\n
    

---

## ASSISTANT

Here's a Python function that calculates the nth Fibonacci number using iteration:

```python
def compute_fib(n):
    """
    Calculate the nth Fibonacci number using an iterative approach.
    
    Args:
        n (int): The position in the Fibonacci sequence (0-indexed)
        
    Returns:
        int: The nth Fibonacci number
        
    Examples:
        >>> compute_fib(0)
        0
        >>> compute_fib(1)
        1
        >>> compute_fib(10)
        55
    """
    if n < 0:
        raise ValueError("n must be a non-negative integer")
    
    if n == 0:
        return 0
    if n == 1:
        return 1
    
    # Initialize first two Fibonacci numbers
    prev, curr = 0, 1
    
    # Iterate from 2 to n
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr
    
    return curr
```

This implementation:
- Uses iteration instead of recursion for better performance and avoiding stack overflow
- Handles edge cases (n=0, n=1, and negative values)
- Has O(n) time complexity and O(1) space complexity
- Includes comprehensive docstring with examples

Would you like more details about optimization or handling larger Fibonacci numbers?

---

## USER


\nWrite a Python function to calculate the nth Fibonacci number.\nCRITICAL RULES:\n1. Do NOT use recursion. Use an iterative loop.\n2. The function name must be 'compute_fib'.\n3. You must include a docstring.\n
    

---

## ASSISTANT

Here's a Python function that calculates the nth Fibonacci number using iteration:

```python
def compute_fib(n):
    """
    Calculate the nth Fibonacci number using an iterative approach.
    
    Args:
        n (int): The position in the Fibonacci sequence (0-indexed)
        
    Returns:
        int: The nth Fibonacci number
        
    Examples:
        >>> compute_fib(0)
        0
        >>> compute_fib(1)
        1
        >>> compute_fib(10)
        55
    """
    if n < 0:
        raise ValueError("n must be a non-negative integer")
    
    if n == 0:
        return 0
    if n == 1:
        return 1
    
    # Initialize first two Fibonacci numbers
    prev, curr = 0, 1
    
    # Iterate from 2 to n
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr
    
    return curr
```

This implementation:
- Uses iteration instead of recursion for better performance (O(n) time, O(1) space)
- Handles edge cases (n=0, n=1, negative numbers)
- Includes comprehensive docstring with examples
- Uses tuple unpacking for clean, efficient updates

Would you like more details about optimization or testing?

---

## USER


\nWrite a Python function to calculate the nth Fibonacci number.\nCRITICAL RULES:\n1. Do NOT use recursion. Use an iterative loop.\n2. The function name must be 'compute_fib'.\n3. You must include a docstring.\n
    

---

## ASSISTANT

Here's a Python function that calculates the nth Fibonacci number using iteration:

```python
def compute_fib(n):
    """
    Calculate the nth Fibonacci number using an iterative approach.
    
    Args:
        n (int): The position in the Fibonacci sequence (0-indexed)
        
    Returns:
        int: The nth Fibonacci number
        
    Examples:
        >>> compute_fib(0)
        0
        >>> compute_fib(1)
        1
        >>> compute_fib(10)
        55
    """
    if n < 0:
        raise ValueError("n must be a non-negative integer")
    
    if n == 0:
        return 0
    if n == 1:
        return 1
    
    # Initialize first two Fibonacci numbers
    prev, curr = 0, 1
    
    # Iterate from 2 to n
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr
    
    return curr
```

This implementation:
- Uses iteration instead of recursion for better performance and avoiding stack overflow
- Handles edge cases (n=0, n=1, and negative values)
- Has O(n) time complexity and O(1) space complexity
- Includes comprehensive docstring with examples

Would you like more details about optimization or handling larger Fibonacci numbers?

---

## USER


\nWrite a Python function to calculate the nth Fibonacci number.\nCRITICAL RULES:\n1. Do NOT use recursion. Use an iterative loop.\n2. The function name must be 'compute_fib'.\n3. You must include a docstring.\n
    

---

## ASSISTANT

Here's a Python function that calculates the nth Fibonacci number using iteration:

```python
def compute_fib(n):
    """
    Calculate the nth Fibonacci number using an iterative approach.
    
    Args:
        n (int): The position in the Fibonacci sequence (0-indexed)
        
    Returns:
        int: The nth Fibonacci number
        
    Examples:
        >>> compute_fib(0)
        0
        >>> compute_fib(1)
        1
        >>> compute_fib(10)
        55
    """
    if n < 0:
        raise ValueError("n must be a non-negative integer")
    
    if n == 0:
        return 0
    if n == 1:
        return 1
    
    # Initialize first two Fibonacci numbers
    prev, curr = 0, 1
    
    # Iterate from 2 to n
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr
    
    return curr
```

This implementation:
- Uses iteration instead of recursion for better performance and avoiding stack overflow
- Handles edge cases (n=0, n=1, and negative numbers)
- Has O(n) time complexity and O(1) space complexity
- Includes comprehensive docstring with examples

Would you like more details about optimization or handling larger Fibonacci numbers?

---

## USER


\nWrite a Python function to calculate the nth Fibonacci number.\nCRITICAL RULES:\n1. Do NOT use recursion. Use an iterative loop.\n2. The function name must be 'compute_fib'.\n3. You must include a docstring.\n
    

---

## ASSISTANT

Here's a Python function that calculates the nth Fibonacci number using iteration:

```python
def compute_fib(n):
    """
    Calculate the nth Fibonacci number using an iterative approach.
    
    Args:
        n (int): The position in the Fibonacci sequence (0-indexed)
        
    Returns:
        int: The nth Fibonacci number
        
    Examples:
        >>> compute_fib(0)
        0
        >>> compute_fib(1)
        1
        >>> compute_fib(10)
        55
    """
    if n < 0:
        raise ValueError("n must be a non-negative integer")
    
    if n == 0:
        return 0
    if n == 1:
        return 1
    
    # Initialize first two Fibonacci numbers
    prev, curr = 0, 1
    
    # Iteratively calculate up to nth number
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr
    
    return curr
```

This implementation:
- Uses iteration instead of recursion for better performance (O(n) time, O(1) space)
- Handles edge cases (n=0, n=1, negative values)
- Includes comprehensive docstring with examples
- Uses tuple unpacking for clean, efficient updates

Would you like more details about optimization or testing?

---

