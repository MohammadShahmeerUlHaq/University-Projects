#include <iostream>
#include <vector>
#include <cmath>
#include <ctime>

using namespace std;

void insertionSort(vector<float>& bucket) {
    int n = bucket.size();
    for (int i = 1; i < n; i++) {
        float key = bucket[i];
        int j = i - 1;
        while (j >= 0 && bucket[j] > key) {
            bucket[j + 1] = bucket[j];
            j--;
        }
        bucket[j + 1] = key;
    }
}

void bucketSort(float arr[], int n) {
    const int bucketCount = 100; 
    vector<float> b[bucketCount]; 

    // Distribute elements into buckets
    for (int i = 0; i < n; i++) {
        int bi = static_cast<int>(arr[i] * bucketCount / 100000.0);
        if (bi == bucketCount) bi--; // Ensure bi is within bounds
        b[bi].push_back(arr[i]);
    }

    // Sort individual buckets
    for (int i = 0; i < bucketCount; i++) {
        insertionSort(b[i]);
    }

    // Concatenate all sorted buckets
    int index = 0;
    for (int i = 0; i < bucketCount; i++) {
        for (int j = 0; j < b[i].size(); j++) {
            arr[index++] = b[i][j];
        }
    }
}

void printArray(float arr[], int n) {
    for (int i = 0; i < n; i++) {
        cout << arr[i] << " ";
    }
    cout << endl;
}

int main() {
    int n;
    cout << "Enter number of elements: ";
    cin >> n;

    float arr[n];
    
    srand(time(0));
    for (int i = 0; i < n; i++) {
        arr[i] = rand() % 100000 + 1;
    }

    clock_t start_time = clock();

    bucketSort(arr, n);

    clock_t end_time = clock();
    double time_taken = double(end_time - start_time) / CLOCKS_PER_SEC;
    cout << "Time taken for bucket sort: " << time_taken << " seconds." << endl;

    return 0;
}