#include <SFML/Graphics.hpp>
#include <iostream>
#include <string>
#include <functional>
#include <chrono>
#include <thread>
#include <sstream>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <string.h>
#include <omp.h>
#include<pthread.h>

#define THREAD_MAX 4
#define noOfStudents 10000
#define totalMarks 10000

int data[10000];


class Paginator {
	public:
		Paginator(int pageSize, int totalItems) : m_pageSize(pageSize), m_totalItems(totalItems) {
			m_totalPages = (totalItems + pageSize - 1) / pageSize;
			m_currentPage = 0;
		}

		void nextPage() {
			if (m_currentPage < m_totalPages - 1)
				++m_currentPage;
		}

		void previousPage() {
			if (m_currentPage > 0)
				--m_currentPage;
		}

		int getCurrentPage() const {
			return m_currentPage;
		}

		int getTotalPages() const {
			return m_totalPages;
		}

		int getPageSize() const {
			return m_pageSize;
		}

	private:
		int m_pageSize;
		int m_totalItems;
		int m_totalPages;
		int m_currentPage;
};


void swap(int* a, int* b) {
	int t = *a;
	*a = *b;
	*b = t;
}

void fetchMarks() {
	srand(time(0));
	int i;
	for (i=0; i < 10000; i++)
		data[i]=(rand()%(1000))+1;
}




void display(int arr[noOfStudents], sf::RenderWindow &window, double total_t) {

	sf::Texture backgroundTexture;
	if (!backgroundTexture.loadFromFile("18.jpg")) {
		std::cerr << "Failed to load background image" << std::endl;
	}
	sf::Sprite backgroundSprite(backgroundTexture);

	sf::Font font;
	if (!font.loadFromFile("G_ari_bd.TTF")) {
		std::cerr << "Failed to load font!" << std::endl;
	}

	sf::Text text;
	text.setFont(font);
	text.setCharacterSize(12);
	text.setFillColor(sf::Color::Black);
	text.setPosition(20.f, 20.f);

	Paginator paginator(20, 10000);

	sf::Text pageText;
	pageText.setFont(font);
	pageText.setCharacterSize(12);
	pageText.setFillColor(sf::Color::Black);
	pageText.setPosition(700.f, 570.f);


	
	std::stringstream totalTimeStr;
	if (total_t != 0) {
		totalTimeStr << "Total execution time: " << total_t << " seconds";
	} else {
		totalTimeStr << "Unsorted Student's Marks";
	}
	sf::FloatRect totalTextRect = text.getLocalBounds();
	float totalTextHeight = totalTextRect.height;



	// Main loop
	while (window.isOpen()) {
		sf::Event event;
		while (window.pollEvent(event)) {
			if (event.type == sf::Event::Closed)
				window.close();
			else if (event.type == sf::Event::KeyPressed) {
				if (event.key.code == sf::Keyboard::Right)
					paginator.nextPage();
				else if (event.key.code == sf::Keyboard::Left)
					paginator.previousPage();
			}
		}

		window.clear(sf::Color::White);
		window.draw(backgroundSprite);

		// Display total execution time
		text.setString(totalTimeStr.str());
		text.setPosition(20.f, 20.f);
		window.draw(text);

		int currentPage = paginator.getCurrentPage();
		int pageSize = paginator.getPageSize();
		int startIndex = currentPage * pageSize;
		int endIndex = std::min(startIndex + pageSize, noOfStudents); // Ensure not to exceed the array size

		std::stringstream ss;
		// Calculate the position for array elements text

		float yOffset = totalTextHeight + 40.f;
		for (int i = startIndex; i < endIndex; ++i) {
			ss << "Student " << i+1 << ": " << arr[i] << "\n";
			sf::Text elementText;
			elementText.setFont(font);
			elementText.setCharacterSize(12);
			elementText.setFillColor(sf::Color::Black);
			elementText.setString(ss.str());
			elementText.setPosition(20.f, yOffset);
			window.draw(elementText);
			yOffset += elementText.getLocalBounds().height + 5.f; // Adjust vertical spacing
			ss.str(std::string()); // Clear stringstream
		}

		// Adjust text position to avoid overlap
		sf::FloatRect textRect = text.getLocalBounds();
		float textHeight = textRect.height;
		float pageTextHeight = pageText.getLocalBounds().height;
		float pageTextY = window.getSize().y - pageTextHeight - 20.f;
		pageText.setPosition(700.f, pageTextY);

		std::stringstream pageStr;
		pageStr << "Page " << currentPage + 1 << "/" << paginator.getTotalPages();
		pageText.setString(pageStr.str());

		window.draw(pageText);
		window.display();
	}
}





