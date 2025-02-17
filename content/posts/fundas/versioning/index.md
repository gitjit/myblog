
+++
title = 'Semantic Versioning'
date = 2021-04-16
categories = ["Foundation"]
toc = true
+++

## Semantic Versioning (SemVer)

**Semantic Versioning (SemVer)** is a versioning system used in software development to indicate changes in a structured and predictable manner.

### **Versioning Format**

```
MAJOR.MINOR.PATCH
```

Where:
- **MAJOR** → Increases when there are **backward-incompatible** changes.
- **MINOR** → Increases when new **features** are added but in a **backward-compatible** way.
- **PATCH** → Increases when **bug fixes** or **security patches** are made without changing functionality.

---

### **How SemVer Works**

1. **Starting Version:** `1.0.0`
2. **Bug Fix Release:** If a bug is fixed without affecting existing features → `1.0.1`
3. **Feature Addition:** If a new feature is added but is backward-compatible → `1.1.0`
4. **Breaking Changes:** If changes break backward compatibility → `2.0.0`

---

### **Handling Deprecation Warnings in SemVer**

Deprecation warnings help developers transition away from obsolete features before they are removed in a future major version.

- When a feature is **deprecated but still available**, it is typically introduced in a **minor version** update (`MINOR` bump), along with a warning notifying users about its future removal.
- When a deprecated feature is **fully removed**, it requires a **major version bump** (`MAJOR` bump), as this breaks backward compatibility.

#### **How Python Handles Deprecation Warnings**
- Python uses `DeprecationWarning` to notify users about deprecated features.
- By default, these warnings are **hidden** in production but can be enabled using:
  ```python
  import warnings
  warnings.simplefilter("default", DeprecationWarning)
  ```
- Deprecated functions often issue warnings using:
  ```python
  import warnings
  def old_function():
      warnings.warn("old_function() is deprecated and will be removed in future versions", DeprecationWarning)
  ```

#### **How Node.js Handles Deprecation Warnings**
- Node.js issues deprecation warnings through the console when using deprecated APIs.
- These warnings can be controlled with flags like `--no-deprecation`, `--trace-deprecation`, or `--throw-deprecation`.
- Example of a deprecated function warning:
  ```javascript
  const util = require('util');
  const deprecatedFunction = util.deprecate(
      () => console.log('This function is deprecated'),
      'deprecatedFunction() is deprecated and will be removed in future versions'
  );
  deprecatedFunction();
  ```

---

### **Examples of Versioning**

| Version | Change Type | Description |
|---------|------------|-------------|
| `1.0.0` | Initial Release | First stable version |
| `1.0.1` | Patch | Bug fix (no new features) |
| `1.1.0` | Minor | Added a new feature (backward-compatible) |
| `1.5.0` | Minor | Marked a function as deprecated with a warning |
| `2.0.0` | Major | Removed deprecated function (breaking change) |

---

### **Why is SemVer Important?**

1. **Predictability** – Developers can understand the impact of changes based on version numbers.
2. **Dependency Management** – Helps in managing dependencies effectively in package managers (e.g., npm, pip).
3. **Backward Compatibility** – Ensures that minor updates don’t break existing applications.
4. **Clear Communication** – Users and teams can easily track changes and updates.

---

### **SemVer in Package Managers**

Many package managers like **npm (Node.js)**, **pip (Python)**, and **Composer (PHP)** use SemVer for dependency management.

For example, in `package.json` (Node.js):

```json
"dependencies": {
  "react": "^17.0.0"
}
```

- `^17.0.0` → Allows updates `>= 17.0.0` and `< 18.0.0` (safe minor/patch updates).
- `~17.0.1` → Allows updates `>= 17.0.1` and `< 17.1.0` (only patch updates).

---

### **Summary**

Semantic Versioning helps teams and developers **clearly track** software changes and avoid compatibility issues. It ensures stability while allowing continuous improvements through **structured version increments**.

Deprecation warnings play a crucial role in guiding developers towards necessary updates before breaking changes occur, ensuring a smoother transition in software evolution.