//22k-4611 Roohan Ahmed
//22k-4643 Mohammad Shahmeer Ul Haq
//22k-4195 Zaid Vohra
#include <SFML/Graphics.hpp>
#include <iostream>
#include <chrono>
#include <thread>
#include <functional>
#include <fstream>
#include <iostream>
#include <string>
#include <cstring>

using namespace std;
string ree;
string s = "example.txt";
string f = "file.txt";
string w = "words.txt";
string replaceWord;

bool match(const string& word, const string& re)
{

	int re_length = re.length();
	int w_length = word.length();
	bool op = false;
	for (int i = 0; i < re_length; i++)
	{
		if (re[i] == '|')
		{
			op = true;
		}
	}

	if (!op)
	{
		int i = 0, j = 0;
		bool flag;
		while (i < re_length || j < w_length)
		{

			flag = false;
			if (i < re_length && (re[i + 1] == '+' || re[i + 1] == '*'))
			{
				char current = re[i];
				if (re[i + 1] == '+')
				{
					if (word[j] != current && !flag)
					{
						return false;
					}
					else
						flag = true;
				}
				while (j < w_length && (word[j] == current))
				{
					j++;
				}
				i += 2;
			}
			else if (re[i] == '(')
			{
				int start = i;
				int end = i;
				while (re[end] != ')')
				{
					end++;
				}
				string sub_re = re.substr(start + 1, end - start - 1);

				bool check = false;
				bool matches = false;
				check = false;
				int x = j + sub_re.length();
				int l = x - j;
				do
				{
					matches = false;
					if (match(word.substr(j, l), sub_re))
					{
						check = true;
						matches = true;
						j = j + l;
					}
					if (!check && re[end + 1] == '+')
					{
						return false;
					}
					if (re[end + 1] != '*' && re[end + 1] != '+')
					{
						break;
					}
				} while (j + l <= (w_length + 1) && matches);

				i = end;
				if (re[i] == ')')
				{
					i++;
				}
				if (re[i] == '*' || re[i] == '+')
				{
					i++;
				}
			}
			else if (word[j] == re[i])
			{
				i++;
				j++;
			}
			else if (word[j] != re[i])
			{
				return false;
			}
		}
		if (i >= re_length && j >= w_length)
		{
			return true;
		}
		if (i == re_length && j < w_length)
		{
			return false;
		}
		if (j == w_length && re[i + 1] != '*')
		{
			return false;
		}
		return j == w_length;
	}

	else if (op)
	{
		int i = 0, j = 0;
		bool flag = false;
		while (i < re_length || j < w_length)
		{

			flag = false;
			if (i < re_length && (re[i + 1] == '+' || re[i + 1] == '*'))
			{
				char current = re[i];
				if (re[i + 1] == '+')
				{
					if (word[j] != current && !flag)
					{
						return false;
					}
					else
						flag = true;
				}
				while (j < w_length && (word[j] == current))
				{
					j++;
				}
				i += 2;
			}
			else if (re[i] == '(')
			{
				int start = i;
				int end = i;
				while (re[end] != ')')
				{
					end++;
				}
				int check = false;
				string matchs;
				bool matches = false;
				bool orr = false;
				int k = i;
				int orcount = 0;
				while (re[k] != ')')
				{
					if (re[k] == '|')
					{
						orcount++;
						orr = true;
					}
					k++;
				}

				if (!orr)
				{
					while (i < re_length || j < w_length)
					{
						flag = false;
						if (i < re_length && (re[i + 1] == '+' || re[i + 1] == '*'))
						{
							char current = re[i];
							if (re[i + 1] == '+')
							{
								if (word[j] != current && !flag)
								{
									return false;
								}
								else
									flag = true;
							}
							while (j < w_length && (word[j] == current))
							{
								j++;
							}
							i += 2;
						}
						else if (re[i] == '(')
						{

							int start = i;
							int end = i;
							while (re[end] != ')')
							{
								end++;
							}
							string sub_re = re.substr(start + 1, end - start - 1);

							bool check = false;
							bool matches = false;
							check = false;
							int x = j + sub_re.length();
							int l = x - j;
							do
							{
								matches = false;
								if (match(word.substr(j, l), sub_re))
								{
									check = true;
									matches = true;
									j = j + l;
								}
								if (!check && re[end + 1] == '+')
								{
									return false;
								}
								if (re[end + 1] != '*' && re[end + 1] != '+')
								{
									break;
								}
							} while (j + l <= (w_length + 1) && matches);
							i = end;
							if (re[i] == ')')
							{
								i++;
								if (re[i] == '(')
									break;
							}
							if (re[i] == '*' || re[i] == '+')
							{
								i++;
								if (re[i] == '(')
									break;
							}
						}
						else if (word[j] == re[i])
						{
							i++;
							j++;
						}
						else if (word[j] != re[i])
						{
							return false;
						}
					}
				}

				else if (orr)
				{

					if (orcount == 1)
					{

						bool bracket = true;
						bool left = true;
						string a[2];
						int k = i;
						int track = 0;
						while (re[k] != ')')
						{
							if (re[k] == '(')
							{
								k++;
							}
							if (re[k] == '|')
							{
								track++;
							}
							else
							{
								a[track] += re[k];
							}
							k++;
						}
						bool check = false;
						bool matches = false;
						check = false;
						int l[2];
						for (int f = 0; f < 2; f++)
						{
							l[f] = a[f].length();
						}

						do
						{
							matches = false;
							if (match(word.substr(j, l[0]), a[0]) || match(word.substr(j, l[1]), a[1]))
							{
								check = true;
								matches = true;
								for (int f = 0; f < 2; f++)
								{
									if (match(word.substr(j, l[f]), a[f]))
									{
										j = j + l[f];
										break;
									}
								}
							}
							if (!check && re[end + 1] == '+')
							{
								return false;
							}
							if (re[end + 1] != '*' && re[end + 1] != '+')
							{
								break;
							}

						} while (j + l[0] <= (w_length + 1) && matches);

						i = end;
						if (re[i] == ')')
						{
							i++;
						}
						if (re[i] == '*' || re[i] == '+')
						{
							i++;
						}

					}
					else if (orcount == 2)
					{
						bool bracket = true;
						bool left = true;
						string a[3];
						int k = i;
						int track = 0;
						while (re[k] != ')')
						{
							if (re[k] == '(')
							{
								k++;
							}
							if (re[k] == '|')
							{
								track++;
							}
							else
							{
								a[track] += re[k];
							}
							k++;
						}
						bool check = false;
						bool matches = false;
						check = false;
						int l[3];
						for (int f = 0; f < 3; f++)
						{
							l[f] = a[f].length();
						}

						do
						{
							matches = false;
							if (match(word.substr(j, l[0]), a[0]) || match(word.substr(j, l[1]), a[1]) || match(word.substr(j, l[2]), a[2]))
							{
								check = true;
								matches = true;
								for (int f = 0; f < 3; f++)
								{
									if (match(word.substr(j, l[f]), a[f]))
									{
										j = j + l[f];
										break;
									}
								}
							}
							if (!check && re[end + 1] == '+')
							{
								return false;
							}
							if (re[end + 1] != '*' && re[end + 1] != '+')
							{
								break;
							}

						} while (j + l[0] <= (w_length + 1) && matches);

						i = end;
						if (re[i] == ')')
						{
							i++;
						}
						if (re[i] == '*' || re[i] == '+')
						{
							i++;
						}
					}
					else if (orcount == 3)
					{
						bool bracket = true;
						bool left = true;
						string a[4];
						int k = i;
						int track = 0;
						while (re[k] != ')')
						{
							if (re[k] == '(')
							{
								k++;
							}
							if (re[k] == '|')
							{
								track++;
							}
							else
							{
								a[track] += re[k];
							}
							k++;
						}
						bool check = false;
						bool matches = false;
						check = false;
						int l[4];
						for (int f = 0; f < 4; f++)
						{
							l[f] = a[f].length();
						}

						do
						{
							matches = false;
							if (match(word.substr(j, l[0]), a[0]) || match(word.substr(j, l[1]), a[1]) || match(word.substr(j, l[2]), a[2]) || match(word.substr(j, l[3]), a[3]))
							{
								check = true;
								matches = true;
								for (int f = 0; f < 4; f++)
								{
									if (match(word.substr(j, l[f]), a[f]))
									{
										j = j + l[f];
										break;
									}
								}
							}
							if (!check && re[end + 1] == '+')
							{
								return false;
							}
							if (re[end + 1] != '*' && re[end + 1] != '+')
							{
								break;
							}

						} while (j + l[0] <= (w_length + 1) && matches);

						i = end;
						if (re[i] == ')')
						{
							i++;
						}
						if (re[i] == '*' || re[i] == '+')
						{
							i++;
						}
					}
					else if (orcount == 4)
					{
						bool bracket = true;
						bool left = true;
						string a[5];
						int k = i;
						int track = 0;
						while (re[k] != ')')
						{
							if (re[k] == '(')
							{
								k++;
							}
							if (re[k] == '|')
							{
								track++;
							}
							else
							{
								a[track] += re[k];
							}
							k++;
						}
						bool check = false;
						bool matches = false;
						check = false;
						int l[5];
						for (int f = 0; f < 5; f++)
						{
							l[f] = a[f].length();
						}

						do
						{
							matches = false;
							if (match(word.substr(j, l[0]), a[0]) || match(word.substr(j, l[1]), a[1]) || match(word.substr(j, l[2]), a[2]) || match(word.substr(j, l[3]), a[3]) || match(word.substr(j, l[4]), a[4]))
							{
								check = true;
								matches = true;
								for (int f = 0; f < 5; f++)
								{
									if (match(word.substr(j, l[f]), a[f]))
									{
										j = j + l[f];
										break;
									}
								}
							}
							if (!check && re[end + 1] == '+')
							{
								return false;
							}
							if (re[end + 1] != '*' && re[end + 1] != '+')
							{
								break;
							}

						} while (j + l[0] <= (w_length + 1) && matches);

						i = end;
						if (re[i] == ')')
						{
							i++;
						}
						if (re[i] == '*' || re[i] == '+')
						{
							i++;
						}
					}
					else if (orcount == 5)
					{
						bool bracket = true;
						bool left = true;
						string a[6];
						int k = i;
						int track = 0;
						while (re[k] != ')')
						{
							if (re[k] == '(')
							{
								k++;
							}
							if (re[k] == '|')
							{
								track++;
							}
							else
							{
								a[track] += re[k];
							}
							k++;
						}
						bool check = false;
						bool matches = false;
						check = false;
						int l[6];
						for (int f = 0; f < 6; f++)
						{
							l[f] = a[f].length();
						}

						do
						{
							matches = false;
							if (match(word.substr(j, l[0]), a[0]) || match(word.substr(j, l[1]), a[1]) || match(word.substr(j, l[2]), a[2]) || match(word.substr(j, l[3]), a[3]) || match(word.substr(j, l[4]), a[4]) || match(word.substr(j, l[5]), a[5]))
							{
								check = true;
								matches = true;
								for (int f = 0; f < 6; f++)
								{
									if (match(word.substr(j, l[f]), a[f]))
									{
										j = j + l[f];
										break;
									}
								}
							}
							if (!check && re[end + 1] == '+')
							{
								return false;
							}
							if (re[end + 1] != '*' && re[end + 1] != '+')
							{
								break;
							}

						} while (j + l[0] <= (w_length + 1) && matches);

						i = end;
						if (re[i] == ')')
						{
							i++;
						}
						if (re[i] == '*' || re[i] == '+')
						{
							i++;
						}
					}
				}
			}

			else if (word[j] == re[i])
			{
				i++;
				j++;
			}
			else if (word[j] != re[i])
			{
				return false;
			}


		}
		if ((i + 1 >= re_length || re[i] == ' ') && j + 1 >= w_length)
		{
			return true;
		}
		if (i == re_length && j < w_length)
		{
			return false;
		}
		if (j == w_length && re[i + 1] != '*')
		{
			return false;
		}
		return j == w_length;

	}

	return false;
}