void copy(int arr1[10000],int arr2[10000]) {
	int i;
	for (i=0; i < noOfStudents; i++)
		arr1[i]=arr2[i];
}
///////////////////////////SERIAL CODES
////////QUICK

int partitionS(int arr[], int lb, int ub) {
	int ind = lb;
	int i;
	for (i = lb; i < ub; ++i) {
		if (arr[i] < arr[ub]) {
			swap(&arr[i], &arr[ind]);
			++ind;
		}
	}
	swap(&arr[ind], &arr[ub]);
	return ind;
}
void quickSortS(int arr[], int lb, int ub) {
	if (lb < ub) {
		int pivot = partitionS(arr, lb, ub);
		quickSortS(arr, lb, pivot - 1);
		quickSortS(arr, pivot + 1, ub);
	}
}

int quickSortSerial() {
	clock_t begin, end;
	double total_t;

	int *marks = new int[noOfStudents];
	//memcpy(marks,data,noOfStudents);
	copy(marks,data);
	begin = clock();
	quickSortS(marks, 0, noOfStudents-1);
	end= clock();

	total_t = (double)(end - begin) / CLOCKS_PER_SEC;

	sf::RenderWindow window(sf::VideoMode(800, 630), "Quick serial Display");
	display(marks,window,total_t);
	free(marks);
	return 0;
}

///////////////////////MERGE

void mergeS(int arr[], int lb, int m, int ub) {
	int *temp=new int[ub-lb+1];
	int i = lb, j = m + 1, ind = 0;
	while ((i <= m) && (j <= ub)) {
		if (arr[i] <= arr[j]) {
			temp[ind] = arr[i];
			++i;
		} else {
			temp[ind] = arr[j];
			++j;
		}
		++ind;
	}
	while (i <= m) {
		temp[ind] = arr[i];
		++i;
		++ind;
	}

	while (j <= ub) {
		temp[ind] = arr[j];
		++j;
		++ind;
	}
	j = 0;
	for (i = lb; i <= ub; ++i) {
		arr[i] = temp[j];
		++j;
	}
}
void mergeSortS(int arr[], int lb, int ub) {
	if (lb < ub) {
		int m = (ub + lb) / 2;
		mergeSortS(arr, lb, m);
		mergeSortS(arr, m + 1, ub);
		mergeS(arr, lb, m, ub);
	}
}

int mergeSortSerial() {
	clock_t begin, end;
	double total_t;

	int *marks= new int[noOfStudents];
	copy(marks,data);

	begin = clock();
	mergeSortS(marks, 0, noOfStudents-1);
	end= clock();

	total_t = (double)(end - begin) / CLOCKS_PER_SEC;
	sf::RenderWindow window(sf::VideoMode(800, 600), "Merge serial Display");
	display(marks,window,total_t);
	free(marks);
	return 0;
}

////////////////bubble
void bubbleSort(int arr[10000], int n) {
	int i, j;
	for (i = 0; i < n-1; i++)
		for (j = 0; j < n-i-1; j++)
			if (arr[j] > arr[j+1])
				swap(&arr[j], &arr[j+1]);
}

int bubbleSortSerial() {
	clock_t begin, end;
	double total_t;

	int *marks = new int[noOfStudents];
	copy(marks,data);

	begin = clock();
	bubbleSort(marks, noOfStudents);
	end= clock();

	total_t = (double)(end - begin) / CLOCKS_PER_SEC;

	sf::RenderWindow window(sf::VideoMode(800, 600), "Bubble serial Display");
	display(marks,window, total_t);
	free(marks);
	return 0;
}

//////////PARALLEL/OPENMP CODES
//////////////////bubble
int bubbleSortParallel() {
	clock_t begin, end;
	double total_t;
	int *marks = new int[noOfStudents];
	copy(marks, data);
	begin = clock();

	#pragma omp parallel num_threads(THREAD_MAX)
	{

		for (int i = 0; i < noOfStudents - 1; i++) {
			#pragma omp for
			for (int j = 0; j < noOfStudents - i - 1; j++) {
				if (marks[j] > marks[j + 1]) {
					#pragma omp critical
					swap(&marks[j], &marks[j + 1]);
				}
			}
		}
	}

	end = clock();

	total_t = (double)(end - begin) / CLOCKS_PER_SEC;
	sf::RenderWindow window(sf::VideoMode(800, 600), "Bubble Parallel Display");
	display(marks,window, total_t);
	free(marks);
	return 0;
}


