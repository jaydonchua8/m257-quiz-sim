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

{
  id: 'l1-subset', lab: 1, title: 'Sum and subset of a list',
  params: r => ({}),
  prompt: p => `
<p>Given a list of integers <code>A</code> and an integer <code>n</code>, the function <code>A_subset(A, n)</code> returns a tuple <code>(sum, Asub)</code> where</p>
<ul>
<li><code>sum</code> is an integer with the sum of all the entries of the list</li>
<li><code>Asub</code> is a list with the first <code>n</code> entries of <code>A</code></li>
</ul>
<pre>A = [54, 83, 77, 34, 8, 47, 57, 23, 49, 99]
print(A_subset(A, 4))
# (531, [54, 83, 77, 34])</pre>
<p>We test your function on other lists, so do not hard-code your results.</p>`,
  given: [['A', 'list', 'example list (for debugging)'], ['n', 'int', 'example n']],
  defines: [['A_subset', 'function', 'returns (sum, Asub)']],
  starter: py`def A_subset(A, n):
    # write some code here
    pass
`,
  setup: py`A = [54, 83, 77, 34, 8, 47, 57, 23, 49, 99]
n = 4
`,
  check: py`def ref(A, n):
    return (sum(A), A[:n])
cases = [(S['A'], S['n']), ([5], 1), ([1, 2, 3], 3), ([-4, 7, 0, 2], 2)]
for k, m in [(9, 5), (12, 1), (20, 11)]:
    cases.append(([int(x) for x in np.random.randint(-60, 100, size=k)], int(m)))
G.expect_fn('A_subset', cases, ref, 10)
`,
  hint: 'A comma builds a tuple: return total, A[:n]. Add the entries with a for loop (or sum(A)).',
  solution: p => py`def A_subset(A, n):
    total = 0
    for a in A:
        total += a
    Asub = A[:n]
    return total, Asub
`
},
{
  id: 'l1-arrays', lab: 1, title: 'Slices, linspace and arange',
  params: r => ({ rate: r.pick([8000, 11025, 22050]), dur: r.pick([0.2, 0.25, 0.3]), M: r.pick([10, 16, 20, 30]) }),
  prompt: p => `
<p><code>int_array</code> is a 1d numpy array of integers. Define:</p>
<ul>
<li><code>middle</code>: every entry except the first and the last</li>
<li><code>odds</code>: the entries at odd indices (1, 3, 5, ...)</li>
<li><code>backwards</code>: <code>int_array</code> in reverse order</li>
<li><code>t</code>: ${p.dur * p.rate | 0} evenly spaced times from 0 to ${p.dur}, both ends included. (That is <code>int(${p.rate} * ${p.dur})</code> samples.)</li>
<li><code>evens</code>: the even integers 0, 2, 4, ..., ${p.M} (include ${p.M})</li>
</ul>`,
  given: [['int_array', '1d numpy array', 'array of integers']],
  defines: [['middle', '1d numpy array', 'all but first and last'], ['odds', '1d numpy array', 'odd-index entries'], ['backwards', '1d numpy array', 'reversed'], ['t', '1d numpy array', 'sample times'], ['evens', '1d numpy array', 'even integers up to M']],
  starter: py`import numpy as np

middle = ...
odds = ...
backwards = ...
t = ...
evens = ...
`,
  setup: py`rate = PARAMS['rate']
dur = PARAMS['dur']
M = PARAMS['M']
int_array = np.random.randint(0, 10, size=int(np.random.randint(7, 12)))
`,
  check: py`a = S['int_array']
G.expect('middle', a[1:-1], 2)
G.expect('odds', a[1::2], 2)
G.expect('backwards', a[::-1], 2)
G.expect('t', np.linspace(0, S['dur'], int(S['rate'] * S['dur'])), 2)
G.expect('evens', np.arange(0, S['M'] + 1, 2), 2)
`,
  hint: 'a[1:-1] drops both ends, a[1::2] starts at 1 with step 2. np.linspace(start, stop, count) includes stop. np.arange(start, stop, step) excludes stop, so go one past it.',
  solution: p => py`import numpy as np

middle = int_array[1:-1]
odds = int_array[1::2]
backwards = int_array[::-1]
t = np.linspace(0, ${p.dur}, int(${p.rate} * ${p.dur}))
evens = np.arange(0, ${p.M} + 1, 2)
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

{
  id: 'l2-shares', lab: 2, title: 'Pick shares to hit a target',
  params: r => ({ start: r.pick([500, 1000, 2000]), mult: r.pick([1.5, 2, 3]), q: r.pick([62, 125, 189]) }),
  prompt: p => `
<p><code>p1</code> and <code>p2</code> are 1d arrays with the daily stock prices of two companies over <code>T</code> trading days.</p>
<p>You buy <code>X1</code> shares of company 1 and <code>X2</code> shares of company 2 on day 0, so that</p>
<pre>X1*p1[0]  + X2*p2[0]  = ${p.start}
X1*p1[-1] + X2*p2[-1] = ${p.start * p.mult}</pre>
<p>Define:</p>
<ul>
<li><code>X1</code>, <code>X2</code>: the numbers of shares (floats) solving the two equations</li>
<li><code>value</code>: 1d array with the value of this portfolio on every day</li>
<li><code>invt_q</code>: the value of the portfolio on day <code>t = ${p.q}</code></li>
</ul>`,
  given: [['p1', '1d numpy array', 'prices of company 1'], ['p2', '1d numpy array', 'prices of company 2']],
  defines: [['X1', 'float', 'shares of company 1'], ['X2', 'float', 'shares of company 2'], ['value', '1d numpy array', 'value on each day'], ['invt_q', 'float', 'value on day q']],
  starter: py`import numpy as np

X1 = ...
X2 = ...
value = ...
invt_q = ...
`,
  setup: py`start = PARAMS['start']
mult = PARAMS['mult']
q = PARAMS['q']
T = 252
p1 = np.round(np.abs(np.cumsum(np.random.randn(T)) + 40), 2)
p2 = np.round(np.abs(np.cumsum(np.random.randn(T) * 1.5) + 160), 2)
while abs(p1[0] * p2[-1] - p2[0] * p1[-1]) < 50:
    p1 = np.round(np.abs(np.cumsum(np.random.randn(T)) + 40), 2)
del T
`,
  check: py`A = np.array([[S['p1'][0], S['p2'][0]], [S['p1'][-1], S['p2'][-1]]])
X = ORIG['solve'](A, np.array([S['start'], S['start'] * S['mult']], dtype=float))
v = X[0] * S['p1'] + X[1] * S['p2']
G.expect('X1', X[0], 2)
G.expect('X2', X[1], 2)
G.expect('value', v, 3)
G.expect('invt_q', v[S['q']], 3)
`,
  hint: 'Put the two equations in matrix form: [[p1[0], p2[0]], [p1[-1], p2[-1]]] @ [X1, X2] = [start, end]. Solve with np.linalg.solve, then value = X1*p1 + X2*p2.',
  solution: p => py`import numpy as np

A = np.array([[p1[0], p2[0]],
              [p1[-1], p2[-1]]])
b = np.array([${p.start}, ${p.start * p.mult}])
X = np.linalg.solve(A, b)
X1 = X[0]
X2 = X[1]
value = X1 * p1 + X2 * p2
invt_q = value[${p.q}]
`
},
{
  id: 'l2-sound', lab: 2, title: 'Make a tone, remove a noise',
  params: r => ({ rate: r.pick([4000, 8000]), dur: r.pick([0.25, 0.5]), w: r.pick([220, 440, 880]), c: r.pick([0.3, 0.5, 0.75, 1.5]) }),
  prompt: p => `
<p>Sounds are 1d arrays sampled at <code>rate = ${p.rate}</code> samples per second.</p>
<ol>
<li><code>nsamples</code>: the number of samples in ${p.dur} seconds, as an <code>int</code></li>
<li><code>t</code>: <code>nsamples</code> evenly spaced times from 0 to ${p.dur} (both included)</li>
<li><code>tone</code>: the pure tone <code>sin(${p.w} · 2π · t)</code></li>
<li>A recording <code>mix</code> was made as <code>mix = voice + ${p.c}*noise</code>. You are given <code>mix</code> and <code>noise</code>. Recover <code>voice</code>.</li>
</ol>`,
  given: [['mix', '1d numpy array', 'voice plus scaled noise'], ['noise', '1d numpy array', 'the noise track']],
  defines: [['nsamples', 'int', 'number of samples'], ['t', '1d numpy array', 'sample times'], ['tone', '1d numpy array', 'pure tone'], ['voice', '1d numpy array', 'recovered voice']],
  starter: py`import numpy as np

nsamples = ...
t = ...
tone = ...
voice = ...
`,
  setup: py`rate = PARAMS['rate']
dur = PARAMS['dur']
w = PARAMS['w']
c = PARAMS['c']
L = 1500
noise = np.random.randn(L) * 0.4
mix = np.sin(np.linspace(0, 40, L)) * np.linspace(1, 0.2, L) + c * noise
del L
`,
  check: py`ns = int(S['rate'] * S['dur'])
tt = np.linspace(0, S['dur'], ns)
G.expect('nsamples', ns, 2)
G.expect('t', tt, 2)
G.expect('tone', np.sin(S['w'] * 2 * np.pi * tt), 3)
G.expect('voice', S['mix'] - S['c'] * S['noise'], 3)
`,
  hint: 'nsamples = int(rate * duration). np.linspace(0, duration, nsamples). np.sin and np.pi work on whole arrays. Move the noise term to the other side.',
  solution: p => py`import numpy as np

nsamples = int(${p.rate} * ${p.dur})
t = np.linspace(0, ${p.dur}, nsamples)
tone = np.sin(${p.w} * 2 * np.pi * t)
voice = mix - ${p.c} * noise
`
},
{
  id: 'l2-colors', lab: 2, title: 'Grid of color combinations',
  params: r => ({}),
  prompt: p => `
<p>A color is a length-3 array <code>[red, green, blue]</code> with entries between 0 and 1.</p>
<p>Write <code>make_color_plot(u, v)</code>. For every <code>x</code> in <code>np.arange(0, 1.1, 0.1)</code> (outer loop) and every <code>y</code> in <code>np.arange(0, 1.1, 0.1)</code> (inner loop), compute the color <code>x*u + y*v</code>, clipped so every entry lies between 0 and 1.</p>
<p>Return all colors as a 2d numpy array with one color per row, in loop order (shape <code>(121, 3)</code>).</p>`,
  given: [['u', '1d numpy array', 'example color'], ['v', '1d numpy array', 'example color']],
  defines: [['make_color_plot', 'function', 'returns a (121, 3) array']],
  starter: py`import numpy as np

def make_color_plot(u, v):
    pass
`,
  setup: py`u = np.array([0.8, 0.1, 0.3])
v = np.array([0.2, 0.7, 0.9])
`,
  check: py`def ref(u, v):
    out = []
    for x in np.arange(0, 1.1, 0.1):
        for y in np.arange(0, 1.1, 0.1):
            out.append(np.clip(x * u + y * v, 0, 1))
    return np.array(out)
cases = [(S['u'], S['v'])] + [(np.random.rand(3), np.random.rand(3)) for _ in range(4)]
G.expect_fn('make_color_plot', cases, ref, 10)
`,
  hint: 'Two nested for loops, append each color to a Python list, then np.array(list) at the end. np.clip(c, 0, 1) caps values.',
  solution: p => py`import numpy as np

def make_color_plot(u, v):
    colors = []
    for x in np.arange(0, 1.1, 0.1):
        for y in np.arange(0, 1.1, 0.1):
            c = x * u + y * v
            colors.append(np.clip(c, 0, 1))
    return np.array(colors)
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

{
  id: 'l3-shear', lab: 3, title: 'Shear, then rotate',
  params: r => ({ s: r.pick([0.4, 0.6, 0.8, -0.5, 1.2]), ax: r.pick(['x', 'y']), th: r.pick([30, 45, 60, 90, 135]) }),
  prompt: p => `
<p>You are given <code>image</code>, a <code>2 × N</code> matrix of points (one point per column).</p>
<p><b>Shear operator</b>:</p>
<pre>${p.ax === 'x' ? `x' = x + ${p.s} y
y' = y` : `x' = x
y' = y + ${p.s} x`}</pre>
<p><b>Rotation operator</b>: rotate ${p.th} degrees counterclockwise about the origin:</p>
<pre>x' = x cos θ − y sin θ
y' = x sin θ + y cos θ</pre>
<p>Define <code>sheared</code>, <code>rotated</code>, and <code>sheared_and_rotated</code> (shear first, then rotate).</p>`,
  given: [['image', 'numpy array', '2 × N points'], ['display_image', 'function', 'helper to plot an image (does nothing here)']],
  defines: [['sheared', 'numpy array', 'sheared image'], ['rotated', 'numpy array', 'rotated image'], ['sheared_and_rotated', 'numpy array', 'sheared, then rotated']],
  starter: py`import numpy as np

sheared = ...
rotated = ...
sheared_and_rotated = ...
`,
  setup: py`s = PARAMS['s']
ax = PARAMS['ax']
th = PARAMS['th']
def display_image(img):
    pass
N = int(np.random.randint(20, 40))
image = np.vstack([np.random.randn(N) * 2, np.random.randn(N) * 3])
del N
`,
  check: py`Sh = np.array([[1.0, S['s']], [0.0, 1.0]]) if S['ax'] == 'x' else np.array([[1.0, 0.0], [S['s'], 1.0]])
t = np.radians(S['th'])
R = np.array([[np.cos(t), -np.sin(t)], [np.sin(t), np.cos(t)]])
img = S['image']
G.expect('sheared', Sh @ img, 3)
G.expect('rotated', R @ img, 3)
G.expect('sheared_and_rotated', R @ Sh @ img, 4)
`,
  hint: 'Read each matrix row off the equations: the row for x\' holds the coefficients of x and y. Shear first, then rotate is R @ Sh @ image (rightmost acts first).',
  solution: p => py`import numpy as np

Sh = np.array([${p.ax === 'x' ? `[1, ${p.s}],
               [0, 1]` : `[1, 0],
               [${p.s}, 1]`}])
theta = ${p.th} * np.pi / 180
R = np.array([[np.cos(theta), -np.sin(theta)],
              [np.sin(theta),  np.cos(theta)]])

sheared = Sh @ image
rotated = R @ image
sheared_and_rotated = R @ Sh @ image
`
},
{
  id: 'l3-undo', lab: 3, title: 'Undo a distortion',
  params: r => ({}),
  prompt: p => `
<p>Someone multiplied the points of a logo by a 2 × 2 matrix <code>A</code>, giving the distorted image <code>image = A @ original</code> (a <code>2 × N</code> array).</p>
<ol>
<li><code>corrected</code>: the original image</li>
<li><code>mirrored</code>: the original image reflected across the x-axis (<code>x' = x</code>, <code>y' = −y</code>)</li>
</ol>`,
  given: [['image', 'numpy array', 'distorted image, 2 × N'], ['A', '2d numpy array', 'the distorting matrix']],
  defines: [['corrected', 'numpy array', 'original image'], ['mirrored', 'numpy array', 'original reflected across the x-axis']],
  starter: py`import numpy as np

corrected = ...
mirrored = ...
`,
  setup: py`A = np.random.randint(-3, 4, size=(2, 2)).astype(float)
while abs(np.linalg.det(A)) < 1:
    A = np.random.randint(-3, 4, size=(2, 2)).astype(float)
N = int(np.random.randint(20, 40))
image = A @ np.vstack([np.random.randn(N), np.random.randn(N) * 2])
del N
`,
  check: py`orig = ORIG['inv'](S['A']) @ S['image']
G.expect('corrected', orig, 6)
G.expect('mirrored', np.array([[1.0, 0.0], [0.0, -1.0]]) @ orig, 4)
`,
  hint: 'image = A @ original, so original = inv(A) @ image. Reflection across the x-axis is [[1, 0], [0, -1]].',
  solution: p => py`import numpy as np

corrected = np.linalg.inv(A) @ image
F = np.array([[1, 0],
              [0, -1]])
mirrored = F @ corrected
`
},
{
  id: 'l3-bright', lab: 3, title: 'Brightness and contrast',
  params: r => ({ m: r.pick([0.4, 0.5, 0.6]), c: r.pick([0.5, 1.5, 2]) }),
  prompt: p => `
<p><code>img</code> is a 2d grayscale image with values between 0 and 1.</p>
<ol>
<li><code>centered</code>: shift <code>img</code> so its mean becomes ${p.m} (add the same number to every pixel)</li>
<li><code>adjusted</code>: scale <code>img</code> by ${p.c} (contrast), then shift the result so its mean is ${p.m}</li>
<li><code>clipped</code>: <code>adjusted</code> with every value clipped to lie between 0 and 1</li>
</ol>`,
  given: [['img', '2d numpy array', 'grayscale image']],
  defines: [['centered', '2d numpy array', 'mean shifted'], ['adjusted', '2d numpy array', 'scaled, then mean shifted'], ['clipped', '2d numpy array', 'adjusted, clipped to [0, 1]']],
  starter: py`import numpy as np

centered = ...
adjusted = ...
clipped = ...
`,
  setup: py`m = PARAMS['m']
c = PARAMS['c']
img = np.clip(np.random.rand(12, 16) * 0.5 + 0.1 + np.linspace(0, 0.3, 16), 0, 1)
`,
  check: py`im = S['img']
G.expect('centered', im + S['m'] - im.mean(), 3)
a = S['c'] * im
a = a + S['m'] - a.mean()
G.expect('adjusted', a, 4)
G.expect('clipped', np.clip(a, 0, 1), 3)
`,
  hint: 'img.mean() is the average of all pixels. Adding (target - mean) to every pixel moves the mean to the target. Scale first, then use the new mean.',
  solution: p => py`import numpy as np

centered = img + ${p.m} - img.mean()

scaled = ${p.c} * img
adjusted = scaled + ${p.m} - scaled.mean()

clipped = np.clip(adjusted, 0, 1)
`
},
{
  id: 'l3-shift', lab: 3, title: 'Shift and smoothing matrices',
  params: r => ({ n: r.pick([10, 12, 16]), k: r.pick([1, 2, 3]) }),
  prompt: p => `
<p><code>x</code> is a 1d signal of length ${p.n}.</p>
<ol>
<li><code>Sh</code>: the ${p.n} × ${p.n} matrix with <code>(Sh @ x)[i] = x[(i + ${p.k}) % ${p.n}]</code> (shift left by ${p.k}, wrapping around). <code>shifted = Sh @ x</code>.</li>
<li><code>Sm</code>: the ${p.n} × ${p.n} smoothing matrix. Row <code>i</code> averages <code>x[i-1], x[i], x[i+1]</code> (1/3 each). The first row averages <code>x[0], x[1]</code> (1/2 each) and the last row averages <code>x[-2], x[-1]</code> (1/2 each).</li>
<li><code>edges</code>: <code>(I − Sm) @ x</code>, where <code>I</code> is the identity.</li>
</ol>`,
  given: [['x', '1d numpy array', 'signal']],
  defines: [['Sh', '2d numpy array', 'shift matrix'], ['shifted', '1d numpy array', 'Sh @ x'], ['Sm', '2d numpy array', 'smoothing matrix'], ['edges', '1d numpy array', '(I - Sm) @ x']],
  starter: py`import numpy as np

Sh = ...
shifted = ...
Sm = ...
edges = ...
`,
  setup: py`n = PARAMS['n']
k = PARAMS['k']
x = np.sin(np.linspace(0, 2 * np.pi, n)) + (np.arange(n) > n // 2)
`,
  check: py`n = S['n']
Sh = np.roll(np.eye(n), -S['k'], axis=0)
Sm = np.zeros((n, n))
Sm[0, :2] = 0.5
Sm[-1, -2:] = 0.5
for i in range(1, n - 1):
    Sm[i, i-1:i+2] = 1 / 3
G.expect('Sh', Sh, 3)
G.expect('shifted', Sh @ S['x'], 2)
G.expect('Sm', Sm, 3)
G.expect('edges', (np.eye(n) - Sm) @ S['x'], 2)
`,
  hint: 'np.roll(np.eye(n), -k, axis=0) moves every row of the identity up by k, so row i picks x[i+k]. Build Sm with a loop over rows and slice assignment Sm[i, i-1:i+2] = 1/3.',
  solution: p => py`import numpy as np

n = len(x)
Sh = np.roll(np.eye(n), -${p.k}, axis=0)
shifted = Sh @ x

Sm = np.zeros((n, n))
Sm[0, 0:2] = 0.5
Sm[n-1, n-2:n] = 0.5
for i in range(1, n - 1):
    Sm[i, i-1:i+2] = 1 / 3

edges = (np.eye(n) - Sm) @ x
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

{
  id: 'l4-slinky', lab: 4, title: 'Hanging slinky',
  params: r => ({}),
  prompt: p => `
<p>A slinky hangs from the ceiling. It is modeled by <code>N</code> masses and <code>N</code> springs: spring 0 joins the ceiling to mass 0, and spring <code>i</code> (for <code>i ≥ 1</code>) joins mass <code>i-1</code> to mass <code>i</code>. The last mass hangs free.</p>
<ol>
<li>Write <code>get_stiffness(k_array)</code> that returns the <code>N × N</code> stiffness matrix for spring stiffnesses <code>k_array</code> (length <code>N</code>):
<pre>K[0, 0] += k_array[0]
for i ≥ 1:  K[i-1:i+1, i-1:i+1] += k_array[i] * [[1, -1], [-1, 1]]</pre></li>
<li><code>u</code>: displacements solving <code>K u = f</code>, where <code>K = get_stiffness(k * np.ones(N))</code> and every mass feels the force <code>f = m * g</code></li>
<li><code>def_coord</code>: the deformed coordinates, length <code>N + 1</code>. The rest coordinates are <code>coord[i] = l * i</code> for <code>i = 0, ..., N</code>; point 0 (the ceiling) does not move, so add <code>[0, u[0], ..., u[N-1]]</code>.</li>
<li><code>tip</code>: the displacement of the free end</li>
</ol>`,
  given: [['N', 'int', 'number of masses and springs'], ['k', 'float', 'stiffness of each spring'], ['m', 'float', 'each mass'], ['g', 'float', 'gravity'], ['l', 'float', 'rest length of each spring']],
  defines: [['get_stiffness', 'function', 'N × N stiffness matrix'], ['u', '1d numpy array', 'displacements'], ['def_coord', '1d numpy array', 'deformed coordinates, length N + 1'], ['tip', 'float', 'displacement of the free end']],
  starter: py`import numpy as np
import numpy.linalg as la

def get_stiffness(k_array):
    pass

u = ...
def_coord = ...
tip = ...
`,
  setup: py`N = int(np.random.randint(8, 20))
Ls = 10.0
Ks = float(np.random.choice([300, 500, 700]))
Mt = float(np.random.choice([120, 170, 220]))
m = Mt / (N + 1)
k = Ks * N
l = Ls / N
g = 981.0
del Ls, Ks, Mt
`,
  check: py`def ref(ka):
    n = len(ka)
    K = np.zeros((n, n))
    K[0, 0] += ka[0]
    for i in range(1, n):
        K[i-1:i+1, i-1:i+1] += ka[i] * np.array([[1.0, -1.0], [-1.0, 1.0]])
    return K
N = S['N']
cases = [(S['k'] * np.ones(N),), (np.array([3.0]),), (np.array([1.0, 2.0, 3.0]),), (np.random.rand(7) * 10 + 1,)]
G.expect_fn('get_stiffness', cases, ref, 4)
uu = ORIG['solve'](ref(S['k'] * np.ones(N)), S['m'] * S['g'] * np.ones(N))
G.expect('u', uu, 2)
G.expect('def_coord', S['l'] * np.arange(N + 1) + np.append(0, uu), 2)
G.expect('tip', uu[-1], 2)
`,
  hint: 'Start from K = np.zeros((n, n)) and add 2 × 2 blocks with slicing. np.append(0, u) puts the fixed point in front. The free end is u[-1].',
  solution: p => py`import numpy as np
import numpy.linalg as la

def get_stiffness(k_array):
    n = len(k_array)
    K = np.zeros((n, n))
    K[0, 0] += k_array[0]
    for i in range(1, n):
        K[i-1:i+1, i-1:i+1] += k_array[i] * np.array([[1, -1], [-1, 1]])
    return K

K = get_stiffness(k * np.ones(N))
f = m * g * np.ones(N)
u = la.solve(K, f)

coord = np.array([l * i for i in range(N + 1)])
def_coord = coord + np.append(0, u)
tip = u[-1]
`
},
{
  id: 'l4-lumany', lab: 4, title: 'LU for many right-hand sides',
  banned: ['numpy.linalg.solve', 'numpy.linalg.inv', 'scipy.linalg.solve', 'scipy.linalg.inv'],
  params: r => ({}),
  prompt: p => `
<p>Use <code>scipy.linalg.lu</code> and <code>scipy.linalg.solve_triangular</code> (no <code>solve</code> or <code>inv</code>).</p>
<ol>
<li><code>my_LU_solve_1(K, f)</code>: solve <code>K u = f</code> for a 1d <code>f</code> and return the displacement at the free end, <code>u[-1]</code></li>
<li><code>my_LU_solve_2(K, fmany)</code>: each column of the 2d array <code>fmany</code> is a force vector. Factor <code>K</code> once, solve for all columns, and return a 1d array with the free-end displacement for each column</li>
<li><code>Kmix</code>: two slinkys glued together, each with <code>n</code> springs. The first <code>n</code> springs have stiffness <code>k1</code>, the next <code>n</code> have <code>k2</code>. Build the <code>2n × 2n</code> stiffness matrix with the given <code>get_stiffness</code>.</li>
</ol>`,
  given: [['K', '2d numpy array', 'example stiffness matrix'], ['f', '1d numpy array', 'example force'], ['fmany', '2d numpy array', 'example forces, one per column'], ['get_stiffness', 'function', 'stiffness matrix from spring stiffnesses'], ['n', 'int', 'springs per slinky'], ['k1', 'float', 'stiffness, first slinky'], ['k2', 'float', 'stiffness, second slinky']],
  defines: [['my_LU_solve_1', 'function', 'returns u[-1]'], ['my_LU_solve_2', 'function', 'returns last row of the solutions'], ['Kmix', '2d numpy array', 'mixed stiffness matrix']],
  starter: py`import numpy as np
import scipy.linalg as sla

def my_LU_solve_1(K, f):
    pass

def my_LU_solve_2(K, fmany):
    pass

Kmix = ...
`,
  setup: py`def get_stiffness(k_array):
    n = len(k_array)
    K = np.zeros((n, n))
    K[0, 0] += k_array[0]
    for i in range(1, n):
        K[i-1:i+1, i-1:i+1] += k_array[i] * np.array([[1.0, -1.0], [-1.0, 1.0]])
    return K
N = 12
K = get_stiffness(np.random.randint(5, 20, size=N).astype(float))
f = np.ones(N) * 9.81
fmany = np.ones((N, 5)) * 9.81 + np.random.choice([0, 1], (N, 5)) * 9.81
n = int(np.random.randint(5, 15))
k1 = float(np.random.choice([700, 500, 300])) * n
k2 = float(np.random.choice([200, 100, 400])) * n
del N
`,
  check: py`gs = S['get_stiffness']
def mk(N):
    return gs(np.random.rand(N) * 20 + 1)
c1 = [(S['K'], S['f'])] + [(mk(N), np.random.randn(N)) for N in [1, 4, 9]]
c2 = [(S['K'], S['fmany'])] + [(mk(N), np.random.randn(N, p)) for N, p in [(3, 1), (6, 4), (10, 7)]]
G.expect_fn('my_LU_solve_1', c1, lambda K, f: ORIG['solve'](K, f)[-1], 3)
G.expect_fn('my_LU_solve_2', c2, lambda K, F: ORIG['solve'](K, F)[-1, :], 4)
n = S['n']
G.expect('Kmix', gs(np.append(S['k1'] * np.ones(n), S['k2'] * np.ones(n))), 3)
`,
  hint: 'P, L, U = sla.lu(K). Then y = solve_triangular(L, P.T @ f, lower=True) and u = solve_triangular(U, y). With fmany the same two calls solve every column at once; take row -1. For Kmix use np.append(k1*np.ones(n), k2*np.ones(n)).',
  solution: p => py`import numpy as np
import scipy.linalg as sla

def my_LU_solve_1(K, f):
    P, L, U = sla.lu(K)
    y = sla.solve_triangular(L, P.T @ f, lower=True)
    u = sla.solve_triangular(U, y)
    return u[-1]

def my_LU_solve_2(K, fmany):
    P, L, U = sla.lu(K)
    Y = sla.solve_triangular(L, P.T @ fmany, lower=True)
    X = sla.solve_triangular(U, Y)
    return X[-1, :]

Kmix = get_stiffness(np.append(k1 * np.ones(n), k2 * np.ones(n)))
`
},
{
  id: 'l4-plate', lab: 4, title: 'Temperature on a plate',
  banned: ['numpy.linalg.solve', 'scipy.linalg.solve'],
  params: r => ({ r: r.pick([2, 3]), c: r.pick([2, 3, 4]) }),
  prompt: p => `
<p>A plate has a ${p.r} × ${p.c} grid of interior points with unknown temperatures. Number them row by row: point <code>(i, j)</code> is unknown <code>T[i*${p.c} + j]</code>.</p>
<p>The boundary temperatures are fixed: <code>top[j]</code> sits above row 0, <code>bottom[j]</code> below row ${p.r - 1}, <code>left[i]</code> left of column 0, and <code>right[i]</code> right of column ${p.c - 1}.</p>
<p>At equilibrium each interior temperature is the average of its 4 neighbors (interior or boundary). Multiply by 4 and move the known boundary values to the right-hand side:</p>
<pre>4*T(i,j) − (interior neighbors) = (sum of boundary neighbors)</pre>
<p>Define the ${p.r * p.c} × ${p.r * p.c} matrix <code>A</code>, the right-hand side <code>b</code>, and the solution <code>T</code> (1d, length ${p.r * p.c}).</p>
<p class="ban"><code>np.linalg.solve()</code> is not allowed here.</p>`,
  given: [['top', '1d numpy array', 'length c'], ['bottom', '1d numpy array', 'length c'], ['left', '1d numpy array', 'length r'], ['right', '1d numpy array', 'length r'], ['r', 'int', 'rows of interior points'], ['c', 'int', 'columns of interior points']],
  defines: [['A', '2d numpy array', 'system matrix'], ['b', '1d numpy array', 'right-hand side'], ['T', '1d numpy array', 'interior temperatures']],
  starter: py`import numpy as np

A = ...
b = ...
T = ...
`,
  setup: py`r = PARAMS['r']
c = PARAMS['c']
top = np.random.randint(50, 100, size=c).astype(float)
bottom = np.random.randint(0, 30, size=c).astype(float)
left = np.random.randint(20, 60, size=r).astype(float)
right = np.random.randint(20, 60, size=r).astype(float)
`,
  check: py`r = S['r']; c = S['c']
n = r * c
A = np.zeros((n, n))
b = np.zeros(n)
for i in range(r):
    for j in range(c):
        p = i * c + j
        A[p, p] = 4
        for di, dj in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            ii, jj = i + di, j + dj
            if 0 <= ii < r and 0 <= jj < c:
                A[p, ii * c + jj] = -1
        if i == 0: b[p] += S['top'][j]
        if i == r - 1: b[p] += S['bottom'][j]
        if j == 0: b[p] += S['left'][i]
        if j == c - 1: b[p] += S['right'][i]
G.expect('A', A, 4)
G.expect('b', b, 3)
G.expect('T', ORIG['solve'](A, b), 3)
`,
  hint: 'Loop over i and j, compute p = i*c + j, put 4 on A[p, p], and -1 at each neighbor that is inside the grid. A neighbor outside the grid is a boundary value: add it to b[p]. Then T = np.linalg.inv(A) @ b.',
  solution: p => py`import numpy as np

n = r * c
A = np.zeros((n, n))
b = np.zeros(n)
for i in range(r):
    for j in range(c):
        p = i * c + j
        A[p, p] = 4
        if i > 0:
            A[p, p - c] = -1
        else:
            b[p] += top[j]
        if i < r - 1:
            A[p, p + c] = -1
        else:
            b[p] += bottom[j]
        if j > 0:
            A[p, p - 1] = -1
        else:
            b[p] += left[i]
        if j < c - 1:
            A[p, p + 1] = -1
        else:
            b[p] += right[i]

T = np.linalg.inv(A) @ b
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
    A = np.array(M, dtype=float)
    m, n = A.shape
    piv = []
    r = 0
    for c in range(n):
        if r >= m:
            break
        p = r + int(np.argmax(np.abs(A[r:, c])))
        if abs(A[p, c]) < tol:
            continue
        A[[r, p]] = A[[p, r]]
        A[r] = A[r] / A[r, c]
        for i in range(m):
            if i != r:
                A[i] = A[i] - A[i, c] * A[r]
        piv.append(c)
        r += 1
    free = [c for c in range(n) if c not in piv]
    N = np.zeros((n, len(free)))
    for k, f in enumerate(free):
        N[f, k] = 1
        for i, pc in enumerate(piv):
            N[pc, k] = -A[i, f]
    return np.round(N, 12) + 0.0
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

{
  id: 'l5-incidence', lab: 5, title: 'Incidence matrix from adjacency',
  params: r => ({}),
  prompt: p => `
<p>Write <code>get_incidence_matrix(G)</code>. <code>G</code> is the symmetric adjacency matrix of an undirected graph with <code>n</code> nodes and no self-loops.</p>
<p>Return the edge-node incidence matrix <code>M</code> with one row per edge. List the edges as pairs <code>(i, j)</code> with <code>i &lt; j</code> and <code>G[i, j] != 0</code>, in order of <code>i</code> and then <code>j</code> (a double loop). For edge number <code>l</code>:</p>
<pre>M[l, i] = 1
M[l, j] = -1</pre>
<p>So <code>M</code> has shape <code>(number of edges, n)</code>.</p>`,
  given: [['G', 'numpy array', 'example adjacency matrix']],
  defines: [['get_incidence_matrix', 'function', 'returns the incidence matrix']],
  starter: py`import numpy as np

def get_incidence_matrix(G):
    pass
`,
  setup: py`G = np.array([[0, 1, 1, 0], [1, 0, 1, 0], [1, 1, 0, 1], [0, 0, 1, 0]], dtype=float)
`,
  check: py`def ref(G):
    n = G.shape[0]
    rows = []
    for i in range(n):
        for j in range(i + 1, n):
            if G[i, j] != 0:
                r = np.zeros(n); r[i] = 1; r[j] = -1
                rows.append(r)
    return np.array(rows)
def rnd(n, q):
    A = np.triu((np.random.rand(n, n) < q).astype(float), 1)
    A = A + A.T
    A[0, 1] = A[1, 0] = 1
    return A
cases = [(S['G'],), (rnd(6, 0.4),), (rnd(10, 0.25),), (np.ones((5, 5)) - np.eye(5),)]
G.expect_fn('get_incidence_matrix', cases, ref, 10)
`,
  hint: 'Collect rows in a Python list: for i in range(n), for j in range(i+1, n), if G[i, j] != 0 make a zero row, set +1 and -1, append. Return np.array(rows).',
  solution: p => py`import numpy as np

def get_incidence_matrix(G):
    n = G.shape[0]
    rows = []
    for i in range(n):
        for j in range(i + 1, n):
            if G[i, j] != 0:
                row = np.zeros(n)
                row[i] = 1
                row[j] = -1
                rows.append(row)
    return np.array(rows)
`
},
{
  id: 'l5-groups', lab: 5, title: 'Group sizes from the nullspace',
  params: r => ({ person: r.int(0, 29) }),
  prompt: p => `
<p><code>D</code> is the edge-node incidence matrix of a friendship network of 30 people. The given <code>nullspace(D)</code> returns a 2d array <code>null</code> of shape <code>(30, d)</code>. Like the lab's sympy version, each column is a 0/1 indicator of one friend group: <code>null[i, g] = 1</code> when person <code>i</code> is in group <code>g</code>.</p>
<ol>
<li><code>ngroups</code>: number of friend groups (<code>int</code>)</li>
<li><code>sizes</code>: 1d array with the size of each group, in column order</li>
<li><code>max_group_size</code>: the size of the largest group (<code>int</code>)</li>
<li><code>lonely</code>: the number of people with no friends at all (<code>int</code>)</li>
<li><code>origin_size</code>: the size of the group that person ${p.person} belongs to (<code>int</code>)</li>
</ol>`,
  given: [['D', 'numpy array', 'incidence matrix, shape (edges, 30)'], ['nullspace', 'function', 'indicator basis of the nullspace']],
  defines: [['ngroups', 'int', 'number of groups'], ['sizes', '1d numpy array', 'size of each group'], ['max_group_size', 'int', 'largest group'], ['lonely', 'int', 'people with no friends'], ['origin_size', 'int', 'size of that person\'s group']],
  starter: py`import numpy as np

ngroups = ...
sizes = ...
max_group_size = ...
lonely = ...
origin_size = ...
`,
  setup: py`person = PARAMS['person']
def nullspace(M, tol=1e-10):
    A = np.array(M, dtype=float)
    m, n = A.shape
    piv = []
    r = 0
    for c in range(n):
        if r >= m:
            break
        p = r + int(np.argmax(np.abs(A[r:, c])))
        if abs(A[p, c]) < tol:
            continue
        A[[r, p]] = A[[p, r]]
        A[r] = A[r] / A[r, c]
        for i in range(m):
            if i != r:
                A[i] = A[i] - A[i, c] * A[r]
        piv.append(c)
        r += 1
    free = [c for c in range(n) if c not in piv]
    N = np.zeros((n, len(free)))
    for k, f in enumerate(free):
        N[f, k] = 1
        for i, pc in enumerate(piv):
            N[pc, k] = -A[i, f]
    return np.round(N, 12) + 0.0
n = 30
k = int(np.random.randint(4, 8))
labels = np.random.permutation(np.arange(n) % k)
iso = np.random.choice(n, int(np.random.randint(1, 4)), replace=False)
labels[iso] = k + np.arange(len(iso))
edges = set()
for g in range(k):
    mem = list(np.where(labels == g)[0])
    np.random.shuffle(mem)
    for a, b in zip(mem[:-1], mem[1:]):
        edges.add((min(a, b), max(a, b)))
D = np.zeros((len(edges), n))
for row, (a, b) in enumerate(sorted(edges)):
    D[row, a] = 1
    D[row, b] = -1
del n, k, labels, iso, edges, g, mem, a, b, row
`,
  check: py`null = S['nullspace'](S['D'])
sz = null.sum(axis=0)
G.expect('ngroups', null.shape[1], 2)
G.expect('sizes', sz, 2)
G.expect('max_group_size', int(sz.max()), 2)
G.expect('lonely', int(np.sum(sz == 1)), 2)
g = np.where(null[S['person']] != 0)[0][0]
G.expect('origin_size', int(sz[g]), 2)
`,
  hint: 'Column sums give group sizes: null.sum(axis=0). A person with no friends forms a group of size 1. np.where(null[p] != 0)[0][0] is the column of person p.',
  solution: p => py`import numpy as np

null = nullspace(D)
ngroups = null.shape[1]
sizes = null.sum(axis=0)
max_group_size = int(sizes.max())
lonely = int(np.sum(sizes == 1))
g = np.where(null[${p.person}] != 0)[0][0]
origin_size = int(sizes[g])
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
},
{
  id: 'l6-dct', lab: 6, title: 'Build the DCT basis',
  params: r => ({ tol: r.pick([0.25, 0.4, 0.5]) }),
  prompt: p => `
<p>The DCT matrix <code>D</code> has entry (row <code>i</code>, column <code>k</code>)</p>
<pre>D[i, k] = cos( (π/N) (i + 1/2) k )</pre>
<p>with every column then normalized to length 1.</p>
<ol>
<li>Write <code>create_dct_basis(N)</code> that returns this <code>N × N</code> matrix</li>
<li><code>ybar</code>: the DCT coordinates of the given signal <code>y</code>, so that <code>D @ ybar = y</code> (no solve or inv: <code>D</code> is orthonormal)</li>
<li><code>W</code>: an <code>N × N</code> array whose row <code>k</code> is the running total <code>ybar[0] d_0 + ... + ybar[k] d_k</code>, where <code>d_i</code> is column <code>i</code> of <code>D</code></li>
<li><code>yremove</code>: a copy of <code>ybar</code> with every entry whose absolute value is less than ${p.tol} set to 0, and <code>removed_entries</code>: how many entries were set to 0</li>
</ol>`,
  given: [['N', 'int', 'signal length'], ['y', '1d numpy array', 'signal, length N']],
  defines: [['create_dct_basis', 'function', 'N × N DCT matrix'], ['ybar', '1d numpy array', 'DCT coordinates of y'], ['W', '2d numpy array', 'running totals of the waves'], ['yremove', '1d numpy array', 'thresholded coordinates'], ['removed_entries', 'int', 'entries set to 0']],
  starter: py`import numpy as np
import numpy.linalg as la

def create_dct_basis(N):
    pass

ybar = ...
W = ...
yremove = ...
removed_entries = ...
`,
  setup: py`tol = PARAMS['tol']
N = 16
x = np.linspace(0, 1, N)
y = np.where(((x >= 0.25) & (x < 0.5)) | ((x >= 0.75) & (x < 1.0)), 1.0, -1.0) + np.round(np.random.randn(N) * 0.2, 2)
del x
`,
  check: py`def ref(N):
    D = np.zeros((N, N))
    for k in range(N):
        for i in range(N):
            D[i, k] = np.cos(np.pi / N * (i + 0.5) * k)
        D[:, k] = D[:, k] / np.linalg.norm(D[:, k])
    return D
G.expect_fn('create_dct_basis', [(16,), (1,), (5,), (8,), (33,)], ref, 3)
D = ref(S['N'])
yb = D.T @ S['y']
W = np.zeros((S['N'], S['N']))
for k in range(S['N']):
    W[k] = D[:, :k+1] @ yb[:k+1]
yr = yb.copy()
mask = np.abs(yr) < S['tol']
yr[mask] = 0
G.expect('ybar', yb, 2)
G.expect('W', W, 2)
G.expect('yremove', yr, 2)
G.expect('removed_entries', int(mask.sum()), 1)
`,
  hint: 'Two loops (k over columns, i over rows), then divide column k by la.norm(D[:, k]). For an orthonormal D, the inverse is D.T, so ybar = D.T @ y. Row k of W is D[:, :k+1] @ ybar[:k+1].',
  solution: p => py`import numpy as np
import numpy.linalg as la

def create_dct_basis(N):
    D = np.zeros((N, N))
    for k in range(N):
        for i in range(N):
            D[i, k] = np.cos(np.pi / N * (i + 0.5) * k)
        D[:, k] = D[:, k] / la.norm(D[:, k])
    return D

D = create_dct_basis(N)
ybar = D.T @ y

W = np.zeros((N, N))
for k in range(N):
    W[k] = D[:, :k+1] @ ybar[:k+1]

yremove = ybar.copy()
removed_entries = 0
for i in range(N):
    if abs(yremove[i]) < ${p.tol}:
        yremove[i] = 0
        removed_entries += 1
`
},
{
  id: 'l6-audio', lab: 6, title: 'Audio compression in sections',
  params: r => ({ N: r.pick([32, 48, 64]), m: r.pick([6, 10, 15]) }),
  prompt: p => `
<p><code>y</code> is an audio signal. Compress it in sections of <code>N = ${p.N}</code> samples, keeping only the first <code>m = ${p.m}</code> DCT basis vectors.</p>
<ol>
<li><code>sections</code>: how many full sections of length ${p.N} fit in <code>y</code> (<code>int</code>)</li>
<li><code>D_trunc</code>: the first ${p.m} columns of <code>D = create_dct_basis(${p.N})</code></li>
<li><code>y_trunc</code>: same shape as <code>y</code>. For each section <code>sec = y[i*N:(i+1)*N]</code>, convert to truncated DCT coordinates and back, and store the result in the same slice of <code>y_trunc</code>. Entries after the last full section stay 0.</li>
</ol>`,
  given: [['y', '1d numpy array', 'audio signal'], ['create_dct_basis', 'function', 'n × n DCT basis matrix']],
  defines: [['sections', 'int', 'number of full sections'], ['D_trunc', '2d numpy array', 'first m DCT columns'], ['y_trunc', '1d numpy array', 'compressed signal']],
  starter: py`import numpy as np

sections = ...
D_trunc = ...
y_trunc = ...
`,
  setup: py`Nsec = PARAMS['N']
msec = PARAMS['m']
def create_dct_basis(n):
    j = np.arange(n).reshape(-1, 1)
    k = np.arange(n).reshape(1, -1)
    B = np.cos(np.pi * (2 * j + 1) * k / (2 * n))
    B[:, 0] *= np.sqrt(1 / n)
    B[:, 1:] *= np.sqrt(2 / n)
    return B
L = Nsec * int(np.random.randint(4, 8)) + int(np.random.randint(0, Nsec // 2))
x = np.linspace(0, 2 * np.pi, L)
y = np.zeros(L)
for _ in range(8):
    y += np.cos((x + np.random.rand() * 10 - 5) * np.random.rand() * 20) * np.random.rand()
del L, x, _
`,
  check: py`N = S['Nsec']; m = S['msec']; y = S['y']
sec_n = len(y) // N
Dt = S['create_dct_basis'](N)[:, :m]
yt = np.zeros_like(y)
for i in range(sec_n):
    yt[i*N:(i+1)*N] = Dt @ (Dt.T @ y[i*N:(i+1)*N])
G.expect('sections', sec_n, 2)
G.expect('D_trunc', Dt, 3)
G.expect('y_trunc', yt, 5)
`,
  hint: 'sections = len(y) // N. D[:, :m] keeps the first m columns. In the loop: sec_bar = D_trunc.T @ sec, then D_trunc @ sec_bar goes back.',
  solution: p => py`import numpy as np

N = ${p.N}
m = ${p.m}
D = create_dct_basis(N)
sections = len(y) // N
D_trunc = D[:, :m]

y_trunc = np.zeros_like(y)
for i in range(sections):
    sec = y[i * N:(i + 1) * N]
    sec_bar = D_trunc.T @ sec
    y_trunc[i * N:(i + 1) * N] = D_trunc @ sec_bar
`
},
{
  id: 'l6-haar', lab: 6, title: 'Haar basis: keep the big coordinates',
  params: r => ({ keep: r.pick([3, 4, 5]) }),
  prompt: p => `
<p>The columns of the 8 × 8 matrix <code>H</code> are the Haar wavelet basis (orthogonal but <b>not</b> orthonormal), and <code>x</code> is a vector in R<sup>8</sup>.</p>
<ol>
<li><code>xH</code>: the coordinates of <code>x</code> in the Haar basis, so <code>H @ xH = x</code></li>
<li><code>xH_small</code>: a copy of <code>xH</code> where only the ${p.keep} entries with the largest absolute value are kept and the other ${8 - p.keep} are set to 0</li>
<li><code>x_approx</code>: the vector (standard basis) with Haar coordinates <code>xH_small</code></li>
<li><code>rel_err</code>: the entrywise relative error <code>|x − x_approx| / |x|</code> (1d array)</li>
</ol>`,
  given: [['H', '2d numpy array', 'Haar basis (columns)'], ['x', '1d numpy array', 'vector in R^8']],
  defines: [['xH', '1d numpy array', 'Haar coordinates'], ['xH_small', '1d numpy array', 'kept coordinates'], ['x_approx', '1d numpy array', 'approximation of x'], ['rel_err', '1d numpy array', 'relative error']],
  starter: py`import numpy as np
import numpy.linalg as la

xH = ...
xH_small = ...
x_approx = ...
rel_err = ...
`,
  setup: py`keep = PARAMS['keep']
H = np.array([[1, 1, 1, 0, 1, 0, 0, 0],
              [1, 1, 1, 0, -1, 0, 0, 0],
              [1, 1, -1, 0, 0, 1, 0, 0],
              [1, 1, -1, 0, 0, -1, 0, 0],
              [1, -1, 0, 1, 0, 0, 1, 0],
              [1, -1, 0, 1, 0, 0, -1, 0],
              [1, -1, 0, -1, 0, 0, 0, 1],
              [1, -1, 0, -1, 0, 0, 0, -1]], dtype=float)
x = np.array([240, 170, 200, 200, -150, -200, -225, -220], dtype=float) + np.round(np.random.randn(8) * 15, 1)
x[np.abs(x) < 1] = 7
`,
  check: py`xH = ORIG['solve'](S['H'], S['x'])
idx = np.argsort(np.abs(xH))[:8 - S['keep']]
xs = xH.copy()
xs[idx] = 0
xa = S['H'] @ xs
G.expect('xH', xH, 3)
G.expect('xH_small', xs, 3)
G.expect('x_approx', xa, 2)
G.expect('rel_err', np.abs(S['x'] - xa) / np.abs(S['x']), 2)
`,
  hint: 'H is not orthonormal, so use la.solve(H, x) (or la.inv(H) @ x). np.argsort(np.abs(xH)) lists indices from smallest to largest, so the first 8 - keep of them are the ones to zero.',
  solution: p => py`import numpy as np
import numpy.linalg as la

xH = la.solve(H, x)

idx = np.argsort(np.abs(xH))[:${8 - p.keep}]
xH_small = xH.copy()
xH_small[idx] = 0

x_approx = H @ xH_small
rel_err = np.abs(x - x_approx) / np.abs(x)
`
}
];
