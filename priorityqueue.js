class PriorityQueue {
    constructor(comparator) {
        this.heap = [];
        this.comparator = comparator || ((a, b) => a - b);
    }

    size() {
        return this.heap.length;
    }

    isEmpty() {
        return this.size() === 0;
    }

    peek() {
        return this.heap[0];
    }

    enqueue(value) {
        this.heap.push(value);
        this.bubbleUp(this.size() - 1);
    }

    dequeue() {
        if (this.isEmpty()) return null;
        this.swap(0, this.size() - 1);
        const value = this.heap.pop();
        this.bubbleDown(0);
        return value;
    }

    bubbleUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.comparator(this.heap[index], this.heap[parentIndex]) < 0) {
                this.swap(index, parentIndex);
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    bubbleDown(index) {
        while (index < this.size()) {
            const leftIndex = 2 * index + 1;
            const rightIndex = 2 * index + 2;
            let minIndex = index;
            if (leftIndex < this.size() && this.comparator(this.heap[leftIndex], this.heap[minIndex]) < 0) {
                minIndex = leftIndex;
            }
            if (rightIndex < this.size() && this.comparator(this.heap[rightIndex], this.heap[minIndex]) < 0) {
                minIndex = rightIndex;
            }
            if (minIndex !== index) {
                this.swap(index, minIndex);
                index = minIndex;
            } else {
                break;
            }
        }
    }

    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
}
