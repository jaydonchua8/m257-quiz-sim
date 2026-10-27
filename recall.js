/* Recall: the "not in the doc" cheat sheet as a card game. First option is the correct one; options get shuffled at play time. */
const RECALL_SECTIONS = {
  syntax: 'Python syntax',
  arrays: 'Arrays & matrix math',
  trig: 'Trig & transforms',
  solve: 'Solving without solve()',
  graphs: 'Graphs',
  dct: 'DCT & coordinates',
  exam: 'Exam mechanics'
};

const RECALL = [
/* syntax */
{ id: 'r-tuple', s: 'syntax', q: 'Return the total and the first `n` entries of `A` from one function.', o: ['return total, A[:n]', 'return [total] + A[:n]', 'return total and A[:n]', 'return (total; A[:n])'], why: 'A comma makes a tuple. `and` returns just one of the two values.' },
{ id: 'r-first', s: 'syntax', q: 'First `n` entries of list `A`.', o: ['A[:n]', 'A[n:]', 'A[0:n+1]', 'A[-n:]'], why: 'The stop index is excluded, so `A[:n]` is indices 0 to n−1.' },
{ id: 'r-last', s: 'syntax', q: 'Last `n` entries of list `A`.', o: ['A[-n:]', 'A[:-n]', 'A[n:]', 'A[-n]'], why: '`A[-n:]` starts n from the end. `A[:-n]` is everything except the last n.' },
{ id: 'r-rev', s: 'syntax', q: 'Reverse list `A` into a new list.', o: ['A[::-1]', 'A[-1:]', 'A.reverse', 'A[:-1]'], why: 'A step of −1 walks backward. `A[-1:]` is just the last item.' },
{ id: 'r-back', s: 'syntax', q: 'Loop `i` from `n-1` down to `0` (back substitution).', o: ['range(n-1, -1, -1)', 'range(n-1, 0, -1)', 'range(n, 0, -1)', 'range(0, n-1, -1)'], why: 'The stop is excluded, so to include 0 the stop has to be −1.' },
{ id: 'r-len', s: 'syntax', q: 'Number of items in list `A`.', o: ['len(A)', 'A.length', 'A.size()', 'count(A)'], why: '`len` works on lists, tuples and arrays (for a 2d array it counts rows).' },
{ id: 'r-tidx', s: 'syntax', q: '`assets = (10, 20, 5)`. What is `assets[0]`?', o: ['10', '20', '5', 'IndexError'], why: 'Indexing starts at 0, for tuples and lists alike.' },

/* arrays */
{ id: 'r-matmul', s: 'arrays', q: 'Matrix product of `A` and `B`.', o: ['A @ B', 'A * B', 'np.multiply(A, B)', 'A ** B'], why: '`*` and `np.multiply` are entrywise. `@` is the linear-algebra product.' },
{ id: 'r-star', s: 'arrays', q: 'For two 2×2 arrays, `A * B` gives…', o: ['entrywise products', 'the matrix product', 'a single number', 'an error'], plain: true, why: 'NumPy `*` multiplies matching entries. That is the classic quiz bug.' },
{ id: 'r-pow', s: 'arrays', q: 'For a NumPy array `M`, `M ** 2` is…', o: ['each entry squared', 'M @ M', 'the norm squared', 'an error'], plain: true, why: 'Use `M @ M` or `la.matrix_power(M, 2)` for the matrix square.' },
{ id: 'r-T', s: 'arrays', q: 'Transpose of `A`.', o: ['A.T', 'A.t()', 'A^T', 'np.T(A)'], why: '`.T` is an attribute, no parentheses.' },
{ id: 'r-col', s: 'arrays', q: 'Column `j` of `A`.', o: ['A[:, j]', 'A[j]', 'A[j, :]', 'A[:][j]'], why: '`A[j]` and `A[:][j]` are both row j.' },
{ id: 'r-shape', s: 'arrays', q: '`A` has 3 rows and 5 columns. `A.shape` is…', o: ['(3, 5)', '(5, 3)', '15', '[3, 5]'], why: 'Always (rows, cols), and it is a tuple.' },
{ id: 'r-build', s: 'arrays', q: 'Create the matrix with rows `[1 1]` and `[1 2]`.', o: ['np.array([[1, 1], [1, 2]])', 'np.array([1, 1], [1, 2])', 'np.array([[1, 1, 1, 2]])', 'np.array((1, 1); (1, 2))'], why: 'One outer list containing one inner list per row.' },
{ id: 'r-hstack', s: 'arrays', q: '`u` and `v` are 1d arrays of length n. `np.hstack([u, v])` gives…', o: ['one 1d array of length 2n', 'an n × 2 matrix', 'a 2 × n matrix', 'an error'], plain: true, why: 'To get columns use `np.column_stack([u, v])` or `np.vstack([u, v]).T`.' },
{ id: 'r-lincomb', s: 'arrays', q: '`z = alpha*u + beta*v + gamma*w`. Solve for `w`.', o: ['w = (z - alpha*u - beta*v) / gamma', 'w = z / gamma - alpha*u - beta*v', 'w = (z - alpha*u - beta*v) * gamma', 'w = gamma / (z - alpha*u - beta*v)'], why: 'Move the known terms over, then divide everything by gamma. Arrays do this entrywise.' },
{ id: 'r-copy', s: 'arrays', q: 'You want `Z` to be `M` with a block zeroed, leaving `M` unchanged.', o: ['Z = M.copy()', 'Z = M', 'Z = M[:]', 'Z = np.array(M.T)'], why: '`Z = M` and slices share memory, so assigning into them changes M too.' },

/* trig */
{ id: 'r-rad', s: 'trig', q: '45 degrees in radians.', o: ['45 * np.pi / 180', '45 * 180 / np.pi', '45 / np.pi', 'np.pi / 45'], why: 'np.cos and np.sin expect radians.' },
{ id: 'r-cos90', s: 'trig', q: '`np.cos(90)` returns…', o: ['cos of 90 radians (about −0.45)', '0', 'cos of 90 degrees', 'an error'], plain: true, why: 'NumPy trig takes radians. Convert first, or it silently gives a wrong number.' },
{ id: 'r-rot', s: 'trig', q: 'Rotate by `t` counterclockwise (c = cos t, s = sin t).', o: ['[[c, -s], [s, c]]', '[[c, s], [-s, c]]', '[[s, c], [c, -s]]', '[[c, -s], [-s, c]]'], why: 'Columns are where (1, 0) and (0, 1) land: (c, s) and (−s, c). The second option rotates clockwise.' },
{ id: 'r-shear', s: 'trig', q: "Shear: `x' = x + 0.6y`, `y' = y`.", o: ['[[1, 0.6], [0, 1]]', '[[1, 0], [0.6, 1]]', '[[0.6, 1], [1, 0]]', '[[1, 0.6], [0.6, 1]]'], why: "Each row is one output equation: row 0 builds x', row 1 builds y'." },
{ id: 'r-order', s: 'trig', q: 'Shear first, then rotate the points in `image`.', o: ['R @ S @ image', 'S @ R @ image', 'image @ R @ S', 'R * S * image'], why: 'The matrix next to the points acts first. Read right to left.' },
{ id: 'r-undo', s: 'trig', q: 'Marketing did `image = M @ original`. Recover the original.', o: ['la.inv(M) @ image', 'M @ image', 'image @ la.inv(M)', 'M.T @ image'], why: 'Undo M from the same side. `M.T` only works when M is orthogonal.' },
{ id: 'r-shift', s: 'trig', q: 'Subtract point (cx, cy) from every column of the 2 × N array `pts`.', o: ['pts - np.array([[cx], [cy]])', 'pts - np.array([cx, cy])', 'pts - [cx, cy]', 'pts.T - [[cx], [cy]]'], why: 'A 2 × 1 column broadcasts across N columns. A flat length-2 array lines up with the wrong axis.' },

/* solve */
{ id: 'r-inv', s: 'solve', q: '`np.linalg.solve` is blocked. Solve `A x = b`.', o: ['x = la.inv(A) @ b', 'x = b @ la.inv(A)', 'x = b / A', 'x = A.T @ b'], why: 'Multiply by the inverse on the left. `b / A` is entrywise division.' },
{ id: 'r-plu', s: 'solve', q: '`P, L, U = sla.lu(A)` means…', o: ['A = P @ L @ U', 'P @ A = L @ U', 'A = L @ U @ P', 'A = P @ U @ L'], why: "SciPy's convention puts P on the left of L U." },
{ id: 'r-lu1', s: 'solve', q: 'After `P, L, U = sla.lu(A)`, the first step to solve `A x = b` is…', o: ['y = sla.solve_triangular(L, P.T @ b, lower=True)', 'y = sla.solve_triangular(U, b)', 'y = sla.solve_triangular(L, P @ b)', 'y = sla.solve_triangular(L, b, lower=False)'], why: 'A = P L U, so L (U x) = Pᵀ b. L is lower, so pass lower=True.' },
{ id: 'r-lu2', s: 'solve', q: 'Then finish with…', o: ['x = sla.solve_triangular(U, y)', 'x = sla.solve_triangular(U, y, lower=True)', 'x = sla.solve_triangular(L, y)', 'x = U @ y'], why: 'U is upper triangular, which is the default (lower=False).' },
{ id: 'r-pt', s: 'solve', q: 'Why `P.T @ b` instead of `la.inv(P) @ b`?', o: ['a permutation matrix’s inverse is its transpose', 'P is always the identity', 'inv would change the answer', 'P.T is required by solve_triangular'], plain: true, why: 'Same result, no inverse needed. Handy when inv is blocked too.' },
{ id: 'r-row', s: 'solve', q: 'Equation `T2 = (T1 + T4 + S7 + S8) / 4`, unknowns T0…T4, with `b[2] = S7 + S8`. Row 2 of A is…', o: ['[0, -1, 4, 0, -1]', '[0, 1, -4, 0, 1]', '[0, 1, 4, 0, 1]', '[0, -1, 1, 0, -1]'], why: 'Multiply by 4 and move the unknowns left: 4·T2 − T1 − T4 = S7 + S8.' },
{ id: 'r-circ', s: 'solve', q: 'Circuit row for `I_j R_j + V = E_j` (unknowns I_0…I_{N−1}, V).', o: ['R[j] in column j, 1 in the last column', 'R[j] in every column', '1 in column j, R[j] in the last column', 'R[j] in column j, 0 in the last column'], plain: true, why: 'Coefficient of I_j is R_j, coefficient of V is 1. The last row (Kirchhoff) is all 1s then a 0.' },
{ id: 'r-band', s: 'solve', q: 'n × n matrix with 2 on the diagonal and −1 just above and below.', o: ['2*np.eye(n) - np.eye(n, k=1) - np.eye(n, k=-1)', '2*np.eye(n) - np.eye(n+1)', 'np.diag(2) - np.diag(-1)', '2*np.ones((n, n)) - np.eye(n)'], why: '`np.eye(n, k=1)` is ones one step above the diagonal, `k=-1` one step below.' },

/* graphs */
{ id: 'r-le2', s: 'graphs', q: 'Count walks of length at most 2.', o: ['A + A @ A', 'A @ A', 'A + A * A', '2 * A'], why: '`A * A` is entrywise and equals A for a 0/1 matrix.' },
{ id: 'r-ij', s: 'graphs', q: 'Entry `M[i, j]` of a walk-count matrix counts walks…', o: ['from j to i', 'from i to j', 'from i back to i', 'in either direction only'], plain: true, why: 'Columns are "from", rows are "to". The index is [to, from].' },
{ id: 'r-ordlax', s: 'graphs', q: 'ORD is airport 58 and LAX is 77 (zero-indexed). Routes ORD → LAX:', o: ['M[77, 58]', 'M[58, 77]', 'M[78, 59]', 'M[59, 78]'], why: '[to, from], and the numbers are already zero-indexed, so no +1.' },
{ id: 'r-allk', s: 'graphs', q: 'True when every pair is joined by a walk of length ≤ k.', o: ['np.all(la.matrix_power(np.eye(n) + A, k) > 0)', 'np.all(la.matrix_power(A, k) > 0)', 'np.any(la.matrix_power(np.eye(n) + A, k) > 0)', 'la.matrix_power(np.eye(n) + A, k) > 0'], why: 'Adding I lets shorter walks count. The last option is an array of booleans, not one True/False.' },
{ id: 'r-eye', s: 'graphs', q: 'Why add `np.eye(n)` before raising to the power k?', o: ['so walks shorter than k still count', 'to make A invertible', 'to remove self-loops', 'to normalize rows'], plain: true, why: 'The identity acts like "stay put" steps, so (I+A)^k covers lengths 0 through k.' },
{ id: 'r-null', s: 'graphs', q: 'Number of connected components from incidence matrix `D`.', o: ['nullspace(D).shape[1]', 'nullspace(D).shape[0]', 'D.shape[0]', 'D.shape[1]'], why: 'nullspace returns basis vectors as columns, and there is one per component.' },
{ id: 'r-all', s: 'graphs', q: '`np.all(M > 0)` returns…', o: ['a single True or False', 'an array of booleans', 'the count of positive entries', 'M with negatives set to 0'], plain: true, why: '`M > 0` is the boolean array, `np.all` collapses it.' },
{ id: 'r-deg', s: 'graphs', q: 'Directed graph, `W[i, j] = 1` when j links to i. Incoming links per page:', o: ['np.sum(W, axis=1)', 'np.sum(W, axis=0)', 'np.sum(W)', 'W.T @ W'], why: 'Row i lists who links to i, so sum each row (axis=1).' },

/* dct */
{ id: 'r-coords', s: 'dct', q: 'Columns of `B` are an orthonormal basis. Coordinates of `x`:', o: ['B.T @ x', 'B @ x', 'x / B', 'np.sum(B * x)'], why: 'x = B c and inv(B) = B.T for orthonormal columns, so c = B.T @ x.' },
{ id: 'r-cback', s: 'dct', q: 'Turn coordinates `c` back into the signal.', o: ['B @ c', 'B.T @ c', 'la.inv(B) @ c', 'c / B'], why: 'Signal = basis times coordinates.' },
{ id: 'r-mask', s: 'dct', q: 'Zero every entry of `c` with absolute value below 1.', o: ['c[np.abs(c) < 1] = 0', 'c[c < 1] = 0', 'c = np.abs(c) < 1', 'c[np.abs(c) > 1] = 0'], why: '`c < 1` would also wipe large negative entries. The third option replaces c with booleans.' },
{ id: 'r-2d', s: 'dct', q: '2D DCT coefficients of an 8 × 8 `chunk`.', o: ['B.T @ chunk @ B', 'B @ chunk @ B.T', 'B.T @ chunk', 'chunk @ B @ B.T'], why: 'Transform the columns with B.T on the left and the rows with B on the right.' },
{ id: 'r-2dback', s: 'dct', q: 'Undo the 2D DCT of `C`.', o: ['B @ C @ B.T', 'B.T @ C @ B', 'B @ C', 'C @ B.T'], why: 'Reverse each side: B on the left, B.T on the right.' },
{ id: 'r-loop', s: 'dct', q: 'Top-left row index of every 8 × 8 block in a 512 × 512 image.', o: ['for i in range(0, 512, 8)', 'for i in range(512 // 8)', 'for i in range(8, 512, 8)', 'for i in range(0, 504)'], why: '`range(512 // 8)` gives block numbers 0–63, not pixel offsets.' },
{ id: 'r-block', s: 'dct', q: 'The 8 × 8 block starting at `(i, j)`.', o: ['image[i:i+8, j:j+8]', 'image[i:8, j:8]', 'image[i:i+7, j:j+7]', 'image[i+8, j+8]'], why: 'Stop is excluded, so i:i+8 is exactly 8 rows.' },
{ id: 'r-tol', s: 'dct', q: 'Tolerance = 10% of the largest absolute coefficient in `C`.', o: ['0.1 * np.max(np.abs(C))', '0.1 * np.max(C)', 'np.max(np.abs(C)) / 0.1', '10 * np.max(np.abs(C))'], why: 'Use the absolute value: the biggest coefficient can be negative.' },
{ id: 'r-gen', s: 'dct', q: 'Columns of `B` are a basis but NOT orthonormal. Coordinates of `x`:', o: ['la.inv(B) @ x', 'B.T @ x', 'B @ x', 'x @ B'], why: 'B.T only equals inv(B) for orthonormal bases like the DCT.' },

/* exam */
{ id: 'r-syntax', s: 'exam', q: 'Your code has a SyntaxError on the last line. What gets graded?', o: ['nothing, the question scores 0', 'everything above that line', 'everything except the last variable', 'the grader skips that line'], plain: true, why: 'Code that does not parse never runs. Run it before you submit.' },
{ id: 'r-ellip', s: 'exam', q: 'You leave `T = ...` from the starter code.', o: ['that check scores 0', 'the grader fills it in', 'syntax error, everything scores 0', 'it counts as an empty array'], plain: true, why: '`...` is valid Python (Ellipsis), so other parts still grade, but T gets no credit.' },
{ id: 'r-hard', s: 'exam', q: 'The example uses `n = 4` and you write `return A[:4]`.', o: ['fails, the tests use other inputs', 'passes, the example is the test', 'passes for lists, fails for arrays', 'syntax error'], plain: true, why: 'Always use the given variables. Graders run hidden test cases.' },
{ id: 'r-name', s: 'exam', q: 'Asked for `sheared_and_rotated`, you define `sheared_rotated`.', o: ['that check scores 0', 'the grader matches close names', 'everything scores 0', 'it passes with a warning'], plain: true, why: 'The autograder looks up the exact name in the table.' },
{ id: 'r-ban', s: 'exam', q: 'The question blocks `np.linalg.solve` and you call it anyway.', o: ['it raises an error, no credit', 'it works but loses points', 'it silently returns zeros', 'it is allowed if you import it as la'], plain: true, why: 'Have inv or the LU recipe ready instead.' }
];