//////////////////////////////merge
void mergeP(int arr[], int l, int m, int r) {
	int i, j, k;
	int n1 = m - l + 1;
	int n2 = r - m;

	int* L = new int[n1];
	int* R = new int[n2];

	for (i = 0; i < n1; i++)
		L[i] = arr[l + i];
	for (j = 0; j < n2; j++)
		R[j] = arr[m + 1 + j];

	i = 0;
	j = 0;
	k = l;

	while (i < n1 && j < n2) {
		if (L[i] <= R[j]) {
			arr[k] = L[i];
			i++;
		} else {
			arr[k] = R[j];
			j++;
		}
		k++;
	}

	while (i < n1) {
		arr[k] = L[i];
		i++;
		k++;
	}

	while (j < n2) {
		arr[k] = R[j];
		j++;
		k++;
	}

	free(L);
	free(R);
}

void mergeSortP(int arr[], int l, int r) {
	if (l < r) {
		int m = l + (r - l) / 2;
		#pragma omp parallel sections
		{
			#pragma omp section
			mergeSortP(arr, l, m);
			#pragma omp section
			mergeSortP(arr, m + 1, r);
		}
		mergeP(arr, l, m, r);
	}
}

int mergeSortParallel() {
	clock_t begin, end;
	double total_t;

	int* marks = new int[noOfStudents];
	copy(marks, data);

	begin = clock();
	mergeSortP(marks, 0, noOfStudents - 1);
	end = clock();

	total_t = (double)(end - begin) / CLOCKS_PER_SEC;
	sf::RenderWindow window(sf::VideoMode(800, 600), "Merge sort MP Display");
	display(marks,window, total_t);
	free(marks);
	return 0;
}

//////////////////////////////////quick

int partitionP (int arr[], int low, int high) {
	int pivot = arr[high];
	int i = (low - 1);

	#pragma omp schedule(static) parallel num_threads(4)
	{
		#pragma omp for

		for (int j = low; j <= high- 1; j++) {
			if (arr[j] <= pivot) {
				i++;
				swap(&arr[i], &arr[j]);
			}
		}
		swap(&arr[i + 1], &arr[high]);
	}
	return (i + 1);
}

void quickSortP(int arr[], int low, int high) {
	if (low < high) {
		int pi = partitionP(arr, low, high);

		quickSortP(arr, low, pi - 1);
		quickSortP(arr, pi + 1, high);
	}
}

int quickSortParallel() {
	clock_t begin, end;
	double total_t;
	int *marks = new int[noOfStudents];
	copy(marks,data);

	begin = clock();
	quickSortP(marks, 0, noOfStudents-1);
	end= clock();

	total_t = (double)(end - begin) / CLOCKS_PER_SEC;
	sf::RenderWindow window(sf::VideoMode(800, 600), "Quick sort MP Display");
	display(marks,window, total_t);

	free(marks);

	return 0;
}


///////////////////threading
//////////////merge

int MarksMT[noOfStudents];
int part = 0;

void mergeT(int l, int m, int r) {
	int n1 = m - l + 1, n2 = r - m, i, j;

	int* left = new int[n1];
	int* right = new int[n2];

	for (i = 0; i < n1; i++)
		left[i] = MarksMT[i + l];
	for (i = 0; i < n2; i++)
		right[i] = MarksMT[i + m + 1];

	int k = l;
	i = j = 0;

	while (i < n1 && j < n2) {
		if (left[i] <= right[j])
			MarksMT[k++] = left[i++];
		else
			MarksMT[k++] = right[j++];
	}
	while (i < n1)
		MarksMT[k++] = left[i++];
	while (j < n2)
		MarksMT[k++] = right[j++];
}

void mergeSortT(int l, int r) {
	int m = l + (r - l) / 2;
	if (l < r) {
		mergeSortT(l, m);
		mergeSortT(m + 1, r);
		mergeT(l, m, r);
	}
}