void ReplaceUserInput()
{
	sf::RenderWindow window(sf::VideoMode(500, 100), "ENTER WORD TO REPLACE");


	bool buttonPressed = false;

	sf::RectangleShape inputBox(sf::Vector2f(400.f, 50.f));
	inputBox.setFillColor(sf::Color::White);
	inputBox.setOutlineThickness(2);
	inputBox.setOutlineColor(sf::Color::Black);
	inputBox.setPosition(50.f, 25.f);

	// sf::RectangleShape enterButton(sf::Vector2f(100.f, 50.f));
	 //enterButton.setFillColor(sf::Color::Green);
	 //enterButton.setOutlineThickness(2);
	 //enterButton.setOutlineColor(sf::Color::Black);
	 //enterButton.setPosition(350.f, 350.f);

	sf::Font font;
	if (!font.loadFromFile("arial.ttf")) // Load a font
	{
		// error...
		std::cerr << "Error loading font file!" << std::endl;

	}

	sf::Text text("", font, 30);
	text.setFillColor(sf::Color::Black);
	text.setPosition(50.f, 25.f);

	/*    sf::Text buttonText("Enter", font, 20);
		buttonText.setFillColor(sf::Color::Black);
		buttonText.setPosition(365.f, 360.f);*/

	while (window.isOpen())
	{
		sf::Event event;
		while (window.pollEvent(event))
		{
			if (event.type == sf::Event::Closed)
				window.close();


			if (event.type == sf::Event::TextEntered)
			{

				if (event.text.unicode < 128)
				{

					if (event.text.unicode == 8 && !replaceWord.empty())
						replaceWord.pop_back();
					else if (event.text.unicode != 8)
						replaceWord += static_cast<char>(event.text.unicode);
				}
				text.setString(replaceWord);
			}

			// Check if mouse button is pressed
			if (event.type == sf::Event::KeyPressed) {
				if (event.key.code == sf::Keyboard::Enter) {
					// Process user input, for example:
					std::cout << "User Input: " << replaceWord << std::endl;
					window.close();
					//currentState = State::SubSubMenu; // Shift to subsubmenu
				}
			}
			/*if (event.type == sf::Event::MouseButtonPressed)
			{
				// Check if the mouse click is within the button area
				sf::Vector2i mousePos = sf::Mouse::getPosition(window);
				sf::Vector2f mousePosF(static_cast<float>(mousePos.x), static_cast<float>(mousePos.y));
				if (enterButton.getGlobalBounds().contains(mousePosF))
				{
					// Button is pressed
					buttonPressed = true;
					// Close the window
					window.close();
				}
			}*/
		}

		window.clear(sf::Color::White);


		window.draw(inputBox);




		window.draw(text);

		window.display();
	}

	if (buttonPressed)
	{
		std::cout << "Input: " << replaceWord << std::endl;
	}


}


