#include <stdio.h>
#include <stdlib.h>
#include <omp.h>

void counting_sort_parallel(int *array, int size, int exp, int max_threads) {
    int *output = (int *)malloc(size * sizeof(int));
    int count[10] = {0};

    // Count occurrences of each digit
    int i;
    #pragma omp parallel num_threads(max_threads)
    {
        int local_count[10] = {0}; // Local count to avoid race conditions

        #pragma omp for
        for (i = 0; i < size; i++) {
            local_count[(array[i] / exp) % 10]++;
        }

        // Merge local counts into the global count array
        #pragma omp critical
        {
            for (i = 0; i < 10; i++) {
                count[i] += local_count[i];
            }
        }
    }

    // Cumulative sum for digit positions
    for (i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }

    for (i = size - 1; i >= 0; i--) {
        int digit = (array[i] / exp) % 10;
        output[--count[digit]] = array[i];
    }

    #pragma omp parallel for num_threads(max_threads)
    for (i = 0; i < size; i++) {
        array[i] = output[i];
    }

    free(output);
}

void radix_sort_parallel(int *array, int size, int max_threads) {
    int max_val = array[0];

    // Find the max to determine no. of digits
    #pragma omp parallel for reduction(max:max_val)
    for (int i = 1; i < size; i++) {
        if (array[i] > max_val) {
            max_val = array[i];
        }
    }

    // count sort for each digit
    for (int exp = 1; max_val / exp > 0; exp *= 10) {
        counting_sort_parallel(array, size, exp, max_threads);
    }
}

int main() {
    int size, max_threads;

    printf("Enter the number of elements: ");
    scanf("%d", &size);

    printf("Enter the number of threads to use: ");
    scanf("%d", &max_threads);

    int *array = (int *)malloc(size * sizeof(int));

    for (int i = 0; i < size; i++) {
        array[i] = rand() % 100000+1; //  1 to 100000
        
    }
    printf("\n");

    double start_time = omp_get_wtime();

    radix_sort_parallel(array, size, max_threads);

    double end_time = omp_get_wtime();

    printf("Sorting took %.6f seconds.\n", end_time - start_time);

    free(array);
    return 0;
}