void *mergeSortThreader(void *arg) {
	int thread_part = part++;

	int l = thread_part * (noOfStudents / 4);
	int r = (thread_part + 1) * (noOfStudents / 4) - 1;

	int m = l + (r - l) / 2;
	if (l < r) {
		mergeSortT(l, m);
		mergeSortT(m + 1, r);
		mergeT(l, m, r);
	}
	pthread_exit(NULL);
}

int mergeSortThreading() {
	clock_t begin, end;
	double total_t;

	//memcpy(MarksMT,data,noOfStudents);
	copy(MarksMT,data);

	pthread_t threads[THREAD_MAX];

	int i;
	begin = clock();
	for (i = 0; i < THREAD_MAX; i++)
		pthread_create(&threads[i], NULL, mergeSortThreader,(void*)NULL);

	for (i = 0; i < 4; i++)
		pthread_join(threads[i], NULL);

	mergeT(0, (noOfStudents / 2 - 1) / 2, noOfStudents / 2 - 1);
	mergeT(noOfStudents / 2, noOfStudents/2 + (noOfStudents-1-noOfStudents/2)/2, noOfStudents - 1);
	mergeT(0, (noOfStudents - 1)/2, noOfStudents - 1);
	end= clock();

	total_t = (double)(end - begin) / CLOCKS_PER_SEC;
	sf::RenderWindow window(sf::VideoMode(800, 600), "Merge sort Parallel Display");
	display(MarksMT,window, total_t);
	return 0;
}

/////////////bubble
struct data {

	int *newArray;
	int Starting_Point;
	int Ending_Point;
};
void Sort(int arr[], int left, int mid, int right) {

	int i, j, k;
	int x = mid-left+1;
	int y = right-mid;

	int L[x];
	int R[y];

	for(i=0; i<x; i++) {
		L[i] = arr[left+i];
	}
	for(j=0; j<y; j++) {
		R[j] = arr[mid+1+j];
	}
	i = j = 0;
	k = left;

	while(i<x && j<y) {
		if(L[i] <= R[j]) {
			arr[k] = L[i];
			i++;
		} else {
			arr[k] = R[j];
			j++;
		}

		k++;

	}

	while(i<x) {
		arr[k] = L[i];
		i++;
		k++;
	}
	while(j<y) {
		arr[k] = R[j];
		j++;
		k++;
	}


}

void CombineThreads(int arr[] , int si , int ei) {

	if(ei>si) {

		int mid = (si+ei)/2;

		CombineThreads(arr,si,mid);
		CombineThreads(arr,mid+1,ei);
		Sort(arr,si,mid,ei);
	}
}

void *bubblesort(void *pArray) { ///////////////thread mai bubble///////////////

	struct data var = *(struct data *)pArray;
	int *newArray = var.newArray;
	int Starting_Point = var.Starting_Point;
	int Ending_Point = var.Ending_Point;

	int i, j;
	for(i=Starting_Point; i<Ending_Point-1; i++) {
		for(j=0; j<Ending_Point-Starting_Point-1; j++) {
			if(newArray[j]>newArray[j+1]) {
				swap(&newArray[j], &newArray[j+1]);
			}
		}
	}
	pthread_exit(NULL);
}

void bubbleSortThreading() {
	int arr[noOfStudents];
	int i,th=THREAD_MAX;
	copy(arr,data);
	clock_t start, end;
	int count = 0;

	struct data x[THREAD_MAX];
	int Starting_Point = 0;
	int Ending_Point = noOfStudents / th;

	for (i = 0; i < th; i++) {
		x[i].newArray = arr;
		x[i].Starting_Point = Starting_Point;
		x[i].Ending_Point = Ending_Point;
		Starting_Point += noOfStudents / th;
		Ending_Point += noOfStudents / th;
	}

	pthread_t pid[th];

	start = clock();

	for(i=0; i<th; i++)
		pthread_create(&pid[i], NULL, bubblesort, (void *)&x[i]);
	for(i=0; i<th; i++)
		pthread_join(pid[i], NULL);
	end = clock();



	int A[noOfStudents];
	for(int r=0 ; r<noOfStudents ; r++)
		A[r] = arr[r];
	count = 0;



	CombineThreads(A,0,noOfStudents-1);

	double total_t = ((double)end - start) / CLOCKS_PER_SEC;
	sf::RenderWindow window(sf::VideoMode(800, 600), "Bubble Sort Threading Display");
	display(A,window, total_t);
}

