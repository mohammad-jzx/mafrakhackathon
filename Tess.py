import numpy as np
classes = np.load('./model/class_names.npy', allow_pickle=True)
for i, c in enumerate(classes):
    print(f"{i}: {c}")