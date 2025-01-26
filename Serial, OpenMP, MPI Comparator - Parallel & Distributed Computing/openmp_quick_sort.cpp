#include <stdio.h>
#include <stdlib.h>
#include <omp.h>
#include <algorithm>

#define THRESHOLD 1000 // Threshold for switching to serial sorting

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);

    for (int j = low; j <= high - 1; j++) {
        if (arr[j] <= pivot) {
            i++;
            std::swap(arr[i], arr[j]);
        }
    }
    std::swap(arr[i + 1], arr[high]);
    return (i + 1);
}

void quickSortParallel(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);

        // Use parallel tasks for large partitions
        if (high - low > THRESHOLD) {
            #pragma omp task
            quickSortParallel(arr, low, pi - 1);

            #pragma omp task
            quickSortParallel(arr, pi + 1, high);

            #pragma omp taskwait
        } else {
            quickSortParallel(arr, low, pi - 1);
            quickSortParallel(arr, pi + 1, high);
        }
    }
}

void printArray(int arr[], int size) {
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

int main() {
    int n;
    scanf("%d", &n);
    int arr[n];
    double start_time, run_time;

    for (int i = 0; i < n; i++) {
        arr[i] = rand() % 100000 + 1;
    }

    start_time = omp_get_wtime();
    #pragma omp parallel
    {
        #pragma omp single
        quickSortParallel(arr, 0, n - 1);
    }
    run_time = omp_get_wtime() - start_time;
    printf("Parallel QuickSort Execution Time: %lf seconds\n", run_time);

    return 0;
}