/////////////quick
struct INDEX {
	int l;
	int r;
};

int marksQT[noOfStudents];

int partitionT(int l, int r) {
	int pivot = marksQT[r];
	int i = l - 1;
	int j;
	for (j = l; j <= r - 1; j++) {
		if (marksQT[j] < pivot) {
			i++;
			swap(&marksQT[i], &marksQT[j]);
		}
	}

	swap(&marksQT[i + 1], &marksQT[r]);

	return (i + 1);
}

void quickSortT(int l, int r) {
	if (l < r) {
		int pivot = partitionT(l, r);

		quickSortT(l, pivot - 1);
		quickSortT(pivot + 1, r);
	}
}

void* quickSortThreader(void* args) {
	struct INDEX* ind = (struct INDEX*)args;
	quickSortT(ind->l, ind->r);
	pthread_exit(NULL);
}

int quickSortThreading() {
	clock_t begin, end;
	double total_t;

	copy(marksQT, data);

	begin = clock();
	quickSortT(0, noOfStudents - 1);
	end = clock();

	total_t = (double)(end - begin)/ CLOCKS_PER_SEC;
	//display(marksQT);
	sf::RenderWindow window(sf::VideoMode(800, 600), "Quick Sort Parallel Display");
	display(marksQT,window, total_t);
	return 0;
}


////////////////////////////////////////////////////////////


class Button {
	public:
		Button(float x, float y, float width, float height, const std::string& text, const sf::Font& font)
			: m_shape(sf::Vector2f(width, height)), m_text(text, font), m_hovered(false) {
			m_shape.setPosition(x, y);
			m_shape.setFillColor(sf::Color::White);

			m_text.setFillColor(sf::Color::Black);
			m_text.setPosition(x + (width - m_text.getLocalBounds().width) / 2, y + (height - m_text.getLocalBounds().height) / 2);

			// Set default hover color
			m_hoverColor = sf::Color::Blue;
		}

		void handleClick() {
			if (m_onClick) {
				m_onClick();
			}
		}

		void draw(sf::RenderWindow& window) {
			window.draw(m_shape);
			window.draw(m_text);
		}

		bool contains(const sf::Vector2f& point) {
			return m_shape.getGlobalBounds().contains(point);
		}

		void setHovered(bool hovered) {
			m_hovered = hovered;
			if (hovered) {
				m_shape.setFillColor(m_hoverColor); // Use custom hover color
			} else {
				m_shape.setFillColor(sf::Color::White);
			}
		}

		// Function to set custom hover color
		void setHoverColor(const sf::Color& color) {
			m_hoverColor = color;
		}

		// Function to set click event handler
		void setOnClick(std::function<void()> onClick) {
			m_onClick = onClick;
		}

	private:
		std::function<void()> m_onClick;
		sf::RectangleShape m_shape;
		sf::Text m_text;
		bool m_hovered;
		sf::Color m_hoverColor; // Hover color for the button
};


void displayGrade(sf::RenderWindow &window) {
    sf::Texture backgroundTexture;
    if (!backgroundTexture.loadFromFile("18.jpg")) {
        std::cerr << "Failed to load background image" << std::endl;
    }
    sf::Sprite backgroundSprite(backgroundTexture);

    sf::Font font;
    if (!font.loadFromFile("G_ari_bd.TTF")) {
        std::cerr << "Failed to load font!" << std::endl;
    }

    sf::Text text;
    text.setFont(font);
    text.setCharacterSize(16);
    text.setFillColor(sf::Color::Black);
    text.setPosition(20.f, 20.f);

    Paginator paginator(20, 10);

    sf::Text pageText;
    pageText.setFont(font);
    pageText.setCharacterSize(12);
    pageText.setFillColor(sf::Color::Black);
    pageText.setPosition(700.f, 570.f);

    // Main loop
    while (window.isOpen()) {
        sf::Event event;
        while (window.pollEvent(event)) {
            if (event.type == sf::Event::Closed)
                window.close();
            else if (event.type == sf::Event::KeyPressed) {
                if (event.key.code == sf::Keyboard::Right)
                    paginator.nextPage();
                else if (event.key.code == sf::Keyboard::Left)
                    paginator.previousPage();
            }
        }

        window.clear(sf::Color::White);
        window.draw(backgroundSprite);

        int currentPage = paginator.getCurrentPage();

        // Bubble sort the data
        int datat[noOfStudents];
        copy(datat, data);
        bubbleSort(datat, noOfStudents);

        // Count grades
        int count[5] = {0};
        for (int i = 0; i < noOfStudents; ++i) {
            if (data[i] >= 900)
                ++count[0];
            else if (data[i] >= 800)
                ++count[1];
            else if (data[i] >= 700)
                ++count[2];
            else if (data[i] >= 600)
                ++count[3];
            else
                ++count[4];
        }

        // Display grades
        std::stringstream gradesText;
        gradesText << "Grade\tCount\n";
        gradesText << "A\t\t\t" << count[0] << "\n";
        gradesText << "B\t\t\t" << count[1] << "\n";
        gradesText << "C\t\t\t" << count[2] << "\n";
        gradesText << "D\t\t\t" << count[3] << "\n";
        gradesText << "F\t\t\t" << count[4] << "\n";

        text.setString(gradesText.str());

        window.draw(text); // Draw the text onto the window
        window.draw(pageText); // Draw the page text onto the window
        window.display(); // Update the display
    }
}



