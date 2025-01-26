#include <mpi.h>
#include <iostream>
#include <cstdlib>
#include <ctime>

using namespace std;

void swap(int* array, int i, int j) {
    int temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}

void quicksort(int* array, int start, int end) {
    if (end <= 1) {
        return;
    }
    int pivot = array[start + end / 2];
    swap(array, start, start + end / 2);
    int index = start;
    for (int i = start + 1; i < start + end; i++) {
        if (array[i] < pivot) {
            index++;
            swap(array, i, index);
        }
    }
    swap(array, start, index);
    quicksort(array, start, index - start);
    quicksort(array, index + 1, start + end - index - 1);
}

int* merge(int* array1, int num1, int* array2, int num2) {
    int* result = new int[num1 + num2];
    int i = 0, j = 0, k = 0;

    while (i < num1 && j < num2) {
        if (array1[i] < array2[j]) {
            result[k++] = array1[i++];
        } else {
            result[k++] = array2[j++];
        }
    }

    while (i < num1) {
        result[k++] = array1[i++];
    }

    while (j < num2) {
        result[k++] = array2[j++];
    }

    return result;
}

int main(int argc, char* argv[]) {
    int n;
    int* data = nullptr;
    int chunk_size, own_chunk_size;
    int* chunk = nullptr;
    double time_taken, communication_time, computation_time;

    MPI_Status status;
    int num_process, process_rank;

    // Initialize MPI
    int rc = MPI_Init(&argc, &argv);
    if (rc != MPI_SUCCESS) {
        cerr << "Error in creating MPI program.\nTerminating...\n";
        MPI_Abort(MPI_COMM_WORLD, rc);
    }

    MPI_Comm_size(MPI_COMM_WORLD, &num_process);
    MPI_Comm_rank(MPI_COMM_WORLD, &process_rank);

    if (process_rank == 0) {
        cout << "Enter the number of elements: ";
        cin >> n;
    }

    // Broadcast n to all processes
    MPI_Bcast(&n, 1, MPI_INT, 0, MPI_COMM_WORLD);

    // Calculate chunk size
    chunk_size = (n % num_process == 0) ? (n / num_process) : (n / (num_process - 1));

    if (process_rank == 0) {
        data = new int[n];
        srand(time(NULL));
        for (int i = 0; i < n; i++) {
            data[i] = rand() % 100000+1;
        }

        // Pad with zeros if necessary for scattering
        for (int i = n; i < num_process * chunk_size; i++) {
            data[i] = 0;
        }
    }

    // Barrier for synchronization before starting the timing
    MPI_Barrier(MPI_COMM_WORLD);

    // Start measuring the time
    time_taken = MPI_Wtime();

    // Scatter data to all processes
    chunk = new int[chunk_size];
    MPI_Scatter(data, chunk_size, MPI_INT, chunk, chunk_size, MPI_INT, 0, MPI_COMM_WORLD);

    // Free data array on rank 0 after scattering
    if (process_rank == 0) {
        delete[] data;
        data = nullptr;
    }

    // Determine the actual chunk size for the current process
    own_chunk_size = (n >= chunk_size * (process_rank + 1)) ? chunk_size : (n - chunk_size * process_rank);

    // Stop measuring communication time (Scatter operation)
    time_taken = MPI_Wtime() - time_taken;
    communication_time = time_taken;

    // Start computation time
    time_taken = MPI_Wtime();

    // Perform quicksort on the chunk
    quicksort(chunk, 0, own_chunk_size);

    // Begin merging the chunks in a binary tree pattern
    for (int step = 1; step < num_process; step = 2 * step) {
        if (process_rank % (2 * step) != 0) {
            // Send data to the process with rank - step
            MPI_Send(chunk, own_chunk_size, MPI_INT, process_rank - step, 0, MPI_COMM_WORLD);
            break;
        }

        if (process_rank + step < num_process) {
            // Receive data from process (rank + step)
            int received_chunk_size = (n >= chunk_size * (process_rank + 2 * step))
                                      ? (chunk_size * step)
                                      : (n - chunk_size * (process_rank + step));

            int* chunk_received = new int[received_chunk_size];
            MPI_Recv(chunk_received, received_chunk_size, MPI_INT, process_rank + step, 0, MPI_COMM_WORLD, &status);

            // Merge the current chunk with the received chunk
            int* merged_chunk = merge(chunk, own_chunk_size, chunk_received, received_chunk_size);

            // Update chunk and own_chunk_size
            delete[] chunk;
            delete[] chunk_received;
            chunk = merged_chunk;
            own_chunk_size += received_chunk_size;
        }
    }

    // Stop measuring computation time (quicksort and merge)
    time_taken = MPI_Wtime() - time_taken;
    computation_time = time_taken;

    // Only rank 0 prints the result
    if (process_rank == 0) {
        cout << endl;
	    cout << fixed;  
        cout.precision(6);
        
        cout << "Quicksort of " << n << " integers on " << num_process << " processes: " << computation_time << " seconds" << endl;
    }

    // Finalize MPI
    delete[] chunk;
    MPI_Finalize();
    return 0;
}

