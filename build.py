h = open('harness.py').read()
assert '`' not in h and '${' not in h
w = open('worker.src.js').read().replace('__HARNESS__', h)
open('worker.js', 'w').write(w)
q = open('questions.js').read() + '\n' + open('drills.js').read()
i = open('index.src.html').read().replace('/*__QUESTIONS__*/', q)
open('index.html', 'w').write(i)
print(len(w), len(i))
