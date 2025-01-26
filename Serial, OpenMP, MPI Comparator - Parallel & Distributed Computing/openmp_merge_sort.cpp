#include <iostream>
#include <time.h>
#include <omp.h>
using namespace std;

void Merge(double arr[], int low, int mid, int high) {
    int i = low, j = mid + 1, k = 0;
    double* temp = new double[high - low + 1];

    while (i <= mid && j <= high) {
        if (arr[i] <= arr[j]) 
            temp[k++] = arr[i++];
        else
            temp[k++] = arr[j++];
    }

    while (i <= mid) 
        temp[k++] = arr[i++];

    while (j <= high) 
        temp[k++] = arr[j++];

    for (i = low, k = 0; i <= high; i++, k++) 
        arr[i] = temp[k];

    delete[] temp;
}

void MergeSort(double arr[], int low, int high) {
    if (low >= high) return;

    int mid = low + (high - low) / 2;

    MergeSort(arr, low, mid);
    MergeSort(arr, mid + 1, high);
    Merge(arr, low, mid, high);
}

int main() {
    int n;

    cout << "Enter the size of the array: ";
    cin >> n;

    const int m = n / 2;

    double* arr = new double[n];

	srand(time(NULL));
    for (int i = 0; i < n; i++) {
        arr[i] = rand() % 100000 + 1;;
    }

    double startParallel = omp_get_wtime();

    // Split the array into two halves and sort them in parallel
    #pragma omp parallel sections
    {
        #pragma omp section
        MergeSort(arr, 0, m - 1);

        #pragma omp section
        MergeSort(arr, m, n - 1);
    }

    // Merge the two sorted halves
    Merge(arr, 0, m - 1, n - 1);

    double endParallel = omp_get_wtime();
    cout << "Parallel operation time: " << endParallel - startParallel << " seconds" << endl;

    delete[] arr;

    return 0;
}