int find(int c) {

	ifstream inputFile("file.txt");
	if (!inputFile.is_open()) {
		cout << "Error opening input file." << endl;
		return 1;
	}

	ofstream outputFile("words.txt");
	if (!outputFile.is_open()) {
		cout << "Error creating output file." << endl;
		return 1;
	}
	string word;
	int count = 0;
	while (inputFile >> word) {
		//	cout << words << endl;
		if (match(word, ree) && (c || (!c && count == 0))) {
			outputFile << word << endl;
			count++;
			cout << "match";
		}

	}

	inputFile.close();
	outputFile.close();
	return 0;
}



int replace(int c) {
	ifstream inputFile("file.txt");
	if (!inputFile.is_open()) {
		cout << "Error opening input file." << endl;
		return 1;
	}

	ofstream outputFile("temp.txt");
	if (!outputFile.is_open()) {
		cout << "Error creating temporary output file." << endl;
		inputFile.close();
		return 1;
	}

	ofstream outputFile2("words.txt");
	if (!outputFile.is_open()) {
		cout << "Error creating output file." << endl;
		return 1;
	}

	string word;
	int count = 0;

	while (inputFile >> word) {
		if (match(word, ree) && (c || (!c && count == 0))) {
			outputFile2 << word << endl;
			outputFile << replaceWord << " ";
			count++;
		}
		else {
			outputFile << word << " ";
		}
	}

	inputFile.close();
	outputFile.close();

	if (remove("file.txt") != 0) {
		cout << "Error removing old file." << endl;
		return 1;
	}

	if (rename("temp.txt", "file.txt") != 0) {
		cout << "Error renaming file." << endl;
		return 1;
	}

	return 0;
}



