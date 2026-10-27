const GROUPS = {
  py: 'Python core',
  arr: 'Arrays & matrices',
  mask: 'Masks & reductions',
  geo: 'Transforms',
  solve: 'Solving systems',
  graph: 'Graphs',
  basis: 'Bases & the DCT'
};

const matStr = (name, M) => {
  const cells = M.map(r => r.map(v => String(v)));
  const w = Math.max(...cells.flat().map(s => s.length));
  return name + ' =\n' + cells.map(r => '[ ' + r.map(s => s.padStart(w)).join('  ') + ' ]').join('\n');
};
const randMat = (r, n, m, lo, hi) => Array.from({ length: n }, () => Array.from({ length: m }, () => r.int(lo, hi)));

const DRILLS = [
/* ---------- Python core ---------- */
{
  id: 'd-slice', group: 'py', title: 'Slicing a list',
  params: r => ({}),
  prompt: p => `<p>Given a list <code>A</code> and an int <code>n</code>, define <code>first</code> (first n entries), <code>last_rev</code> (last n entries, reversed) and <code>evens</code> (entries at even indices 0, 2, 4, …).</p>`,
  given: [['A', 'list', 'numbers'], ['n', 'int', 'a count']],
  defines: [['first', 'list', 'A[0..n-1]'], ['last_rev', 'list', 'last n, reversed'], ['evens', 'list', 'every other entry from index 0']],
  starter: py`first = ...
last_rev = ...
evens = ...
`,
  setup: py`A = [int(x) for x in np.random.randint(-9, 30, size=int(np.random.randint(8, 13)))]
n = int(np.random.randint(2, 5))
`,
  check: py`A, n = S['A'], S['n']
G.expect('first', A[:n], 3)
G.expect('last_rev', A[::-1][:n], 4)
G.expect('evens', A[::2], 3)
`,
  solution: p => py`first = A[:n]
last_rev = A[::-1][:n]     # or A[-n:][::-1]
evens = A[::2]
`,
  idea: 'A[start:stop:step]. A negative step walks backward, so A[::-1] reverses. A[-n:] is the last n.'
},
{
  id: 'd-tuple', group: 'py', title: 'Return two things',
  params: r => ({}),
  prompt: p => `<p>Write <code>spread(A)</code> that returns the tuple <code>(smallest, largest)</code> of a non-empty list, using a loop (no <code>min</code>/<code>max</code> on the whole list).</p>`,
  given: [['A', 'list', 'example list']],
  defines: [['spread', 'function', 'returns (smallest, largest)']],
  starter: py`def spread(A):
    pass
`,
  setup: py`A = [int(x) for x in np.random.randint(-20, 20, size=8)]
`,
  check: py`cases = [(S['A'],), ([4],), ([3, -1, 7, 7],)] + [([float(x) for x in np.random.randn(k)],) for k in [5, 9]]
G.expect_fn('spread', cases, lambda A: (min(A), max(A)), 10)
`,
  solution: p => py`def spread(A):
    lo = A[0]
    hi = A[0]
    for a in A:
        if a < lo:
            lo = a
        if a > hi:
            hi = a
    return lo, hi
`,
  idea: 'Start the running values at A[0], update inside one loop, and return lo, hi (a comma makes a tuple).'
},
{
  id: 'd-backloop', group: 'py', title: 'Loop backwards',
  params: r => ({}),
  prompt: p => `<p>Back substitution walks indices from <code>n-1</code> down to <code>0</code>. Define <code>order</code> as that list of indices for the given <code>n</code>, and <code>tails</code>, where <code>tails[k]</code> is <code>sum(v[i+1:])</code> for <code>i = order[k]</code>.</p>`,
  given: [['n', 'int', 'length'], ['v', '1d numpy array', 'length n']],
  defines: [['order', 'list', '[n-1, ..., 0]'], ['tails', 'list', 'sums of v after each index, in that order']],
  starter: py`order = ...
tails = ...
`,
  setup: py`n = int(np.random.randint(4, 9))
v = np.random.randint(-5, 6, size=n).astype(float)
`,
  check: py`n, v = S['n'], S['v']
o = list(range(n - 1, -1, -1))
G.expect('order', o, 5)
G.expect('tails', [float(v[i + 1:].sum()) for i in o], 5)
`,
  solution: p => py`order = list(range(n - 1, -1, -1))
tails = [sum(v[i+1:]) for i in order]
`,
  idea: 'range(n-1, -1, -1): the stop is -1 because range excludes it. v[i+1:] for i = n-1 is empty and sums to 0.'
},

/* ---------- Arrays ---------- */
{
  id: 'd-build', group: 'arr', title: 'Type a matrix',
  params: r => ({ m: randMat(r, 3, 3, -5, 9) }),
  prompt: p => `<p>Create this matrix as a NumPy array named <code>M</code>, then define <code>Mt</code> (its transpose) and <code>shape</code> (its shape).</p><pre>${matStr('M', p.m)}</pre>`,
  given: [],
  defines: [['M', 'numpy array', 'the matrix above'], ['Mt', 'numpy array', 'transpose'], ['shape', 'tuple', 'M.shape']],
  starter: py`import numpy as np

M = ...
Mt = ...
shape = ...
`,
  setup: py`pass
`,
  check: py`M = np.array(S['PARAMS']['m'], dtype=float)
G.expect('M', M, 5)
G.expect('Mt', M.T, 3)
G.expect('shape', tuple(M.shape), 2)
`,
  solution: p => py`import numpy as np

M = np.array([${p.m.map(r => '[' + r.join(', ') + ']').join(',\n              ')}])
Mt = M.T
shape = M.shape
`,
  idea: 'One inner list per row. .T transposes, .shape is (rows, cols).'
},
{
  id: 'd-matmul', group: 'arr', title: '@ versus *',
  params: r => ({}),
  prompt: p => `<p>For the 3 × 3 matrices <code>A</code>, <code>B</code> and vector <code>x</code>, define <code>prod</code> (matrix product AB), <code>entry</code> (entrywise product), <code>Ax</code> (matrix times vector) and <code>combo</code> = 2x − 3·(Ax).</p>`,
  given: [['A', 'numpy array', '3 × 3'], ['B', 'numpy array', '3 × 3'], ['x', '1d numpy array', 'length 3']],
  defines: [['prod', 'numpy array', 'A B'], ['entry', 'numpy array', 'entrywise'], ['Ax', '1d numpy array', 'A x'], ['combo', '1d numpy array', '2x − 3(Ax)']],
  starter: py`import numpy as np

prod = ...
entry = ...
Ax = ...
combo = ...
`,
  setup: py`A = np.random.randint(-4, 5, size=(3, 3)).astype(float)
B = np.random.randint(-4, 5, size=(3, 3)).astype(float)
x = np.random.randint(-4, 5, size=3).astype(float)
`,
  check: py`A, B, x = S['A'], S['B'], S['x']
G.expect('prod', A @ B, 3)
G.expect('entry', A * B, 2)
G.expect('Ax', A @ x, 3)
G.expect('combo', 2 * x - 3 * (A @ x), 2)
`,
  solution: p => py`import numpy as np

prod = A @ B
entry = A * B
Ax = A @ x
combo = 2 * x - 3 * Ax
`,
  idea: '@ is the linear-algebra product. * multiplies matching entries. Scalars and + - work entrywise on arrays.'
},
{
  id: 'd-index', group: 'arr', title: 'Rows, columns, blocks',
  params: r => ({ i: r.int(0, 5), j: r.int(0, 5), bi: r.pick([0, 2, 4]), bj: r.pick([0, 2, 4]) }),
  prompt: p => `<p><code>M</code> is 8 × 8. Define <code>row</code> (row ${p.i}), <code>col</code> (column ${p.j}), <code>block</code> (the 4 × 4 block whose top-left corner is <code>[${p.bi}, ${p.bj}]</code>) and <code>Z</code>, a copy of <code>M</code> with that block set to 0 (leave <code>M</code> unchanged).</p>`,
  given: [['M', 'numpy array', '8 × 8']],
  defines: [['row', '1d numpy array', 'one row'], ['col', '1d numpy array', 'a column'], ['block', 'numpy array', '4 × 4'], ['Z', 'numpy array', 'copy with block zeroed']],
  starter: py`import numpy as np

row = ...
col = ...
block = ...
Z = ...
`,
  setup: py`M = np.random.randint(0, 50, size=(8, 8)).astype(float)
`,
  check: py`p = S['PARAMS']
M = S['M']
i, j, bi, bj = p['i'], p['j'], p['bi'], p['bj']
G.expect('row', M[i, :], 2)
G.expect('col', M[:, j], 2)
G.expect('block', M[bi:bi+4, bj:bj+4], 3)
Zr = M.copy()
Zr[bi:bi+4, bj:bj+4] = 0
G.expect('Z', Zr, 2)
zok = 'Z' in U and U['Z'] is not Ellipsis
if zok and 'M' in U and not np.array_equal(U['M'], M):
    G._add('M unchanged', False, 1, 'M was modified. Use M.copy() before assigning into it.')
else:
    G._add('M unchanged', zok, 1, 'M was left unchanged' if zok else 'define Z first')
`,
  solution: p => py`import numpy as np

row = M[${p.i}, :]
col = M[:, ${p.j}]
block = M[${p.bi}:${p.bi + 4}, ${p.bj}:${p.bj + 4}]
Z = M.copy()
Z[${p.bi}:${p.bi + 4}, ${p.bj}:${p.bj + 4}] = 0
`,
  idea: 'M[i, :] row, M[:, j] column, M[a:a+4, b:b+4] block. Assigning into a slice changes the original, so copy first.'
},
{
  id: 'd-stack', group: 'arr', title: 'Stack and reshape',
  params: r => ({}),
  prompt: p => `<p>Given vectors <code>u</code> and <code>v</code> (same length n), define <code>rows</code> (2 × n, u on top), <code>cols</code> (n × 2, u is column 0), <code>ucol</code> (u as an n × 1 column) and <code>longer</code> (v with a 0 added at the end).</p>`,
  given: [['u', '1d numpy array', 'length n'], ['v', '1d numpy array', 'length n']],
  defines: [['rows', 'numpy array', '2 × n'], ['cols', 'numpy array', 'n × 2'], ['ucol', 'numpy array', 'n × 1'], ['longer', '1d numpy array', 'length n + 1']],
  starter: py`import numpy as np

rows = ...
cols = ...
ucol = ...
longer = ...
`,
  setup: py`n = int(np.random.randint(4, 8))
u = np.random.randint(-9, 10, size=n).astype(float)
v = np.random.randint(-9, 10, size=n).astype(float)
del n
`,
  check: py`u, v = S['u'], S['v']
G.expect('rows', np.vstack([u, v]), 3)
G.expect('cols', np.column_stack([u, v]), 3)
G.expect('ucol', u.reshape(-1, 1), 2)
G.expect('longer', np.append(v, 0.0), 2)
`,
  solution: p => py`import numpy as np

rows = np.vstack([u, v])
cols = np.column_stack([u, v])     # or rows.T
ucol = u.reshape(-1, 1)
longer = np.append(v, 0)
`,
  idea: 'vstack puts vectors in rows, column_stack (or .T) puts them in columns. reshape(-1, 1) makes a column so it broadcasts across a 2 × N array.'
},
{
  id: 'd-band', group: 'arr', title: 'Build a banded matrix',
  params: r => ({ n: r.int(5, 8), d: r.pick([2, 3, 4]), o: r.pick([-1, 1, 2]) }),
  prompt: p => `<p>Define the ${p.n} × ${p.n} matrix <code>T</code> with ${p.d} on the diagonal, ${p.o} directly above and directly below the diagonal, and 0 elsewhere. Do it without typing the matrix out.</p>`,
  given: [],
  defines: [['T', 'numpy array', 'banded matrix']],
  starter: py`import numpy as np

T = ...
`,
  setup: py`pass
`,
  check: py`p = S['PARAMS']
n, d, o = p['n'], p['d'], p['o']
G.expect('T', d * np.eye(n) + o * np.eye(n, k=1) + o * np.eye(n, k=-1), 10)
`,
  solution: p => py`import numpy as np

n = ${p.n}
T = ${p.d} * np.eye(n) + ${p.o} * np.eye(n, k=1) + ${p.o} * np.eye(n, k=-1)

# loop version:
# T = np.zeros((n, n))
# for i in range(n):
#     T[i, i] = ${p.d}
#     if i > 0: T[i, i-1] = ${p.o}
#     if i < n - 1: T[i, i+1] = ${p.o}
`,
  idea: 'np.eye(n, k=1) is ones one step above the diagonal, k=-1 one step below. A loop with the two edge checks works too.'
},

/* ---------- Masks & reductions ---------- */
{
  id: 'd-mask', group: 'mask', title: 'Zero out small entries',
  params: r => ({ tol: r.pick([0.5, 1, 1.5, 2]) }),
  prompt: p => `<p>Define <code>f</code>: a copy of <code>c</code> where every entry with absolute value below ${p.tol} becomes 0. Also define <code>kept</code> (number of nonzero entries in <code>f</code>, an int) and <code>biggest</code> (largest absolute value in <code>c</code>).</p>`,
  given: [['c', '1d numpy array', 'coefficients']],
  defines: [['f', '1d numpy array', 'filtered copy'], ['kept', 'int', 'nonzero count'], ['biggest', 'float', 'max |c|']],
  starter: py`import numpy as np

f = ...
kept = ...
biggest = ...
`,
  setup: py`c = np.round(np.random.randn(30) * 1.6, 3)
`,
  check: py`c = S['c']
t = S['PARAMS']['tol']
f = c.copy()
f[np.abs(f) < t] = 0
G.expect('f', f, 5)
G.expect('kept', int(np.count_nonzero(f)), 3)
G.expect('biggest', float(np.max(np.abs(c))), 2)
`,
  solution: p => py`import numpy as np

f = c.copy()
f[np.abs(f) < ${p.tol}] = 0
kept = int(np.count_nonzero(f))
biggest = np.max(np.abs(c))
`,
  idea: 'A comparison makes a boolean array; indexing with it selects those entries, and assigning sets only them.'
},
{
  id: 'd-axis', group: 'mask', title: 'Sums along an axis',
  params: r => ({}),
  prompt: p => `<p>For the 2d array <code>W</code>, define <code>row_sums</code>, <code>col_sums</code>, <code>top_row</code> (index of the row with the largest sum, an int) and <code>total</code>.</p>`,
  given: [['W', 'numpy array', 'm × n']],
  defines: [['row_sums', '1d numpy array', 'one per row'], ['col_sums', '1d numpy array', 'one per column'], ['top_row', 'int', 'argmax of row sums'], ['total', 'float', 'sum of everything']],
  starter: py`import numpy as np

row_sums = ...
col_sums = ...
top_row = ...
total = ...
`,
  setup: py`W = np.random.randint(0, 6, size=(int(np.random.randint(4, 7)), int(np.random.randint(3, 6)))).astype(float)
`,
  check: py`W = S['W']
G.expect('row_sums', W.sum(axis=1), 3)
G.expect('col_sums', W.sum(axis=0), 3)
G.expect('top_row', int(np.argmax(W.sum(axis=1))), 2)
G.expect('total', float(W.sum()), 2)
`,
  solution: p => py`import numpy as np

row_sums = np.sum(W, axis=1)
col_sums = np.sum(W, axis=0)
top_row = int(np.argmax(row_sums))
total = np.sum(W)
`,
  idea: 'axis=1 collapses the columns, giving one number per row. axis=0 gives one per column.'
},
{
  id: 'd-all', group: 'mask', title: 'Check every entry',
  params: r => ({}),
  prompt: p => `<p>Write <code>all_positive(M)</code> that returns <code>True</code> when every entry of the array is greater than 0, and <code>False</code> otherwise. Also define <code>num_zero</code>: how many entries of the given <code>M</code> equal 0 (an int).</p>`,
  given: [['M', 'numpy array', 'example matrix']],
  defines: [['all_positive', 'function', 'returns a bool'], ['num_zero', 'int', 'zero entries in M']],
  starter: py`import numpy as np

def all_positive(M):
    pass

num_zero = ...
`,
  setup: py`M = np.random.randint(0, 4, size=(5, 5)).astype(float)
`,
  check: py`cases = [(S['M'],), (np.ones((3, 3)),), (np.array([[1.0, 0.0], [2.0, 3.0]]),), (np.array([[2.0, -1.0], [1.0, 1.0]]),), (np.random.rand(6, 6) + 0.1,)]
G.expect_fn('all_positive', cases, lambda M: bool(np.all(M > 0)), 6)
G.expect('num_zero', int(np.count_nonzero(S['M'] == 0)), 4)
`,
  solution: p => py`import numpy as np

def all_positive(M):
    return bool(np.all(M > 0))

num_zero = int(np.count_nonzero(M == 0))
`,
  idea: 'np.all(M > 0) collapses a boolean array to one True/False. Counting True values with count_nonzero counts matches.'
},

/* ---------- Transforms ---------- */
{
  id: 'd-rad', group: 'geo', title: 'Rotation matrix from degrees',
  params: r => ({ deg: r.pick([30, 45, 60, 120, 135, 210, 300]) }),
  prompt: p => `<p>Define <code>R</code>, the 2 × 2 matrix that rotates points ${p.deg}° counterclockwise about the origin, and <code>moved</code> = <code>R</code> applied to every column of <code>pts</code>.</p>`,
  given: [['pts', 'numpy array', '2 × N points']],
  defines: [['R', 'numpy array', '2 × 2'], ['moved', 'numpy array', '2 × N']],
  starter: py`import numpy as np

R = ...
moved = ...
`,
  setup: py`pts = np.random.randn(2, 12)
`,
  check: py`t = np.radians(S['PARAMS']['deg'])
R = np.array([[np.cos(t), -np.sin(t)], [np.sin(t), np.cos(t)]])
G.expect('R', R, 6)
G.expect('moved', R @ S['pts'], 4)
`,
  solution: p => py`import numpy as np

t = ${p.deg} * np.pi / 180
R = np.array([[np.cos(t), -np.sin(t)],
              [np.sin(t),  np.cos(t)]])
moved = R @ pts
`,
  idea: 'Convert to radians first. Columns of R are where (1, 0) and (0, 1) land: (cos, sin) and (−sin, cos).'
},
{
  id: 'd-compose', group: 'geo', title: 'Order of composition',
  params: r => ({ first: r.pick(['A', 'B']) }),
  prompt: p => `<p>Apply <code>${p.first}</code> to the points first, then <code>${p.first === 'A' ? 'B' : 'A'}</code>. Store the result in <code>out</code>, and the single combined matrix in <code>Cm</code>.</p>`,
  given: [['A', 'numpy array', '2 × 2'], ['B', 'numpy array', '2 × 2'], ['pts', 'numpy array', '2 × N']],
  defines: [['out', 'numpy array', '2 × N'], ['Cm', 'numpy array', 'combined 2 × 2 matrix']],
  starter: py`import numpy as np

Cm = ...
out = ...
`,
  setup: py`A = np.random.randint(-3, 4, size=(2, 2)).astype(float)
B = np.random.randint(-3, 4, size=(2, 2)).astype(float)
while np.allclose(A @ B, B @ A):
    B = np.random.randint(-3, 4, size=(2, 2)).astype(float)
pts = np.random.randn(2, 10)
`,
  check: py`A, B = S['A'], S['B']
Cm = B @ A if S['PARAMS']['first'] == 'A' else A @ B
G.expect('Cm', Cm, 5)
G.expect('out', Cm @ S['pts'], 5)
`,
  solution: p => py`import numpy as np

Cm = ${p.first === 'A' ? 'B @ A' : 'A @ B'}     # the first one sits next to the points
out = Cm @ pts
`,
  idea: 'Read right to left: in X @ Y @ pts, Y acts first. So "first Y, then X" is X @ Y.'
},
{
  id: 'd-colvec', group: 'geo', title: 'Shift every point',
  params: r => ({ cx: r.int(-5, 5), cy: r.int(-5, 5) }),
  prompt: p => `<p>Subtract the point <code>(${p.cx}, ${p.cy})</code> from every column of <code>pts</code> and store it as <code>shifted</code>. Then define <code>back</code> by adding it again.</p>`,
  given: [['pts', 'numpy array', '2 × N points']],
  defines: [['shifted', 'numpy array', '2 × N'], ['back', 'numpy array', '2 × N']],
  starter: py`import numpy as np

shifted = ...
back = ...
`,
  setup: py`pts = np.random.randn(2, 9) * 3
`,
  check: py`p = S['PARAMS']
c = np.array([[p['cx']], [p['cy']]], dtype=float)
G.expect('shifted', S['pts'] - c, 6)
G.expect('back', S['pts'], 4)
`,
  solution: p => py`import numpy as np

c = np.array([[${p.cx}],
              [${p.cy}]])     # 2 × 1 column
shifted = pts - c
back = shifted + c
`,
  idea: 'A 2 × 1 column broadcasts across all N columns. A flat array of length 2 does not line up with a 2 × N array.'
},

/* ---------- Solving ---------- */
{
  id: 'd-inv', group: 'solve', title: 'Solve without solve()',
  banned: ['numpy.linalg.solve', 'scipy.linalg.solve'],
  params: r => ({}),
  prompt: p => `<p>Solve <code>A x = b</code> and <code>A X = B</code> (several right-hand sides, one per column of <code>B</code>). <code>np.linalg.solve</code> is blocked.</p>`,
  given: [['A', 'numpy array', 'n × n invertible'], ['b', '1d numpy array', 'length n'], ['B', 'numpy array', 'n × k']],
  defines: [['x', '1d numpy array', 'solution'], ['X', 'numpy array', 'n × k solutions']],
  starter: py`import numpy as np

x = ...
X = ...
`,
  setup: py`n = int(np.random.randint(3, 6))
A = np.random.randn(n, n) + n * np.eye(n)
b = np.random.randn(n)
B = np.random.randn(n, 3)
del n
`,
  check: py`Ai = ORIG['inv'](S['A'])
G.expect('x', Ai @ S['b'], 5)
G.expect('X', Ai @ S['B'], 5)
`,
  solution: p => py`import numpy as np

Ainv = np.linalg.inv(A)
x = Ainv @ b
X = Ainv @ B
`,
  idea: 'x = inv(A) @ b. The same inverse handles a whole matrix of right-hand sides at once.'
},
{
  id: 'd-lu', group: 'solve', title: 'The LU recipe',
  banned: ['numpy.linalg.solve', 'numpy.linalg.inv', 'scipy.linalg.solve', 'scipy.linalg.inv'],
  params: r => ({}),
  prompt: p => `<p>Use <code>scipy.linalg.lu</code> and <code>scipy.linalg.solve_triangular</code> to solve <code>A x = b</code>. Store <code>P</code>, <code>L</code>, <code>U</code> and the solution <code>x</code>. <code>solve</code> and <code>inv</code> are blocked.</p>`,
  given: [['A', 'numpy array', 'n × n'], ['b', '1d numpy array', 'length n']],
  defines: [['P', 'numpy array', 'permutation'], ['L', 'numpy array', 'lower triangular'], ['U', 'numpy array', 'upper triangular'], ['x', '1d numpy array', 'solution']],
  starter: py`import numpy as np
import scipy.linalg as sla

P, L, U = ...
x = ...
`,
  setup: py`n = int(np.random.randint(3, 6))
A = np.random.randint(-5, 6, size=(n, n)).astype(float) + 6 * np.eye(n)
b = np.random.randint(-9, 10, size=n).astype(float)
del n
`,
  check: py`P, L, U = ORIG['lu'](S['A'])
G.expect('P', P, 1)
G.expect('L', L, 2)
G.expect('U', U, 2)
G.expect('x', ORIG['solve'](S['A'], S['b']), 5)
`,
  solution: p => py`import numpy as np
import scipy.linalg as sla

P, L, U = sla.lu(A)                                   # A = P @ L @ U
y = sla.solve_triangular(L, P.T @ b, lower=True)      # L y = P^T b
x = sla.solve_triangular(U, y)                        # U x = y
`,
  idea: 'A = P L U, so L U x = Pᵀ b. Forward-solve with L (lower=True), then back-solve with U.'
},
{
  id: 'd-fwd', group: 'solve', title: 'One substitution loop',
  banned: ['numpy.linalg.solve', 'numpy.linalg.inv', 'scipy.linalg.solve', 'scipy.linalg.inv', 'scipy.linalg.solve_triangular'],
  params: r => ({}),
  prompt: p => `<p><code>L</code> is lower triangular. Solve <code>L x = b</code> with a single loop: <code>x[i] = (b[i] − L[i, :i] @ x[:i]) / L[i, i]</code>. Store the result in <code>x</code>.</p>`,
  given: [['L', 'numpy array', 'n × n lower triangular'], ['b', '1d numpy array', 'length n']],
  defines: [['x', '1d numpy array', 'solution']],
  starter: py`import numpy as np

x = ...
`,
  setup: py`n = int(np.random.randint(4, 7))
L = np.tril(np.random.randint(-3, 4, size=(n, n))).astype(float)
np.fill_diagonal(L, np.random.randint(1, 5, size=n))
b = np.random.randint(-9, 10, size=n).astype(float)
del n
`,
  check: py`G.expect('x', ORIG['solve'](S['L'], S['b']), 10)
`,
  solution: p => py`import numpy as np

n = len(b)
x = np.zeros(n)
for i in range(n):
    x[i] = (b[i] - L[i, :i] @ x[:i]) / L[i, i]
`,
  idea: 'Each row only uses x values already found. For upper triangular, loop i from n-1 down and use U[i, i+1:] @ x[i+1:].'
},

/* ---------- Graphs ---------- */
{
  id: 'd-walks', group: 'graph', title: 'Count walks',
  params: r => ({ k: r.pick([2, 3, 4]), i: r.int(0, 9), j: r.int(0, 9) }),
  prompt: p => `<p><code>A</code> is a 10 × 10 adjacency matrix (<code>A[i, j] = 1</code> means an edge from j to i). Define <code>w</code>: the number of walks of length exactly ${p.k} from node ${p.j} to node ${p.i} (an int), and <code>Ak</code> = A<sup>${p.k}</sup>.</p>`,
  given: [['A', 'numpy array', '10 × 10 adjacency']],
  defines: [['Ak', 'numpy array', `A to the power k`], ['w', 'int', 'walks from j to i']],
  starter: py`import numpy as np
import numpy.linalg as la

Ak = ...
w = ...
`,
  setup: py`A = (np.random.rand(10, 10) < 0.3).astype(float)
np.fill_diagonal(A, 0)
`,
  check: py`p = S['PARAMS']
Ak = ORIG['matrix_power'](S['A'], p['k'])
G.expect('Ak', Ak, 4)
G.expect('w', int(Ak[p['i'], p['j']]), 6)
`,
  solution: p => py`import numpy as np
import numpy.linalg as la

Ak = la.matrix_power(A, ${p.k})
w = int(Ak[${p.i}, ${p.j}])      # [to, from]
`,
  idea: 'Entry [i, j] of A^k counts walks of length k from j to i. With this column-is-from convention the index is [to, from].'
},
{
  id: 'd-atmost', group: 'graph', title: 'Walks of length at most k',
  params: r => ({ k: r.pick([2, 3, 4]) }),
  prompt: p => `<p>For the adjacency matrix <code>A</code>, define <code>S_k</code> = A + A² + … + A<sup>${p.k}</sup> using a loop (it counts walks of length 1 through ${p.k}), and <code>reach_k</code> = (I + A)<sup>${p.k}</sup>.</p>`,
  given: [['A', 'numpy array', 'n × n adjacency']],
  defines: [['S_k', 'numpy array', 'sum of powers'], ['reach_k', 'numpy array', '(I + A)^k']],
  starter: py`import numpy as np
import numpy.linalg as la

S_k = ...
reach_k = ...
`,
  setup: py`n = int(np.random.randint(6, 10))
T = np.triu((np.random.rand(n, n) < 0.3).astype(float), 1)
A = T + T.T
del T, n
`,
  check: py`A = S['A']
k = S['PARAMS']['k']
n = A.shape[0]
Sk = sum(ORIG['matrix_power'](A, m) for m in range(1, k + 1))
G.expect('S_k', Sk, 6)
G.expect('reach_k', ORIG['matrix_power'](np.eye(n) + A, k), 4)
`,
  solution: p => py`import numpy as np
import numpy.linalg as la

n = A.shape[0]
S_k = np.zeros((n, n))
for m in range(1, ${p.k} + 1):
    S_k = S_k + la.matrix_power(A, m)

reach_k = la.matrix_power(np.eye(n) + A, ${p.k})
`,
  idea: 'Both have the same zero pattern off the diagonal: an entry is positive exactly when a walk of length at most k exists. (I+A)^k is the one-line test.'
},
{
  id: 'd-reach', group: 'graph', title: 'Who can be reached',
  params: r => ({ s: r.int(0, 11) }),
  prompt: p => `<p><code>A</code> is the adjacency matrix of an undirected graph with 12 nodes. Define <code>reachable</code>: the number of nodes that can be reached from node ${p.s}, counting node ${p.s} itself (an int).</p>`,
  given: [['A', 'numpy array', '12 × 12 adjacency']],
  defines: [['reachable', 'int', 'size of the component of the start node']],
  starter: py`import numpy as np
import numpy.linalg as la

reachable = ...
`,
  setup: py`n = 12
lab = np.random.randint(0, 3, size=n)
A = np.zeros((n, n))
for a in range(n):
    for b in range(a + 1, n):
        if lab[a] == lab[b] and np.random.rand() < 0.45:
            A[a, b] = A[b, a] = 1
del lab, n, a, b
`,
  check: py`A = S['A']
n = A.shape[0]
R = ORIG['matrix_power'](np.eye(n) + A, n - 1)
G.expect('reachable', int(np.count_nonzero(R[:, S['PARAMS']['s']])), 10)
`,
  solution: p => py`import numpy as np
import numpy.linalg as la

n = A.shape[0]
R = la.matrix_power(np.eye(n) + A, n - 1)
reachable = int(np.count_nonzero(R[:, ${p.s}]))
`,
  idea: 'Any reachable node is within n − 1 steps, so (I + A)^(n−1) has a nonzero in column s exactly for the nodes s can reach.'
},
{
  id: 'd-null', group: 'graph', title: 'Components from an incidence matrix',
  params: r => ({}),
  prompt: p => `<p><code>D</code> is an edge-node incidence matrix (one row per edge, with −1 and +1 in the two endpoint columns). Using the given <code>nullspace</code> function, define <code>components</code> (number of connected components) and <code>rank</code> (<code>n − components</code>, where n is the number of nodes).</p>`,
  given: [['D', 'numpy array', 'edges × n'], ['nullspace', 'function', 'columns are a basis of the nullspace']],
  defines: [['components', 'int', 'connected components'], ['rank', 'int', 'rank of D']],
  starter: py`import numpy as np

components = ...
rank = ...
`,
  setup: py`def nullspace(M, tol=1e-10):
    u, s, vh = np.linalg.svd(M)
    r = int((s > tol).sum())
    return vh[r:].T.copy()
n = int(np.random.randint(8, 14))
k = int(np.random.randint(2, 5))
lab = np.arange(n) % k
rows = []
for g in range(k):
    m = list(np.where(lab == g)[0])
    for a, b in zip(m[:-1], m[1:]):
        r = np.zeros(n); r[a] = -1; r[b] = 1; rows.append(r)
D = np.array(rows)
ncomp = k
del n, k, lab, rows, g, m, a, b, r
`,
  check: py`k = S['ncomp']
G.expect('components', k, 6)
G.expect('rank', S['D'].shape[1] - k, 4)
`,
  solution: p => py`import numpy as np

components = nullspace(D).shape[1]
rank = D.shape[1] - components
`,
  idea: 'D x = 0 exactly when x is constant on each component, so the nullspace has one dimension per component.'
},

/* ---------- Bases ---------- */
{
  id: 'd-orth', group: 'basis', title: 'Coordinates in an orthonormal basis',
  params: r => ({}),
  prompt: p => `<p>The columns of <code>B</code> are an orthonormal basis (the DCT basis). Define <code>c</code>, the coordinates of <code>x</code> in this basis, and <code>x_back</code>, the vector rebuilt from <code>c</code>.</p>`,
  given: [['B', 'numpy array', 'n × n, orthonormal columns'], ['x', '1d numpy array', 'length n']],
  defines: [['c', '1d numpy array', 'coordinates'], ['x_back', '1d numpy array', 'B times c']],
  starter: py`import numpy as np

c = ...
x_back = ...
`,
  setup: py`n = int(np.random.choice([8, 16]))
j = np.arange(n).reshape(-1, 1)
k = np.arange(n).reshape(1, -1)
B = np.cos(np.pi * (2 * j + 1) * k / (2 * n))
B[:, 0] *= np.sqrt(1 / n)
B[:, 1:] *= np.sqrt(2 / n)
x = np.random.randn(n)
del n, j, k
`,
  check: py`c = S['B'].T @ S['x']
G.expect('c', c, 6)
G.expect('x_back', S['x'], 4)
`,
  solution: p => py`import numpy as np

c = B.T @ x        # orthonormal: inverse = transpose
x_back = B @ c
`,
  idea: 'x = B c. For orthonormal columns inv(B) = B.T, so c = B.T @ x. No inverse needed.'
},
{
  id: 'd-gen', group: 'basis', title: 'Coordinates in any basis',
  params: r => ({}),
  prompt: p => `<p>The columns of <code>B</code> and <code>C</code> are two bases (not orthonormal). Define <code>c</code> (coordinates of <code>x</code> in basis B) and <code>P_CB</code> (converts B-coordinates into C-coordinates).</p>`,
  given: [['B', 'numpy array', 'n × n basis'], ['C', 'numpy array', 'n × n basis'], ['x', '1d numpy array', 'a vector']],
  defines: [['c', '1d numpy array', 'B-coordinates of x'], ['P_CB', 'numpy array', 'B → C']],
  starter: py`import numpy as np

c = ...
P_CB = ...
`,
  setup: py`def mk():
    while True:
        M = np.random.randint(-3, 4, size=(3, 3)).astype(float)
        if abs(np.linalg.det(M)) > 2:
            return M
B = mk()
C = mk()
x = np.random.randint(-6, 7, size=3).astype(float)
del mk
`,
  check: py`G.expect('c', ORIG['inv'](S['B']) @ S['x'], 5)
G.expect('P_CB', ORIG['inv'](S['C']) @ S['B'], 5)
`,
  solution: p => py`import numpy as np

c = np.linalg.inv(B) @ x
P_CB = np.linalg.inv(C) @ B     # B-coords -> standard -> C-coords
`,
  idea: 'B-coordinates → standard: multiply by B. Standard → C-coordinates: multiply by inv(C). Chain them right to left.'
},
{
  id: 'd-2d', group: 'basis', title: '2D transform of a block',
  params: r => ({ pct: r.pick([10, 20, 30]) }),
  prompt: p => `<p>For the 8 × 8 <code>chunk</code> and DCT matrix <code>B</code> (8 × 8), define <code>Cc</code> = the 2D DCT coefficients, <code>Cf</code> = <code>Cc</code> with entries below ${p.pct}% of its largest absolute value set to 0, and <code>approx</code> = the chunk rebuilt from <code>Cf</code>.</p>`,
  given: [['chunk', 'numpy array', '8 × 8'], ['B', 'numpy array', '8 × 8 DCT basis']],
  defines: [['Cc', 'numpy array', 'B.T chunk B'], ['Cf', 'numpy array', 'thresholded'], ['approx', 'numpy array', 'rebuilt chunk']],
  starter: py`import numpy as np

Cc = ...
Cf = ...
approx = ...
`,
  setup: py`n = 8
j = np.arange(n).reshape(-1, 1)
k = np.arange(n).reshape(1, -1)
B = np.cos(np.pi * (2 * j + 1) * k / (2 * n))
B[:, 0] *= np.sqrt(1 / n)
B[:, 1:] *= np.sqrt(2 / n)
chunk = np.round(np.random.rand(8, 8) * 255)
del n, j, k
`,
  check: py`B = S['B']
Cc = B.T @ S['chunk'] @ B
Cf = Cc.copy()
Cf[np.abs(Cf) < S['PARAMS']['pct'] / 100 * np.max(np.abs(Cc))] = 0
G.expect('Cc', Cc, 4)
G.expect('Cf', Cf, 3)
G.expect('approx', B @ Cf @ B.T, 3)
`,
  solution: p => py`import numpy as np

Cc = B.T @ chunk @ B
Cf = Cc.copy()
Cf[np.abs(Cf) < ${p.pct / 100} * np.max(np.abs(Cc))] = 0
approx = B @ Cf @ B.T
`,
  idea: 'Transform rows and columns: B.T on the left, B on the right. Undo with B on the left, B.T on the right.'
}
];

const USES = {
  'l1-stats': ['d-slice', 'd-tuple'],
  'l1-runmax': ['d-tuple', 'd-slice'],
  'l2-missing': ['d-matmul'],
  'l2-portfolio': ['d-matmul', 'd-axis'],
  'l2-angle': ['d-rad', 'd-tuple'],
  'l3-reflect': ['d-build', 'd-compose'],
  'l3-unmix': ['d-stack', 'd-inv'],
  'l3-rotate': ['d-rad', 'd-colvec', 'd-compose'],
  'l4-subs': ['d-fwd', 'd-backloop'],
  'l4-rod': ['d-band', 'd-inv'],
  'l4-springs': ['d-band', 'd-lu'],
  'l4-circuit': ['d-index', 'd-inv'],
  'l5-flights': ['d-walks', 'd-atmost'],
  'l5-components': ['d-null', 'd-reach'],
  'l5-indegree': ['d-axis', 'd-walks'],
  'l5-separation': ['d-atmost', 'd-all'],
  'l6-denoise': ['d-orth', 'd-mask'],
  'l6-compress': ['d-2d', 'd-index'],
  'l6-basis': ['d-gen', 'd-orth']
};
