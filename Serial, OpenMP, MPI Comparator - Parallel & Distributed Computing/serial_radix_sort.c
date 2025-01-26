#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int getMax(int arr[], int n) {
    int mx = arr[0];
    for (int i = 1; i < n; i++)
        if (arr[i] > mx)
            mx = arr[i];
    return mx;
}

// count sort arr[] according to the digit represented by exp
void countSort(int arr[], int n, int exp) {
    int *output = (int *)malloc(n * sizeof(int));
    int count[10] = {0};

    // counting occurences
    for (int i = 0; i < n; i++)
        count[(arr[i] / exp) % 10]++;

    // Change count[i] to contain actual position of digit
    for (int i = 1; i < 10; i++)
        count[i] += count[i - 1];

    // Build the output array
    for (int i = n - 1; i >= 0; i--) {
        output[count[(arr[i] / exp) % 10] - 1] = arr[i];
        count[(arr[i] / exp) % 10]--;
    }

    // Copy the output array to arr[]
    for (int i = 0; i < n; i++)
        arr[i] = output[i];

    free(output);
}

void radixSort(int arr[], int n) {
    // Find the max to know no. of digits
    int m = getMax(arr, n);

    // Do count sort for every digit. Exp is 10^i where i is the current digit number
    for (int exp = 1; m / exp > 0; exp *= 10)
        countSort(arr, n, exp);
}

int *generateDataset(int n) {
    int *arr = (int *)malloc(n * sizeof(int));
    if (arr == NULL) {
        perror("Memory allocation failed");
        exit(EXIT_FAILURE);
    }

    srand(time(NULL));
    for (int i = 0; i < n; i++) {
        arr[i] = rand() % 100000 + 1;  // Range 1 to 100000
    }

    return arr;
}

int main() {
    int n;

    printf("Enter the size of the array: ");
    scanf("%d", &n);

    printf("Generating dataset...\n");
    int *arr = generateDataset(n);
    printf("Dataset generated with %d elements.\n", n);

    printf("Sorting dataset...\n");
    clock_t start = clock();
    radixSort(arr, n);
    clock_t end = clock();
    double time_taken = (double)(end - start) / CLOCKS_PER_SEC;

    printf("Sorting completed.\n");
    printf("Time taken: %f seconds\n", time_taken);

    free(arr);
    return 0;
}