void display(string x)
{
	sf::RenderWindow window(sf::VideoMode(800, 600), x);

	// Load font
	sf::Font font;
	if (!font.loadFromFile("arial.ttf")) {
		std::cerr << "Failed to load font" << std::endl;
	}

	std::ifstream file(x);
	if (!file.is_open()) {
		std::cerr << "Failed to open file" << std::endl;
	}

	std::string content;
	std::string line;
	while (std::getline(file, line)) {
		content += line + '\n';
	}
	file.close();

	// Create text object
	sf::Text text;
	text.setFont(font);
	text.setString(content);
	text.setCharacterSize(24);
	text.setFillColor(sf::Color::White);
	text.setPosition(10, 10);

	while (window.isOpen()) {
		sf::Event event;
		while (window.pollEvent(event)) {
			if (event.type == sf::Event::Closed) {
				window.close();
			}
		}

		window.clear();
		window.draw(text);
		window.display();
	}
}


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
		}
		else {
			m_shape.setFillColor(sf::Color::White); // Set to default color when not hovered
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


int main() {
	sf::RenderWindow window(sf::VideoMode(1920, 1080), "RE Search Engine");
	sf::Font font;
	if (!font.loadFromFile("arial.ttf")) {
		std::cerr << "Failed to load font" << std::endl;
		return 1;
	}

	enum class State {
		MainMenu,
		SubMenuWithInput,
		SubSubMenu
	};

	sf::Texture backgroundTexture;
	if (!backgroundTexture.loadFromFile("15.jpg")) {
		std::cerr << "Failed to load background image" << std::endl;
		return 1;
	}
	sf::Sprite background(backgroundTexture);

	State currentState = State::MainMenu;
	sf::RectangleShape inputBox(sf::Vector2f(1200, 60));
	inputBox.setFillColor(sf::Color::Transparent);
	inputBox.setOutlineColor(sf::Color::White);
	inputBox.setOutlineThickness(2);
	inputBox.setPosition(300, 100);

	sf::Text inputText;
	inputText.setFont(font);
	inputText.setCharacterSize(28);
	inputText.setFillColor(sf::Color::White);
	inputText.setPosition(inputBox.getPosition().x + 10, inputBox.getPosition().y + 10);

	// Buttons for subsubmenu
	float buttonWidth = 200;
	float buttonHeight = 50;
	float buttonSpacing = 20;
	float buttonX = 800;

	Button findButton(buttonX, 200 + buttonHeight + buttonSpacing, buttonWidth, buttonHeight, "Find", font);
	Button findAllButton(buttonX, 350 + buttonHeight + buttonSpacing, buttonWidth, buttonHeight, "Find All", font);
	Button replaceButton(buttonX, 500 + (buttonHeight + buttonSpacing), buttonWidth, buttonHeight, "Replace", font);
	Button replaceAllButton(buttonX, 650 + (buttonHeight + buttonSpacing), buttonWidth, buttonHeight, "Replace All", font);
	Button viewFileButton(buttonX, 800 + (buttonHeight + buttonSpacing), buttonWidth, buttonHeight, "View File", font);
	Button enterButton(inputBox.getPosition().x + inputBox.getSize().x + 20, inputBox.getPosition().y, 100, inputBox.getSize().y, "Enter", font);

	enterButton.setOnClick([&inputText, &currentState]() {
		std::string ree = inputText.getString().toAnsiString();
		std::cout << "User Input: " << ree << std::endl;
		// Process user input here, for example:
		// find(ree); // Call the find function with the user input
		currentState = State::SubSubMenu; // Shift to subsubmenu
		});


	enterButton.setOnClick([]() {
		std::cout << "enter button clicked!" << std::endl;
		});

	findButton.setOnClick([]() {
		std::cout << "Find button clicked!" << std::endl;
		});

	findAllButton.setOnClick([]() {
		std::cout << "Find All button clicked!" << std::endl;
		});

	replaceButton.setOnClick([]() {
		std::cout << "Replace button clicked!" << std::endl;
		});

	replaceAllButton.setOnClick([]() {
		std::cout << "Replace All button clicked!" << std::endl;
		});

	viewFileButton.setOnClick([&window, &font]() {
		std::cout << "View File button clicked!" << std::endl;
		// Open the file and read its content
		std::ifstream file("file.txt");
		std::string fileContent;
		if (file.is_open()) {
			std::string line;
			while (std::getline(file, line)) {
				fileContent += line + "\n";
			}
			file.close();
		}
		else {
			std::cerr << "Unable to open file" << std::endl;
		}

		// Render the file content onto the window
		sf::Text fileText;
		fileText.setFont(font);
		fileText.setCharacterSize(20);
		fileText.setFillColor(sf::Color::White);
		fileText.setString(fileContent);
		fileText.setPosition(300, 300);
		window.draw(fileText);
		});

	while (window.isOpen()) {
		sf::Event event;
		while (window.pollEvent(event)) {
			if (event.type == sf::Event::Closed) {
				window.close();
			}
			else if (event.type == sf::Event::KeyPressed && currentState == State::SubMenuWithInput) {
				if (event.key.code == sf::Keyboard::Enter) {
					// Process user input, for example:
					std::cout << "User Input: " << ree << std::endl;
					//reel = ree.length();
					//currentState = State::SubSubMenu; // Shift to subsubmenu
				}
			}
			else if (event.type == sf::Event::TextEntered && currentState == State::SubMenuWithInput) {
				if (event.text.unicode == '\b') { // Backspace
					if (!ree.empty()) {
						ree.pop_back();
					}
				}
				else if (event.text.unicode < 128) {
					ree += static_cast<char>(event.text.unicode);
				}
				inputText.setString(ree);

			}
			else if (event.type == sf::Event::MouseButtonPressed && currentState == State::SubMenuWithInput) {

				if (enterButton.contains(sf::Vector2f(event.mouseButton.x, event.mouseButton.y))) {
					enterButton.handleClick();
					std::cout << "User Input: " << ree << std::endl;
				}
				else if (findButton.contains(sf::Vector2f(event.mouseButton.x, event.mouseButton.y))) {
					findButton.handleClick();
					find(0);
					display(w);
				}
				else if (findAllButton.contains(sf::Vector2f(event.mouseButton.x, event.mouseButton.y))) {
					findAllButton.handleClick();
					find(1);
					display(w);
				}
				else if (replaceButton.contains(sf::Vector2f(event.mouseButton.x, event.mouseButton.y))) {
					replaceButton.handleClick();
					ReplaceUserInput();
					replace(0);
					display(f);
				}
				else if (replaceAllButton.contains(sf::Vector2f(event.mouseButton.x, event.mouseButton.y))) {
					replaceAllButton.handleClick();
					ReplaceUserInput();
					replace(1);
					display(f);
				}
				else if (viewFileButton.contains(sf::Vector2f(event.mouseButton.x, event.mouseButton.y))) {
					viewFileButton.handleClick();
					display(f);
				}
			}
			else if (event.type == sf::Event::MouseMoved && currentState == State::SubMenuWithInput) {
				// Check if the mouse is hovering over any button
				sf::Vector2f mousePos = window.mapPixelToCoords(sf::Mouse::getPosition(window));
				findButton.setHovered(findButton.contains(mousePos));
				findAllButton.setHovered(findAllButton.contains(mousePos));
				replaceButton.setHovered(replaceButton.contains(mousePos));
				replaceAllButton.setHovered(replaceAllButton.contains(mousePos));
				viewFileButton.setHovered(viewFileButton.contains(mousePos));
				enterButton.setHovered(enterButton.contains(mousePos));
			}
		}

		window.clear();
		window.draw(background);

		if (currentState == State::MainMenu) {
			// Draw main menu
			sf::Text mainMenuText;
			mainMenuText.setFont(font);
			mainMenuText.setCharacterSize(100);
			mainMenuText.setString("Welcome to Find and replace");
			mainMenuText.setFillColor(sf::Color::White);
			mainMenuText.setPosition(270, 100);
			window.draw(mainMenuText);
			window.display();
			std::this_thread::sleep_for(std::chrono::seconds(2)); // Delay
			currentState = State::SubMenuWithInput;
		}
		else if (currentState == State::SubMenuWithInput) {
			// Draw sub menu with input box
			window.draw(inputBox);
			window.draw(inputText);
			findButton.draw(window);
			findAllButton.draw(window);
			replaceButton.draw(window);
			replaceAllButton.draw(window);
			viewFileButton.draw(window);
			enterButton.draw(window);
			window.display();
		}
	}

	return 0;
}