int main() {

	sf::RenderWindow window(sf::VideoMode(1920, 1080), "Sorting Simulator");

	sf::Texture backgroundTexture;
	if (!backgroundTexture.loadFromFile("15.jpg")) {
		std::cerr << "Failed to load background image" << std::endl;
		return 1;
	}
	sf::Sprite backgroundSprite(backgroundTexture);


	sf::Font font;
	if (!font.loadFromFile("G_ari_bd.TTF")) {
		std::cerr << "Failed to load font" << std::endl;
		return 1;
	}

	enum class State {
	    MainMenu,
	    SubFetchMenu,
	    SubMenu,
	    QuickSortSubMenu,
	    MergeSortSubMenu,
	    BubbleSortSubMenu
	};

	State currentState = State::MainMenu;

	// Adjusted button coordinates for center alignment
	Button startButton((window.getSize().x - 230) / 2, 300, 250, 50, "Start", font);
	Button exitButton((window.getSize().x - 230) / 2, 400, 250, 50, "Exit", font);

	Button fetchDataButton((window.getSize().x - 230) / 2, 250, 200, 50, "Fetch Data", font);

	Button quickButton((window.getSize().x - 230) / 2, 300, 250, 50, "Quick Sort", font);
	Button mergeButton((window.getSize().x - 230) / 2, 400, 250, 50, "Merge Sort", font);
	Button bubbleButton((window.getSize().x - 230) / 2, 500, 250, 50, "Bubble Sort", font);
	Button grades((window.getSize().x - 230) / 2, 600, 250, 50, "Display Grades", font);

	Button quickSerialButton((window.getSize().x - 230) / 2, 300, 250, 50, "Quick Serial", font);
	Button quickParallelButton((window.getSize().x - 230) / 2, 400, 250, 50, "Quick Threader", font);
	Button quickMPButton((window.getSize().x - 230) / 2, 500, 250, 50, "Quick MP", font);

	Button mergeSerialButton((window.getSize().x - 230) / 2, 300, 250, 50, "Merge Serial", font);
	Button mergeParallelButton((window.getSize().x - 230) / 2, 400, 250, 50, "Merge Threader", font);
	Button mergeMPButton((window.getSize().x - 230) / 2, 500, 250, 50, "Merge MP", font);

	Button bubbleSerialButton((window.getSize().x - 230) / 2, 300, 250, 50, "Bubble Serial", font);
	Button bubbleParallelButton((window.getSize().x - 230) / 2, 400, 250, 50, "Bubble Threader", font);
	Button bubbleMPButton((window.getSize().x - 230) / 2, 500, 250, 50, "Bubble MP", font);

	Button backButton(10, 10, 80, 40, "X", font);
	backButton.setHoverColor(sf::Color::Red);

	// Add a text object for the fetch prompt
	sf::Text fetchPromptText;
	fetchPromptText.setFont(font);
	fetchPromptText.setString("Let's fetch data by clicking the Fetch button");
	fetchPromptText.setCharacterSize(25);
	fetchPromptText.setFillColor(sf::Color::Black);
	fetchPromptText.setStyle(sf::Text::Bold);

	// Add a text object for the fetching indicator
	sf::Text fetchingText;
	fetchingText.setFont(font);
	fetchingText.setString("Fetching...");
	fetchingText.setCharacterSize(25);
	fetchingText.setFillColor(sf::Color::Black);
	fetchingText.setStyle(sf::Text::Bold);
	fetchingText.setPosition((window.getSize().x - fetchingText.getLocalBounds().width) / 2, 300);


	sf::Text text; // Declare sf::Text here
	text.setFont(font);
	text.setCharacterSize(20);
	text.setFillColor(sf::Color::Black);
	text.setStyle(sf::Text::Bold);


	while (window.isOpen()) {
		sf::Event event;
		while (window.pollEvent(event)) {
			if (event.type == sf::Event::Closed) {
				window.close();
			} else if (event.type == sf::Event::MouseButtonPressed) {
				sf::Vector2f mousePos = window.mapPixelToCoords(sf::Mouse::getPosition(window));
				if (currentState == State::MainMenu) {
					if (startButton.contains(mousePos)) {
						currentState = State::SubFetchMenu;
					} else if (exitButton.contains(mousePos)) {
						window.close();
					}
				} else if (currentState == State::SubFetchMenu) {
					if (fetchDataButton.contains(mousePos)) {
						currentState = State::SubMenu;
						fetchMarks();
						// Display "Fetching..." for 2 seconds
						window.clear();
						window.draw(backgroundSprite);
						window.draw(fetchingText);
						window.display();
						std::this_thread::sleep_for(std::chrono::seconds(1));
						sf::RenderWindow window(sf::VideoMode(800, 600), "Fetched Marks");
						display(data,window,0);
					}
				} else if (currentState == State::SubMenu || currentState == State::QuickSortSubMenu || currentState == State::MergeSortSubMenu || currentState == State::BubbleSortSubMenu) {
					// Check if the back button is pressed
					if (backButton.contains(mousePos)) {
						currentState = State::MainMenu;
					}
					// Check other buttons
					else if (currentState == State::SubMenu) {
						if (quickButton.contains(mousePos)) {
							currentState = State::QuickSortSubMenu;
						} else if (mergeButton.contains(mousePos)) {
							currentState = State::MergeSortSubMenu;
						} else if (bubbleButton.contains(mousePos)) {
							currentState = State::BubbleSortSubMenu;
						}
						else if (grades.contains(mousePos)){
							currentState = State::SubMenu;
							sf::RenderWindow window(sf::VideoMode(800, 600), "Grades");
							displayGrade(window);
						}
					} else if (currentState == State::QuickSortSubMenu) {
						if (quickSerialButton.contains(mousePos)) {
							// Draw array data when "Quick Serial" button is pressed
							quickSortSerial();


						} else if (quickParallelButton.contains(mousePos)) {
							// Handle Quick Parallel button press
							quickSortThreading();
						} else if (quickMPButton.contains(mousePos)) {
							// Handle Quick MP button press
							quickSortParallel();
						}
					} else if (currentState == State::MergeSortSubMenu) {
						if (mergeSerialButton.contains(mousePos)) {
							// Handle Merge Serial button press
							mergeSortSerial();
						} else if (mergeParallelButton.contains(mousePos)) {
							mergeSortThreading();
							// Handle Merge Parallel button press
						} else if (mergeMPButton.contains(mousePos)) {
							// Handle Merge MP button press
							mergeSortParallel();
						}
					} else if (currentState == State::BubbleSortSubMenu) {
						if (bubbleSerialButton.contains(mousePos)) {
							//bubbleSortSerial();

							bubbleSortSerial();
						} else if (bubbleParallelButton.contains(mousePos)) {
							// Handle Bubble Parallel button press
							bubbleSortThreading();
						} else if (bubbleMPButton.contains(mousePos)) {
							// Handle Bubble MP button press
							bubbleSortParallel();
						}
					}
				}
			} else if (event.type == sf::Event::MouseMoved) {
				sf::Vector2f mousePos = window.mapPixelToCoords(sf::Mouse::getPosition(window));
				startButton.setHovered(startButton.contains(mousePos));
				exitButton.setHovered(exitButton.contains(mousePos));
				quickButton.setHovered(quickButton.contains(mousePos));
				mergeButton.setHovered(mergeButton.contains(mousePos));
				bubbleButton.setHovered(bubbleButton.contains(mousePos));
				grades.setHovered(grades.contains(mousePos));
				quickSerialButton.setHovered(quickSerialButton.contains(mousePos));
				quickParallelButton.setHovered(quickParallelButton.contains(mousePos));
				quickMPButton.setHovered(quickMPButton.contains(mousePos));
				mergeSerialButton.setHovered(mergeSerialButton.contains(mousePos));
				mergeParallelButton.setHovered(mergeParallelButton.contains(mousePos));
				mergeMPButton.setHovered(mergeMPButton.contains(mousePos));
				bubbleSerialButton.setHovered(bubbleSerialButton.contains(mousePos));
				bubbleParallelButton.setHovered(bubbleParallelButton.contains(mousePos));
				bubbleMPButton.setHovered(bubbleMPButton.contains(mousePos));
				backButton.setHovered(backButton.contains(mousePos)); // Set hover for the back button
			}
		}

		window.clear();

		// Draw background
		window.draw(backgroundSprite);

		// Draw prompt only when in the fetch menu state
		if (currentState == State::SubFetchMenu) {
			fetchPromptText.setPosition((window.getSize().x - fetchPromptText.getLocalBounds().width) / 2, 150);
			window.draw(fetchPromptText);
		}

		// Draw buttons and other elements based on the current state
		if (currentState == State::MainMenu) {
			// Draw main menu elements
			sf::Text text;
			text.setFont(font);
			text.setString("Project Creators: Zaid Vohra : Roohan Ahmed : Mohammad Shahmeer Ul Haq");
			text.setCharacterSize(25);
			text.setFillColor(sf::Color::White);
			text.setStyle(sf::Text::Bold | sf::Text::Italic);

// Add two more lines
			sf::Text text2;
			text2.setFont(font);
			text2.setString("Different Sorting Techniques on a Data Set of 10000 Student's Marks");
			text2.setCharacterSize(25);
			text2.setFillColor(sf::Color::White); // Adjust color as needed
			text2.setStyle(sf::Text::Bold );

			sf::Text text3;
			text3.setFont(font);
			text3.setString("Bubble Sort	Merge Sort	Quick Sort");
			text3.setCharacterSize(25);
			text3.setFillColor(sf::Color::White); // Adjust color as needed
			text3.setStyle(sf::Text::Bold | sf::Text::Italic);

// Calculate text bounds to determine its size
			sf::FloatRect textBounds = text.getLocalBounds();
			sf::FloatRect text2Bounds = text2.getLocalBounds();
			sf::FloatRect text3Bounds = text3.getLocalBounds();

// Calculate the center of the window along both the X and Y axes
			float centerX = window.getSize().x / 2;
			float centerY = window.getSize().y / 2;

// Adjust the position of the text to center-align it
			text.setPosition(centerX - textBounds.width / 2, centerY - textBounds.height);

// Adjust positions for the additional lines
			float lineSpacing = 10.0f;
			text2.setPosition(centerX - text2Bounds.width / 2, text.getPosition().y + textBounds.height + lineSpacing);
			text3.setPosition(centerX - text3Bounds.width / 2, text2.getPosition().y + text2Bounds.height + lineSpacing);

			window.draw(text);
			window.draw(text2);
			window.draw(text3);

			startButton.draw(window);
			exitButton.draw(window);
		} else if (currentState == State::SubFetchMenu) {
			// Draw fetch menu elements
			backButton.draw(window); // Draw the back button
			fetchDataButton.draw(window);
		} else if (currentState == State::SubMenu || currentState == State::QuickSortSubMenu || currentState == State::MergeSortSubMenu || currentState == State::BubbleSortSubMenu) {
			// Draw sub menus and their buttons
			backButton.draw(window); // Draw the back button
			if (currentState == State::SubMenu) {
				quickButton.draw(window);
				mergeButton.draw(window);
				bubbleButton.draw(window);
				grades.draw(window);
			} else if (currentState == State::QuickSortSubMenu) {
				quickSerialButton.draw(window);
				quickParallelButton.draw(window);
				quickMPButton.draw(window);
			} else if (currentState == State::MergeSortSubMenu) {
				mergeSerialButton.draw(window);
				mergeParallelButton.draw(window);
				mergeMPButton.draw(window);
			} else if (currentState == State::BubbleSortSubMenu) {
				bubbleSerialButton.draw(window);
				bubbleParallelButton.draw(window);
				bubbleMPButton.draw(window);
			}
		}

		window.display();
	}

	return 0;
}
