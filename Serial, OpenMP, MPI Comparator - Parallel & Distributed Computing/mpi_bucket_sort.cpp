#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>
#include <mpi.h>

using namespace std;

void bucketSort(int arr[], int dataSize, int numBuckets, int rank) {
    int maxValue = *max_element(arr, arr + dataSize);
    int minValue = *min_element(arr, arr + dataSize);
    int bucketSize = (maxValue - minValue) / numBuckets + 1;

    vector<int> buckets[numBuckets];

    for (int i = 0; i < dataSize; i++) {
        int bucketIndex = (arr[i] - minValue) / bucketSize;
        buckets[bucketIndex].push_back(arr[i]);
    }

    for (int i = 0; i < numBuckets; i++) {
        sort(buckets[i].begin(), buckets[i].end());
    }

    int index = 0;
    for (int i = 0; i < numBuckets; i++) {
        for (int num : buckets[i]) {
            arr[index++] = num;
        }
    }
}

int main(int argc, char *argv[]) {
    int rank, size;
    int dataSize, numBuckets = 10; 
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);


    if (rank == 0) {
        cout << "Enter the array size: ";
        cin >> dataSize;
    }

    MPI_Bcast(&dataSize, 1, MPI_INT, 0, MPI_COMM_WORLD);

    int localDataSize = dataSize / size;

    int *localData = new int[localDataSize];

    srand(rank);  

    for (int i = 0; i < localDataSize; i++) {
        localData[i] = rand() % 100000+1;  
    }

    double startTime = MPI_Wtime();

    bucketSort(localData, localDataSize, numBuckets, rank);

    int *sortedData = nullptr;
    if (rank == 0) {
        sortedData = new int[dataSize];
    }

    MPI_Gather(localData, localDataSize, MPI_INT, sortedData, localDataSize, MPI_INT, 0, MPI_COMM_WORLD);

    if (rank == 0) {
        sort(sortedData, sortedData + dataSize);

        double endTime = MPI_Wtime();
        cout << "Time taken for bucket sort: " << endTime - startTime << " seconds" << endl;

        delete[] sortedData;
    }

    delete[] localData;

    MPI_Finalize();

    return 0;
}

