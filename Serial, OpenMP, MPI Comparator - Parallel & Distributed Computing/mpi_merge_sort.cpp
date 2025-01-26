#include <iostream>
#include <cstdlib>
#include <ctime>
#include <mpi.h>

using namespace std;

void merge(int*, int*, int, int, int);
void mergeSort(int*, int*, int, int);

int main(int argc, char** argv) {
    // Initialize MPI 
    int rank, num_process;
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &num_process);

    // Get array size from user input 
    int n;
    if (rank == 0) {
        cout << "Enter the size of the array: ";
        cin >> n;
    }
    MPI_Bcast(&n, 1, MPI_INT, 0, MPI_COMM_WORLD); // Broadcast size to all processes

    int* original_array = nullptr;
    if (rank == 0) {
        original_array = new int[n];
        srand(time(NULL)); 
        for (int i = 0; i < n; i++) {
            original_array[i] = rand() % 100000+1;
        }
    }

    // Divide the array into equal-sized chunks
    int size = n / num_process;
    int* sub_array = new int[size];

    // Scatter the array to all processes 
    MPI_Scatter(original_array, size, MPI_INT, sub_array, size, MPI_INT, 0, MPI_COMM_WORLD);

    // Perform the mergeSort on each process 
    int* tmp_array = new int[size];
    mergeSort(sub_array, tmp_array, 0, size - 1);

    //Gather the sorted subarrays into one 
    int* sorted = nullptr;
    if (rank == 0) {
        sorted = new int[n];
    }
    MPI_Gather(sub_array, size, MPI_INT, sorted, size, MPI_INT, 0, MPI_COMM_WORLD);

    // Make the final mergeSort call 
    if (rank == 0) {
        double start_time = MPI_Wtime(); // Start timing

        int* other_array = new int[n];
        mergeSort(sorted, other_array, 0, n - 1);

        double end_time = MPI_Wtime(); // End timing

        // Print the time taken and sorted data
        cout << "Time taken for sorting: " << end_time - start_time << " seconds" << endl;
	
	//for(int i=0;i<n;i++){
	//	cout<<sorted[i]<<" ";
	//}
        // Clean up root 
        delete[] sorted;
        delete[] other_array;
    }

    //Clean up rest 
    if (rank == 0) {
        delete[] original_array;
    }
    delete[] sub_array;
    delete[] tmp_array;

    //Finalize MPI
    MPI_Finalize();

    return 0;
}

//Merge Function 
void merge(int* a, int* b, int l, int m, int r) {
    int h = l, i = l, j = m + 1;

    while ((h <= m) && (j <= r)) {
        if (a[h] <= a[j]) {
            b[i] = a[h];
            h++;
        } else {
            b[i] = a[j];
            j++;
        }
        i++;
    }

    if (m < h) {
        for (int k = j; k <= r; k++) {
            b[i] = a[k];
            i++;
        }
    } else {
        for (int k = h; k <= m; k++) {
            b[i] = a[k];
            i++;
        }
    }

    for (int k = l; k <= r; k++) {
        a[k] = b[k];
    }
}

// Recursive MergeSort Function 
void mergeSort(int* a, int* b, int l, int r) {
    if (l < r) {
        int m = (l + r) / 2;
        mergeSort(a, b, l, m);
        mergeSort(a, b, m + 1, r);
        merge(a, b, l, m, r);
    }
}
