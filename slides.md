---
theme: default
background: https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1920
class: text-center
highlighter: shiki
lineNumbers: false
drawings:
  persist: false
transition: slide-left
title: Hybrid Methods in Numerical Methods
mdc: true
---

# Hybrid Methods
## in Numerical Methods

<div class="pt-12">
  <span class="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-xl">
    Root-Finding Algorithms
  </span>
</div>

<div class="abs-br m-6 flex flex-col items-end gap-2 text-right">
  <div class="text-lg font-semibold text-cyan-300">Student: Yusif Aliyev</div>
  <div class="text-lg font-semibold text-emerald-300">Teacher: Günel Eyvazlı</div>
  <div class="text-md text-amber-300">Numerical Methods Course</div>
  <div class="px-3 py-1 bg-white/20 rounded-lg text-white font-mono">Group: 6324E</div>
</div>

<style>
h1 {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 4rem !important;
}
h2 {
  color: #94a3b8;
}
</style>

---
transition: fade-out
layout: two-cols
---

# What are Hybrid Methods?

<v-clicks>

- **Combination** of two or more classical root-finding techniques
- Achieve both **reliability** and **speed**
- Balance between convergence guarantee and fast convergence rate
- Automatically switch between methods based on conditions

</v-clicks>

::right::

<div class="ml-4 mt-8">

