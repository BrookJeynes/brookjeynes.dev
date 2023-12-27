+++
title = 'Shared Memory With Zig'
date = 2023-12-15
draft = false
+++

Inter-process communication is a way to share information between different processes. 

In this video, I'll dive into what IPC is and how to create shared memory with Zig.

{{< youtube QEGihu2Z9pE >}}

Disclaimer: This code is not production safe and just for educational purposes.

You can find the code written in this video here: [github.com/zig-shared-memory](https://github.com/BrookJeynes/zig-shared-memory)
You can find the diagrams used in this video here: [excalidraw/zig-shared-memory](https://excalidraw.com/#json=a7YXNXJeeN44McfflxUww,6UoBTQ7c-IAPQsBRwo080Q)

Corrections are in the pinned ERRATA comment.

Timestamps:
- [0:00] Intro
- [0:12] IPC
- [0:24] Shared memory
- [0:48] Example program
- [1:04] Disclaimer
- [1:17] Programming
- [1:32] Shared memory considerations
- [2:45] mmap()
- [4:18] Mapping to a file
- [6:18] Back to the program
- [6:36] Forking the child
- [7:59] Output
- [8:21] Outro

Resources:
- [Operating System Concepts: Global Edition](https://www.wiley.com/en-au/Silberschatz%27s+Operating+System+Concepts%2C+Global+Edition%2C+10th+Edition-p-9781119455868)
- [musl - shm_open](https://elixir.bootlin.com/musl/latest/source/src/mman/shm_open.c)

\--------------------------------------------------------------  
🎵 Music "bread" by ‘Lukrembo’  
💿 Listen: https://www.youtube.com/watch?v=6eWIffP2M3Y  
\--------------------------------------------------------------  
