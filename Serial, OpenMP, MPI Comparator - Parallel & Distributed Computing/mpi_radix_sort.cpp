#include <iostream>
#include <cstdlib>
#include <ctime>
#include <cstring>
#include "mpi.h"

using namespace std;
int get_max(int* arr, int n) { 
    int mx = arr[0]; 
    for (int i = 1; i < n; i++) 
        if (arr[i] > mx) 
            mx = arr[i]; 
    return mx; 
}

void count_sort(int* arr, int n, int divisor, int num_process, int rank) {
    int n_per_proc = n / num_process;
    int* sub_arr = new int[n_per_proc];

    // Scatter random numbers to all processes
    MPI_Scatter(arr, n_per_proc, MPI_INT, sub_arr, n_per_proc, MPI_INT, 0, MPI_COMM_WORLD);

    // Compute sub count in each process
    int sub_count[10] = {0};
    for (int i = 0; i < n_per_proc; i++) {
        sub_count[(sub_arr[i] / divisor) % 10]++;
    }

    // Reduce all the sub counts to root process
    if (rank == 0) {
        int count[10] = {0};
        MPI_Reduce(sub_count, count, 10, MPI_INT, MPI_SUM, 0, MPI_COMM_WORLD);

        for (int i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }

        int* temp_arr = new int[n];
        for (int i = n - 1; i >= 0; i--) { 
            temp_arr[count[(arr[i] / divisor) % 10] - 1] = arr[i]; 
            count[(arr[i] / divisor) % 10]--; 
        }
        memcpy(arr, temp_arr, sizeof(int) * n);
        delete[] temp_arr;

    } else {
        MPI_Reduce(sub_count, 0, 10, MPI_INT, MPI_SUM, 0, MPI_COMM_WORLD);
    }
    delete[] sub_arr;
}

void radix_sort(int* arr, int n, int num_process, int rank) { 
    int m = get_max(arr, n);
    for (int divisor = 1; m / divisor > 0; divisor *= 10) {
        count_sort(arr, n, divisor, num_process, rank);
    }
}

int main(int argc, char* argv[]) {
    // Init MPI communication
    int num_process, rank;
    MPI_Status Stat;
    MPI_Init(&argc, &argv);
    MPI_Comm_size(MPI_COMM_WORLD, &num_process);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);

    int n;
    if (rank == 0) {
        cout << "Enter the size of the array: ";
        cin >> n;
    }

    // Broadcast n to all processes
    MPI_Bcast(&n, 1, MPI_INT, 0, MPI_COMM_WORLD);

    int* arr = new int[n];
    
    if (rank == 0) {
        srand(time(NULL));
        for (int i = 0; i < n; i++) {
            arr[i] = rand() % 100000 +1;
        }
    }

    // Scatter the array to all processes
    MPI_Bcast(arr, n, MPI_INT, 0, MPI_COMM_WORLD);

    // Sort
    if (rank == 0) {

        double start, end;
        double cpu_time_used;

        start = MPI_Wtime();
        radix_sort(arr, n, num_process, rank);
        end = MPI_Wtime();
        cout << fixed;  
        cout.precision(6);
        cout << "Sorted in " << end-start << " seconds" <<endl;
    } else {
        radix_sort(arr, n, num_process, rank);
    }

    delete[] arr;

    MPI_Finalize();
    return 0; 
}