\`\`\`mermaid
graph TD
    A[Hybrid Method] --> B[Reliability]
    A --> C[Speed]
    B --> D[Bisection]
    B --> E[False Position]
    C --> F[Newton-Raphson]
    C --> G[Iteration]
    style A fill:#06b6d4,stroke:#0891b2,color:#fff
    style B fill:#10b981,stroke:#059669,color:#fff
    style C fill:#f59e0b,stroke:#d97706,color:#fff
\`\`\`

</div>

<style>
h1 {
  background: linear-gradient(90deg, #06b6d4, #10b981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

---
layout: default
class: px-20
---

# 🎯 Bisection Method

<div class="grid grid-cols-2 gap-8 mt-4">

<div>

### Algorithm
For a continuous function $f(x)$ on $[a, b]$ where $f(a) \cdot f(b) < 0$:

<div class="text-2xl text-center my-6 p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl border-2 border-cyan-400">

$$c = \frac{a + b}{2}$$

</div>

<v-clicks>

- If $f(a) \cdot f(c) < 0$ → root in $[a, c]$
- Otherwise → root in $[c, b]$
- **Convergence**: Linear, guaranteed
- **Error**: Halves each iteration

</v-clicks>

</div>

<div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-xl">

### Properties

| Feature | Value |
|---------|-------|
| **Order** | 1 (Linear) |
| **Reliability** | ✅ Very High |
| **Speed** | 🐢 Slow |
| **Requires** | Sign change |

<div class="mt-4 text-amber-400 text-sm">
⚠️ Cannot find even multiplicity roots
</div>

</div>

</div>

---
layout: default
class: px-20
---

# ⚡ Newton-Raphson Method

<div class="text-center my-6">
<div class="inline-block p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border-2 border-purple-400">

$$x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}$$

</div>
</div>

<div class="grid grid-cols-2 gap-8">

<div>

### How it Works

<v-clicks>

1. Start with initial guess $x_0$
2. Draw tangent line at $(x_n, f(x_n))$
3. Find where tangent crosses x-axis
4. Repeat until $|x_{n+1} - x_n| < \epsilon$

</v-clicks>

</div>

<div>

### Convergence Condition

<div class="bg-slate-800/50 rounded-xl p-4 mt-2">

$$\left|\frac{f(x) \cdot f''(x)}{[f'(x)]^2}\right| < 1$$

</div>

<div class="mt-4 grid grid-cols-2 gap-2 text-sm">
  <div class="bg-green-500/20 rounded-lg p-2 text-center">✅ Quadratic convergence</div>
  <div class="bg-red-500/20 rounded-lg p-2 text-center">❌ May diverge</div>
  <div class="bg-green-500/20 rounded-lg p-2 text-center">✅ Very fast</div>
  <div class="bg-red-500/20 rounded-lg p-2 text-center">❌ Needs derivative</div>
</div>

</div>

</div>

---
layout: default
class: px-20
---

# 🔄 Iteration Method (Fixed-Point)

<div class="grid grid-cols-2 gap-8 mt-4">

<div>

### Transformation

Convert $f(x) = 0$ into fixed-point form:

<div class="text-2xl text-center my-4 p-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl border-2 border-emerald-400">

$$x = \varphi(x)$$

</div>

### Iteration Formula

$$x_{n+1} = \varphi(x_{n})$$

</div>

<div>

### Convergence Criterion

<div class="bg-slate-800/80 rounded-2xl p-6 shadow-xl">

For convergence near root $\alpha$:

<div class="text-center my-4 text-xl text-amber-300">

$$|\varphi'(x)| < 1$$

</div>

<div class="text-sm mt-4">

**Example**: $x^3 - 12x - 5 = 0$

Transform to: $x = \sqrt[3]{12x + 5}$

</div>

</div>

</div>

</div>

<div class="mt-4 text-center">
<span class="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full text-white font-bold">
  Linear Convergence • Simple Implementation • May be slow
</span>
</div>

---
layout: default
class: px-20
---

# 📐 False Position (Regula Falsi)

<div class="text-center my-6">
<div class="inline-block p-6 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl border-2 border-orange-400">

$$c = b - \frac{f(b)(b - a)}{f(b) - f(a)}$$

</div>
</div>

<div class="grid grid-cols-2 gap-8">

<div>

### Key Concept

<v-clicks>

- Uses **linear interpolation** instead of midpoint
- Connects $(a, f(a))$ and $(b, f(b))$ with a line
- Finds x-intercept of this secant line
- **Faster** than bisection in most cases

</v-clicks>

</div>

<div>

### Comparison with Bisection

| | Bisection | False Position |
|---|---|---|
| **Point** | Midpoint | Secant intercept |
| **Speed** | Slower | Usually faster |
| **Guarantee** | Always | Always |
| **Problem** | None | May stagnate |

</div>

</div>

<div class="mt-4 p-3 bg-amber-500/20 rounded-xl text-center">
⚠️ One endpoint may remain fixed causing slow convergence (Modified Regula Falsi solves this)
</div>

---
layout: center
class: text-center
---

# 🔀 Hybrid Method Combinations

<div class="grid grid-cols-2 gap-6 mt-8 text-left max-w-4xl">

<div class="bg-gradient-to-br from-cyan-500/30 to-blue-600/30 rounded-2xl p-6 border border-cyan-400">

### Bisection + Newton-Raphson
<div class="text-sm mt-2">
Use bisection for safety, switch to Newton when derivative is well-behaved
</div>

$$x_{n+1} = \begin{cases} \frac{a+b}{2} & \text{if unsafe} \\ x_n - \frac{f(x_n)}{f'(x_n)} & \text{if safe} \end{cases}$$

</div>

<div class="bg-gradient-to-br from-purple-500/30 to-pink-600/30 rounded-2xl p-6 border border-purple-400">

### Bisection + False Position
<div class="text-sm mt-2">
Combine guaranteed convergence with faster interpolation
</div>

$$c = \begin{cases} \frac{a+b}{2} & \text{every } k \text{ steps} \\ b - \frac{f(b)(b-a)}{f(b)-f(a)} & \text{otherwise} \end{cases}$$

</div>

<div class="bg-gradient-to-br from-emerald-500/30 to-teal-600/30 rounded-2xl p-6 border border-emerald-400">

### Newton + Iteration
<div class="text-sm mt-2">
Fall back to simple iteration when Newton fails
</div>

$$x_{n+1} = \begin{cases} x_n - \frac{f(x_n)}{f'(x_n)} & \text{if } f'(x_n) \neq 0 \\ \varphi(x_n) & \text{otherwise} \end{cases}$$

</div>

<div class="bg-gradient-to-br from-amber-500/30 to-orange-600/30 rounded-2xl p-6 border border-amber-400">

### Brent's Method
<div class="text-sm mt-2">
Combines bisection, secant, and inverse quadratic interpolation
</div>

<div class="text-xs mt-2 text-amber-200">
Industry standard hybrid algorithm
</div>

</div>

</div>

---
layout: default
class: px-16
---

# 📊 Example: Bisection-Newton Hybrid

<div class="text-center mb-4">
<span class="text-lg">Solve: $x^4 - 2x - 4 = 0$</span>
</div>

<div class="grid grid-cols-2 gap-6">

<div class="bg-slate-800/50 rounded-xl p-4">

### Step 1: Bisection for Initial Bracket

$$f(1) = 1 - 2 - 4 = -5 < 0$$
$$f(2) = 16 - 4 - 4 = 8 > 0$$

<div class="text-emerald-400 mt-2">✓ Root in $[1, 2]$</div>

$$x_0 = \frac{1 + 2}{2} = 1.5$$

</div>

<div class="bg-slate-800/50 rounded-xl p-4">

### Step 2: Newton-Raphson Refinement

$$f'(x) = 4x^3 - 2$$

**Iteration 1:**
$$x_1 = 1.5 - \frac{-1.9375}{12.5} = 1.655$$

**Iteration 2:**
$$x_2 = 1.655 - \frac{0.156}{16.02} \approx 1.645$$

</div>

</div>

<div class="mt-6 text-center">
<div class="inline-block px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-white font-bold text-xl">
  Root: $x \approx 1.645$
</div>
</div>

<div class="mt-4 text-sm text-slate-400 text-center">
Bisection provided safe starting point → Newton converged quickly in 2 iterations
</div>

---
layout: two-cols
---

# 🔬 Hybrid Strategy Decision

<div class="mt-4">

### When to Use Each Method

\`\`\`mermaid
flowchart TD
    A[Start] --> B{Derivative available?}
    B -->|Yes| C{Good initial guess?}
    B -->|No| D[Use Bisection/False Position]
    C -->|Yes| E[Newton-Raphson]
    C -->|No| F[Bisection first]
    F --> E
    E --> G{Converging?}
    G -->|No| D
    G -->|Yes| H[Solution Found]
    D --> H
    style A fill:#06b6d4,color:#fff
    style H fill:#10b981,color:#fff
    style E fill:#8b5cf6,color:#fff
    style D fill:#f59e0b,color:#fff
\`\`\`

</div>

::right::

<div class="ml-6 mt-12">

### Switching Criteria

<v-clicks>

1. **Switch to Newton** when:
   - $|f'(x)| > \epsilon$
   - Within convergence region
   - Derivative doesn't change sign rapidly

2. **Fall back to Bisection** when:
   - Newton step goes outside bracket
   - $f'(x) \approx 0$
   - Divergence detected

3. **Convergence Check**:

$$|x_{n+1} - x_n| < \epsilon$$

</v-clicks>

</div>

---
layout: default
class: px-16
---

# 📈 Convergence Comparison

<div class="grid grid-cols-4 gap-4 mt-6">

<div class="bg-gradient-to-b from-blue-500/40 to-blue-600/20 rounded-xl p-4 text-center">

### Bisection

<div class="text-4xl my-4">🐢</div>

**Order**: 1

$$e_{n+1} \approx \frac{e_n}{2}$$

<div class="text-xs mt-2 text-blue-300">
~3.3 bits/iteration
</div>

</div>

<div class="bg-gradient-to-b from-orange-500/40 to-orange-600/20 rounded-xl p-4 text-center">

### False Position

<div class="text-4xl my-4">🐇</div>

**Order**: ~1.6

$$e_{n+1} \approx C \cdot e_n^{1.6}$$

<div class="text-xs mt-2 text-orange-300">
Superlinear
</div>

</div>

<div class="bg-gradient-to-b from-emerald-500/40 to-emerald-600/20 rounded-xl p-4 text-center">

### Iteration

<div class="text-4xl my-4">🦊</div>

**Order**: 1

$$e_{n+1} \approx |\varphi'| \cdot e_n$$

<div class="text-xs mt-2 text-emerald-300">
Linear (if converges)
</div>

</div>

<div class="bg-gradient-to-b from-purple-500/40 to-purple-600/20 rounded-xl p-4 text-center">

### Newton

<div class="text-4xl my-4">🚀</div>

**Order**: 2

$$e_{n+1} \approx C \cdot e_n^2$$

<div class="text-xs mt-2 text-purple-300">
Quadratic!
</div>

</div>

</div>

<div class="mt-8 p-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl">

### Hybrid Advantage

$$\text{Hybrid} = \underbrace{\text{Bisection Reliability}}_{\text{Always converges}} + \underbrace{\text{Newton Speed}}_{\text{Quadratic when close}}$$

</div>

---
layout: center
class: text-center
---

# 🎓 Summary

<div class="grid grid-cols-2 gap-8 mt-8 text-left max-w-4xl">

<div>

### Key Takeaways

<v-clicks>

- **Hybrid methods** combine strengths of multiple algorithms
- **Bisection** guarantees convergence but is slow
- **Newton-Raphson** is fast but can fail
- **False Position** balances speed and safety
- **Smart switching** = Best of both worlds

</v-clicks>

</div>

<div>

### Method Formulas Recap

| Method | Formula |
|--------|---------|
| Bisection | $c = \frac{a+b}{2}$ |
| Newton | $x_{n+1} = x_n - \frac{f}{f'}$ |
| Iteration | $x_{n+1} = \varphi(x_n)$ |
| False Pos. | $c = b - \frac{f(b)(b-a)}{f(b)-f(a)}$ |

</div>

</div>

<div class="mt-12">
<div class="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl text-white font-bold text-xl shadow-2xl">
  Hybrid Methods = Reliability + Speed 🚀
</div>
</div>

<div class="mt-8 text-slate-400">
  <span class="text-cyan-400">Yusif Aliyev</span> • Group 6324E • Numerical Methods
</div>
