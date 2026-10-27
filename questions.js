const py = String.raw;

const LABS = {
  1: 'Lab 1 · Python basics',
  2: 'Lab 2 · Vectors',
  3: 'Lab 3 · Matrix operations',
  4: 'Lab 4 · Linear systems',
  5: 'Lab 5 · Graphs',
  6: 'Lab 6 · DCT & coordinates'
};

const QUESTIONS = [
/* ---------------- LAB 1 ---------------- */
{
  id: 'l1-stats', lab: 1, title: 'Count and reverse a list',
  params: r => ({ d: r.pick([3, 4, 5]) }),
  prompt: p => `
<p>Write a function <code>stats(A, n)</code>. <code>A</code> is a Python list of integers and <code>n</code> is a positive integer.</p>
<p>It returns a tuple <code>(count, last)</code> where</p>
<ul>
<li><code>count</code> is the number of entries of <code>A</code> that are divisible by ${p.d}</li>
<li><code>last</code> is a list with the last <code>n</code> entries of <code>A</code>, in reverse order</li>
</ul>
<p>Example with <code>A = [6, 1, ${p.d * 3}, 7, 2]</code> and <code>n = 3</code>:</p>
<pre>stats(A, 3)   # returns (${(6 % p.d === 0 ? 1 : 0) + 1}, [2, 7, ${p.d * 3}])</pre>
<p>We test your function on other lists, so do not hard-code results.</p>`,
  given: [['A', 'list', 'example list (for debugging)'], ['n', 'int', 'example n']],
  defines: [['stats', 'function', 'returns (count, last)']],
  starter: py`def stats(A, n):
    # write your code here
    pass
`,
  setup: py`d = PARAMS['d']
A = [int(x) for x in np.random.randint(-20, 40, size=np.random.randint(8, 14))]
n = int(np.random.randint(2, 6))
`,
  check: py`d = S['d']
def ref(A, n):
    return (sum(1 for a in A if a % d == 0), A[::-1][:n])
cases = [(S['A'], S['n'])]
for k, m in [(10, 3), (7, 1), (15, 7), (5, 5), (12, 4)]:
    cases.append(([int(x) for x in np.random.randint(-50, 50, size=k)], int(m)))
G.expect_fn('stats', cases, ref, 10)
`,
  hint: 'Use the modulo operator a % d == 0 inside a loop. Slicing A[::-1] reverses a list.',
  solution: p => py`def stats(A, n):
    count = 0
    for a in A:
        if a % ${p.d} == 0:
            count += 1
    last = A[::-1][:n]
    return (count, last)
`
},
{
  id: 'l1-runmax', lab: 1, title: 'Running maximum',
  params: r => ({}),
  prompt: p => `
<p>Write a function <code>running_max(A)</code> that takes a non-empty list of numbers and returns a list <code>R</code> of the same length where <code>R[i]</code> is the largest value among <code>A[0], ..., A[i]</code>.</p>
<pre>running_max([3, 1, 4, 1, 5, 2])   # returns [3, 3, 4, 4, 5, 5]</pre>
<p>Return a Python list.</p>`,
  given: [['A', 'list', 'example list (for debugging)']],
  defines: [['running_max', 'function', 'returns the running maximum as a list']],
  starter: py`def running_max(A):
    # write your code here
    pass
`,
  setup: py`A = [int(x) for x in np.random.randint(-30, 30, size=10)]
`,
  check: py`def ref(A):
    out = []
    m = None
    for a in A:
        m = a if m is None else max(m, a)
        out.append(m)
    return out
cases = [(S['A'],), ([5],), ([9, 8, 7, 6],), ([1, 2, 3, 4],)]
for k in [6, 11, 20]:
    cases.append(([float(x) for x in np.round(np.random.randn(k) * 10, 2)],))
G.expect_fn('running_max', cases, ref, 10)
`,
  hint: 'Keep a variable with the biggest value seen so far. Append it to the output list on every iteration.',
  solution: p => py`def running_max(A):
    R = []
    best = A[0]
    for a in A:
        if a > best:
            best = a
        R.append(best)
    return R
`
},

/* ---------------- LAB 2 ---------------- */
{
  id: 'l2-missing', lab: 2, title: 'Find the missing vector',
  params: r => ({}),
  prompt: p => `
<p>Three vectors were combined into</p>
<pre>z = alpha*u + beta*v + gamma*w</pre>
<p>You are given <code>v</code>, <code>w</code>, the result <code>z</code>, and the coefficients <code>alpha</code>, <code>beta</code>, <code>gamma</code>. The vector <code>u</code> was lost.</p>
<p>Compute the missing vector and store it in <code>u</code>.</p>`,
  given: [['v', '1d numpy array', 'vector v'], ['w', '1d numpy array', 'vector w'], ['z', '1d numpy array', 'vector z'], ['alpha', 'float', 'coefficient of u'], ['beta', 'float', 'coefficient of v'], ['gamma', 'float', 'coefficient of w']],
  defines: [['u', '1d numpy array', 'the missing vector']],
  starter: py`import numpy as np

# Write your code to calculate u below this line
u = ...
`,
  setup: py`u0 = np.random.randint(-9, 10, size=6).astype(float)
v = np.random.randint(-9, 10, size=6).astype(float)
w = np.random.randint(-9, 10, size=6).astype(float)
alpha, beta, gamma = [float(c) for c in np.random.choice([-3, -2, -1.5, -0.5, 0.5, 1.5, 2, 3], 3)]
z = alpha * u0 + beta * v + gamma * w
del u0
`,
  check: py`G.expect('u', (S['z'] - S['beta'] * S['v'] - S['gamma'] * S['w']) / S['alpha'], 10)
`,
  hint: 'Move the known terms to the other side, then divide by alpha. NumPy arrays support +, -, * and / elementwise.',
  solution: p => py`import numpy as np

u = (z - beta * v - gamma * w) / alpha
`
},
{
  id: 'l2-portfolio', lab: 2, title: 'Portfolio value over time',
  params: r => ({}),
  prompt: p => `
<p>The 2d array <code>P</code> holds daily stock prices for three companies. Row <code>t</code> holds the three prices on day <code>t</code>, so <code>P</code> has shape <code>(T, 3)</code>.</p>
<p>The tuple <code>shares</code> holds how many shares you own of each company (same order as the columns of <code>P</code>).</p>
<p>Compute:</p>
<ul>
<li><code>values</code>: a 1d array of length <code>T</code> with the total value of your shares on each day</li>
<li><code>best_day</code>: the index of the day with the highest value (an <code>int</code>)</li>
<li><code>gain</code>: the value on the last day minus the value on the first day</li>
</ul>`,
  given: [['P', '2d numpy array', 'prices, shape (T, 3)'], ['shares', 'tuple', 'number of shares of each company']],
  defines: [['values', '1d numpy array', 'value on each day'], ['best_day', 'int', 'day with the highest value'], ['gain', 'float', 'last value minus first value']],
  starter: py`import numpy as np

values = ...
best_day = ...
gain = ...
`,
  setup: py`T = int(np.random.randint(30, 60))
P = np.round(np.cumsum(np.random.randn(T, 3) * 2, axis=0) + np.array([120.0, 45.0, 80.0]), 2)
shares = tuple(int(s) for s in np.random.randint(5, 40, size=3))
del T
`,
  check: py`vals = S['P'] @ np.array(S['shares'], dtype=float)
G.expect('values', vals, 4)
G.expect('best_day', int(np.argmax(vals)), 3)
G.expect('gain', vals[-1] - vals[0], 3)
`,
  hint: 'A matrix-vector product P @ np.array(shares) gives every day at once. np.argmax returns the index of the largest entry.',
  solution: p => py`import numpy as np

values = P @ np.array(shares)
best_day = int(np.argmax(values))
gain = values[-1] - values[0]
`
},
{
  id: 'l2-angle', lab: 2, title: 'Unit vectors and angles',
  params: r => ({}),
  prompt: p => `
<p>Write two functions that take 1d numpy arrays:</p>
<ul>
<li><code>unit(x)</code> returns the unit vector pointing in the same direction as <code>x</code></li>
<li><code>angle_deg(x, y)</code> returns the angle between <code>x</code> and <code>y</code> <b>in degrees</b>, as a float between 0 and 180</li>
</ul>
<p>Recall <code>cos(θ) = (x · y) / (‖x‖ ‖y‖)</code>. Rounding can push this ratio slightly past 1 for parallel vectors, so clip it to [-1, 1] before taking the arccos.</p>`,
  given: [['x', '1d numpy array', 'example vector'], ['y', '1d numpy array', 'example vector']],
  defines: [['unit', 'function', 'unit vector of x'], ['angle_deg', 'function', 'angle between x and y in degrees']],
  starter: py`import numpy as np

def unit(x):
    pass

def angle_deg(x, y):
    pass
`,
  setup: py`x = np.random.randint(-5, 6, size=4).astype(float)
y = np.random.randint(-5, 6, size=4).astype(float)
x[0] = 3.0
y[1] = -2.0
`,
  check: py`def ref_unit(x):
    return x / np.linalg.norm(x)
def ref_ang(x, y):
    c = np.dot(x, y) / (np.linalg.norm(x) * np.linalg.norm(y))
    return float(np.degrees(np.arccos(np.clip(c, -1, 1))))
cases1 = [(S['x'],)] + [(np.random.randn(k) * 4 + 0.1,) for k in [2, 3, 5, 6]]
G.expect_fn('unit', cases1, ref_unit, 4)
cases2 = [(S['x'], S['y']), (np.array([1.0, 0.0]), np.array([0.0, 2.0])), (np.array([1.0, 2.0, 3.0]), np.array([2.0, 4.0, 6.0])), (np.array([1.0, 1.0]), np.array([-1.0, -1.0]))]
cases2 += [(np.random.randn(k), np.random.randn(k)) for k in [3, 4, 6]]
G.expect_fn('angle_deg', cases2, ref_ang, 6, tol=1e-5)
`,
  hint: 'np.linalg.norm(x) gives the length. np.dot(x, y) or x @ y gives the dot product. np.arccos returns radians, and np.degrees converts them.',
  solution: p => py`import numpy as np

def unit(x):
    return x / np.linalg.norm(x)

def angle_deg(x, y):
    c = np.dot(x, y) / (np.linalg.norm(x) * np.linalg.norm(y))
    c = np.clip(c, -1, 1)
    return float(np.degrees(np.arccos(c)))
`
},

/* ---------------- LAB 3 ---------------- */
{
  id: 'l3-reflect', lab: 3, title: 'Reflect and scale points',
  params: r => ({ sx: r.pick([2, 3, 0.5]), sy: r.pick([0.5, 2, 1.5]) }),
  prompt: p => `
<p>The variable <code>image</code> is a <code>2 × N</code> array. Each column is a point <code>(x, y)</code>.</p>
<p><b>Reflection</b> across the line <code>y = x</code>:</p>
<pre>x' = y
y' = x</pre>
<p><b>Scaling</b>:</p>
<pre>x' = ${p.sx} x
y' = ${p.sy} y</pre>
<p>Build both 2 × 2 matrices and compute:</p>
<ul>
<li><code>reflected</code>: the image after the reflection</li>
<li><code>scaled</code>: the image after the scaling</li>
<li><code>reflect_then_scale</code>: the image reflected first, then scaled</li>
</ul>`,
  given: [['image', 'numpy array', '2 × N array of points']],
  defines: [['reflected', 'numpy array', 'reflected image'], ['scaled', 'numpy array', 'scaled image'], ['reflect_then_scale', 'numpy array', 'reflected, then scaled']],
  starter: py`import numpy as np

reflected = ...
scaled = ...
reflect_then_scale = ...
`,
  setup: py`sx = PARAMS['sx']
sy = PARAMS['sy']
N = int(np.random.randint(20, 40))
image = np.vstack([np.random.randn(N) * 3, np.random.randn(N) * 2 + 1])
del N
`,
  check: py`R = np.array([[0.0, 1.0], [1.0, 0.0]])
D = np.array([[S['sx'], 0.0], [0.0, S['sy']]])
img = S['image']
G.expect('reflected', R @ img, 3)
G.expect('scaled', D @ img, 3)
G.expect('reflect_then_scale', D @ R @ img, 4)
`,
  hint: 'Each output row is one equation. For "first A then B" the matrix is B @ A, because the matrix closest to the image acts first.',
  solution: p => py`import numpy as np

R = np.array([[0, 1],
              [1, 0]])
D = np.array([[${p.sx}, 0],
              [0, ${p.sy}]])

reflected = R @ image
scaled = D @ image
reflect_then_scale = D @ R @ image
`
},
{
  id: 'l3-unmix', lab: 3, title: 'Separate two mixed sounds',
  params: r => ({}),
  prompt: p => `
<p>Two microphones recorded mixtures of two sounds <code>s1</code> and <code>s2</code>:</p>
<pre>m1 = M[0,0]*s1 + M[0,1]*s2
m2 = M[1,0]*s1 + M[1,1]*s2</pre>
<p>You are given the recordings <code>m1</code>, <code>m2</code> and the 2 × 2 mixing matrix <code>M</code>.</p>
<p>Recover the original sounds and store them as 1d arrays <code>s1</code> and <code>s2</code>.</p>`,
  given: [['m1', '1d numpy array', 'first recording'], ['m2', '1d numpy array', 'second recording'], ['M', '2d numpy array', '2 × 2 mixing matrix']],
  defines: [['s1', '1d numpy array', 'first original sound'], ['s2', '1d numpy array', 'second original sound']],
  starter: py`import numpy as np

s1 = ...
s2 = ...
`,
  setup: py`t = np.linspace(0, 1, 400)
f1, f2 = [int(f) for f in np.random.choice([3, 5, 7, 11, 13], 2, replace=False)]
a1 = np.sin(2 * np.pi * f1 * t)
a2 = 0.6 * np.sign(np.sin(2 * np.pi * f2 * t))
M = np.round(np.random.uniform(0.2, 1.0, size=(2, 2)), 2)
while abs(np.linalg.det(M)) < 0.2:
    M = np.round(np.random.uniform(0.2, 1.0, size=(2, 2)), 2)
m1 = M[0, 0] * a1 + M[0, 1] * a2
m2 = M[1, 0] * a1 + M[1, 1] * a2
del t, f1, f2, a1, a2
`,
  check: py`X = ORIG['inv'](S['M']) @ np.vstack([S['m1'], S['m2']])
G.expect('s1', X[0], 5)
G.expect('s2', X[1], 5)
`,
  hint: 'Stack the recordings into a 2 × N matrix with np.vstack. Then the mixing is mixed = M @ sources, so sources = inv(M) @ mixed.',
  solution: p => py`import numpy as np

mixed = np.vstack([m1, m2])
sources = np.linalg.inv(M) @ mixed
s1 = sources[0]
s2 = sources[1]
`
},
{
  id: 'l3-rotate', lab: 3, title: 'Rotate about a point',
  params: r => ({ th: r.pick([30, 45, 60, 90, 120, 135, 150]), cx: r.int(-4, 4), cy: r.int(-4, 4) }),
  prompt: p => `
<p>The variable <code>image</code> is a <code>2 × N</code> array of points (one point per column).</p>
<p>Rotate every point <b>${p.th} degrees counterclockwise</b> around the point <code>c = (${p.cx}, ${p.cy})</code>, and store the result in <code>rotated</code>.</p>
<p>A rotation by angle θ around the origin is</p>
<pre>x' = x cos θ − y sin θ
y' = x sin θ + y cos θ</pre>
<p>To rotate around <code>c</code> instead: shift the points so <code>c</code> sits at the origin, rotate, then shift back.</p>`,
  given: [['image', 'numpy array', '2 × N array of points']],
  defines: [['rotated', 'numpy array', 'rotated image, 2 × N']],
  starter: py`import numpy as np

rotated = ...
`,
  setup: py`th = PARAMS['th']
cx = PARAMS['cx']
cy = PARAMS['cy']
N = int(np.random.randint(15, 30))
image = np.vstack([np.random.randn(N) * 2, np.random.randn(N) * 2])
del N
`,
  check: py`t = np.radians(S['th'])
R = np.array([[np.cos(t), -np.sin(t)], [np.sin(t), np.cos(t)]])
c = np.array([[S['cx']], [S['cy']]], dtype=float)
G.expect('rotated', R @ (S['image'] - c) + c, 10)
`,
  hint: 'np.cos and np.sin take radians: theta = degrees * np.pi / 180. Make c a 2 × 1 column, np.array([[cx], [cy]]), so it broadcasts across all columns.',
  solution: p => py`import numpy as np

theta = ${p.th} * np.pi / 180
R = np.array([[np.cos(theta), -np.sin(theta)],
              [np.sin(theta),  np.cos(theta)]])
c = np.array([[${p.cx}],
              [${p.cy}]])

rotated = R @ (image - c) + c
`
},

/* ---------------- LAB 4 ---------------- */
{
  id: 'l4-subs', lab: 4, title: 'Forward and back substitution',
  banned: ['numpy.linalg.solve', 'numpy.linalg.inv', 'scipy.linalg.solve', 'scipy.linalg.inv', 'scipy.linalg.solve_triangular'],
  params: r => ({}),
  prompt: p => `
<p>Write two functions without using <code>np.linalg.solve</code>, <code>np.linalg.inv</code> or <code>solve_triangular</code>:</p>
<ul>
<li><code>forward_sub(L, b)</code>: <code>L</code> is an <code>n × n</code> lower triangular matrix with nonzero diagonal. Return the 1d array <code>x</code> with <code>L x = b</code>.</li>
<li><code>back_sub(U, y)</code>: <code>U</code> is an <code>n × n</code> upper triangular matrix with nonzero diagonal. Return the 1d array <code>x</code> with <code>U x = y</code>.</li>
</ul>
<p>Forward substitution solves for <code>x[0]</code> first and works down. Back substitution solves for <code>x[n-1]</code> first and works up.</p>`,
  given: [['L', '2d numpy array', 'example lower triangular matrix'], ['U', '2d numpy array', 'example upper triangular matrix'], ['b', '1d numpy array', 'example right-hand side']],
  defines: [['forward_sub', 'function', 'solves L x = b'], ['back_sub', 'function', 'solves U x = y']],
  starter: py`import numpy as np

def forward_sub(L, b):
    pass

def back_sub(U, y):
    pass
`,
  setup: py`n = 4
L = np.tril(np.random.randint(-3, 4, size=(n, n))).astype(float)
np.fill_diagonal(L, np.random.randint(1, 5, size=n))
U = np.triu(np.random.randint(-3, 4, size=(n, n))).astype(float)
np.fill_diagonal(U, np.random.randint(1, 5, size=n))
b = np.random.randint(-9, 10, size=n).astype(float)
del n
`,
  check: py`def mk(n, lower):
    A = np.random.randn(n, n)
    A = np.tril(A) if lower else np.triu(A)
    np.fill_diagonal(A, np.random.choice([-1, 1], n) * (np.random.rand(n) + 1))
    return A
fc = [(S['L'], S['b'])] + [(mk(k, True), np.random.randn(k)) for k in [1, 3, 6, 9]]
bc = [(S['U'], S['b'])] + [(mk(k, False), np.random.randn(k)) for k in [1, 3, 6, 9]]
G.expect_fn('forward_sub', fc, lambda A, v: ORIG['solve'](A, v), 5)
G.expect_fn('back_sub', bc, lambda A, v: ORIG['solve'](A, v), 5)
`,
  hint: 'For forward substitution: x[i] = (b[i] - L[i, :i] @ x[:i]) / L[i, i]. For back substitution loop i from n-1 down to 0 with range(n-1, -1, -1).',
  solution: p => py`import numpy as np

def forward_sub(L, b):
    n = len(b)
    x = np.zeros(n)
    for i in range(n):
        x[i] = (b[i] - L[i, :i] @ x[:i]) / L[i, i]
    return x

def back_sub(U, y):
    n = len(y)
    x = np.zeros(n)
    for i in range(n - 1, -1, -1):
        x[i] = (y[i] - U[i, i+1:] @ x[i+1:]) / U[i, i]
    return x
`
},
{
  id: 'l4-rod', lab: 4, title: 'Temperature along a heated rod',
  banned: ['numpy.linalg.solve', 'scipy.linalg.solve'],
  params: r => ({ n: r.int(5, 9), TL: r.pick([0, 10, 20, 25, 30]), TR: r.pick([50, 60, 75, 80, 100]), h: r.pick([0.5, 1, 1.5, 2, 3]) }),
  prompt: p => `
<p>A rod has ${p.n} interior points with unknown temperatures <code>T[0], ..., T[${p.n - 1}]</code>. The left end is held at ${p.TL} degrees and the right end at ${p.TR} degrees. A heat source adds <code>h = ${p.h}</code> at every interior point.</p>
<p>At equilibrium each interior point satisfies</p>
<pre>-T[i-1] + 2*T[i] - T[i+1] = h</pre>
<p>where <code>T[-1]</code> means the left end (${p.TL}) and <code>T[${p.n}]</code> means the right end (${p.TR}).</p>
<p>Write this as <code>A T = b</code>. Store the ${p.n} × ${p.n} matrix in <code>A</code>, the right-hand side in <code>b</code>, and the solution in <code>T</code>.</p>
<p class="ban"><code>np.linalg.solve()</code> is not allowed here, since you may not have it on the exam. Solve another way.</p>`,
  given: [['n', 'int', 'number of interior points'], ['TL', 'float', 'left end temperature'], ['TR', 'float', 'right end temperature'], ['h', 'float', 'heat source']],
  defines: [['A', '2d numpy array', 'n × n matrix'], ['b', '1d numpy array', 'right-hand side'], ['T', '1d numpy array', 'interior temperatures']],
  starter: py`import numpy as np

A = ...
b = ...
T = ...
`,
  setup: py`n = int(PARAMS['n'])
TL = float(PARAMS['TL'])
TR = float(PARAMS['TR'])
h = float(PARAMS['h'])
`,
  check: py`n = S['n']
A = 2 * np.eye(n) - np.eye(n, k=1) - np.eye(n, k=-1)
b = np.full(n, S['h'])
b[0] += S['TL']
b[-1] += S['TR']
G.expect('A', A, 3)
G.expect('b', b, 3)
G.expect('T', ORIG['solve'](A, b), 4)
`,
  hint: 'Row i has 2 on the diagonal and -1 just left and right of it. The known end temperatures move to the right-hand side, so they get added to b[0] and b[-1]. Then use np.linalg.inv(A) @ b, or LU with solve_triangular.',
  solution: p => py`import numpy as np

A = np.zeros((n, n))
for i in range(n):
    A[i, i] = 2
    if i > 0:
        A[i, i-1] = -1
    if i < n - 1:
        A[i, i+1] = -1

b = np.ones(n) * h
b[0] += TL
b[-1] += TR

T = np.linalg.inv(A) @ b
`
},
{
  id: 'l4-springs', lab: 4, title: 'Spring system with LU',
  banned: ['numpy.linalg.solve', 'scipy.linalg.solve'],
  params: r => ({}),
  prompt: p => `
<p><code>n</code> masses sit in a line between two walls, joined by <code>n + 1</code> springs. Spring <code>j</code> has stiffness <code>k[j]</code>. Spring 0 joins the left wall to mass 0, spring <code>i</code> joins mass <code>i-1</code> to mass <code>i</code>, and spring <code>n</code> joins mass <code>n-1</code> to the right wall.</p>
<p>The stiffness matrix <code>K</code> is <code>n × n</code> with</p>
<pre>K[i, i]   = k[i] + k[i+1]
K[i, i+1] = K[i+1, i] = -k[i+1]</pre>
<p>and zeros elsewhere. The displacements <code>u</code> satisfy <code>K u = f</code>.</p>
<ol>
<li>Build <code>K</code>.</li>
<li>Write <code>my_LU_solve(A, B)</code>, which solves <code>A X = B</code> for a square <code>A</code> and a 2d array <code>B</code> (one right-hand side per column) using <code>scipy.linalg.lu</code> and <code>scipy.linalg.solve_triangular</code>.</li>
<li>Compute the 1d array <code>u</code>.</li>
</ol>
<p class="ban"><code>np.linalg.solve()</code> is not allowed here.</p>`,
  given: [['n', 'int', 'number of masses'], ['k', '1d numpy array', 'spring stiffnesses, length n + 1'], ['f', '1d numpy array', 'forces on the masses, length n']],
  defines: [['K', '2d numpy array', 'stiffness matrix'], ['my_LU_solve', 'function', 'solves A X = B with LU'], ['u', '1d numpy array', 'displacements']],
  starter: py`import numpy as np
import scipy.linalg as sla

K = ...

def my_LU_solve(A, B):
    pass

u = ...
`,
  setup: py`n = int(np.random.randint(4, 8))
k = np.random.randint(1, 10, size=n + 1).astype(float)
f = np.random.randint(-5, 6, size=n).astype(float)
`,
  check: py`n = S['n']
k = S['k']
K = np.zeros((n, n))
for i in range(n):
    K[i, i] = k[i] + k[i + 1]
    if i < n - 1:
        K[i, i + 1] = K[i + 1, i] = -k[i + 1]
G.expect('K', K, 3)
def mkA(m):
    A = np.random.randn(m, m)
    return A + np.eye(m) * m
cases = [(K, np.column_stack([S['f'], np.ones(n)]))] + [(mkA(m), np.random.randn(m, c)) for m, c in [(3, 1), (5, 4), (8, 2)]]
G.expect_fn('my_LU_solve', cases, lambda A, B: ORIG['solve'](A, B), 4)
G.expect('u', ORIG['solve'](K, S['f']), 3)
`,
  hint: 'sla.lu(A) returns P, L, U with A = P @ L @ U. Then A X = B becomes L Y = P.T @ B (forward, lower=True), then U X = Y (back). P is a permutation, so its inverse is P.T.',
  solution: p => py`import numpy as np
import scipy.linalg as sla

K = np.zeros((n, n))
for i in range(n):
    K[i, i] = k[i] + k[i+1]
    if i < n - 1:
        K[i, i+1] = -k[i+1]
        K[i+1, i] = -k[i+1]

def my_LU_solve(A, B):
    P, L, U = sla.lu(A)
    Y = sla.solve_triangular(L, P.T @ B, lower=True)
    X = sla.solve_triangular(U, Y)
    return X

u = my_LU_solve(K, f.reshape(-1, 1))[:, 0]
`
},
{
  id: 'l4-circuit', lab: 4, title: 'Parallel circuit',
  params: r => ({}),
  prompt: p => `
<p>A circuit has <code>N</code> branches in parallel. Branch <code>j</code> has a resistor <code>R[j]</code> and a power supply <code>E[j]</code>. Ohm's law on each branch gives</p>
<pre>I[j]*R[j] + V = E[j]      for j = 0, ..., N-1</pre>
<p>and Kirchhoff's law gives</p>
<pre>I[0] + I[1] + ... + I[N-1] = 0</pre>
<p>The unknown vector is <code>x = [I[0], ..., I[N-1], V]</code> (length <code>N + 1</code>) and the right-hand side is <code>[E[0], ..., E[N-1], 0]</code>.</p>
<p>Build the <code>(N+1) × (N+1)</code> matrix <code>A</code> and store the solution vector in <code>x</code>.</p>`,
  given: [['N', 'int', 'number of branches'], ['R', '1d numpy array', 'resistances, length N'], ['E', '1d numpy array', 'electromotive forces, length N']],
  defines: [['A', '2d numpy array', 'system matrix'], ['x', '1d numpy array', 'currents followed by V']],
  starter: py`import numpy as np

A = ...
x = ...
`,
  setup: py`N = int(np.random.randint(3, 7))
R = np.random.randint(1, 10, size=N).astype(float)
E = np.random.randint(-12, 13, size=N).astype(float)
`,
  check: py`N = S['N']
A = np.zeros((N + 1, N + 1))
for j in range(N):
    A[j, j] = S['R'][j]
    A[j, N] = 1
A[N, :N] = 1
G.expect('A', A, 4)
G.expect('x', ORIG['solve'](A, np.append(S['E'], 0.0)), 6)
`,
  hint: 'Try N = 2 on paper first. Row j has R[j] in column j and 1 in the last column. The last row has 1 in the first N columns and 0 in the last.',
  solution: p => py`import numpy as np

A = np.zeros((N + 1, N + 1))
for j in range(N):
    A[j, j] = R[j]
    A[j, N] = 1
A[N, :N] = 1

rhs = np.append(E, 0)
x = np.linalg.inv(A) @ rhs
`
},

/* ---------------- LAB 5 ---------------- */
{
  id: 'l5-flights', lab: 5, title: 'Flights with layovers',
  params: r => ({ src: r.int(0, 29), dst: r.int(0, 29) }),
  fix: p => { if (p.dst === p.src) p.dst = (p.src + 7) % 30; return p; },
  prompt: p => `
<p>The symmetric 30 × 30 matrix <code>G</code> is the adjacency matrix of nonstop flights between 30 airports: <code>G[i, j] = 1</code> if there is a nonstop flight between airports <code>i</code> and <code>j</code>.</p>
<ol>
<li><code>walks2</code>: the matrix whose entry <code>[i, j]</code> counts walks of length exactly 2 from <code>j</code> to <code>i</code></li>
<li><code>atmost3</code>: the matrix counting walks of length 1, 2 or 3 (at most two layovers)</li>
<li><code>routes</code>: the number of ways to fly from airport ${p.src} to airport ${p.dst} with at most two layovers, as an <code>int</code> (zero-indexed airports)</li>
</ol>`,
  given: [['G', 'numpy array', '30 × 30 adjacency matrix']],
  defines: [['walks2', 'numpy array', '30 × 30'], ['atmost3', 'numpy array', '30 × 30'], ['routes', 'int', 'number of routes']],
  starter: py`import numpy as np
import numpy.linalg as la

walks2 = ...
atmost3 = ...
routes = ...
`,
  setup: py`src = PARAMS['src']
dst = PARAMS['dst']
n = 30
A = (np.random.rand(n, n) < 0.12).astype(float)
G = np.triu(A, 1)
G = G + G.T
del A, n
`,
  check: py`Gm = S['G']
W2 = Gm @ Gm
W3 = W2 @ Gm
M = Gm + W2 + W3
G.expect('walks2', W2, 3)
G.expect('atmost3', M, 4)
G.expect('routes', int(M[S['dst'], S['src']]), 3)
`,
  hint: 'Entry [i, j] of G^k counts walks of length k. la.matrix_power(G, k) or G @ G. The answer is entry [destination, source].',
  solution: p => py`import numpy as np
import numpy.linalg as la

walks2 = G @ G
atmost3 = G + la.matrix_power(G, 2) + la.matrix_power(G, 3)
routes = int(atmost3[${p.dst}, ${p.src}])
`
},
{
  id: 'l5-components', lab: 5, title: 'Friend groups from an incidence matrix',
  params: r => ({ person: r.int(0, 39) }),
  prompt: p => `
<p>A social network of 40 people is stored as an edge-node incidence matrix <code>D</code>. Each row is one friendship (edge): it has <code>-1</code> in the column of one person and <code>+1</code> in the column of the other. The direction carries no meaning.</p>
<p>A friend group is a connected component. You are given a function <code>nullspace(M)</code> that returns a 2d array whose columns are a basis of the nullspace of <code>M</code>.</p>
<ol>
<li><code>num_groups</code>: the number of friend groups (an <code>int</code>)</li>
<li><code>adj</code>: the 40 × 40 adjacency matrix, with <code>adj[i, j] = 1</code> when <code>i</code> and <code>j</code> are friends and 0 otherwise</li>
<li><code>num_reached</code>: how many people see a meme that starts with person ${p.person}, if everyone forwards it to all their friends (include person ${p.person})</li>
</ol>`,
  given: [['D', 'numpy array', 'edge-node incidence matrix, shape (edges, 40)'], ['nullspace', 'function', 'basis of the nullspace of a matrix']],
  defines: [['num_groups', 'int', 'number of connected components'], ['adj', 'numpy array', '40 × 40 adjacency matrix'], ['num_reached', 'int', 'people who see the meme']],
  starter: py`import numpy as np
import numpy.linalg as la

num_groups = ...
adj = ...
num_reached = ...
`,
  setup: py`person = PARAMS['person']
def nullspace(M, tol=1e-10):
    u, s, vh = np.linalg.svd(M)
    rank = int((s > tol).sum())
    return vh[rank:].T.copy()
n = 40
k = int(np.random.randint(3, 7))
labels = np.random.permutation(np.arange(n) % k)
edges = set()
for g in range(k):
    members = list(np.where(labels == g)[0])
    np.random.shuffle(members)
    for a, b in zip(members[:-1], members[1:]):
        edges.add((min(a, b), max(a, b)))
    for _ in range(len(members) // 2):
        a, b = np.random.choice(members, 2, replace=False)
        edges.add((min(a, b), max(a, b)))
edges = sorted(edges)
D = np.zeros((len(edges), n))
for r, (a, b) in enumerate(edges):
    if np.random.rand() < 0.5:
        a, b = b, a
    D[r, a] = -1
    D[r, b] = 1
group_labels = labels
del labels, edges, members, n, g, r, a, b, k
`,
  check: py`lab = S['group_labels']
Dm = S['D']
A = np.zeros((40, 40))
for row in Dm:
    i = int(np.where(row == -1)[0][0])
    j = int(np.where(row == 1)[0][0])
    A[i, j] = A[j, i] = 1
G.expect('num_groups', int(len(set(lab.tolist()))), 4)
G.expect('adj', A, 3)
G.expect('num_reached', int((lab == lab[S['person']]).sum()), 3)
`,
  hint: 'The dimension of the nullspace of the incidence matrix equals the number of connected components: nullspace(D).shape[1]. For reach, (I + adj) raised to the power 39 is positive exactly where a walk exists.',
  solution: p => py`import numpy as np
import numpy.linalg as la

num_groups = nullspace(D).shape[1]

n = D.shape[1]
adj = np.zeros((n, n))
for row in D:
    i = np.where(row == -1)[0][0]
    j = np.where(row == 1)[0][0]
    adj[i, j] = 1
    adj[j, i] = 1

reach = la.matrix_power(np.eye(n) + adj, n - 1)
num_reached = int(np.count_nonzero(reach[:, ${p.person}]))
`
},
{
  id: 'l5-indegree', lab: 5, title: 'Links in a directed graph',
  params: r => ({ a: r.int(0, 24), b: r.int(0, 24) }),
  prompt: p => `
<p><code>W</code> is the 25 × 25 adjacency matrix of a directed graph of web pages: <code>W[i, j] = 1</code> when page <code>j</code> links to page <code>i</code> (columns are "from", rows are "to").</p>
<ul>
<li><code>in_deg</code>: 1d array, number of links pointing <b>to</b> each page</li>
<li><code>out_deg</code>: 1d array, number of links going <b>out of</b> each page</li>
<li><code>most_cited</code>: index of the page with the most incoming links (smallest index if tied), as an <code>int</code></li>
<li><code>two_step</code>: number of directed walks of length exactly 2 from page ${p.a} to page ${p.b}, as an <code>int</code></li>
</ul>`,
  given: [['W', 'numpy array', '25 × 25 directed adjacency matrix']],
  defines: [['in_deg', '1d numpy array', 'incoming links per page'], ['out_deg', '1d numpy array', 'outgoing links per page'], ['most_cited', 'int', 'page with most incoming links'], ['two_step', 'int', 'walks of length 2']],
  starter: py`import numpy as np

in_deg = ...
out_deg = ...
most_cited = ...
two_step = ...
`,
  setup: py`a = PARAMS['a']
b = PARAMS['b']
W = (np.random.rand(25, 25) < 0.18).astype(float)
np.fill_diagonal(W, 0)
`,
  check: py`Wm = S['W']
ind = Wm.sum(axis=1)
G.expect('in_deg', ind, 3)
G.expect('out_deg', Wm.sum(axis=0), 2)
G.expect('most_cited', int(np.argmax(ind)), 2)
G.expect('two_step', int((Wm @ Wm)[S['b'], S['a']]), 3)
`,
  hint: 'Row i lists the pages that link to i, so the row sum is the in-degree: np.sum(W, axis=1). Column sums give out-degree. For walks from a to b use (W @ W)[b, a].',
  solution: p => py`import numpy as np

in_deg = np.sum(W, axis=1)
out_deg = np.sum(W, axis=0)
most_cited = int(np.argmax(in_deg))
two_step = int((W @ W)[${p.b}, ${p.a}])
`
},
{
  id: 'l5-separation', lab: 5, title: 'Degrees of separation',
  params: r => ({}),
  prompt: p => `
<p>Write a function <code>separation(network)</code>. The input is the adjacency matrix of an undirected graph with <code>n</code> nodes (a symmetric 2d array of 0s and 1s).</p>
<p>Return the smallest integer <code>k ≥ 1</code> such that every pair of different nodes is joined by a walk of length at most <code>k</code>. If some pair is never joined (the graph is disconnected), return <code>-1</code>.</p>
<pre>path 0 - 1 - 2 - 3   →  3
triangle            →  1
two separate edges  →  -1</pre>`,
  given: [['network', 'numpy array', 'example adjacency matrix']],
  defines: [['separation', 'function', 'returns k or -1']],
  starter: py`import numpy as np
import numpy.linalg as la

def separation(network):
    pass
`,
  setup: py`network = np.array([[0, 1, 0, 0], [1, 0, 1, 0], [0, 1, 0, 1], [0, 0, 1, 0]], dtype=float)
`,
  check: py`def ref(A):
    n = A.shape[0]
    M = np.eye(n) + A
    P = np.eye(n)
    for k in range(1, n):
        P = P @ M
        if np.all(P > 0):
            return k
    return -1
def path(n):
    A = np.zeros((n, n))
    for i in range(n - 1):
        A[i, i + 1] = A[i + 1, i] = 1
    return A
def cycle(n):
    A = path(n)
    A[0, n - 1] = A[n - 1, 0] = 1
    return A
def rnd(n, p):
    A = np.triu((np.random.rand(n, n) < p).astype(float), 1)
    return A + A.T
two = np.zeros((4, 4)); two[0, 1] = two[1, 0] = two[2, 3] = two[3, 2] = 1
cases = [(S['network'],), (path(6),), (cycle(7),), (np.ones((5, 5)) - np.eye(5),), (two,), (rnd(12, 0.3),), (rnd(10, 0.15),), (cycle(10),)]
G.expect_fn('separation', cases, ref, 10)
`,
  hint: '(I + A)^k has a positive entry [i, j] exactly when i and j are joined by a walk of length at most k. Try k = 1, 2, ..., n-1 with np.all(M > 0).',
  solution: p => py`import numpy as np
import numpy.linalg as la

def separation(network):
    n = network.shape[0]
    for k in range(1, n):
        M = la.matrix_power(np.eye(n) + network, k)
        if np.all(M > 0):
            return k
    return -1
`
},

/* ---------------- LAB 6 ---------------- */
{
  id: 'l6-denoise', lab: 6, title: 'Denoise a signal with the DCT',
  params: r => ({ tol: r.pick([0.5, 0.8, 1.0, 1.2]) }),
  prompt: p => `
<p>The 1d array <code>audio_signal</code> has length 256 and contains background noise. The helper <code>create_dct_basis(n)</code> returns an <code>n × n</code> matrix whose columns are the DCT basis of R<sup>n</sup> (the columns are orthonormal).</p>
<ol>
<li><code>coordinates</code>: the coordinate vector of <code>audio_signal</code> with respect to the DCT basis</li>
<li><code>coordinates_filtered</code>: a copy of <code>coordinates</code> where every entry with absolute value less than ${p.tol} is replaced by 0</li>
<li><code>denoised</code>: the vector whose DCT coordinates are <code>coordinates_filtered</code></li>
<li><code>num_kept</code>: the number of nonzero entries in <code>coordinates_filtered</code> (an <code>int</code>)</li>
</ol>`,
  given: [['audio_signal', '1d numpy array', 'noisy signal, length 256'], ['create_dct_basis', 'function', 'n × n DCT basis matrix']],
  defines: [['coordinates', '1d numpy array', 'DCT coordinates'], ['coordinates_filtered', '1d numpy array', 'thresholded coordinates'], ['denoised', '1d numpy array', 'denoised signal'], ['num_kept', 'int', 'number of nonzero coordinates']],
  starter: py`import numpy as np

coordinates = ...
coordinates_filtered = ...
denoised = ...
num_kept = ...
`,
  setup: py`tol = PARAMS['tol']
def create_dct_basis(n):
    j = np.arange(n).reshape(-1, 1)
    k = np.arange(n).reshape(1, -1)
    B = np.cos(np.pi * (2 * j + 1) * k / (2 * n))
    B[:, 0] *= np.sqrt(1 / n)
    B[:, 1:] *= np.sqrt(2 / n)
    return B
n = 256
x = np.arange(n)
clean = 3 * np.cos(np.pi * (2 * x + 1) * 4 / (2 * n)) + 2 * np.cos(np.pi * (2 * x + 1) * 15 / (2 * n)) + np.cos(np.pi * (2 * x + 1) * 31 / (2 * n))
audio_signal = clean + 0.15 * np.random.randn(n)
del n, x, clean
`,
  check: py`B = S['create_dct_basis'](256)
c = B.T @ S['audio_signal']
cf = c.copy()
cf[np.abs(cf) < S['tol']] = 0
G.expect('coordinates', c, 3)
G.expect('coordinates_filtered', cf, 3)
G.expect('denoised', B @ cf, 2)
G.expect('num_kept', int(np.count_nonzero(cf)), 2)
`,
  hint: 'If the columns of B are the basis, then signal = B @ coordinates. B is orthonormal, so coordinates = B.T @ signal. Use a boolean mask: c[np.abs(c) < tol] = 0.',
  solution: p => py`import numpy as np

B = create_dct_basis(len(audio_signal))
coordinates = B.T @ audio_signal

coordinates_filtered = coordinates.copy()
coordinates_filtered[np.abs(coordinates_filtered) < ${p.tol}] = 0

denoised = B @ coordinates_filtered
num_kept = int(np.count_nonzero(coordinates_filtered))
`
},
{
  id: 'l6-compress', lab: 6, title: 'Compress an image in 8 × 8 chunks',
  params: r => ({ pct: r.pick([5, 10, 15, 20]) }),
  prompt: p => `
<p><code>image</code> is a 64 × 64 grayscale image with pixel values from 0 to 255. Compress it by splitting it into 8 × 8 chunks. For each chunk:</p>
<ol>
<li>Convert the chunk to the 2D DCT basis: <code>C = B.T @ chunk @ B</code>, where <code>B = create_dct_basis(8)</code></li>
<li>Set to 0 every entry of <code>C</code> whose absolute value is less than ${p.pct}% of the largest absolute value in <code>C</code></li>
<li>Convert back: <code>B @ C @ B.T</code></li>
<li>Clip the values so they lie between 0 and 255</li>
</ol>
<p>Define <code>compress_chunk(chunk)</code>, which returns the compressed 8 × 8 chunk, and use it to build the 64 × 64 array <code>compressed</code>.</p>`,
  given: [['image', 'numpy array', '64 × 64 image'], ['create_dct_basis', 'function', 'n × n DCT basis matrix']],
  defines: [['compress_chunk', 'function', 'compresses one 8 × 8 chunk'], ['compressed', 'numpy array', '64 × 64 compressed image']],
  starter: py`import numpy as np

def compress_chunk(chunk):
    pass

compressed = ...
`,
  setup: py`pct = PARAMS['pct']
def create_dct_basis(n):
    j = np.arange(n).reshape(-1, 1)
    k = np.arange(n).reshape(1, -1)
    B = np.cos(np.pi * (2 * j + 1) * k / (2 * n))
    B[:, 0] *= np.sqrt(1 / n)
    B[:, 1:] *= np.sqrt(2 / n)
    return B
yy, xx = np.mgrid[0:64, 0:64]
img = 120 + 60 * np.sin(xx / 9.0) * np.cos(yy / 13.0) + 0.9 * (xx - 32) + 25 * np.random.randn(64, 64)
img[20:40, 10:30] += 70
image = np.clip(np.round(img), 0, 255)
del yy, xx, img
`,
  check: py`B = S['create_dct_basis'](8)
frac = S['pct'] / 100.0
def ref_chunk(ch):
    C = B.T @ ch @ B
    C[np.abs(C) < frac * np.max(np.abs(C))] = 0
    return np.clip(B @ C @ B.T, 0, 255)
img = S['image']
out = np.zeros_like(img)
for i in range(0, 64, 8):
    for j in range(0, 64, 8):
        out[i:i+8, j:j+8] = ref_chunk(img[i:i+8, j:j+8])
cases = [(img[0:8, 0:8].copy(),), (img[24:32, 16:24].copy(),), (np.random.rand(8, 8) * 255,), (np.random.rand(8, 8) * 400 - 50,)]
G.expect_fn('compress_chunk', cases, ref_chunk, 4)
G.expect('compressed', out, 6)
`,
  hint: 'Loop i and j over range(0, 64, 8) and slice image[i:i+8, j:j+8]. np.clip(X, 0, 255) handles the last step.',
  solution: p => py`import numpy as np

B = create_dct_basis(8)

def compress_chunk(chunk):
    C = B.T @ chunk @ B
    C[np.abs(C) < ${p.pct / 100} * np.max(np.abs(C))] = 0
    out = B @ C @ B.T
    return np.clip(out, 0, 255)

compressed = np.zeros(image.shape)
for i in range(0, 64, 8):
    for j in range(0, 64, 8):
        compressed[i:i+8, j:j+8] = compress_chunk(image[i:i+8, j:j+8])
`
},
{
  id: 'l6-basis', lab: 6, title: 'Coordinates and change of basis',
  params: r => ({}),
  prompt: p => `
<p>The columns of the 4 × 4 matrix <code>B</code> form a basis 𝓑 of R<sup>4</sup>, and the columns of <code>C</code> form another basis 𝒞.</p>
<ol>
<li><code>c</code>: the coordinate vector of <code>x</code> with respect to 𝓑, so that <code>B @ c</code> equals <code>x</code></li>
<li><code>y</code>: the vector (in standard coordinates) whose 𝓑-coordinates are <code>d</code></li>
<li><code>P_CB</code>: the change-of-coordinates matrix from 𝓑 to 𝒞, so that <code>P_CB @ [v]_𝓑 = [v]_𝒞</code> for every vector <code>v</code></li>
</ol>
<p>The basis here is not orthonormal, so <code>B.T</code> is not the inverse.</p>`,
  given: [['B', '2d numpy array', 'basis 𝓑 (columns)'], ['C', '2d numpy array', 'basis 𝒞 (columns)'], ['x', '1d numpy array', 'a vector'], ['d', '1d numpy array', '𝓑-coordinates of a vector']],
  defines: [['c', '1d numpy array', 'coordinates of x in 𝓑'], ['y', '1d numpy array', 'vector with 𝓑-coordinates d'], ['P_CB', '2d numpy array', 'change of coordinates 𝓑 → 𝒞']],
  starter: py`import numpy as np

c = ...
y = ...
P_CB = ...
`,
  setup: py`def mk():
    while True:
        M = np.random.randint(-3, 4, size=(4, 4)).astype(float)
        if abs(np.linalg.det(M)) > 2:
            return M
B = mk()
C = mk()
x = np.random.randint(-6, 7, size=4).astype(float)
d = np.random.randint(-4, 5, size=4).astype(float)
del mk
`,
  check: py`Bm = S['B']
Cm = S['C']
G.expect('c', ORIG['solve'](Bm, S['x']), 3)
G.expect('y', Bm @ S['d'], 3)
G.expect('P_CB', ORIG['inv'](Cm) @ Bm, 4)
`,
  hint: 'B @ c = x means c = inv(B) @ x. Going from 𝓑 to standard coordinates multiplies by B, and from standard to 𝒞 multiplies by inv(C). So P_CB = inv(C) @ B.',
  solution: p => py`import numpy as np

c = np.linalg.inv(B) @ x
y = B @ d
P_CB = np.linalg.inv(C) @ B
`
}
];
